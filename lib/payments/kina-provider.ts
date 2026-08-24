import { requireProviderConfig } from "./env"
import { PaymentConfigurationError } from "./payment-errors"
import type {
  CreatePaymentSessionInput,
  CreatePaymentSessionResult,
  QueryPaymentInput,
  QueryPaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
  VerifiedPaymentCallback,
} from "./types"

export class KinaPaymentProvider {
  async createPaymentSession(_input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult> {
    requireProviderConfig("KINA")
    // TODO:
    // Replace this placeholder request mapping with the exact request fields,
    // signing method, response format and callback verification process supplied
    // in Kina Bank's official merchant integration documentation.
    throw new PaymentConfigurationError("Kina Bank IPG adapter is structured but awaits official merchant integration documentation")
  }

  async verifyCallback(_request: Request): Promise<VerifiedPaymentCallback> {
    requireProviderConfig("KINA")
    throw new PaymentConfigurationError("Kina callback verification requires official Kina Bank signing documentation")
  }

  async queryTransaction(_input: QueryPaymentInput): Promise<QueryPaymentResult> {
    requireProviderConfig("KINA")
    throw new PaymentConfigurationError("Kina transaction query requires official Kina Bank API documentation")
  }

  async refundTransaction(_input: RefundPaymentInput): Promise<RefundPaymentResult> {
    requireProviderConfig("KINA")
    throw new PaymentConfigurationError("Kina refunds require official Kina Bank refund documentation")
  }
}
