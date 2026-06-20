"use client"

import { useCallback, useEffect, useState } from "react"
import ResponsiveVideoPlayer from "@/components/ResponsiveVideoPlayer"
import {
  formatAirwavesPostTime,
  groupAirwavesByMonth,
} from "@/lib/airwaves-timeline"

type NewsItem = {
  id: string
  title: string
  content: string
  mediaUrl: string | null
  mediaType: string | null
  createdAt: string
  isHidden: boolean
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const timeline = groupAirwavesByMonth(news)
  const selectedFileLabel = file ? file.name : "No news media selected"

  const loadNews = useCallback(async () => {
    try {
      const res = await fetch("/api/news/list?includeHidden=true")
      const data = await res.json()

      setNews(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNews()
  }, [loadNews])

  const resetForm = () => {
    setTitle("")
    setContent("")
    setFile(null)
    setEditingId(null)
  }

  const startEdit = (item: NewsItem) => {
    setEditingId(item.id)
    setTitle(item.title)
    setContent(item.content)
    setFile(null)
  }

  const handleSave = async () => {
    if (!title || !content) {
      alert("Title and content required")
      return
    }

    if (editingId) {
      const res = await fetch("/api/news/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title, content }),
      })

      if (!res.ok) {
        alert("Update failed")
        return
      }

      await loadNews()
      resetForm()
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)

    if (file) {
      formData.append("file", file)
    }

    const res = await fetch("/api/news/upload", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      await loadNews()
      resetForm()
    } else {
      const data = await res.json().catch(() => null)
      alert(data?.error || "Upload failed")
    }
  }

  const handleDelete = async (id: string) => {
    await fetch("/api/news/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    loadNews()
  }

  const toggleHide = async (id: string) => {
    await fetch("/api/news/hide", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    loadNews()
  }

  return (
    <div className="p-6 text-white">
      <section className="relative isolate -mx-6 -mt-6 mb-10 overflow-hidden px-6 py-14">
        <div
          className="absolute inset-0 -z-30 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
          style={{ backgroundImage: "url('/images/mainwall.png')" }}
        />
        <div className="absolute inset-0 -z-20 bg-black/65" />
        <div className="absolute inset-0 -z-20 bg-[#003b36]/45" />

        <h1 className="mx-auto mb-8 max-w-4xl text-2xl font-bold text-yellow-400">
          Daily News Update
        </h1>

        <div className="group relative isolate mx-auto max-w-4xl overflow-hidden rounded-xl border border-yellow-400/30 bg-black/45 p-6 shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-yellow-300/90 hover:shadow-[0_24px_55px_rgba(0,0,0,0.45)]">
        <div
          className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-45 blur-[1px]"
          style={{ backgroundImage: "url('/images/news.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-black/50" />
        <div className="absolute inset-0 -z-10 bg-[#003b36]/35" />
        <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/90 to-transparent" />

        <input
          placeholder="News Heading"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded border border-yellow-400/30 bg-white/10 p-3 outline-none transition duration-300 placeholder:text-white/55 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-white/15 hover:shadow-[0_12px_28px_rgba(250,204,21,0.16)] focus:border-yellow-400 focus:bg-white/15"
        />

        <textarea
          placeholder="Write news update here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 min-h-[120px] w-full rounded border border-yellow-400/30 bg-white/10 p-3 outline-none transition duration-300 placeholder:text-white/55 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-white/15 hover:shadow-[0_12px_28px_rgba(250,204,21,0.16)] focus:border-yellow-400 focus:bg-white/15"
        />

        {!editingId && (
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-yellow-300/45 bg-black/35 px-5 py-3 text-sm font-bold text-yellow-200 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-yellow-200 hover:bg-yellow-300 hover:text-[#003b36] hover:shadow-[0_16px_34px_rgba(250,204,21,0.28)]">
              Select News Media
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="sr-only"
              />
            </label>
            <span className="max-w-full truncate text-sm font-semibold text-white/85">
              {selectedFileLabel}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-500 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-blue-400 hover:shadow-[0_16px_34px_rgba(59,130,246,0.32)]"
          >
            {editingId ? "Save Changes" : "Post News Update"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-lg bg-white/10 px-6 py-3 font-bold transition duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              Cancel
            </button>
          )}
        </div>
        </div>
      </section>

      {loading && <p>Loading...</p>}

      {!loading && news.length === 0 && (
        <p className="text-gray-400">No news yet</p>
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

                <div className="grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {day.items.map((item) => (
                    <div
                      key={item.id}
                      className={`overflow-hidden rounded-xl shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:border-yellow-300/80 hover:shadow-[0_24px_55px_rgba(0,0,0,0.45)] ${
                        item.isHidden
                          ? "opacity-40 border border-red-500"
                          : "border border-yellow-300/20 bg-black/40"
                      }`}
                    >
                      <div className="flex w-full items-center justify-center bg-black">
                        {item.mediaType === "VIDEO" && item.mediaUrl ? (
                          <ResponsiveVideoPlayer src={item.mediaUrl} title={item.title} />
                        ) : item.mediaType === "IMAGE" && item.mediaUrl ? (
                          <div className="h-[220px] w-full">
                          <img
                            src={item.mediaUrl}
                            className="w-full h-full object-cover"
                            alt={item.title || "News content"}
                          />
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">No media</p>
                        )}
                      </div>

                      <div className="p-3">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm truncate">
                            {item.title || "Untitled"}
                          </h4>
                          <time
                            dateTime={item.createdAt}
                            className="shrink-0 text-[10px] text-yellow-300"
                          >
                            {formatAirwavesPostTime(item.createdAt)}
                          </time>
                        </div>

                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {item.content || "No content"}
                        </p>

                        <div className="flex gap-2 mt-3 flex-wrap">
                          <button
                            onClick={() => startEdit(item)}
                            className="bg-blue-500 px-2 py-1 text-xs rounded"
                          >
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
                        </div>
                      </div>
                    </div>
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
