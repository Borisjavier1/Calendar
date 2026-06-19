export const COMPETITION_COLOR_PALETTE = [
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

export const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
}
