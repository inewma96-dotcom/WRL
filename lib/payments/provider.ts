import type {
  CreatePaymentSessionInput,
  CreatePaymentSessionResult,
  QueryPaymentInput,
  QueryPaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
  VerifiedPaymentCallback,
} from "./types"

export interface PaymentProvider {
  createPaymentSession(input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult>
  verifyCallback(request: Request): Promise<VerifiedPaymentCallback>
  queryTransaction(input: QueryPaymentInput): Promise<QueryPaymentResult>
  refundTransaction(input: RefundPaymentInput): Promise<RefundPaymentResult>
}
