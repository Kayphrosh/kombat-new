import { createContext, ReactNode, useContext } from 'react';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db as firestore, storage } from '@/firebase';
import vsIcon from '@/assets/images/icons/vs.svg';

// Define the shape of the context
interface FirestoreContextProps {
  addData: (collectionName: string, data: any, docId?: string) => Promise<void>;
  getData: (collectionName: string) => Promise<any[]>;
  uploadProfilePicture: (file: File, userId: string) => Promise<string>;
  getProfilePicture: (userId: string) => Promise<string>;
  createUser: (address: string, username: string) => Promise<void>;
  isUsernameTaken: (username: string) => Promise<boolean>;
  createBet: (userId: number, betData: BetData) => Promise<void>;
  getBet: (betId: string) => Promise<any>;
  getUserBets: (userId: string) => Promise<any[]>;
  getAddressByUsername: (username: string) => Promise<string | null>;
  getUsernameByAddress: (address: string) => Promise<string | null>;
  checkUserExists: (address: string) => Promise<boolean>;
}

export interface BetData {
  actor1: string;
  actor2: string;
  description: string;
  option: string;
  amount: number;
}

const FirestoreContext = createContext<FirestoreContextProps | undefined>(
  undefined,
);

export const FirestoreProvider = ({ children }: { children: ReactNode }) => {
  // Upload profile picture and return the download URL
  const uploadProfilePicture = async (file: File, userId: string) => {
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  // Get the profile picture download URL for a user
  const getProfilePicture = async (userId: string) => {
    try {
      const storageRef = ref(storage, `profile_pictures/${userId}`);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error(
        `Error fetching profile picture for userId ${userId}:`,
        error,
      );

      return vsIcon; // Replace with your default image path
    }
  };

  // Create a user with address and username
  const createUser = async (address: string, username: string) => {
    const userRef = doc(firestore, 'users', address);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      throw new Error('User already exists');
    }

    await setDoc(userRef, { username, address });
  };

  const checkUserExists = async (address: string) => {
    const userRef = doc(firestore, 'users', address);
    const userSnapshot = await getDoc(userRef);
    return userSnapshot.exists();
  };

  // Check if the username is already taken
  const isUsernameTaken = async (username: string) => {
    const q = query(
      collection(firestore, 'users'),
      where('username', '==', username),
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // Get the address of a user by their username
  const getAddressByUsername = async (username: string) => {
    const q = query(
      collection(firestore, 'users'),
      where('username', '==', username),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const userDoc = querySnapshot.docs[0];
    return userDoc.data().address;
  };

  const getUsernameByAddress = async (address: string) => {
    const q = query(
      collection(firestore, 'users'),
      where('address', '==', address),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const userDoc = querySnapshot.docs[0];
    return userDoc.data().username;
  };

  // Create a new bet
  const createBet = async (betId: number, betData: BetData) => {
    const userRef = doc(firestore, 'bets', String(betId));

    await setDoc(userRef, { betId: betId, ...betData });
  };

  // Get a bet by ID
  const getBet = async (betId: string) => {
    const userRef = doc(firestore, 'bets', betId);
    const userSnapshot = await getDoc(userRef);
    return { ...userSnapshot.data() };
  };

  const addData = async (collectionName: string, data: any, docId: any) => {
    const colRef = collection(firestore, collectionName, docId);
    await addDoc(colRef, data);
  };

  const getData = async (collectionName: string) => {
    const colRef = collection(firestore, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Get all bets for a user
  const getUserBets = async (userId: string) => {
    const userBetsCollection = collection(
      firestore,
      `users/${userId}/userBets`,
    );
    const snapshot = await getDocs(userBetsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  return (
    <FirestoreContext.Provider
      value={{
        addData,
        getData,
        uploadProfilePicture,
        getProfilePicture,
        createUser,
        isUsernameTaken,
        createBet,
        getBet,
        getUserBets,
        getAddressByUsername,
        checkUserExists,
        getUsernameByAddress,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
};

//   liveBets.forEach((bet, index) => {
//     console.log(`Live bet ${index + 1}:`);
//     console.log(`  Actor1: ${bet.actor1}`);
//     console.log(`  Actor2: ${bet.actor2}`);
//   });
// };
