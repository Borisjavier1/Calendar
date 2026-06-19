import { useEffect, useMemo, useState } from 'react'
import { subscribeToOrganizers } from '../services/organizersService'

export const useOrganizers = ({ enabled = true } = {}) => {
  const [organizers, setOrganizers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setOrganizers([])
      setError('')
      setIsLoading(false)
      return () => {}
    }

    setIsLoading(true)

    const unsubscribe = subscribeToOrganizers({
      onData: (data) => {
        setOrganizers(data)
        setError('')
        setIsLoading(false)
      },
      onError: (err) => {
        setError(err.message)
        setIsLoading(false)
      },
    })

    return () => unsubscribe()
  }, [enabled])

  const hasData = useMemo(() => organizers.length > 0, [organizers])

  return {
    organizers,
    isLoading,
    error,
    hasData,
  }
}
