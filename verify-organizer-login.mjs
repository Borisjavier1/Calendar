import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const username = process.argv[2]
const password = process.argv[3]
if (!username || !password) {
  console.error('Usage: node verify-organizer-login.mjs <username> <password>')
  process.exit(1)
}

const email = username.includes('@') ? username : `${username}@organizador.bfcr.local`
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

try {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  console.log(JSON.stringify({ ok: true, uid: credential.user.uid, email: credential.user.email }, null, 2))
  await signOut(auth)
} catch (error) {
  console.error(JSON.stringify({ ok: false, code: error.code, message: error.message }, null, 2))
  process.exitCode = 1
}
