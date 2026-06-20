import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { cert, deleteApp, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serviceAccountPath = path.join(__dirname, 'service-account-key.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

const inputName = process.argv.slice(2).join(' ').trim()
if (!inputName) {
  console.error('Uso: node inspect-event-by-name.mjs <nombre evento>')
  process.exit(1)
}

const app = initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore(app)

try {
  const snap = await db.collection('events').where('name', '==', inputName).get()
  const results = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  console.log(JSON.stringify(results, null, 2))
} finally {
  await deleteApp(app)
}
