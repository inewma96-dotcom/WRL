"use client"

import { useState } from "react"
import Image from "next/image"
import AirwaveAudioCard from "@/components/AirwaveAudioCard"
import ResponsiveVideoPlayer from "@/components/ResponsiveVideoPlayer"
import { formatAirwavesPostTime } from "@/lib/airwaves-timeline"

type DashboardAirwave = {
  id: string
  title: string
  description: string | null
  mediaUrl: string
  createdAt: string
  isHidden: boolean
}

type DashboardNews = {
  id: string
  title: string
  content: string
  mediaUrl: string | null
  mediaType: string | null
  createdAt: string
  isHidden: boolean
}

type AdminDashboardContentProps = {
  airwaves: DashboardAirwave[]
  news: DashboardNews[]
}

export default function AdminDashboardContent({
  airwaves,
  news,
}: AdminDashboardContentProps) {
  const [showing, setShowing] = useState<"airwaves" | "news">("airwaves")
  const airwavesCount = airwaves.length
  const newsCount = news.length

  return (
    <div className="p-6 text-white">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-bold text-yellow-400">
          Admin Control Panel
        </h1>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <button
          type="button"
          onClick={() => setShowing("airwaves")}
          aria-pressed={showing === "airwaves"}
          className={`rounded-xl bg-black/40 p-6 text-left shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-300/80 hover:shadow-[0_24px_55px_rgba(0,0,0,0.35)] ${
            showing === "airwaves"
              ? "border border-yellow-300 shadow-[0_0_28px_rgba(250,204,21,0.18)]"
              : "border border-yellow-400/20"
          }`}
        >
          <h2 className="text-sm text-gray-400">Airwaves</h2>
          <p className="text-3xl font-bold text-yellow-400">{airwavesCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setShowing("news")}
          aria-pressed={showing === "news"}
          className={`rounded-xl bg-black/40 p-6 text-left shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-300/80 hover:shadow-[0_24px_55px_rgba(0,0,0,0.35)] ${
            showing === "news"
              ? "border border-yellow-300 shadow-[0_0_28px_rgba(250,204,21,0.18)]"
              : "border border-yellow-400/20"
          }`}
        >
          <h2 className="text-sm text-gray-400">News</h2>
          <p className="text-3xl font-bold text-yellow-400">{newsCount}</p>
        </button>

        <div className="rounded-xl border border-yellow-400/20 bg-black/40 p-6 shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-300/80 hover:shadow-[0_24px_55px_rgba(0,0,0,0.35)]">
          <h2 className="text-sm text-gray-400">Total Uploads</h2>
          <p className="text-3xl font-bold text-yellow-400">
            {showing === "airwaves" ? airwavesCount : newsCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {showing === "airwaves"
          ? airwaves.map((item) => (
              <div key={item.id} className={item.isHidden ? "opacity-45" : ""}>
                <AirwaveAudioCard
                  title={item.title}
                  description={item.description}
                  mediaUrl={item.mediaUrl}
                  timeLabel={formatAirwavesPostTime(item.createdAt)}
                  dateTime={item.createdAt}
                />
              </div>
            ))
          : news.map((item) => (
              <article
                key={item.id}
                className={`overflow-hidden rounded-xl shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-300/80 hover:shadow-[0_24px_55px_rgba(0,0,0,0.45)] ${
                  item.isHidden
                    ? "border border-red-500 opacity-45"
                    : "border border-yellow-300/20 bg-black/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                    {item.isHidden ? "Hidden" : "News"}
                  </p>
                  <time
                    dateTime={item.createdAt}
                    className="text-xs font-semibold text-yellow-300"
                  >
                    {formatAirwavesPostTime(item.createdAt)}
                  </time>
                </div>

                <div className="flex w-full items-center justify-center bg-black">
                  {item.mediaType === "VIDEO" && item.mediaUrl ? (
                    <ResponsiveVideoPlayer src={item.mediaUrl} title={item.title} />
                  ) : item.mediaType === "IMAGE" && item.mediaUrl ? (
                    <div className="h-[220px] w-full">
                      <Image
                        src={item.mediaUrl}
                        alt={item.title || "News content"}
                        width={500}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="grid h-[160px] w-full place-items-center px-5 text-center text-sm text-gray-400">
                      News update
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="line-clamp-2 text-sm font-bold">{item.title}</h2>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-400">
                    {item.content || "No content"}
                  </p>
                </div>
              </article>
            ))}
      </div>
    </div>
  )
}
