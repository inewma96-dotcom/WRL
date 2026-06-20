import PartnersSlider from "@/components/PartnersSlider"
import Image from "next/image"

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-[#003b36] text-white">
      <section
        tabIndex={0}
        aria-label="Major Partner feature"
        className="group relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfaf2] px-6 py-20 text-center text-[#071512] outline-none"
      >
        <Image
          src="/images/majorp.png"
          alt="New Life FM Founder and Owner Mr. Joe Emmert and wife during a Share-a-thon fundraising event"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-0 transition duration-[2000ms] ease-out group-hover:opacity-100 group-hover:duration-[3500ms] group-focus:opacity-100 group-focus:duration-[3500ms]"
        />
        <div className="absolute inset-0 -z-10 bg-black/0 transition duration-[2000ms] group-hover:bg-black/35 group-hover:duration-[3500ms] group-focus:bg-black/35 group-focus:duration-[3500ms]" />

        <div className="mx-auto max-w-5xl transition duration-[2000ms] group-hover:scale-[1.02] group-hover:duration-[3500ms] group-hover:text-white group-focus:scale-[1.02] group-focus:duration-[3500ms] group-focus:text-white">
          <p className="text-sm font-semibold text-[#007a3d] drop-shadow-[0_2px_10px_rgba(255,255,255,0.55)] md:text-base">
            Major Partner
          </p>
          <h1 className="mt-7 text-5xl font-light leading-tight tracking-normal md:text-7xl lg:text-8xl">
            <span className="text-[#d71920] drop-shadow-[0_3px_12px_rgba(0,0,0,0.22)]">
              A
            </span>{" "}
            <span className="text-[#071512] transition duration-[2000ms] drop-shadow-[0_3px_12px_rgba(255,255,255,0.55)] group-hover:duration-[3500ms] group-hover:text-white group-focus:duration-[3500ms] group-focus:text-white">
              Major
            </span>{" "}
            <span className="text-[#facc15] drop-shadow-[0_3px_14px_rgba(0,0,0,0.25)]">
              Partner
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-4xl text-lg font-semibold leading-8 text-[#007a3d] drop-shadow-[0_2px_10px_rgba(255,255,255,0.55)] md:text-2xl md:leading-10">
            New Life FM Founder &amp; Owner Mr. Joe Emmert &amp; Wife
            <br />
            <span className="text-[#d71920]">
              During our Share-a-thon Fundraising in 2007
            </span>
          </p>
          <div className="mx-auto mt-12 h-px w-32 bg-[#071512] transition duration-[2000ms] group-hover:bg-white group-hover:duration-[3500ms] group-focus:bg-white group-focus:duration-[3500ms]" />
        </div>
      </section>

      <section className="px-6 py-14 text-center">
        <h1 className="text-5xl font-black tracking-normal text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.9)] transition duration-300 hover:-translate-y-1 hover:scale-105 md:text-7xl">
          PARTNERS
        </h1>
        <p className="mt-5 text-lg font-bold text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.75)] transition duration-300 hover:-translate-y-1 hover:scale-105 md:text-2xl">
          List of Partners who support us.
        </p>
      </section>

      <section className="relative isolate overflow-hidden px-6 py-16">
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center opacity-35 blur-[0.5px]"
          style={{ backgroundImage: "url('/images/support.png')" }}
        />
        <div className="absolute inset-0 -z-20 bg-black/65" />
        <div className="absolute inset-0 -z-20 bg-[#003b36]/45" />

        <div className="mx-auto max-w-5xl rounded-lg border border-yellow-400/50 bg-black/45 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.42)] transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-yellow-300 hover:shadow-[0_30px_90px_rgba(250,204,21,0.2)] md:p-12">
          <h2 className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_16px_rgba(250,204,21,0.65)] md:text-5xl">
            What &quot;Partners&quot; Mean to Wantok Radio Light.
          </h2>
          <p className="mt-8 text-lg font-medium leading-8 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] md:text-xl md:leading-9">
            Partners are organizations, ministries, churches, broadcasters, and
            supporters that work together with Wantok Radio Light to spread the
            Gospel, encourage families, support communities, and strengthen
            Christian ministry across Papua New Guinea. These partners help
            through prayer support, Christian radio programs, technical
            broadcasting assistance, ministry training, financial donations,
            media resources, discipleship materials, and outreach missions.
            They are not just sponsors - they are ministry companions helping
            Wantok Radio Light bring hope, faith, biblical teaching, and
            community transformation to people throughout PNG, especially in
            remote areas.
          </p>
        </div>
      </section>

      <PartnersSlider />

      <section className="relative isolate overflow-hidden bg-[#f8f6ef] px-6 py-20 text-[#071512]">
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center opacity-20 blur-[0.5px]"
          style={{ backgroundImage: "url('/images/partnershipBG.png')" }}
        />
        <div className="absolute inset-0 -z-20 bg-white/80" />

        <article
          tabIndex={0}
          aria-label="Papua New Guinea Bible Church partner"
          className="mx-auto max-w-6xl rounded-lg border border-black/10 bg-[#fbfaf2] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.18)] outline-none transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_30px_90px_rgba(0,0,0,0.24)] focus:-translate-y-2 focus:scale-[1.02] focus:shadow-[0_30px_90px_rgba(0,0,0,0.24)] md:p-12"
        >
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_360px] md:items-center lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <p className="text-sm font-semibold text-[#d71920] md:text-base">
                Papua New Guinea Provinces
              </p>
              <h2 className="mt-5 max-w-3xl text-5xl font-black leading-tight tracking-normal text-[#071512] md:text-7xl">
                Papua New Guinea Bible Church
              </h2>
              <div className="mt-9 max-w-3xl space-y-5 text-lg font-medium leading-8 text-[#071512] md:text-xl md:leading-9">
                <p className="border-l-4 border-[#d71920] pl-5">
                  Papua New Guinea Bible Church holds the license to Broadcast.
                </p>
                <p>
                  From a Dream To Reality, PNGBC continues to support Christian
                  ministry and communication across Papua New Guinea through
                  radio broadcasting, church partnership, and Gospel outreach.
                </p>
                <p>
                  Find out more about the PNG Bible Church and visit their
                  website by clicking the button below the logo.
                </p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[360px] text-center lg:max-w-[420px]">
              <div className="relative aspect-square w-full overflow-hidden rounded border border-black/10 bg-white">
                <Image
                  src="/images/pngbc.png"
                  alt="Papua New Guinea Bible Church Inc logo"
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-contain p-6"
                />
              </div>
              <a
                href="https://pngbc.org/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded bg-black px-8 py-4 text-sm font-black uppercase tracking-normal text-white shadow-[0_16px_35px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-[#d71920] focus:-translate-y-1 focus:scale-[1.03] focus:bg-[#d71920]"
              >
                Click to learn more
              </a>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
