import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';
import LoadingOverlay from '../Components/LoadingOverlay';

type Role = 'admin' | 'user';

interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: AppUser | null;
  signup: (email: string, password: string, name: string, role: Role, stayLoggedIn: boolean) => Promise<void>;
  login: (email: string, password: string, stayLoggedIn: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true); // 🧠 Add loading flag

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
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: '',
          role: 'user',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        await loadUserData(fbUser);
      } else {
        setUser(null);
      }
      setLoading(false); // ✅ Set loading to false after auth check
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string, role: Role, stayLoggedIn: boolean) => {
    try {
      await setPersistence(auth, stayLoggedIn ? browserLocalPersistence : browserSessionPersistence);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), { name, role })
  .then(() => console.log("User added to Firestore"))
  .catch(console.error);

      await loadUserData(res.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, stayLoggedIn: boolean) => {
    try {
      await setPersistence(auth, stayLoggedIn ? browserLocalPersistence : browserSessionPersistence);
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

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
