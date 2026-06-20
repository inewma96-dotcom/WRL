"use client"

import { useCallback, useEffect, useState } from "react"
import AirwaveAudioCard from "@/components/AirwaveAudioCard"
import {
  formatAirwavesPostTime,
  groupAirwavesByMonth,
} from "@/lib/airwaves-timeline"

type Content = {
  id: string
  title: string
  description?: string
  mediaUrl: string
  mediaType: string
  createdAt: string
  isHidden: boolean
}

export default function AirwavesAdmin() {
  const [content, setContent] = useState<Content[]>([])
  const [files, setFiles] = useState<FileList | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const timeline = groupAirwavesByMonth(content)
  const selectedFileLabel =
    files && files.length > 0
      ? Array.from(files).map((file) => file.name).join(", ")
      : "No program selected"

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/airwaves/list")
      const data = await res.json()

      setContent(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch error:", err)
      setContent([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContent()
  }, [fetchContent])

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Select at least 1 file")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)

    Array.from(files).forEach((file) => {
      formData.append("files", file)
    })

    const res = await fetch("/api/airwaves/upload", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      await fetchContent()
      setFiles(null)
      setTitle("")
      setDescription("")
    } else {
      const data = await res.json().catch(() => null)
      alert(data?.error || "Upload failed")
    }
  }

  const handleDelete = async (id: string) => {
    await fetch("/api/airwaves/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    fetchContent()
  }

  const toggleHide = async (id: string) => {
    await fetch("/api/airwaves/hide", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    fetchContent()
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-yellow-400 text-2xl font-bold mb-6">
        Upload Programes
      </h1>

      <div className="group relative mb-10 max-w-4xl overflow-hidden rounded-xl border border-yellow-400/30 bg-black/45 p-6 shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-yellow-300/90 hover:shadow-[0_24px_55px_rgba(0,0,0,0.45)]">
        <div
          className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
          style={{ backgroundImage: "url('/images/playout.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-black/65" />
        <div className="absolute inset-0 -z-10 bg-[#003b36]/45" />
        <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/90 to-transparent" />

        <input
          placeholder="Program"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded border border-yellow-400/30 bg-white/10 p-3 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-white/15 hover:shadow-[0_12px_28px_rgba(250,204,21,0.16)] focus:border-yellow-400 focus:bg-white/15"
        />

        <textarea
          placeholder="Write description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 min-h-[120px] w-full rounded border border-yellow-400/30 bg-white/10 p-3 outline-none transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-white/15 hover:shadow-[0_12px_28px_rgba(250,204,21,0.16)] focus:border-yellow-400 focus:bg-white/15"
        />

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-yellow-300/45 bg-black/35 px-5 py-3 text-sm font-bold text-yellow-200 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-yellow-200 hover:bg-yellow-300 hover:text-[#003b36] hover:shadow-[0_16px_34px_rgba(250,204,21,0.28)]">
            Select Program
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="sr-only"
            />
          </label>
          <span className="max-w-full truncate text-sm font-semibold text-white/85">
            {selectedFileLabel}
          </span>
        </div>

        <button
          onClick={handleUpload}
          className="rounded-lg bg-blue-500 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-blue-400 hover:shadow-[0_16px_34px_rgba(59,130,246,0.32)]"
        >
          Play Out Now
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && content.length === 0 && (
        <p className="text-gray-400">No uploads yet</p>
      )}

      <div className="space-y-12">
        {timeline.map((month) => (
          <section key={month.key} className="space-y-6">
            <div className="border-b border-yellow-400/30 pb-3">
              <h2 className="text-2xl font-bold text-yellow-400">
                {month.label}
              </h2>
            </div>

            {month.days.map((day) => (
              <div key={day.key} className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {day.label}
                </h3>

                <div className="grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {day.items.map((item) => (
                    <AirwaveAudioCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      mediaUrl={item.mediaUrl}
                      timeLabel={formatAirwavesPostTime(item.createdAt)}
                      dateTime={item.createdAt}
                      actions={
                        <>
                          <button className="bg-blue-500 px-2 py-1 text-xs rounded">
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 px-2 py-1 text-xs rounded"
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => toggleHide(item.id)}
                            className="bg-gray-500 px-2 py-1 text-xs rounded"
                          >
                            {item.isHidden ? "Unhide" : "Hide"}
                          </button>
                        </>
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
