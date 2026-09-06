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
  { name: "Donate", href: "/donate" },
]
