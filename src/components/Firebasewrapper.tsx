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
import VsIconDataUrl from '@/assets/images/icons/vs.svg';

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
  const VsIconDataUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M30.8898 2.72998L30.1304 3.79873L33.6554 6.29623L34.4148 5.22373L30.8898 2.72998ZM22.6398 3.20248L24.9085 7.45498L25.0773 7.57592L26.4648 3.79217L22.6398 3.20248ZM28.0398 4.38654L26.5023 8.58654L30.3179 11.2875L33.6273 8.33061C33.5429 8.27623 33.4491 8.21904 33.3648 8.1581L28.0398 4.38654ZM5.6082 4.55248L6.62445 8.84904L9.40227 9.09279L9.65539 6.31498L5.6082 4.55248ZM44.146 7.06967C43.621 7.51123 43.0023 7.87498 42.3179 8.17029C42.7866 12.525 40.9398 15.9937 38.0804 18.4594C35.596 20.6062 32.371 22.0594 29.1741 22.95C28.9398 23.4 28.7054 23.8125 28.4804 24.1781C32.371 24.6844 37.2179 22.1906 40.5929 18.5531C42.4491 16.5562 43.8554 14.25 44.446 12.0656C44.9335 10.2469 44.8866 8.55748 44.146 7.06967ZM11.2116 7.88623L10.9304 10.9312L7.89758 10.6594L29.1366 36.0656L31.0116 34.5L32.446 33.3L11.2116 7.88623ZM40.6866 8.72717C40.2929 8.82092 39.8898 8.91467 39.4866 8.98029C38.0898 9.21467 36.6648 9.27092 35.4085 9.00842L31.5648 12.4406C31.9398 13.0969 32.0335 13.9125 31.9866 14.7375C31.9304 15.9187 31.5835 17.2406 31.1148 18.5719C30.8335 19.35 30.5241 20.1281 30.1866 20.8781C32.7085 20.0156 35.1179 18.7875 36.9835 17.1844C39.4398 15.0469 40.9679 12.3469 40.6866 8.72717ZM25.6866 10.0687L20.8866 16.8375L23.7554 20.2594L29.2116 12.5625L25.6866 10.0687ZM16.2929 23.325L3.23633 41.7375L6.75477 44.2312L19.1523 26.7469L16.2929 23.325ZM38.1366 30.75L25.621 41.2031L27.421 43.3687L39.9366 32.9062L38.1366 30.75ZM36.421 38.0531L33.1116 40.8094L36.8335 45.2719L40.1429 42.5156L36.421 38.0531Z' fill='white'/%3E%3C/svg%3E";
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

      return VsIconDataUrl;
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
