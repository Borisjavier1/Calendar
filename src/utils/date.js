import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatDate = (value, pattern = "dd 'de' MMM yyyy, HH:mm") => {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return format(date, pattern, { locale: es })
}

export const formatEventDate = (value, hasCustomTime = false) => {
  const pattern = hasCustomTime ? "dd 'de' MMM yyyy, h:mm a" : "dd 'de' MMM yyyy"
  return formatDate(value, pattern)
}

export const startAndEndOfDay = (dateValue) => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue)

  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}
