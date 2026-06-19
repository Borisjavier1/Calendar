import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import { setCompetitionColorMap } from '../utils/constants'

const competitionsCollection = collection(db, 'competitions')
const eventsCollection = collection(db, 'events')

const mapDocToCompetition = (item) => {
  const data = item.data()

  return {
    id: item.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
  }
}

export const createCompetition = async (payload) => {
  const competitionData = {
    name: payload.name,
    city: payload.city,
    imageUrl: payload.imageUrl,
    color: payload.color || '#ef4444', // Rojo por defecto
    instagramUrl: payload.instagramUrl || '',
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(competitionsCollection, competitionData)
  return docRef.id
}

export const updateCompetition = async (competitionId, payload) => {
  await updateDoc(doc(db, 'competitions', competitionId), {
    name: payload.name,
    city: payload.city,
    imageUrl: payload.imageUrl,
    color: payload.color,
    instagramUrl: payload.instagramUrl || '',
  })

  // Keep denormalized event fields in sync when competition data changes.
  const linkedEventsQuery = query(eventsCollection, where('competitionId', '==', competitionId))
  const linkedEventsSnapshot = await getDocs(linkedEventsQuery)

  if (linkedEventsSnapshot.empty) return

  let batch = writeBatch(db)
  let batchCount = 0

  for (const eventDoc of linkedEventsSnapshot.docs) {
    batch.update(eventDoc.ref, {
      competitionName: payload.name,
      type: payload.name,
      imageUrl: payload.imageUrl || '',
      color: payload.color,
      competitionInstagramUrl: payload.instagramUrl || '',
    })
    batchCount += 1

    if (batchCount === 450) {
      await batch.commit()
      batch = writeBatch(db)
      batchCount = 0
    }
  }

  if (batchCount > 0) {
    await batch.commit()
  }
}

export const deleteCompetition = async (competitionId) => {
  // Primero elimina todos los eventos asociados a esta competencia
  const linkedEventsQuery = query(eventsCollection, where('competitionId', '==', competitionId))
  const linkedEventsSnapshot = await getDocs(linkedEventsQuery)

  if (!linkedEventsSnapshot.empty) {
    let batch = writeBatch(db)
    let batchCount = 0

    for (const eventDoc of linkedEventsSnapshot.docs) {
      batch.delete(eventDoc.ref)
      batchCount += 1

      if (batchCount === 450) {
        await batch.commit()
        batch = writeBatch(db)
        batchCount = 0
      }
    }

    if (batchCount > 0) {
      await batch.commit()
    }
  }

  // Luego elimina la competencia
  await deleteDoc(doc(db, 'competitions', competitionId))
}

export const updateCompetitionInstagram = async (competitionId, instagramUrl) => {
  await updateDoc(doc(db, 'competitions', competitionId), {
    instagramUrl: instagramUrl || '',
  })

  const linkedEventsQuery = query(eventsCollection, where('competitionId', '==', competitionId))
  const linkedEventsSnapshot = await getDocs(linkedEventsQuery)

  if (linkedEventsSnapshot.empty) return

  let batch = writeBatch(db)
  let batchCount = 0

  for (const eventDoc of linkedEventsSnapshot.docs) {
    batch.update(eventDoc.ref, {
      competitionInstagramUrl: instagramUrl || '',
    })
    batchCount += 1

    if (batchCount === 450) {
      await batch.commit()
      batch = writeBatch(db)
      batchCount = 0
    }
  }

  if (batchCount > 0) {
    await batch.commit()
  }
}

export const updateCompetitionColor = async (competitionId, color) => {
  await updateDoc(doc(db, 'competitions', competitionId), {
    color,
  })

  const linkedEventsQuery = query(eventsCollection, where('competitionId', '==', competitionId))
  const linkedEventsSnapshot = await getDocs(linkedEventsQuery)

  if (linkedEventsSnapshot.empty) return

  let batch = writeBatch(db)
  let batchCount = 0

  for (const eventDoc of linkedEventsSnapshot.docs) {
    batch.update(eventDoc.ref, {
      color,
    })
    batchCount += 1

    if (batchCount === 450) {
      await batch.commit()
      batch = writeBatch(db)
      batchCount = 0
    }
  }

  if (batchCount > 0) {
    await batch.commit()
  }
}

export const subscribeToCompetitions = ({ onData, onError }) => {
  const competitionsQuery = query(competitionsCollection, orderBy('name', 'asc'))

  return onSnapshot(
    competitionsQuery,
    (snapshot) => {
      const competitions = snapshot.docs.map(mapDocToCompetition)
      // Carga el mapeo de colores por ID
      const colorMap = {}
      competitions.forEach((comp) => {
        if (comp.color) {
          colorMap[comp.id] = comp.color
        }
      })
      setCompetitionColorMap(colorMap)
      onData(competitions)
    },
    onError,
  )
}
