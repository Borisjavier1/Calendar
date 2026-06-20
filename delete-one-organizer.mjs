import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { cert, deleteApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serviceAccountPath = path.join(__dirname, 'service-account-key.json')

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Archivo 'service-account-key.json' no encontrado.")
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
const app = initializeApp({ credential: cert(serviceAccount) })
const auth = getAuth(app)
const db = getFirestore(app)

const normalizeUsername = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/gi, 'o')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

const rawInput = process.argv.slice(2).join(' ').trim()
if (!rawInput) {
  console.error('Uso: node delete-one-organizer.mjs <usuario o nombre de competencia>')
  process.exit(1)
}

const username = normalizeUsername(rawInput)
const email = `${username}@organizador.bfcr.local`

try {
  let deletedAuth = false
  let deletedProfile = false
  let uid = null

  try {
    const user = await auth.getUserByEmail(email)
    uid = user.uid
    await auth.deleteUser(user.uid)
    deletedAuth = true
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      throw error
    }
  }

  if (uid) {
    const organizerRef = db.collection('organizers').doc(uid)
    const organizerSnap = await organizerRef.get()
    if (organizerSnap.exists) {
      await organizerRef.delete()
      deletedProfile = true
    }
  } else {
    const organizerSnap = await db.collection('organizers').where('username', '==', username).get()
    for (const doc of organizerSnap.docs) {
      await doc.ref.delete()
      deletedProfile = true
    }
  }

  console.log(JSON.stringify({ username, email, deletedAuth, deletedProfile }, null, 2))
} catch (error) {
  console.error('Error eliminando organizador:', error.message || error)
  process.exitCode = 1
} finally {
  await deleteApp(app)
}
