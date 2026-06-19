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

const emailFromUsername = (username) => `${username}@organizador.bfcr.local`

async function run() {
  try {
    const organizersSnapshot = await db.collection('organizers').get()

    if (organizersSnapshot.empty) {
      console.log('No hay organizadores para resetear.')
      return
    }

    let resetCount = 0

    for (const organizerDoc of organizersSnapshot.docs) {
      const organizer = organizerDoc.data()
      const username = normalizeUsername(organizer.username || '')

      if (!username) {
        console.log(`SKIP uid=${organizerDoc.id} (sin username)`)
        continue
      }

      const email = organizer.email || emailFromUsername(username)
      const newPassword = `${username}123`

      try {
        const user = await auth.getUserByEmail(email)
        await auth.updateUser(user.uid, { password: newPassword })

        await db
          .collection('organizers')
          .doc(user.uid)
          .set(
            {
              passwordResetAt: FieldValue.serverTimestamp(),
              passwordResetMode: 'bulk-default-username123',
            },
            { merge: true },
          )

        console.log(`OK ${username} -> ${newPassword}`)
        resetCount += 1
      } catch (error) {
        console.log(`ERROR ${username}: ${error?.message || error}`)
      }
    }

    console.log(`Total reseteados: ${resetCount}`)
  } catch (error) {
    console.error('Error en reset masivo:', error.message || error)
    process.exitCode = 1
  } finally {
    await deleteApp(app)
  }
}

run()
