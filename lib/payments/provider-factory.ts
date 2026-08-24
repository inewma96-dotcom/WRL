import type { PaymentProvider } from "./provider"
import type { PaymentProviderCode } from "./types"
import { MockPaymentProvider } from "./mock-provider"
import { BspPaymentProvider } from "./bsp-provider"
import { KinaPaymentProvider } from "./kina-provider"

export function getPaymentProvider(provider: PaymentProviderCode): PaymentProvider {
  if (provider === "BSP") return new BspPaymentProvider()
  if (provider === "KINA") return new KinaPaymentProvider()
  return new MockPaymentProvider()
}
