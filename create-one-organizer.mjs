import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { cert, deleteApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

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

const inputName = process.argv.slice(2).join(' ').trim()
if (!inputName) {
  console.error('Uso: node create-one-organizer.mjs <nombre de competencia>')
  process.exit(1)
}

const username = normalizeUsername(inputName)
const email = `${username}@organizador.bfcr.local`
const password = `${username}123`

try {
  const competitionsSnap = await db.collection('competitions').get()
  const competition = competitionsSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .find((item) => normalizeUsername(item.name || '') === username)

  if (!competition) {
    throw new Error(`No se encontro competencia para ${inputName}`)
  }

  let userRecord
  try {
    userRecord = await auth.getUserByEmail(email)
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: username,
      })
    } else {
      throw error
    }
  }

  await db.collection('organizers').doc(userRecord.uid).set(
    {
      username,
      email,
      competitionId: competition.id,
      competitionName: competition.name,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
      provisionedBy: 'manual-repair-script',
    },
    { merge: true },
  )

  console.log(JSON.stringify({
    ok: true,
    competitionId: competition.id,
    competitionName: competition.name,
    username,
    email,
    password,
    uid: userRecord.uid,
  }, null, 2))
} catch (error) {
  console.error('Error creando organizador:', error.message || error)
  process.exitCode = 1
} finally {
  await deleteApp(app)
}
