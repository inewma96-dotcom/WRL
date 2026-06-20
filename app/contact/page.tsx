import ContactForm from "@/components/forms/contact-form"

export default function ContactPage() {
  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Contact Us
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Get in touch with Wantok Radio Light
          </h1>

          <p className="mt-5 text-lg text-muted-foreground">
            Reach out for partnerships, program inquiries, media coverage,
            support, or general questions.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <ContactForm />

          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Contact Information</h2>

            <div className="mt-6 space-y-5 text-muted-foreground">
              <div>
                <p className="font-semibold text-black">Email</p>
                <p>info@wantokradiolight.com</p>
              </div>

              <div>
                <p className="font-semibold text-black">Phone</p>
                <p>+675 xxx xxxx</p>
              </div>

              <div>
                <p className="font-semibold text-black">Location</p>
                <p>Port Moresby, Papua New Guinea</p>
              </div>

              <div>
                <p className="font-semibold text-black">Support Hours</p>
                <p>Monday - Friday, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}