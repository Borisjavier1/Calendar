import { useEffect, useMemo, useState } from 'react'
import { subscribeToEvents } from '../services/eventsService'

export const useEvents = ({
  sort = 'asc',
  competitionId = 'all',
  startDate,
  upcomingOnly = false,
  listLimit,
} = {}) => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToEvents({
      sort,
      competitionId,
      startDate,
      upcomingOnly,
      listLimit,
      onData: (data) => {
        setEvents(data)
        setError('')
        setIsLoading(false)
      },
      onError: (err) => {
        setError(err.message)
        setIsLoading(false)
      },
    })

    return () => unsubscribe()
  }, [sort, competitionId, startDate, upcomingOnly, listLimit])

  const hasData = useMemo(() => events.length > 0, [events])

  return { events, isLoading, error, hasData }
}
