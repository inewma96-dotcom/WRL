import { AppError } from "@/lib/api-utils"

export class PaymentConfigurationError extends AppError {
  constructor(message: string) {
    super("PAYMENT_CONFIGURATION_ERROR", message, 503)
  }
}

export class PaymentValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("PAYMENT_VALIDATION_ERROR", message, 400, details)
  }
}

export class PaymentProviderError extends AppError {
  constructor(message: string, status = 502) {
    super("PAYMENT_PROVIDER_ERROR", message, status)
  }
}
