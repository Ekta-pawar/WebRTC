export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isStrongEnoughPassword(value) {
  return value.length >= 6
}

export function passwordsMatch(a, b) {
  return a.length > 0 && a === b
}
