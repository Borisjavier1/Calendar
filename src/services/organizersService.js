import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const organizersCollection = collection(db, 'organizers')

const mapDocToOrganizer = (item) => {
  const data = item.data()

  return {
    id: item.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
  }
}

export const createOrganizerProfile = async ({
  uid,
  username,
  email,
  competitionId,
  competitionName,
}) => {
  await setDoc(doc(db, 'organizers', uid), {
    username,
    email,
    competitionId,
    competitionName,
    isActive: true,
    createdAt: serverTimestamp(),
  })
}

export const getOrganizerProfile = async (uid) => {
  if (!uid) return null

  const snapshot = await getDoc(doc(db, 'organizers', uid))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

export const subscribeToOrganizers = ({ onData, onError }) => {
  const organizersQuery = query(organizersCollection, orderBy('username', 'asc'))

  return onSnapshot(
    organizersQuery,
    (snapshot) => {
      onData(snapshot.docs.map(mapDocToOrganizer))
    },
    onError,
  )
}
