import { prisma } from "@/lib/prisma"
import { getBaseUrl, getDefaultPaymentProvider } from "./env"
import { assertMinorAmount, getPaymentCurrency, multiplyMinor } from "./money"
import { getPaymentProvider } from "./provider-factory"
import { createPublicId, createPublicReference } from "./references"
import { stringifySanitized } from "./sanitization"
import { PaymentProviderError, PaymentValidationError } from "./payment-errors"
import type { CustomerInput, PaymentProviderCode, PaymentQuote, PaymentQuoteInput, VerifiedPaymentCallback } from "./types"

const ORDER_STATUS_BY_PAYMENT: Record<string, string> = {
  SUCCEEDED: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
  PROCESSING: "PROCESSING",
  PENDING: "PROCESSING",
  REQUIRES_ACTION: "PENDING_PAYMENT",
}

export async function getPaymentQuote(input: PaymentQuoteInput): Promise<PaymentQuote> {
  const currency = getPaymentCurrency()
  const quantity = Number.isInteger(input.quantity) && input.quantity ? Math.max(1, Math.min(input.quantity, 99)) : 1
  const slug = input.paymentItemSlug || "general-donation"
  const product = await prisma.paymentProduct.findUnique({ where: { slug } })

  if (!product || !product.isActive) {
    throw new PaymentValidationError("Selected payment item is not available")
  }

  let unitPriceMinor = product.priceMinor || 0
  if (product.allowCustomAmount) {
    if (input.customAmountMinor === undefined) {
      unitPriceMinor = product.priceMinor || product.minimumAmountMinor || 100
    } else {
      unitPriceMinor = input.customAmountMinor
    }
    assertMinorAmount(unitPriceMinor, "Donation amount")
    if (product.minimumAmountMinor && unitPriceMinor < product.minimumAmountMinor) {
      throw new PaymentValidationError("Donation amount is below the minimum for this option")
    }
    if (product.maximumAmountMinor && unitPriceMinor > product.maximumAmountMinor) {
      throw new PaymentValidationError("Donation amount is above the maximum for this option")
    }
  } else if (!unitPriceMinor || unitPriceMinor < 1) {
    throw new PaymentValidationError("Selected payment item has no configured amount")
  }

  const subtotalMinor = multiplyMinor(unitPriceMinor, quantity)

  return {
    productId: product.id,
    productSlug: product.slug,
    purpose: product.paymentPurpose as PaymentQuote["purpose"],
    description: product.name,
    currency,
    quantity,
    unitPriceMinor,
    subtotalMinor,
    processingFeeMinor: 0,
    totalMinor: subtotalMinor,
  }
}

export async function initializePayment(input: {
  quoteInput: PaymentQuoteInput
  customer: CustomerInput
  provider: PaymentProviderCode
  idempotencyKey: string
  notes?: string
  anonymous?: boolean
  userId?: string
}) {
  const existing = await prisma.paymentTransaction.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    include: { order: { include: { customer: true, items: true } } },
  })
  if (existing?.redirectUrl) {
    return { order: existing.order, payment: existing, redirectUrl: existing.redirectUrl, idempotent: true }
  }

  const quote = await getPaymentQuote(input.quoteInput)
  const provider = getPaymentProvider(input.provider || getDefaultPaymentProvider())
  const baseUrl = getBaseUrl()

  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.paymentCustomer.create({
      data: {
        publicId: createPublicId("pcus"),
        userId: input.userId,
        fullName: input.customer.fullName,
        email: input.customer.email,
        phone: input.customer.phone,
        country: input.customer.country,
        province: input.customer.province,
        city: input.customer.city,
        postalCode: input.customer.postalCode,
        billingAddress: input.customer.billingAddress,
      },
    })

    const order = await tx.paymentOrder.create({
      data: {
        publicReference: createPublicReference("ORD"),
        userId: input.userId,
        customerId: customer.id,
        status: "PENDING_PAYMENT",
        purpose: quote.purpose,
        currency: quote.currency,
        subtotalMinor: quote.subtotalMinor,
        processingFeeMinor: quote.processingFeeMinor,
        totalMinor: quote.totalMinor,
        description: quote.description,
        notes: input.notes,
        metadata: stringifySanitized({ anonymous: input.anonymous, productSlug: quote.productSlug }),
      },
    })

    await tx.paymentOrderItem.create({
      data: {
        orderId: order.id,
        productId: quote.productId,
        descriptionSnapshot: quote.description,
        quantity: quote.quantity,
        unitPriceMinor: quote.unitPriceMinor,
        lineTotalMinor: quote.subtotalMinor,
      },
    })

    const payment = await tx.paymentTransaction.create({
      data: {
        publicReference: createPublicReference("PAY"),
        orderId: order.id,
        provider: input.provider,
        status: "CREATED",
        currency: quote.currency,
        amountMinor: quote.totalMinor,
        idempotencyKey: input.idempotencyKey,
        requestMetadata: stringifySanitized({ quoteInput: input.quoteInput }),
      },
    })

    await tx.paymentAuditLog.create({
      data: {
        paymentId: payment.id,
        orderId: order.id,
        actorUserId: input.userId,
        action: "PAYMENT_INITIALIZATION_STARTED",
        newStatus: payment.status,
      },
    })

    return { order, payment, customer }
  })

  const session = await provider.createPaymentSession({
    orderReference: result.order.publicReference,
    paymentReference: result.payment.publicReference,
    amountMinor: result.payment.amountMinor,
    currency: result.payment.currency,
    description: result.order.description,
    customer: input.customer,
    returnUrl: `${baseUrl}/payment/processing?reference=${result.payment.publicReference}`,
    callbackUrl: `${baseUrl}/api/payments/${input.provider.toLowerCase()}/callback`,
  })

  const payment = await prisma.paymentTransaction.update({
    where: { id: result.payment.id },
    data: {
      status: "REQUIRES_ACTION",
      providerSessionId: session.providerSessionId,
      redirectUrl: session.redirectUrl,
      responseMetadata: stringifySanitized(session.responseMetadata),
      expiresAt: session.expiresAt,
    },
    include: { order: { include: { customer: true, items: true } } },
  })

  return { order: payment.order, payment, redirectUrl: session.redirectUrl, idempotent: false }
}

export async function applyVerifiedCallback(callback: VerifiedPaymentCallback) {
  const payment = await prisma.paymentTransaction.findUnique({
    where: { publicReference: callback.paymentReference },
    include: { order: true },
  })
  if (!payment || payment.order.publicReference !== callback.orderReference) {
    throw new PaymentProviderError("Payment reference mismatch", 400)
  }
  if (payment.amountMinor !== callback.amountMinor || payment.currency !== callback.currency) {
    throw new PaymentProviderError("Payment amount or currency mismatch", 400)
  }

  const nextOrderStatus = ORDER_STATUS_BY_PAYMENT[callback.status] || "PROCESSING"

  return prisma.$transaction(async (tx) => {
    const duplicate = await tx.paymentEvent.findUnique({
      where: { providerEventId: callback.providerEventId },
    })
    if (duplicate) return { payment, duplicate: true }

    await tx.paymentEvent.create({
      data: {
        paymentId: payment.id,
        provider: callback.provider,
        eventType: callback.eventType,
        providerEventId: callback.providerEventId,
        payloadHash: callback.payloadHash,
        sanitizedPayload: stringifySanitized(callback.sanitizedPayload),
        signatureValid: callback.signatureValid,
        processed: true,
        processedAt: new Date(),
      },
    })

    const updatedPayment = await tx.paymentTransaction.update({
      where: { id: payment.id },
      data: {
        status: callback.status,
        providerTransactionId: callback.providerTransactionId || payment.providerTransactionId,
        verifiedAt: callback.status === "SUCCEEDED" ? new Date() : payment.verifiedAt,
      },
      include: { order: true },
    })

    await tx.paymentOrder.update({
      where: { id: payment.orderId },
      data: {
        status: nextOrderStatus,
        paidAt: callback.status === "SUCCEEDED" ? new Date() : payment.order.paidAt,
        cancelledAt: callback.status === "CANCELLED" ? new Date() : payment.order.cancelledAt,
      },
    })

    await tx.paymentAuditLog.create({
      data: {
        paymentId: payment.id,
        orderId: payment.orderId,
        action: "PAYMENT_CALLBACK_VERIFIED",
        previousStatus: payment.status,
        newStatus: callback.status,
        metadata: stringifySanitized({ eventType: callback.eventType }),
      },
    })

    return { payment: updatedPayment, duplicate: false }
  })
}

export async function getPaymentStatus(reference: string) {
  const payment = await prisma.paymentTransaction.findUnique({
    where: { publicReference: reference },
    include: { order: { include: { customer: true, items: true } } },
  })
  if (!payment) throw new PaymentValidationError("Payment not found")
  return payment
}
