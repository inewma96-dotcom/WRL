"use client"

import { useEffect, useState } from "react"

type Schedule = {
  id: string
  title: string
  day: string
  startTime: string
  endTime: string
}

export default function ScheduleAdmin() {
  const [title, setTitle] = useState("")
  const [day, setDay] = useState("Monday")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [data, setData] = useState<Schedule[]>([])

  const fetchData = async () => {
    const res = await fetch("/api/schedule/list")
    const json = await res.json()
    setData(json)
  }

  useEffect(() => {
    let isMounted = true

    fetch("/api/schedule/list")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) setData(json)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleCreate = async () => {
    await fetch("/api/schedule/create", {
      method: "POST",
      body: JSON.stringify({ title, day, startTime, endTime }),
    })

    fetchData()
  }

  const handleDelete = async (id: string) => {
    await fetch("/api/schedule/delete", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    fetchData()
  }

  return (
    <div className="min-h-screen bg-[#003b36] p-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400">📻 Scheduler</h1>

      <div className="mt-6 space-y-3">
        <input placeholder="Program" onChange={(e) => setTitle(e.target.value)} className="p-2 text-black" />

        <select onChange={(e) => setDay(e.target.value)} className="p-2 text-black">
          {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <input type="time" onChange={(e) => setStartTime(e.target.value)} className="p-2 text-black" />
        <input type="time" onChange={(e) => setEndTime(e.target.value)} className="p-2 text-black" />

        <button onClick={handleCreate} className="bg-yellow-400 px-4 py-2 text-black font-bold">
          Add Program
        </button>
      </div>

      <div className="mt-10 space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-black/40 p-4 rounded">
            <p>{item.title}</p>
            <p>{item.day} | {item.startTime} - {item.endTime}</p>

            <button
              onClick={() => handleDelete(item.id)}
              className="mt-2 bg-red-500 px-3 py-1"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
