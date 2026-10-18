import { 
  doc, 
  collection, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
export { db };
import { 
  Course, 
  PlacementStory, 
  InstituteNotice, 
  StudentInquiry, 
  InstituteInfo, 
  StudentCertificateRecord 
} from '../types';
import { 
  DEFAULT_INSTITUTE_INFO, 
  INITIAL_COURSES, 
  INITIAL_NOTICES, 
  INITIAL_PLACEMENTS, 
  INITIAL_CERTIFICATES, 
  INITIAL_INQUIRIES 
} from '../data/instituteData';

// Validate connection per Firebase Skill Guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline, using cached or fallback data.");
    }
    return false;
  }
}

// Automatically test connection on boot
testConnection();

// Initial seed helper: If database collections are empty, populate with default institute data
export async function seedInitialDataIfEmpty() {
  try {
    const profileRef = doc(db, 'institute_config', 'profile');
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      await setDoc(profileRef, {
        ...DEFAULT_INSTITUTE_INFO,
        updatedAt: new Date().toISOString(),
      });
    }

    const coursesSnap = await getDocs(collection(db, 'courses'));
    if (coursesSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_COURSES.forEach((course) => {
        const cRef = doc(db, 'courses', course.id);
        batch.set(cRef, course);
      });
      await batch.commit();
    }
  } catch (err) {
    console.warn('Initial data seeding notice (using local/default data):', err);
  }
}

// Map for preserving default curriculum logical ordering
const courseOrderMap = new Map(INITIAL_COURSES.map((c, idx) => [c.id, idx]));

// -------------------------------------------------------------
// REAL-TIME CLOUD LISTENERS (Updates all phones in real-time)
// -------------------------------------------------------------

export function subscribeToInstituteInfo(onData: (info: InstituteInfo) => void) {
  try {
    const profileRef = doc(db, 'institute_config', 'profile');
    return onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as InstituteInfo;
        onData(data);
      }
    }, (err) => {
      console.warn('Institute info real-time listener notice:', err);
    });
  } catch (e) {
    console.warn('Error setting up institute info listener', e);
    return () => {};
  }
}

export function subscribeToCourses(onData: (courses: Course[]) => void) {
  try {
    const colRef = collection(db, 'courses');
    return onSnapshot(colRef, (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as Course);
        // Retain logical syllabus ordering
        items.sort((a, b) => {
          const idxA = courseOrderMap.has(a.id) ? courseOrderMap.get(a.id)! : 999;
          const idxB = courseOrderMap.has(b.id) ? courseOrderMap.get(b.id)! : 999;
          return idxA - idxB;
        });
        onData(items);
      }
    }, (err) => {
      console.warn('Courses real-time listener notice:', err);
    });
  } catch (e) {
    console.warn('Error setting up courses listener', e);
    return () => {};
  }
}

export function subscribeToNotices(onData: (notices: InstituteNotice[]) => void) {
  try {
    const colRef = collection(db, 'notices');
    return onSnapshot(colRef, (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as InstituteNotice);
        onData(items);
      }
    }, (err) => {
      console.warn('Notices real-time listener notice:', err);
    });
  } catch (e) {
    console.warn('Error setting up notices listener', e);
    return () => {};
  }
}

export function subscribeToPlacements(onData: (placements: PlacementStory[]) => void) {
  try {
    const colRef = collection(db, 'placements');
    return onSnapshot(colRef, (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as PlacementStory);
        onData(items);
      }
    }, (err) => {
      console.warn('Placements real-time listener notice:', err);
    });
  } catch (e) {
    console.warn('Error setting up placements listener', e);
    return () => {};
  }
}

export function subscribeToInquiries(onData: (inquiries: StudentInquiry[]) => void) {
  try {
    const colRef = collection(db, 'inquiries');
    return onSnapshot(colRef, (snap) => {
      const items = snap.docs.map((d) => d.data() as StudentInquiry);
      if (items.length > 0) {
        onData(items);
      }
    }, (err) => {
      console.warn('Inquiries real-time listener notice:', err);
    });
  } catch (e) {
    console.warn('Error setting up inquiries listener', e);
    return () => {};
  }
}

export function subscribeToCertificates(onData: (certs: StudentCertificateRecord[]) => void) {
  try {
    const colRef = collection(db, 'certificates');
    return onSnapshot(colRef, (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => d.data() as StudentCertificateRecord);
        onData(items);
      }
    }, (err) => {
      console.warn('Certificates real-time listener notice:', err);
    });
  } catch (e) {
    console.warn('Error setting up certificates listener', e);
    return () => {};
  }
}

// -------------------------------------------------------------
// CLOUD WRITE ACTIONS (Propagates immediately to all users)
// -------------------------------------------------------------

export async function saveInstituteInfoToCloud(info: InstituteInfo) {
  try {
    const ref = doc(db, 'institute_config', 'profile');
    await setDoc(ref, {
      ...info,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to sync institute info to Cloud Firestore:', err);
  }
}

export async function saveCoursesToCloud(courses: Course[]) {
  try {
    const batch = writeBatch(db);
    courses.forEach((course) => {
      const ref = doc(db, 'courses', course.id);
      batch.set(ref, course, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Failed to sync courses to Cloud Firestore:', err);
  }
}

export async function saveSingleCourseToCloud(course: Course) {
  try {
    const ref = doc(db, 'courses', course.id);
    await setDoc(ref, course, { merge: true });
  } catch (err) {
    console.error('Failed to sync single course to Cloud Firestore:', err);
  }
}

export async function deleteCourseFromCloud(courseId: string) {
  try {
    const ref = doc(db, 'courses', courseId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Failed to delete course from Cloud Firestore:', err);
  }
}

export async function saveNoticesToCloud(notices: InstituteNotice[]) {
  try {
    const batch = writeBatch(db);
    notices.forEach((notice) => {
      const ref = doc(db, 'notices', notice.id);
      batch.set(ref, notice, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Failed to sync notices to Cloud Firestore:', err);
  }
}

export async function savePlacementsToCloud(placements: PlacementStory[]) {
  try {
    const batch = writeBatch(db);
    placements.forEach((placement) => {
      const ref = doc(db, 'placements', placement.id);
      batch.set(ref, placement, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Failed to sync placements to Cloud Firestore:', err);
  }
}

export async function saveInquiriesToCloud(inquiries: StudentInquiry[]) {
  try {
    const batch = writeBatch(db);
    inquiries.forEach((inq) => {
      const ref = doc(db, 'inquiries', inq.id);
      batch.set(ref, inq, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Failed to sync inquiries to Cloud Firestore:', err);
  }
}

export async function submitInquiryToCloud(inquiry: StudentInquiry) {
  try {
    const ref = doc(db, 'inquiries', inquiry.id);
    await setDoc(ref, inquiry);
  } catch (err) {
    console.error('Failed to submit inquiry to Cloud Firestore:', err);
  }
}

export async function saveCertificatesToCloud(certificates: StudentCertificateRecord[]) {
  try {
    const batch = writeBatch(db);
    certificates.forEach((cert) => {
      const docKey = (cert.studentId || cert.id).replace(/[^a-zA-Z0-9_-]/g, '_');
      const ref = doc(db, 'certificates', docKey);
      batch.set(ref, cert, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Failed to sync certificates to Cloud Firestore:', err);
  }
}
