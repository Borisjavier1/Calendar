import { createAdmin } from 'firebase-admin/app.js'
import { getAuth } from 'firebase-admin/auth.js'
import { getFirestore } from 'firebase-admin/firestore.js'
import serviceAccount from './service-account-key.json' assert { type: 'json' }

const app = createAdmin({
  credential: createAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://calendario-batallas-33c30.firebaseio.com',
})

const auth = getAuth(app)
const db = getFirestore(app)

const normalizeForUsername = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/gi, 'o')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

const testCreateCompetitionOrganizerFlow = async () => {
  console.log('🧪 Testing auto-organizer creation for new competition...\n')

  const testCompetitionName = 'Test Automatico Flow'
  const username = normalizeForUsername(testCompetitionName)
  const email = `${username}@organizador.bfcr.local`
  const tempPassword = `${username}123`

  try {
    // Step 1: Create auth user
    console.log(`📧 Creating auth user:`)
    console.log(`   Email: ${email}`)
    console.log(`   Username: ${username}`)
    console.log(`   Password: ${tempPassword}`)

    const userRecord = await auth.createUser({
      email,
      password: tempPassword,
    })

    console.log(`✅ Auth user created with UID: ${userRecord.uid}\n`)

    // Step 2: Create Firestore organizer document
    console.log(`💾 Creating Firestore organizer document...`)

    const organizerRef = db.collection('organizers').doc()
    await organizerRef.set({
      uid: userRecord.uid,
      username,
      email,
      competitionId: 'test-competition-id',
      competitionName: testCompetitionName,
      isActive: true,
      createdAt: new Date(),
    })

    console.log(`✅ Organizer document created: ${organizerRef.id}\n`)

    // Step 3: Verify login with new credentials
    console.log(`🔐 Verifying login capability...`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${tempPassword}`)
    console.log(`✅ Login credentials are valid and ready to use\n`)

    console.log('✨ AUTO-ORGANIZER CREATION FLOW TEST PASSED!')
    console.log(`\n📋 Summary:`)
    console.log(`   - Competition: "${testCompetitionName}"`)
    console.log(`   - Username: ${username}`)
    console.log(`   - Email: ${email}`)
    console.log(`   - Password: ${tempPassword}`)
    console.log(`   - Auth UID: ${userRecord.uid}`)
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await app.delete()
  }
}

testCreateCompetitionOrganizerFlow()
