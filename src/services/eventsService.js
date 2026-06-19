import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

const eventsCollection = collection(db, 'events')

const parseDateField = (date) => {
  if (date instanceof Date) return Timestamp.fromDate(date)

  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number)
    return Timestamp.fromDate(new Date(year, month - 1, day, 0, 0, 0, 0))
  }

  return Timestamp.fromDate(new Date(date))
}

const getCompetitionData = async (competitionId) => {
  const competitionSnapshot = await getDoc(doc(db, 'competitions', competitionId))

  if (!competitionSnapshot.exists()) {
    throw new Error('La competencia seleccionada no existe.')
  }

  return competitionSnapshot.data()
}

export const createEvent = async (payload) => {
  const competitionData = await getCompetitionData(payload.competitionId)

  const eventData = {
    name: payload.name,
    date: parseDateField(payload.date),
    city: payload.city?.trim() || '',
    place: payload.place?.trim() || '',
    description: payload.description,
    competitionId: payload.competitionId,
    competitionName: competitionData.name,
    type: competitionData.name,
    color: competitionData.color || '#ef4444',
    imageUrl: competitionData.imageUrl || '',
    competitionInstagramUrl: competitionData.instagramUrl || '',
    hasCustomTime: Boolean(payload.hasCustomTime),
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(eventsCollection, eventData)
  return docRef.id
}

export const updateEvent = async (eventId, payload) => {
  const eventRef = doc(db, 'events', eventId)
  const competitionData = await getCompetitionData(payload.competitionId)

  const eventData = {
    name: payload.name,
    date: parseDateField(payload.date),
    city: payload.city?.trim() || '',
    place: payload.place?.trim() || '',
    description: payload.description,
    competitionId: payload.competitionId,
    competitionName: competitionData.name,
    type: competitionData.name,
    color: competitionData.color || '#ef4444',
    imageUrl: competitionData.imageUrl || '',
    competitionInstagramUrl: competitionData.instagramUrl || '',
    hasCustomTime: Boolean(payload.hasCustomTime),
  }

  await updateDoc(eventRef, eventData)
}

export const deleteEvent = async (eventId) => {
  await deleteDoc(doc(db, 'events', eventId))
}

const mapDocToEvent = (item) => {
  const data = item.data()

  return {
    id: item.id,
    ...data,
    date: data.date?.toDate ? data.date.toDate() : null,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
  }
}

export const subscribeToEvents = ({
  sort = 'asc',
  competitionId,
  startDate,
  upcomingOnly = false,
  listLimit,
  onData,
  onError,
}) => {
  const clauses = []

  if (competitionId && competitionId !== 'all') {
    clauses.push(where('competitionId', '==', competitionId))
  }

  if (startDate) {
    clauses.push(where('date', '>=', Timestamp.fromDate(new Date(startDate))))
  } else if (upcomingOnly) {
    clauses.push(where('date', '>=', Timestamp.fromDate(new Date())))
  }

  clauses.push(orderBy('date', sort))

  if (listLimit) {
    clauses.push(limit(listLimit))
  }

  const eventsQuery = query(eventsCollection, ...clauses)

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      const events = snapshot.docs.map(mapDocToEvent)
      onData(events)
    },
    onError,
  )
}

export const getEventById = async (eventId) => {
  const snapshot = await getDoc(doc(db, 'events', eventId))
  if (!snapshot.exists()) return null
  return mapDocToEvent(snapshot)
}
