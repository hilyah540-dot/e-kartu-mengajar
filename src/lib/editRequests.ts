import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { RecordRow } from '../types';

export interface EditRequest {
  id?: string;
  teacherName: string;
  tanggal: string;
  originalData: RecordRow;
  requestedData: Partial<RecordRow>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
}

export const submitEditRequest = async (request: Omit<EditRequest, 'id' | 'createdAt' | 'status'>) => {
  const requestsRef = collection(db, 'edit_requests');
  await addDoc(requestsRef, {
    ...request,
    status: 'pending',
    createdAt: serverTimestamp()
  });
};

export const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
  const docRef = doc(db, 'edit_requests', requestId);
  await updateDoc(docRef, { status });
};

export const listenToTeacherRequests = (teacherName: string, callback: (requests: EditRequest[]) => void) => {
  const q = query(
    collection(db, 'edit_requests'),
    where('teacherName', '==', teacherName),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EditRequest));
    callback(requests);
  });
};

export const listenToAllPendingRequests = (callback: (requests: EditRequest[]) => void) => {
  const q = query(
    collection(db, 'edit_requests'),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EditRequest));
    callback(requests);
  });
};

export const listenToTeacherAllRequests = (teacherName: string, callback: (requests: EditRequest[]) => void) => {
  const q = query(
    collection(db, 'edit_requests'),
    where('teacherName', '==', teacherName)
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EditRequest));
    callback(requests);
  });
}
