"use client"

import { useCallback, useEffect, useState } from "react"
import ResponsiveVideoPlayer from "@/components/ResponsiveVideoPlayer"

type News = {
  id: string
  title: string
  content: string
  mediaUrl: string | null
  mediaType: string | null
  createdAt: string
  isHidden: boolean
}

type NewsManagerProps = {
  heading?: string
  canDelete?: boolean
}

export default function NewsManager({
  heading = "Create News",
  canDelete = false,
}: NewsManagerProps) {
  const [news, setNews] = useState<News[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    const res = await fetch("/api/news/list")
    const data = await res.json()
    setNews(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNews()
  }, [fetchNews])

  const resetForm = () => {
    setTitle("")
    setContent("")
    setFile(null)
    setEditingId(null)
  }

  const startEdit = (item: News) => {
    setEditingId(item.id)
    setTitle(item.title)
    setContent(item.content)
    setFile(null)
  }

  const handleSave = async () => {
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

      await fetchNews()
      resetForm()
      return
    }

    if (!file) return alert("File required")

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("file", file)

    const res = await fetch("/api/news/upload", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      await fetchNews()
      resetForm()
    } else {
      alert("Upload failed")
    }
  }

  const handleDelete = async (id: string) => {
    await fetch("/api/news/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchNews()
  }

  const toggleHide = async (id: string) => {
    await fetch("/api/news/hide", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchNews()
  }

  return (
    <div className="p-6 text-white">
      <h1 className="mb-4 text-xl font-bold text-yellow-400">{heading}</h1>

      <div className="mb-10 rounded-xl bg-black/40 p-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full rounded border border-yellow-400/30 bg-white/10 p-3 outline-none focus:border-yellow-400"
        />

        <textarea
          placeholder="Write full content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-3 min-h-[140px] w-full rounded border border-yellow-400/30 bg-white/10 p-3 outline-none focus:border-yellow-400"
        />

        {!editingId && (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4 block"
          />
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="rounded bg-blue-500 px-6 py-2 font-semibold transition hover:bg-blue-400"
          >
            {editingId ? "Save Changes" : "Post"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="rounded bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {news.map((item) => (
          <div
            key={item.id}
            className={`overflow-hidden rounded-xl ${
              item.isHidden ? "border border-red-500 opacity-40" : "bg-black/40"
            }`}
          >
            <div className="flex w-full items-center justify-center bg-black">
              {item.mediaType === "VIDEO" && item.mediaUrl ? (
                <ResponsiveVideoPlayer src={item.mediaUrl} title={item.title} />
              ) : item.mediaType === "IMAGE" && item.mediaUrl ? (
                <div className="h-[200px] w-full">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                </div>
              ) : item.mediaUrl ? (
                <audio controls className="w-full px-2">
                  <source src={item.mediaUrl} />
                </audio>
              ) : (
                <p className="text-xs text-gray-400">No media</p>
              )}
            </div>

            <div className="p-3">
              <h2 className="truncate text-sm font-bold">{item.title}</h2>
              <p className="mt-1 line-clamp-2 text-xs text-gray-300">
                {item.content}
              </p>
              <p className="mt-2 text-[10px] text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="rounded bg-blue-500 px-2 py-1 text-xs"
                >
                  Edit
                </button>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded bg-red-500 px-2 py-1 text-xs"
                  >
                    Delete
                  </button>
                )}

                <button
                  onClick={() => toggleHide(item.id)}
                  className="rounded bg-gray-500 px-2 py-1 text-xs"
                >
                  {item.isHidden ? "Unhide" : "Hide"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
