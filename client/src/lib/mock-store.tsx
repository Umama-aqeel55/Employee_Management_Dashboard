import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { 
  onSnapshot, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { db, auth } from './firebase';
import { useToast } from '@/hooks/use-toast';

// --- Types ---

export type Role = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string; // ISO date
  checkIn: string; // ISO string
  checkOut: string | null; // ISO string
  status: 'present' | 'absent' | 'late' | 'half-day';
  hours: number;
}

export interface Leave {
  id: string;
  userId: string;
  type: 'sick' | 'casual' | 'annual';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  attendance: Attendance[];
  leaves: Leave[];
  loading: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  checkIn: (userId: string) => Promise<void>;
  checkOut: (userId: string) => Promise<void>;
  requestLeave: (leave: Omit<Leave, 'id' | 'status'>) => Promise<void>;
  updateLeaveStatus: (id: string, status: Leave['status']) => Promise<void>;
}

// --- Context ---

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Real-time Listeners ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      console.log("Auth state changed:", fbUser?.email);
      if (fbUser) {
        setLoading(true);
        const q = query(collection(db, "users"), where("email", "==", fbUser.email));
        
        const unsubUserProfile = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const docRef = snapshot.docs[0];
            let userData = { id: docRef.id, ...docRef.data() } as User;
            
            // Auto-upgrade to admin for testing if email contains 'admin'
            const isAdminEmail = fbUser.email?.toLowerCase().includes('admin');
            if (isAdminEmail && userData.role !== 'admin') {
              userData.role = 'admin';
              updateDoc(docRef.ref, { role: 'admin', department: 'Management' });
            }
            
            setCurrentUser(userData);
          } else {
            const isAdminEmail = fbUser.email?.toLowerCase().includes('admin');
            const defaultUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'New Employee',
              email: fbUser.email || '',
              role: isAdminEmail ? 'admin' : 'employee',
              department: isAdminEmail ? 'Management' : 'General',
              status: 'active',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.email}`
            };
            setDoc(doc(db, "users", fbUser.uid), defaultUser);
            setCurrentUser(defaultUser);
          }
          setLoading(false);
        }, (error) => {
          console.error("User profile listener error:", error);
          // If we can't read the profile due to permissions, we still need to stop loading
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Database Error",
            description: "Could not fetch user profile. Please check Firestore permissions.",
          });
        });

        return () => unsubUserProfile();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  // Global listeners only for authenticated users
  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      setAttendance([]);
      setLeaves([]);
      return;
    }

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(userData);
    }, (error) => {
      if (error.code !== 'permission-denied') {
        console.error("Users listener error:", error);
      }
    });

    const unsubAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const attendanceData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attendance));
      setAttendance(attendanceData);
    }, (error) => {
      if (error.code !== 'permission-denied') {
        console.error("Attendance listener error:", error);
      }
    });

    const unsubLeaves = onSnapshot(collection(db, "leaves"), (snapshot) => {
      const leaveData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leave));
      setLeaves(leaveData);
    }, (error) => {
      if (error.code !== 'permission-denied') {
        console.error("Leaves listener error:", error);
      }
    });

    return () => {
      unsubUsers();
      unsubAttendance();
      unsubLeaves();
    };
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    console.log("Attempting login for:", email);
    // Authentication is handled via Firebase Auth
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase Auth success:", result.user.email);
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google Auth success:", result.user.email);
      // We don't need to manually create the user doc here because 
      // onAuthStateChanged will handle default user creation if they don't exist in Firestore.
    } catch (error) {
      console.error("Google Authentication failed:", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: Role) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // Check if a record already exists for this email (e.g. added by admin)
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      let newUser: User;
      if (!querySnapshot.empty) {
        // If exists, merge with existing data but use the new UID
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();
        newUser = {
          ...existingData,
          id: res.user.uid,
          name: name || existingData.name,
          email: email,
          role: existingData.role || role || 'employee',
        } as User;
        
        // Delete the old record with random ID if it's different from UID
        if (existingDoc.id !== res.user.uid) {
          // Note: In a real app we'd probably want to move other related data too
          // but for now we'll just ensure the profile is consolidated.
        }
      } else {
        newUser = {
          id: res.user.uid,
          name,
          email,
          role,
          department: 'General',
          status: 'active',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
      }
      
      await setDoc(doc(db, "users", res.user.uid), newUser);
      setCurrentUser(newUser);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      await addDoc(collection(db, "users"), userData);
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      await updateDoc(doc(db, "users", id), data);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const checkIn = async (userId: string) => {
    try {
      const newRecord: Omit<Attendance, 'id'> = {
        userId,
        date: format(new Date(), 'yyyy-MM-dd'),
        checkIn: new Date().toISOString(),
        checkOut: null,
        status: 'present',
        hours: 0,
      };
      await addDoc(collection(db, "attendance"), newRecord);
    } catch (error) {
      console.error("Check-in error:", error);
      throw error;
    }
  };

  const checkOut = async (userId: string) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const q = query(
        collection(db, "attendance"), 
        where("userId", "==", userId), 
        where("date", "==", today),
        where("checkOut", "==", null)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const attendanceDoc = snapshot.docs[0];
        const checkInTime = new Date(attendanceDoc.data().checkIn).getTime();
        const checkOutTime = new Date().getTime();
        const diffHours = Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60) * 10) / 10;

        await updateDoc(doc(db, "attendance", attendanceDoc.id), {
          checkOut: new Date().toISOString(),
          hours: diffHours > 0 ? diffHours : 0.1
        });
      }
    } catch (error) {
      console.error("Check-out error:", error);
      throw error;
    }
  };

  const requestLeave = async (leaveData: Omit<Leave, 'id' | 'status'>) => {
    try {
      const newLeave: Omit<Leave, 'id'> = { ...leaveData, status: 'pending' };
      await addDoc(collection(db, "leaves"), newLeave);
    } catch (error) {
      console.error("Leave request error:", error);
      throw error;
    }
  };

  const updateLeaveStatus = async (id: string, status: Leave['status']) => {
    try {
      await updateDoc(doc(db, "leaves", id), { status });
    } catch (error) {
      console.error("Leave status update error:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      attendance,
      leaves,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      addUser,
      updateUser,
      checkIn,
      checkOut,
      requestLeave,
      updateLeaveStatus
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

