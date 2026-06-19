export const COMPETITION_COLOR_PALETTE = [
  { label: 'Blanco', value: '#ffffff' },
  { label: 'Rojo Pasión', value: '#ef4444' },
  { label: 'Amarillo Graffiti', value: '#fcd34d' },
  { label: 'Verde Lima', value: '#22c55e' },
  { label: 'Azul Oscuro', value: '#1e40af' },
  { label: 'Púrpura Vibrant', value: '#a855f7' },
  { label: 'Turquesa', value: '#14b8a6' },
  { label: 'Naranja Fuego', value: '#f97316' },
  { label: 'Cian Cielo', value: '#06b6d4' },
  { label: 'Rosa Neón', value: '#ec4899' },
  { label: 'Verde Neon', value: '#84cc16' },
  { label: 'Beige Arena', value: '#d6c4a1' },
  { label: 'Crema Suave', value: '#f5e6c8' },
  { label: 'Marrón Tierra', value: '#8b5e34' },
  { label: 'Mostaza', value: '#d4a017' },
  { label: 'Coral', value: '#ff7f50' },
  { label: 'Vino', value: '#7f1d1d' },
  { label: 'Lavanda', value: '#c4b5fd' },
  { label: 'Azul Hielo', value: '#7dd3fc' },
  { label: 'Verde Menta', value: '#6ee7b7' },
  { label: 'Gris Piedra', value: '#9ca3af' },
]

// Mapeo de competitionId a color (se llena dinámicamente)
let competitionColorMap = {}

export const setCompetitionColor = (competitionId, color) => {
  competitionColorMap[competitionId] = color
}

export const setCompetitionColorMap = (map) => {
  competitionColorMap = { ...map }
}

export const getCompetitionColor = (idOrSeed = '', fallbackToSeed = true) => {
  // Primero intenta usar mapeo personalizado por ID
  if (competitionColorMap[idOrSeed]) {
    return competitionColorMap[idOrSeed]
  }

  // Si fallbackToSeed es true, usa hash del nombre/seed
  if (!fallbackToSeed) {
    return COMPETITION_COLOR_PALETTE[0].value
  }

  const normalized = String(idOrSeed || 'default')
  let hash = 0

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(index)
    hash |= 0
  }

  const colorIndex = Math.abs(hash) % COMPETITION_COLOR_PALETTE.length
  return COMPETITION_COLOR_PALETTE[colorIndex].value
}

export const getReadableTextColor = (hexColor = '#ef4444') => {
  const hex = String(hexColor).replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return '#ffffff'

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  // Relative luminance approximation for quick contrast selection.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#111827' : '#ffffff'
}

export const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
}
