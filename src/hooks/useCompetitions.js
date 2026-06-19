import { useEffect, useMemo, useState } from 'react'
import { subscribeToCompetitions } from '../services/competitionsService'

export const useCompetitions = () => {
  const [competitions, setCompetitions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToCompetitions({
      onData: (data) => {
        setCompetitions(data)
        setError('')
        setIsLoading(false)
      },
      onError: (err) => {
        setError(err.message)
        setIsLoading(false)
      },
    })

    return () => unsubscribe()
  }, [])

  const hasData = useMemo(() => competitions.length > 0, [competitions])

  return { competitions, isLoading, error, hasData }
}
