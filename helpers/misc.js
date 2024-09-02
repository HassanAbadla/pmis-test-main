export function getInitials(fullName) {
  if (!fullName) return ""

  const nameArray = fullName.trim().split(" ")
  const initials = nameArray.map((name) => name.charAt(0).toUpperCase())
  return initials.join("")
}
