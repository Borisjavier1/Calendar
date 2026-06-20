import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

let analyticsInstance = null

export const initAnalytics = async () => {
  if (analyticsInstance) return analyticsInstance
  if (typeof window === 'undefined') return null
  if (!firebaseConfig.measurementId) return null

  const supported = await isSupported()
  if (!supported) return null

  analyticsInstance = getAnalytics(firebaseApp)
  return analyticsInstance
}

export const trackPageView = async (path = '/') => {
  const analytics = await initAnalytics()
  if (!analytics) return

  logEvent(analytics, 'page_view', {
    page_path: path,
    page_title: document?.title || 'Batallas Freestyle CR',
  })
}

export const trackAppOpen = async () => {
  const analytics = await initAnalytics()
  if (!analytics) return

  logEvent(analytics, 'screen_view', {
    firebase_screen: 'web_app',
    firebase_screen_class: 'app',
  })
}
