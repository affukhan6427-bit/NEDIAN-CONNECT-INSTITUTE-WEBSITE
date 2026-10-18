import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { 
  DEFAULT_INSTITUTE_INFO, 
  INITIAL_COURSES, 
  INITIAL_PLACEMENTS, 
  INITIAL_NOTICES, 
  INITIAL_CERTIFICATES, 
  INITIAL_INQUIRIES 
} from '../src/data/instituteData';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    console.log('Target database:', firebaseConfig.firestoreDatabaseId);

    // 1. Profile
    console.log('Seeding profile...');
    await setDoc(doc(db, 'institute_config', 'profile'), {
      ...DEFAULT_INSTITUTE_INFO,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // 2. Courses
    console.log('Seeding courses:', INITIAL_COURSES.length);
    const b1 = writeBatch(db);
    INITIAL_COURSES.forEach((c) => {
      b1.set(doc(db, 'courses', c.id), c, { merge: true });
    });
    await b1.commit();

    // 3. Notices
    console.log('Seeding notices:', INITIAL_NOTICES.length);
    const b2 = writeBatch(db);
    INITIAL_NOTICES.forEach((n) => {
      b2.set(doc(db, 'notices', n.id), n, { merge: true });
    });
    await b2.commit();

    // 4. Placements
    console.log('Seeding placements:', INITIAL_PLACEMENTS.length);
    const b3 = writeBatch(db);
    INITIAL_PLACEMENTS.forEach((p) => {
      b3.set(doc(db, 'placements', p.id), p, { merge: true });
    });
    await b3.commit();

    // 5. Certificates
    console.log('Seeding certificates:', INITIAL_CERTIFICATES.length);
    const b4 = writeBatch(db);
    INITIAL_CERTIFICATES.forEach((cert) => {
      const key = (cert.studentId || cert.id).replace(/[^a-zA-Z0-9_-]/g, '_');
      b4.set(doc(db, 'certificates', key), cert, { merge: true });
    });
    await b4.commit();

    // 6. Inquiries
    console.log('Seeding inquiries:', INITIAL_INQUIRIES.length);
    const b5 = writeBatch(db);
    INITIAL_INQUIRIES.forEach((inq) => {
      b5.set(doc(db, 'inquiries', inq.id), inq, { merge: true });
    });
    await b5.commit();

    console.log('SUCCESS: All collections seeded into Cloud Firestore!');
  } catch (e) {
    console.error('Seeding error:', e);
  }
  process.exit(0);
}

run();
