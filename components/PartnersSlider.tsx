"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type Partner = {
  name: string
  image: string
  alt: string
  lead: string
  details: string
  website?: string
}

const partners: Partner[] = [
  {
    name: "SonSet Solutions",
    image: "/images/SonSet.png",
    alt: "SonSet Solutions",
    lead:
      "Sonset Solutions provides us with Equipments and Technical Support. They are a vital partner in our existence and longevity.",
    details:
      "SonSet Solutions is a Christian technology ministry that helps churches, missionaries, and radio stations use technology to spread the Gospel worldwide.",
    website: "https://sonsetsolutions.org/",
  },
  {
    name: "Reach Beyond",
    image: "/images/reachbyond.png",
    alt: "Reach Beyond",
    lead:
      "Reach Beyond is a global Christian ministry that helps communities hear the Gospel and experience practical care through media, healthcare, technology, and missionary service.",
    details:
      "Through radio broadcasting, training, engineering support, and partnership with local ministries, Reach Beyond helps extend Christian communication to people and places that are difficult to reach.",
    website: "https://reachbeyond.org/",
  },
  {
    name: "New Life Radio",
    image: "/images/newlifeFM.png",
    alt: "New Life Radio",
    lead:
      "New Life Radio is a Christian broadcasting ministry dedicated to sharing hope, faith, worship music, biblical teaching, and encouragement through radio programming.",
    details:
      "The ministry supports Christian outreach by producing inspirational content, partnering with missionary radio stations, and using media to strengthen listeners through Jesus Christ.",
    website: "https://newliferadio.com/",
  },
  {
    name: "EBM International",
    image: "/images/EBM.png",
    alt: "EBM International",
    lead:
      "EBM International is an international evangelical missionary organization involved in church planting, education, healthcare, orphan support, Bible training, and community development.",
    details:
      "Since its beginnings in the Bahamas in the 1940s, the organization has expanded globally, supporting churches and underserved communities through humanitarian and Christian ministry projects.",
    website: "https://ebminternational.com/",
  },
  {
    name: "Leading The Way Australia",
    image: "/images/leadingTheWay.png",
    alt: "Leading The Way Australia",
    lead:
      "Leading The Way is an international Christian teaching and evangelism ministry founded by Dr. Michael Youssef.",
    details:
      "The ministry uses television, radio, digital platforms, and discipleship programs to proclaim biblical truth worldwide, with a strong focus on reaching unreached people groups.",
    website: "https://au.ltw.org/",
  },
  {
    name: "Focus on the Family",
    image: "/images/fotf.png",
    alt: "Focus on the Family",
    lead:
      "Focus on the Family is a global Christian non-profit organization dedicated to helping families thrive through biblical teaching, marriage support, parenting resources, counseling, and radio programs.",
    details:
      "Founded by Dr. James Dobson, the ministry focuses on strengthening marriages, supporting parents, promoting Christian family values, and encouraging healthy relationships centered on biblical principles.",
    website: "https://www.focusonthefamily.com/",
  },
  {
    name: "Back to the Bible",
    image: "/images/bttb.png",
    alt: "Back to the Bible",
    lead:
      "Back to the Bible is a Christian discipleship and Bible-teaching ministry focused on helping people grow spiritually through biblical resources, devotionals, digital tools, and radio programs.",
    details:
      "The organization encourages believers to deepen their relationship with Jesus Christ and become active disciple-makers through practical and accessible biblical guidance.",
    website: "https://www.backtothebible.org/",
  },
  {
    name: "Papua New Guinea Radio Ministry Leads New Church Plants",
    image: "/images/KraiBelongMeri.png",
    alt: "Krai Belong Meri",
    lead:
      "Church of the Nazarene highlights how Christian radio ministry in Papua New Guinea has helped spread the Gospel, disciple believers, and plant new churches across remote communities.",
    details:
      "Through consistent radio broadcasts in local languages, the ministry has reached thousands of listeners, encouraged spiritual growth, and helped establish new Christian fellowships in hard-to-reach areas.",
    website:
      "https://nazarene.org/news/papua-new-guinea-radio-ministry-leads-new-church-plants/",
  },
  {
    name: "Adventures in Odyssey",
    image: "/images/Advanture.png",
    alt: "Adventures in Odyssey",
    lead:
      "Adventures in Odyssey is a Christian audio drama program for families and children, sharing stories that teach biblical values, faith, and character.",
    details:
      "The program offers engaging adventures, memorable characters, and practical lessons that encourage young listeners and families in their walk with Jesus Christ.",
    website: "https://www.adventuresinodyssey.com/",
  },
  {
    name: "AOG Cornerstone Gateway Church",
    image: "/images/AOG.png",
    alt: "AOG Cornerstone Gateway Church",
    lead:
      "Wantok Radio Light works together with AOG Cornerstone Gateway Church by broadcasting the church's live Sunday services, sermons, and biblical teachings to listeners across Papua New Guinea.",
    details:
      "Through this partnership, the church provides spiritual content and preaching ministry, while Wantok Radio Light provides the radio platform and media outreach for urban and remote communities.",
  },
]

function getPosition(index: number, activeIndex: number, total: number) {
  const raw = (index - activeIndex + total) % total
  return raw > total / 2 ? raw - total : raw
}

export default function PartnersSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % partners.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const visibleSlides = useMemo(
    () =>
      partners.map((partner, index) => ({
        ...partner,
        position: getPosition(index, activeIndex, partners.length),
      })),
    [activeIndex],
  )

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + partners.length) % partners.length)
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % partners.length)
  }

  return (
    <section className="relative isolate overflow-hidden px-4 pb-20 pt-8 md:px-6">
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center opacity-35 blur-[0.5px]"
        style={{ backgroundImage: "url('/images/outlook.png')" }}
      />
      <div className="absolute inset-0 -z-20 bg-black/80" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="relative h-[520px] overflow-hidden [perspective:1400px] md:h-[650px]">
          {visibleSlides.map((partner, index) => {
            const distance = Math.abs(partner.position)
            const isActive = partner.position === 0
            const isVisible = distance <= 1
            const slideScale = isActive ? 1 : 0.72
            const slideWidth = isActive ? "min(86vw, 460px)" : "min(52vw, 360px)"
            const slideHeight = isActive ? "min(72vh, 560px)" : "min(58vh, 430px)"

            return (
              <article
                key={partner.name}
                onClick={() => setActiveIndex(index)}
                className="group absolute left-1/2 top-1/2 cursor-pointer transition-all duration-700 ease-out [transform-style:preserve-3d]"
                style={{
                  width: slideWidth,
                  height: slideHeight,
                  opacity: isVisible ? (isActive ? 1 : 0.42) : 0,
                  pointerEvents: isVisible ? "auto" : "none",
                  transform: `translate(-50%, -50%) translateX(${partner.position * 116}%) scale(${slideScale}) rotateY(${
                    partner.position * -24
                  }deg) translateZ(${isActive ? 90 : -150}px)`,
                  zIndex: 20 - distance,
                }}
              >
                <div className="relative isolate block h-full overflow-hidden rounded border border-yellow-300/45 bg-white shadow-[0_34px_95px_rgba(0,0,0,0.75)]">
                  <div className="flex h-full flex-col items-center justify-center px-4 pb-8 pt-4 md:px-6 md:pb-10 md:pt-6">
                    <img
                      src={partner.image}
                      alt={partner.alt}
                      className="min-h-0 w-full flex-1 object-contain transition duration-700 group-hover:scale-[1.02] group-hover:opacity-20"
                    />

                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="mt-4 inline-flex items-center justify-center rounded bg-red-600 px-6 py-3 text-center text-sm font-black text-white shadow-[0_12px_30px_rgba(220,38,38,0.35)] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-red-500"
                      >
                        Visit Website
                      </a>
                    ) : null}
                  </div>

                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 p-5 opacity-0 transition duration-700 group-hover:bg-black/80 group-hover:opacity-100 md:p-8">
                    <div className="max-w-2xl text-center">
                      <h2 className="text-2xl font-black leading-tight text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.45)] md:text-3xl">
                        {partner.name}
                      </h2>
                      <p className="mt-4 text-sm font-semibold leading-6 text-white md:text-base md:leading-7">
                        {partner.lead}
                      </p>
                      <p className="mt-3 text-xs leading-6 text-white/90 md:text-sm md:leading-7">
                        {partner.details}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}

          <button
            type="button"
            aria-label="Previous partner"
            onClick={showPrevious}
            className="absolute left-2 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg transition hover:-translate-y-[54%] hover:border-yellow-300 hover:bg-yellow-400 hover:text-black md:left-14"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Next partner"
            onClick={showNext}
            className="absolute right-2 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg transition hover:-translate-y-[54%] hover:border-yellow-300 hover:bg-yellow-400 hover:text-black md:right-14"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

      </div>
    </section>
  )
}
