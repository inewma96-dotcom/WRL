import { NextRequest } from "next/server"
import { getPaymentStatus } from "@/lib/payments/payment-service"
import { formatMoney } from "@/lib/payments/money"
import { validatePublicReference } from "@/lib/payments/validation"

export async function GET(_request: NextRequest, context: { params: Promise<{ reference: string }> }) {
  const { reference } = await context.params
  const payment = await getPaymentStatus(validatePublicReference(reference, "Payment reference"))
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>WRL Mock Payment Gateway</title>
  <style>
    body{margin:0;font-family:Arial,sans-serif;background:#071512;color:white;padding:48px 20px}
    main{max-width:560px;margin:auto;border:1px solid rgba(253,224,71,.45);border-radius:8px;background:#082b52;padding:32px;box-shadow:0 24px 80px rgba(0,0,0,.35)}
    .warn{background:#fde047;color:#071512;text-align:center;text-transform:uppercase;font-weight:900;padding:14px;border-radius:6px}
    dl{display:grid;gap:14px;margin:28px 0}
    .row{display:flex;justify-content:space-between;gap:18px;border-bottom:1px solid rgba(255,255,255,.12);padding-bottom:12px}
    dt{color:rgba(255,255,255,.72)} dd{margin:0;text-align:right;font-weight:700}
    a{display:block;text-align:center;border-radius:6px;padding:14px 18px;margin-top:12px;font-weight:900;text-decoration:none}
    .ok{background:#10b981;color:white}.bad{background:#ef4444;color:white}.cancel{background:#e2e8f0;color:#020617}.pending{border:1px solid rgba(255,255,255,.35);color:white}
  </style>
</head>
<body>
  <main>
    <p class="warn">TEST PAYMENT PAGE - DO NOT ENTER REAL CARD INFORMATION</p>
    <h1>Wantok Radio Light</h1>
    <dl>
      <div class="row"><dt>Merchant</dt><dd>Wantok Radio Light</dd></div>
      <div class="row"><dt>Order reference</dt><dd>${payment.order.publicReference}</dd></div>
      <div class="row"><dt>Payment reference</dt><dd>${payment.publicReference}</dd></div>
      <div class="row"><dt>Amount</dt><dd>${formatMoney(payment.amountMinor, payment.currency)}</dd></div>
      <div class="row"><dt>Currency</dt><dd>${payment.currency}</dd></div>
    </dl>
    <a class="ok" href="/api/payments/mock/complete/${payment.publicReference}?action=approve">Approve payment</a>
    <a class="bad" href="/api/payments/mock/complete/${payment.publicReference}?action=decline">Decline payment</a>
    <a class="cancel" href="/api/payments/mock/complete/${payment.publicReference}?action=cancel">Cancel payment</a>
    <a class="pending" href="/api/payments/mock/complete/${payment.publicReference}?action=pending">Leave pending</a>
  </main>
</body>
</html>`

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-content-type-options": "nosniff",
    },
  })
}
