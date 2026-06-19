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
  console.error("❌ Archivo 'service-account-key.json' no encontrado.")
  process.exit(1)
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

const app = initializeApp({
  credential: cert(serviceAccount),
})

const auth = getAuth(app)
const db = getFirestore(app)

const competitionNames = [
  'Bronx 04',
  'Perros de Traba',
  'Central Battles',
  'Leyendas 420',
  'Ritmoverso',
  'Código Øccidente',
  'Gallos de pelea',
  'Pacífico Flow Battles',
  'Elander',
  'Hunter Battles',
  '03 Under',
  'Reyes de Desampa',
  'ZHH',
  'Brumas Battles',
]

const normalizeSlug = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/gi, 'o')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

async function run() {
  try {
    const competitionsSnap = await db.collection('competitions').get()
    const competitionsBySlug = new Map()

    for (const doc of competitionsSnap.docs) {
      const data = doc.data()
      const slug = normalizeSlug(data.name || '')
      competitionsBySlug.set(slug, { id: doc.id, name: data.name || '' })
    }

    const createdOrUpdated = []

    for (const competitionName of competitionNames) {
      const username = normalizeSlug(competitionName)
      const password = `${username}123`
      const email = `${username}@organizador.bfcr.local`
      const competition = competitionsBySlug.get(username)

      if (!competition) {
        console.warn(`⚠️ Competencia no encontrada en Firestore: ${competitionName}`)
        continue
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
        },
        { merge: true },
      )

      createdOrUpdated.push({
        username,
        password,
        email,
        competitionName: competition.name,
      })
    }

    console.log('✅ Organizadores creados/actualizados:')
    for (const item of createdOrUpdated) {
      console.log(
        JSON.stringify({
          competition: item.competitionName,
          username: item.username,
          password: item.password,
          email: item.email,
        }),
      )
    }
  } catch (error) {
    console.error('❌ Error creando organizadores:', error)
    process.exitCode = 1
  } finally {
    await deleteApp(app)
  }
}

run()
