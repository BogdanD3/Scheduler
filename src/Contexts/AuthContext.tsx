import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';

type Role = 'admin' | 'user';

interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: AppUser | null;
  signup: (email: string, password: string, name: string, role: Role) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  // Load Firestore user data (name, role)
const loadUserData = async (fbUser: FirebaseUser) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<AppUser, 'uid' | 'email'>;
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || '',
        ...userData,
      });
    } else {
      // Handle case where user data is missing in Firestore
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || '',
        name: '',
        role: 'user',
      });
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    // Optionally set user to null or a fallback state
  }
};

const signup = async (email: string, password: string, name: string, role: Role) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      name,
      role,
    });
    await loadUserData(res.user);
  } catch (error) {
    console.error('Signup error:', error);
    throw error; // Rethrow so the UI can respond accordingly
  }
};

const login = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await loadUserData(res.user);
  } catch (error) {
    console.error('Login failed:', error);
    alert(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};


  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
