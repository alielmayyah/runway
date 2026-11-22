// localStorage can be unavailable (private mode, blocked storage), so every access is guarded.
const BEST_KEY = 'crossroads.best'

export function getBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

export function saveBest(decisions) {
  try {
    if (decisions > getBest()) localStorage.setItem(BEST_KEY, String(decisions))
  } catch {
    // Ignore: the best score is a convenience only.
  }
}
