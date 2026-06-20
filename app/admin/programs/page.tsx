"use client"

import { useCallback, useEffect, useState } from "react"

type ProgramSettings = {
  heading: string
  subheading: string
  timeSlotHeading: string
  programHeading: string
  contentFocusHeading: string
}

type RadioProgram = {
  id: string
  timeSlot: string
  program: string
  contentFocus: string
  sortOrder: number
  isHidden: boolean
}

const emptyProgram = {
  timeSlot: "",
  program: "",
  contentFocus: "",
  sortOrder: 0,
}

const defaultSettings: ProgramSettings = {
  heading: "24-Hour Radio Program List",
  subheading: "Wantok Radio Light daily broadcast schedule",
  timeSlotHeading: "Time Slot",
  programHeading: "Program",
  contentFocusHeading: "Content Focus",
}

const panelClass =
  "group relative mx-auto mb-10 max-w-5xl overflow-hidden rounded-xl border border-yellow-400/30 bg-black/45 p-6 shadow-lg transition duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:border-yellow-300/90 hover:shadow-[0_24px_55px_rgba(0,0,0,0.45)]"

const fieldClass =
  "rounded border border-yellow-400/30 bg-white/10 p-3 outline-none transition duration-300 placeholder:text-white/55 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-white/15 hover:shadow-[0_12px_28px_rgba(250,204,21,0.16)] focus:border-yellow-400 focus:bg-white/15"

function ProgramPanelBackground() {
  return (
    <>
      <div
        className="absolute inset-0 -z-20 scale-105 bg-cover bg-center opacity-30 blur-[1px]"
        style={{ backgroundImage: "url('/images/programbg.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/65" />
      <div className="absolute inset-0 -z-10 bg-[#003b36]/45" />
      <div className="pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/90 to-transparent" />
    </>
  )
}

export default function AdminProgramsPage() {
  const [settings, setSettings] = useState<ProgramSettings>(defaultSettings)
  const [programs, setPrograms] = useState<RadioProgram[]>([])
  const [form, setForm] = useState(emptyProgram)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadPrograms = useCallback(async () => {
    try {
      const res = await fetch("/api/programs?includeHidden=true")
      const data = await res.json()

      setSettings(data.settings || defaultSettings)
      setPrograms(Array.isArray(data.programs) ? data.programs : [])
    } catch (err) {
      console.error(err)
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPrograms()
  }, [loadPrograms])

  const resetForm = () => {
    setForm(emptyProgram)
    setEditingId(null)
  }

  const saveSettings = async () => {
    const res = await fetch("/api/programs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "settings", ...settings }),
    })

    if (!res.ok) {
      alert("Failed to save headings")
      return
    }

    await loadPrograms()
  }

  const saveProgram = async () => {
    if (!form.timeSlot || !form.program || !form.contentFocus) {
      alert("Fill in time slot, program, and content focus")
      return
    }

    const res = await fetch("/api/programs", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    })

    if (!res.ok) {
      alert("Failed to save program")
      return
    }

    await loadPrograms()
    resetForm()
  }

  const startEdit = (program: RadioProgram) => {
    setEditingId(program.id)
    setForm({
      timeSlot: program.timeSlot,
      program: program.program,
      contentFocus: program.contentFocus,
      sortOrder: program.sortOrder,
    })
  }

  const toggleHide = async (id: string) => {
    await fetch("/api/programs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "toggle", id }),
    })

    loadPrograms()
  }

  const deleteProgram = async (id: string) => {
    await fetch("/api/programs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    loadPrograms()
  }

  return (
    <div className="p-6 text-white">
      <div className="mx-auto mb-8 max-w-5xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
          Programs
        </p>
        <h1 className="mt-2 text-3xl font-bold text-yellow-400">
          Radio Program List Manager
        </h1>
      </div>

      <section className={panelClass}>
        <ProgramPanelBackground />
        <h2 className="mb-4 text-xl font-bold text-yellow-300">
          Editable Headings
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={settings.heading}
            onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
            placeholder="Main heading"
            className={fieldClass}
          />
          <input
            value={settings.subheading}
            onChange={(e) => setSettings({ ...settings, subheading: e.target.value })}
            placeholder="Subheading"
            className={fieldClass}
          />
          <input
            value={settings.timeSlotHeading}
            onChange={(e) => setSettings({ ...settings, timeSlotHeading: e.target.value })}
            placeholder="Time slot column heading"
            className={fieldClass}
          />
          <input
            value={settings.programHeading}
            onChange={(e) => setSettings({ ...settings, programHeading: e.target.value })}
            placeholder="Program column heading"
            className={fieldClass}
          />
          <input
            value={settings.contentFocusHeading}
            onChange={(e) =>
              setSettings({ ...settings, contentFocusHeading: e.target.value })
            }
            placeholder="Content focus column heading"
            className={`${fieldClass} md:col-span-2`}
          />
        </div>

        <button
          onClick={saveSettings}
          className="mt-5 rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black shadow-lg shadow-yellow-500/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-yellow-300 hover:shadow-[0_16px_34px_rgba(250,204,21,0.32)]"
        >
          Save Headings
        </button>
      </section>

      <section className={panelClass}>
        <ProgramPanelBackground />
        <h2 className="mb-4 text-xl font-bold text-yellow-300">
          {editingId ? "Edit Program Row" : "Create Program Row"}
        </h2>

        <div className="grid gap-4 md:grid-cols-[0.8fr_1fr_1.4fr_0.45fr]">
          <input
            value={form.timeSlot}
            onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
            placeholder="12:00 am - 2:00 am"
            className={fieldClass}
          />
          <input
            value={form.program}
            onChange={(e) => setForm({ ...form, program: e.target.value })}
            placeholder="Midnight Melodies"
            className={fieldClass}
          />
          <input
            value={form.contentFocus}
            onChange={(e) => setForm({ ...form, contentFocus: e.target.value })}
            placeholder="Soft music, prayers, listener dedications"
            className={fieldClass}
          />
          <input
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: Number.parseInt(e.target.value || "0", 10) })
            }
            type="number"
            placeholder="Order"
            className={fieldClass}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={saveProgram}
            className="rounded-lg bg-blue-500 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:bg-blue-400 hover:shadow-[0_16px_34px_rgba(59,130,246,0.32)]"
          >
            {editingId ? "Save Changes" : "Add Program"}
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
      </section>

      {loading && <p>Loading programs...</p>}

      {!loading && programs.length === 0 && (
        <p className="text-gray-300">No program rows yet.</p>
      )}

      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-yellow-400/25 bg-black/35 shadow-lg transition duration-500 hover:-translate-y-1 hover:border-yellow-300/80 hover:shadow-[0_24px_55px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-[0.8fr_1fr_1.5fr_0.5fr_0.9fr] border-b border-yellow-400/25 bg-black/35 px-4 py-3 text-sm font-bold text-yellow-300">
          <span>{settings.timeSlotHeading}</span>
          <span>{settings.programHeading}</span>
          <span>{settings.contentFocusHeading}</span>
          <span>Order</span>
          <span>Actions</span>
        </div>

        {programs.map((program) => (
          <div
            key={program.id}
            className={`grid grid-cols-[0.8fr_1fr_1.5fr_0.5fr_0.9fr] items-center gap-3 border-b border-white/10 px-4 py-4 text-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-yellow-300/70 hover:bg-yellow-300 hover:text-[#003b36] hover:shadow-[0_18px_40px_rgba(250,204,21,0.22)] ${
              program.isHidden ? "opacity-45" : ""
            }`}
          >
            <span className="font-semibold">{program.timeSlot}</span>
            <span className="font-bold">{program.program}</span>
            <span>{program.contentFocus}</span>
            <span>{program.sortOrder}</span>
            <span className="flex flex-wrap gap-2">
              <button
                onClick={() => startEdit(program)}
                className="rounded bg-blue-500 px-2 py-1 text-xs font-bold text-white"
              >
                Edit
              </button>
              <button
                onClick={() => toggleHide(program.id)}
                className="rounded bg-gray-600 px-2 py-1 text-xs font-bold text-white"
              >
                {program.isHidden ? "Unhide" : "Hide"}
              </button>
              <button
                onClick={() => deleteProgram(program.id)}
                className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white"
              >
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
