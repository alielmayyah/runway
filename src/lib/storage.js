// localStorage can be unavailable (private mode, blocked storage), so every access is guarded.
const BEST_KEY = 'runway.bestWeeks'

export function getBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

export function saveBest(weeks) {
  try {
    if (weeks > getBest()) localStorage.setItem(BEST_KEY, String(weeks))
  } catch {
    // Ignore: the best score is a convenience only.
  }
}
