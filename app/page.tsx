import CircularImageGallery from "@/components/CircularImageGallery"
import FacebookPageSection from "@/components/FacebookPageSection"

const timelineEvents = [
  {
    date: "January 14th 2002",
    title: "Radio Light Launches in Port Moresby",
    description:
      "It was during this time that the dream of Christian radio was realised. The very first giving came from PNG Bible Churches in PNG after we got the licence to broadcast in PNG by NICTA, previously known as PANGTEL. We started broadcasting in a rented office space in Heritage Centre Building along Waigani Drive. People came in numbers to support the cause. We had a very successful Share-a-thon drive that year, and many churches came in numbers to support.",
  },
  {
    date: "2005",
    title: "Radio Relocates to Monian Tower Ground Floor - Downtown Port Moresby",
    description:
      "We left Heritage Center and moved to a new location in town, the ground floor of Monian Tower. People would come to support us by providing lunch for the staff members and announcers. For the two years, God was very good to us.",
  },
  {
    date: "2007",
    title: "Radio Secured Land in Gerehu Stage 2. Now the Home of Wantok Radio Light Studios",
    description:
      "We moved again, this time with a different approach. With the funding we got from Christian partners and sponsors, we decided to buy land and property. That is how we transferred to Gerehu Stage 2 along Sivari Road, which is now the home of Wantok Radio Light. We renovated the old Country Club Building, Moale Gabuna, into a Christian radio campus.",
  },
  {
    date: "31 November 2010",
    title: "Wantok Radio Light Migrates to New Satellite System and Discontinues EMTV Service Contract",
    description:
      "We bought satellite and hub uplink/downlink equipment from the USA and shipped it to PNG. It arrived on 4 November 2010 with the help of big team workers and engineers from the US. By 31 December, we were running on the satellite link.",
  },
]

export default function HomePage() {
  return (
    <main className="bg-[#003b36] text-white">
      <CircularImageGallery />
      <section className="relative isolate overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
          style={{ backgroundImage: "url('/images/mainwall.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-black/65" />
        <div className="absolute inset-0 -z-10 bg-[#003b36]/45" />
        <div
          className="absolute inset-0 -z-5 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 15% 25%, rgba(250,204,21,0.30), rgba(250,204,21,0.06) 25%, transparent 55%)',
            filter: 'blur(36px)',
            mixBlendMode: 'screen',
          }}
        />

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-yellow-400/55 bg-black/45 px-5 py-9 text-center shadow-[0_0_38px_rgba(0,0,0,0.42)] backdrop-blur-md sm:px-8 md:px-12 lg:px-16">
          <div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/90 to-transparent" />

          <p className="text-sm font-bold uppercase tracking-[0.28em] text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.65)]">
            Introduction
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-yellow-300 drop-shadow-[0_0_18px_rgba(250,204,21,0.55)] sm:text-4xl lg:text-5xl">
            What is Wantok Radio Light?
          </h2>
          <div className="mx-auto mt-7 max-w-4xl space-y-5 text-base leading-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.24)] sm:text-lg">
            <p>
              Wantok Radio Light is Basically a Christian Radio Station
              scroll down for a brief  history timeline:
              Introduction....
            </p>
            <p>
              Papua New Guinea is a country founded on Christian Principles and this is manifested in the preamble of our Constitution:
              “We pledge ourselves to guard and pass on to those who come after us these Christian Principles. We also, as a people, commit 
              ourselves to establish a sovereign nation Papua New Guinea under the guiding hand of God.”
            </p>
            <p>
              Consistent with this, Christian Churches in PNG for years have always played an important role in the building of this wonderful 
              nation of PNG and will continue to be the major player in partnership with the State in the delivery of essential services. Traditionally 
              the churches have been leading in the areas of Health and Education. The government of PNG has been very supportive of the work of Churches and has continued to support and encourage where possible and we thank God for such leadership in Government. 
            </p>
          </div>
        </div>
      </section>
      <section id="timeline" className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
          style={{ backgroundImage: "url('/images/timeline.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-black/65" />
        <div className="absolute inset-0 -z-10 bg-[#003b36]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-transparent to-black/40" />

        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-yellow-300 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]">
              Timeline
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-yellow-300 drop-shadow-[0_0_18px_rgba(250,204,21,0.52)] sm:text-4xl lg:text-5xl">
              Our Story in Brief
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Stories behind the scenes, from where Wantok Radio Light started to where we are today.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-yellow-300/20 via-yellow-300 to-yellow-300/20 shadow-[0_0_18px_rgba(250,204,21,0.5)] md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-10">
              {timelineEvents.map((event, index) => {
                const isEven = index % 2 === 0

                return (
                  <article
                    key={event.date}
                    className="group relative grid gap-5 pl-12 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:pl-0"
                  >
                    <div
                      className="absolute left-4 top-4 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-[#003b36] bg-yellow-300 shadow-[0_0_0_0_rgba(250,204,21,0.7)] transition duration-500 group-hover:scale-125 group-hover:shadow-[0_0_0_14px_rgba(250,204,21,0)] md:static md:col-start-2 md:row-start-1 md:translate-x-0"
                      aria-hidden="true"
                    />

                    <div
                      className={`transition duration-500 ${
                        isEven ? "md:col-start-1 md:text-right" : "md:col-start-3 md:text-left"
                      }`}
                    >
                      <time className="inline-flex rounded-full border border-yellow-300/40 bg-black/30 px-4 py-2 text-2xl font-bold text-yellow-300 shadow-[0_0_18px_rgba(0,0,0,0.25)] transition duration-500 group-hover:-translate-y-1 group-hover:border-yellow-200 group-hover:bg-yellow-300 group-hover:text-[#003b36] group-hover:shadow-[0_0_28px_rgba(250,204,21,0.45)] sm:text-3xl">
                        {event.date}
                      </time>
                    </div>

                    <div
                      className={`rounded-xl border border-yellow-300/25 bg-black/38 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-yellow-300/80 hover:bg-[#003b36]/95 hover:shadow-[0_24px_55px_rgba(0,0,0,0.42)] ${
                        isEven ? "md:col-start-3" : "md:col-start-1 md:row-start-1 md:text-right"
                      }`}
                    >
                      <h3 className="text-xl font-bold leading-snug text-yellow-200 transition duration-300 group-hover:text-white">
                        {event.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-white/82 transition duration-300 hover:text-white sm:text-base">
                        {event.description}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      <FacebookPageSection />
    </main>
  )
}
