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

export class BspPaymentProvider {
  async createPaymentSession(_input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult> {
    requireProviderConfig("BSP")
    // TODO:
    // Replace this placeholder request mapping with the exact request fields,
    // signing method, response format and callback verification process supplied
    // in BSP's official merchant integration documentation.
    throw new PaymentConfigurationError("BSP IPG adapter is structured but awaits official merchant integration documentation")
  }

  async verifyCallback(_request: Request): Promise<VerifiedPaymentCallback> {
    requireProviderConfig("BSP")
    throw new PaymentConfigurationError("BSP callback verification requires official BSP signing documentation")
  }

  async queryTransaction(_input: QueryPaymentInput): Promise<QueryPaymentResult> {
    requireProviderConfig("BSP")
    throw new PaymentConfigurationError("BSP transaction query requires official BSP API documentation")
  }

  async refundTransaction(_input: RefundPaymentInput): Promise<RefundPaymentResult> {
    requireProviderConfig("BSP")
    throw new PaymentConfigurationError("BSP refunds require official BSP refund documentation")
  }
}
