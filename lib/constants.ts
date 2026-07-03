export const USER_ROLES = {
  ADMIN: "ADMIN",
  JOURNALIST: "JOURNALIST",
  PRAYER: "PRAYER",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export function isUserRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole)
}

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Coverage", href: "/coverage" },
  { name: "Projects", href: "/projects" },
  { name: "Partners", href: "/partners" },
  { name: "News & Updates", href: "/news" },
  { name: "Support Us", href: "/support-us" },
  { name: "Contact", href: "/contact" },
]

export const programsList = [
  {
    title: "Morning Devotion",
    category: "Faith",
    description:
      "Daily spiritual encouragement, prayer, Bible reading, and devotion to start the day.",
  },
  {
    title: "Youth Talk",
    category: "Youth",
    description:
      "Programs for young people covering life, purpose, leadership, faith, and real issues.",
  },
  {
    title: "Family Hour",
    category: "Family",
    description:
      "Content focused on family values, parenting, relationships, and healthy living.",
  },
  {
    title: "Live Talk Show",
    category: "Talk Show",
    description:
      "Interactive discussions on society, faith, education, and community development.",
  },
  {
    title: "Special Broadcasts",
    category: "Events",
    description:
      "Coverage of conferences, crusades, public events, and important ministry programs.",
  },
  {
    title: "Community Voices",
    category: "Community",
    description:
      "Stories, interviews, and updates from communities, churches, and local leaders.",
  },
]

export const galleryImages = [
  {
    title: "Community Outreach",
    image: "/images/gallery1.jpg",
  },
  {
    title: "Youth Program",
    image: "/images/gallery2.jpg",
  },
  {
    title: "Live Broadcast",
    image: "/images/gallery3.jpg",
  },
  {
    title: "Church Event",
    image: "/images/gallery4.jpg",
  },
]

export const coverageEvents = [
  {
    title: "National Prayer Conference",
    description:
      "Coverage of national prayer gathering bringing churches together.",
  },
  {
    title: "Youth Leadership Summit",
    description:
      "Inspiring young leaders to serve communities and churches.",
  },
  {
    title: "Community Outreach Program",
    description:
      "Support and outreach activities helping families and communities.",
  },
]

export const projectsList = [
  {
    title: "Faith Broadcasting Expansion",
    description:
      "Expanding Wantok Radio Light broadcasting to reach more communities.",
  },
  {
    title: "Youth Empowerment Initiative",
    description:
      "Programs focused on youth leadership, faith, and education.",
  },
  {
    title: "Community Education Program",
    description:
      "Educational content designed to support families and communities.",
  },
]

export const partnersList = [
  {
    name: "Local Churches Network",
  },
  {
    name: "Community Outreach Ministries",
  },
  {
    name: "Faith Education Partners",
  },
  {
    name: "Youth Development Organizations",
  },
]

export const airwavesSchedule = [
  {
    day: "Monday",
    program: "Morning Devotion",
    time: "6:00 AM",
  },
  {
    day: "Tuesday",
    program: "Youth Talk",
    time: "7:00 PM",
  },
  {
    day: "Wednesday",
    program: "Family Hour",
    time: "6:30 PM",
  },
  {
    day: "Thursday",
    program: "Live Talk Show",
    time: "8:00 PM",
  },
  {
    day: "Friday",
    program: "Community Voices",
    time: "7:30 PM",
  },
]
