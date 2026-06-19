import fs from 'fs'
import { cert, deleteApp, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const key = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'))
const app = initializeApp({ credential: cert(key) })
const db = getFirestore(app)

const snap = await db.collection('organizers').get()
console.log(`TOTAL_ORGANIZERS=${snap.size}`)
for (const doc of snap.docs) {
  const data = doc.data()
  console.log(`${data.username || '-'} | ${data.competitionName || '-'}`)
}

await deleteApp(app)
