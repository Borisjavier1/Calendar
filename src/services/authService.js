import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth'
import { deleteApp, initializeApp } from 'firebase/app'
import { adminEmail, auth, firebaseConfig } from './firebase'

export const normalizeUsername = (value = '') => value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')

export const organizerEmailFromUsername = (username = '') => {
  const normalized = normalizeUsername(username)
  if (!normalized) return ''
  return `${normalized}@organizador.bfcr.local`
}

export const loginPanelUser = async ({ identifier, password }) => {
  const normalizedIdentifier = (identifier || '').trim()
  const email = normalizedIdentifier.includes('@')
    ? normalizedIdentifier.toLowerCase()
    : organizerEmailFromUsername(normalizedIdentifier)

  if (!email) {
    throw new Error('Ingresa un usuario o correo valido.')
  }

  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export const loginAdmin = async ({ email, password }) => {
  const credential = await signInWithEmailAndPassword(auth, email, password)

  if (!isAdminEmail(credential.user.email)) {
    await signOut(auth)
    throw new Error('Solo el administrador puede acceder al panel.')
  }

  return credential.user
}

export const logoutAdmin = async () => {
  await signOut(auth)
}

export const changeCurrentUserPassword = async ({ currentPassword, newPassword }) => {
  const currentUser = auth.currentUser

  if (!currentUser?.email) {
    throw new Error('No hay una sesion activa para cambiar la clave.')
  }

  const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
  await reauthenticateWithCredential(currentUser, credential)
  await updatePassword(currentUser, newPassword)
}

export const createOrganizerAuthAccount = async ({ username, password }) => {
  const email = organizerEmailFromUsername(username)

  if (!email) {
    throw new Error('El usuario debe tener al menos una letra o numero.')
  }

  const secondaryAppName = `organizer-creator-${Date.now()}`
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    await signOut(secondaryAuth)

    return {
      uid: credential.user.uid,
      email,
      username: normalizeUsername(username),
    }
  } catch (error) {
    if (error?.code === 'auth/email-already-in-use') {
      throw new Error(
        'Ese usuario ya existe en Firebase Auth. Si lo borraste desde el admin, todavia queda la cuenta de acceso y hay que eliminarla del servidor.',
      )
    }

    if (error?.code === 'auth/weak-password') {
      throw new Error('La clave debe tener al menos 6 caracteres.')
    }

    throw error
  } finally {
    await deleteApp(secondaryApp)
  }
}

export const createOrganizerWithDefaultPassword = async ({ username, email }) => {
  const normalizedUsername = normalizeUsername(username)
  if (!normalizedUsername) {
    throw new Error('El usuario debe tener al menos una letra o numero.')
  }

  const finalEmail = email || organizerEmailFromUsername(normalizedUsername)
  const tempPassword = `${normalizedUsername}123`

  const secondaryAppName = `auto-organizer-${Date.now()}`
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, finalEmail, tempPassword)
    await signOut(secondaryAuth)

    return {
      uid: credential.user.uid,
      email: finalEmail,
      username: normalizedUsername,
      tempPassword,
    }
  } catch (error) {
    if (error?.code === 'auth/email-already-in-use') {
      throw new Error(
        'Ese usuario ya existe en Firebase Auth. Si lo borraste desde el admin, todavia queda la cuenta de acceso y hay que eliminarla del servidor.',
      )
    }

    if (error?.code === 'auth/weak-password') {
      throw new Error('La clave debe tener al menos 6 caracteres.')
    }

    throw error
  } finally {
    await deleteApp(secondaryApp)
  }
}

export const subscribeToAuth = (onChange) => onAuthStateChanged(auth, onChange)

export const isAdminEmail = (email = '') => email.toLowerCase() === adminEmail?.toLowerCase()
