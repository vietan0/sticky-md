import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import getDateNow from '../utils/getDate';
import NoteData from '../types/NoteData';
import { auth, db } from './auth';

// READ
async function dbReadAll(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}

async function dbRead(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!');
  }
}

// CREATE
async function dbCreate(noteData: NoteData) {
  // I use userId as collection name
  const { uid } = auth.currentUser as User;
  try {
    console.log(uid);
    
    // const docRef = await addDoc(collection(db, uid), noteData);
    // console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

// UPDATE
async function dbUpdate(collectionName: string, docId: string) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    lastModifiedAt: getDateNow(),
  });
}

// DELETE
async function dbDelete(collectionName: string, docId: string) {
  await deleteDoc(doc(db, collectionName, docId));
}

export { dbReadAll, dbRead, dbCreate, dbUpdate, dbDelete };
