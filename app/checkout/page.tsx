import CheckoutForm from "@/components/payments/CheckoutForm"

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const params = await searchParams
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#071512] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_8%,rgba(250,204,21,0.08),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(8,43,82,0.34),transparent_34%),linear-gradient(135deg,#03110e,#071512_44%,#061f1c)]" />
      <div className="wrl-premium-grid absolute inset-0 -z-10 opacity-35" />
      <CheckoutForm initialSlug={params.item || "general-donation"} />
    </main>
  )
}
