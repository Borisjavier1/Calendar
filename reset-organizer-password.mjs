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

const parseArgs = () => {
  const args = process.argv.slice(2)
  const usernameArg = args.find((arg) => !arg.startsWith('--'))
  const passwordFlag = args.find((arg) => arg.startsWith('--password='))
  const password = passwordFlag ? passwordFlag.split('=')[1] : ''

  return {
    username: normalizeUsername(usernameArg || ''),
    password,
  }
}

const emailFromUsername = (username) => `${username}@organizador.bfcr.local`

async function run() {
  try {
    const { username, password } = parseArgs()

    if (!username) {
      console.error('Uso: node reset-organizer-password.mjs <usuario> [--password=nuevaClave]')
      process.exitCode = 1
      return
    }

    const newPassword = password || `${username}123`

    if (newPassword.length < 6) {
      console.error('La nueva clave debe tener al menos 6 caracteres.')
      process.exitCode = 1
      return
    }

    const email = emailFromUsername(username)
    const user = await auth.getUserByEmail(email)

    await auth.updateUser(user.uid, { password: newPassword })

    await db
      .collection('organizers')
      .doc(user.uid)
      .set(
        {
          passwordResetAt: FieldValue.serverTimestamp(),
          passwordResetMode: password ? 'manual' : 'default-username123',
        },
        { merge: true },
      )

    console.log('Password actualizado correctamente')
    console.log(`usuario=${username}`)
    console.log(`email=${email}`)
    console.log(`nuevaClave=${newPassword}`)
  } catch (error) {
    if (error?.code === 'auth/user-not-found') {
      console.error('No existe un organizador con ese usuario.')
    } else {
      console.error('Error reseteando clave:', error.message || error)
    }
    process.exitCode = 1
  } finally {
    await deleteApp(app)
  }
}

run()
