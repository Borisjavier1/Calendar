import { useEffect, useState } from 'react'
import { isAdminEmail, subscribeToAuth } from '../services/authService'
import { getOrganizerProfile } from '../services/organizersService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('guest')
  const [organizerProfile, setOrganizerProfile] = useState(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (nextUser) => {
      if (!nextUser) {
        setUser(null)
        setRole('guest')
        setOrganizerProfile(null)
        setIsChecking(false)
        return
      }

      setUser(nextUser)

      if (isAdminEmail(nextUser.email)) {
        setRole('admin')
        setOrganizerProfile(null)
        setIsChecking(false)
        return
      }

      try {
        const organizer = await getOrganizerProfile(nextUser.uid)

        if (organizer?.isActive) {
          setRole('organizer')
          setOrganizerProfile(organizer)
        } else {
          setRole('guest')
          setOrganizerProfile(null)
        }
      } catch {
        setRole('guest')
        setOrganizerProfile(null)
      } finally {
        setIsChecking(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    role,
    organizerProfile,
    isChecking,
    isAdmin: role === 'admin',
    isOrganizer: role === 'organizer',
    isAuthenticated: role === 'admin' || role === 'organizer',
  }
}
