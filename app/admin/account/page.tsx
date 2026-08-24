"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Edit3, Eye, EyeOff, KeyRound, Plus, Save, Trash2, X } from "lucide-react"

import { USER_ROLES, type UserRole } from "@/lib/constants"

type ManagedAccount = {
  id: string
  username: string | null
  displayPassword: string | null
  role: UserRole
  createdAt: string
}

type FormState = {
  username: string
  password: string
  role: UserRole
}

const emptyForm: FormState = {
  username: "",
  password: "",
  role: USER_ROLES.JOURNALIST,
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong"
}

export default function AdminAccountPage() {
  const [accounts, setAccounts] = useState<ManagedAccount[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const editingAccount = useMemo(
    () => accounts.find((account) => account.id === editingId) || null,
    [accounts, editingId]
  )

  const loadAccounts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/accounts/users", {
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load accounts")
      }

      setAccounts(data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    window.setTimeout(() => {
      loadAccounts()
    }, 0)
  }, [loadAccounts])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  function startEdit(account: ManagedAccount) {
    setEditingId(account.id)
    setForm({
      username: account.username || "",
      password: account.displayPassword || "",
      role: account.role,
    })
    setMessage(null)
    setError(null)
  }

  async function submitAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch("/api/accounts/users", {
        method: editingId ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? {
                action: "update",
                id: editingId,
                username: form.username,
                password: form.password,
                role: form.role,
              }
            : form
        ),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save account")
      }

      if (editingId) {
        setAccounts((current) =>
          current.map((account) => (account.id === data.id ? data : account))
        )
        setMessage("Account credentials updated")
      } else {
        setAccounts((current) => [data, ...current])
        setMessage("Account created")
      }

      resetForm()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function resetPassword(account: ManagedAccount) {
    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch("/api/accounts/users", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reset",
          id: account.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setAccounts((current) =>
        current.map((item) => (item.id === data.id ? data : item))
      )
      setMessage(`Password reset for ${data.username}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function deleteAccount(account: ManagedAccount) {
    const confirmed = window.confirm(`Delete ${account.username}? This cannot be undone.`)
    if (!confirmed) return

    setSaving(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch("/api/accounts/users", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: account.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account")
      }

      setAccounts((current) => current.filter((item) => item.id !== account.id))
      if (editingId === account.id) resetForm()
      setMessage("Account deleted")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  function togglePassword(id: string) {
    setVisiblePasswords((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-yellow-400">Account Credentials</h1>
        <p className="max-w-2xl text-sm text-white/70">
          Manage the usernames and passwords used by journalist and prayer dashboard users.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
            error
              ? "border-red-400/50 bg-red-500/10 text-red-100"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
          }`}
        >
          {error || message}
        </div>
      )}

      <form
        onSubmit={submitAccount}
        className="grid gap-4 rounded-lg border border-white/10 bg-black/25 p-5 md:grid-cols-[1fr_1fr_180px_auto]"
      >
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Username</span>
          <input
            value={form.username}
            onChange={(event) =>
              setForm((current) => ({ ...current, username: event.target.value }))
            }
            minLength={3}
            required
            className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            placeholder="username"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Password</span>
          <input
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            minLength={6}
            required
            className="w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            placeholder="password"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Role</span>
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value as UserRole,
              }))
            }
            className="w-full rounded-lg border border-white/15 bg-[#003b36] px-4 py-3 text-white outline-none transition focus:border-yellow-400"
          >
            <option value={USER_ROLES.JOURNALIST}>Journalist</option>
            <option value={USER_ROLES.PRAYER}>Prayer</option>
          </select>
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-yellow-400 px-5 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {editingId ? <Save size={18} /> : <Plus size={18} />}
            {editingId ? "Save" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 px-4 text-white transition hover:bg-white/10"
              aria-label="Cancel edit"
              title="Cancel edit"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20">
        <div className="grid grid-cols-[1.1fr_0.8fr_1.1fr_180px] border-b border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-yellow-400">
          <span>Username</span>
          <span>Role</span>
          <span>Password</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-white/70">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="px-4 py-8 text-white/70">
            No journalist or prayer accounts have been created yet.
          </div>
        ) : (
          accounts.map((account) => {
            const passwordVisible = visiblePasswords.has(account.id)
            const password = account.displayPassword || ""

            return (
              <div
                key={account.id}
                className={`grid grid-cols-[1.1fr_0.8fr_1.1fr_180px] items-center gap-3 border-b border-white/10 px-4 py-4 last:border-b-0 ${
                  editingAccount?.id === account.id ? "bg-yellow-400/10" : ""
                }`}
              >
                <span className="font-semibold text-white">{account.username}</span>
                <span className="text-white/75">
                  {account.role === USER_ROLES.PRAYER ? "Prayer" : "Journalist"}
                </span>
                <span className="flex min-w-0 items-center gap-2 font-mono text-sm text-white/85">
                  <span className="truncate">
                    {passwordVisible ? password : password.replace(/./g, "*")}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePassword(account.id)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                    title={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(account)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 transition hover:bg-white/10"
                    aria-label="Edit account"
                    title="Edit account"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetPassword(account)}
                    disabled={saving}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 transition hover:bg-white/10 disabled:opacity-60"
                    aria-label="Reset password"
                    title="Reset password"
                  >
                    <KeyRound size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAccount(account)}
                    disabled={saving}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/40 text-red-100 transition hover:bg-red-500/20 disabled:opacity-60"
                    aria-label="Delete account"
                    title="Delete account"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
