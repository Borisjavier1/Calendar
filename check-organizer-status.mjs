import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { cert, deleteApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serviceAccountPath = path.join(__dirname, 'service-account-key.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

const username = process.argv[2]
if (!username) {
  console.error('Usage: node check-organizer-status.mjs <username>')
  process.exit(1)
}

const email = `${username}@organizador.bfcr.local`
const app = initializeApp({ credential: cert(serviceAccount) })
const auth = getAuth(app)
const db = getFirestore(app)

try {
  let authUser = null
  try {
    authUser = await auth.getUserByEmail(email)
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      throw error
    }
  }

  const organizerSnap = await db.collection('organizers').where('username', '==', username).get()
  const competitionSnap = await db.collection('competitions').get()
  const competitionMatches = []
  for (const doc of competitionSnap.docs) {
    const data = doc.data()
    const slug = (data.name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ø/gi, 'o')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
    if (slug === username) {
      competitionMatches.push({ id: doc.id, ...data })
    }
  }

  console.log(JSON.stringify({
    username,
    email,
    authExists: Boolean(authUser),
    authUid: authUser?.uid || null,
    organizerDocs: organizerSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    matchingCompetitions: competitionMatches,
  }, null, 2))
} finally {
  await deleteApp(app)
}
