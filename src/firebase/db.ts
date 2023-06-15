import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import getDateNow from '../utils/getDate';
import { db } from './auth';

// READ
async function dbReadAll(colId: string) {
  const querySnapshot = await getDocs(collection(db, colId));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}

async function dbRead(colId: string, docId: string) {
  const docRef = doc(db, colId, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!');
  }
}

// CREATE
async function dbCreate(colId: string) {
  const now = getDateNow();
  try {
    const docRef = await addDoc(collection(db, colId), {
      title: 'Test Note Title',
      content: '# Test note content: ~~completed~~',
      tags: ['md', 'test'],
      createdAt: now,
      lastModifiedAt: now,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

// UPDATE
async function dbUpdate(colId: string, docId: string) {
  const docRef = doc(db, colId, docId);
  await updateDoc(docRef, {
    lastModifiedAt: getDateNow(),
  });
}

// DELETE
async function dbDelete(colId: string, docId: string) {
  await deleteDoc(doc(db, colId, docId));
}

export { dbReadAll, dbRead, dbCreate, dbUpdate, dbDelete };
