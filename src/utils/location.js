const normalize = (value) => (value || '').trim()

const isGenericPlace = (value) => {
  const normalized = normalize(value).toLowerCase()
  return (
    normalized === '' ||
    normalized === 'lugar por confirmar' ||
    normalized === 'por confirmar'
  )
}

export const formatLocation = (place, city) => {
  const cleanPlace = normalize(place)
  const cleanCity = normalize(city)

  if (!cleanPlace && !cleanCity) {
    return 'Ubicacion por confirmar'
  }

  if (isGenericPlace(cleanPlace)) {
    return cleanCity || 'Ubicacion por confirmar'
  }

  if (!cleanCity || cleanPlace.toLowerCase() === cleanCity.toLowerCase()) {
    return cleanPlace
  }

  return `${cleanPlace}, ${cleanCity}`
}