export type AirwavesTimelineItem = {
  id: string
  createdAt: string | Date
}

export type AirwavesTimelineDay<T extends AirwavesTimelineItem> = {
  key: string
  label: string
  items: T[]
}

export type AirwavesTimelineMonth<T extends AirwavesTimelineItem> = {
  key: string
  label: string
  days: AirwavesTimelineDay<T>[]
}

const AIRWAVES_TIME_ZONE = "Pacific/Port_Moresby"

type DateParts = {
  year: number
  month: number
  day: number
}

function toDate(value: string | Date) {
  return value instanceof Date ? value : new Date(value)
}

function getZonedParts(date: Date): DateParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: AIRWAVES_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value)

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
  }
}

function dateFromParts(parts: DateParts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12))
}

function getIsoKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

function formatMonthLabel(parts: DateParts) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(parts.year, parts.month - 1, 1, 12)))
}

function getMonthKey(parts: DateParts) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}`
}

export function formatAirwavesPostTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: AIRWAVES_TIME_ZONE,
  }).format(toDate(value))
}

export function groupAirwavesByMonth<T extends AirwavesTimelineItem>(
  items: T[],
) {
  const monthMap = new Map<
    string,
    {
      label: string
      dayMap: Map<string, AirwavesTimelineDay<T>>
    }
  >()

  const sortedItems = [...items].sort(
    (a, b) =>
      toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime(),
  )

  for (const item of sortedItems) {
    const itemParts = getZonedParts(toDate(item.createdAt))
    const itemDay = dateFromParts(itemParts)
    const monthKey = getMonthKey(itemParts)
    const dayKey = getIsoKey(itemDay)

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        label: formatMonthLabel(itemParts),
        dayMap: new Map(),
      })
    }

    const month = monthMap.get(monthKey)

    if (!month) continue

    if (!month.dayMap.has(dayKey)) {
      month.dayMap.set(dayKey, {
        key: dayKey,
        label: formatDayLabel(itemDay),
        items: [],
      })
    }

    month.dayMap.get(dayKey)?.items.push(item)
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, month]) => ({
      key,
      label: month.label,
      days: Array.from(month.dayMap.values()).sort((a, b) =>
        a.key < b.key ? 1 : -1,
      ),
    }))
}

export const groupAirwavesByWeek = groupAirwavesByMonth
