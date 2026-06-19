export const COMPETITION_COLOR_PALETTE = [
  '#e11d48',
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
]

export const getCompetitionColor = (seed = '') => {
  const normalized = String(seed || 'default')
  let hash = 0

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(index)
    hash |= 0
  }

  const colorIndex = Math.abs(hash) % COMPETITION_COLOR_PALETTE.length
  return COMPETITION_COLOR_PALETTE[colorIndex]
}

export const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
}
