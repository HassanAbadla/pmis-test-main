export function isEndDateValid(startDate, endDate) {
  if (!startDate || !endDate) return true
  return new Date(endDate) >= new Date(startDate)
}

export function formatDateForDisplay(date) {
  return new Date(date).toISOString().split("T")[0]
}
