import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format, subDays } from 'date-fns';

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
}

interface AppContextType extends AppState {
  login: (email: string, role: Role) => void;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  checkIn: (userId: string) => void;
  checkOut: (userId: string) => void;
  requestLeave: (leave: Omit<Leave, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: Leave['status']) => void;
}

// --- Mock Data ---

const MOCK_USERS: User[] = [
  { id: '1', name: 'Sarah Connor', email: 'admin@nexus.com', role: 'admin', department: 'Management', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: '2', name: 'Kyle Reese', email: 'manager@nexus.com', role: 'manager', department: 'Operations', status: 'active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: '3', name: 'John Doe', email: 'employee@nexus.com', role: 'employee', department: 'Engineering', status: 'active', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150' },
  { id: '4', name: 'Jane Smith', email: 'jane@nexus.com', role: 'employee', department: 'Design', status: 'active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
  { id: '5', name: 'Mike Ross', email: 'mike@nexus.com', role: 'employee', department: 'Legal', status: 'inactive' },
];

const MOCK_ATTENDANCE: Attendance[] = [
  { id: '1', userId: '3', date: format(new Date(), 'yyyy-MM-dd'), checkIn: new Date().toISOString(), checkOut: null, status: 'present', hours: 0 },
  { id: '2', userId: '2', date: format(new Date(), 'yyyy-MM-dd'), checkIn: subDays(new Date(), 0).toISOString(), checkOut: null, status: 'present', hours: 0 },
  // History
  { id: '3', userId: '3', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), checkIn: subDays(new Date(), 1).toISOString(), checkOut: subDays(new Date(), 1).toISOString(), status: 'present', hours: 8.5 },
];

const MOCK_LEAVES: Leave[] = [
  { id: '1', userId: '4', type: 'sick', startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(new Date(), 'yyyy-MM-dd'), status: 'pending', reason: 'Flu' },
  { id: '2', userId: '3', type: 'annual', startDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'), endDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'), status: 'approved', reason: 'Vacation' },
];

// --- Context ---

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [attendance, setAttendance] = useState<Attendance[]>(MOCK_ATTENDANCE);
  const [leaves, setLeaves] = useState<Leave[]>(MOCK_LEAVES);

  const login = (email: string, role: Role) => {
    // Simple mock login
    const user = users.find(u => u.email === email) || users[0];
    setCurrentUser({ ...user, role }); // Force role for demo purposes if needed, otherwise rely on user.role
  };

  const logout = () => setCurrentUser(null);

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const checkIn = (userId: string) => {
    const newRecord: Attendance = {
      id: Math.random().toString(),
      userId,
      date: format(new Date(), 'yyyy-MM-dd'),
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: 'present',
      hours: 0,
    };
    setAttendance([...attendance, newRecord]);
  };

  const checkOut = (userId: string) => {
    setAttendance(attendance.map(a => {
      if (a.userId === userId && !a.checkOut && a.date === format(new Date(), 'yyyy-MM-dd')) {
        return { ...a, checkOut: new Date().toISOString(), hours: 8 }; // Mock 8 hours calculation
      }
      return a;
    }));
  };

  const requestLeave = (leaveData: Omit<Leave, 'id' | 'status'>) => {
    const newLeave: Leave = { ...leaveData, id: Math.random().toString(), status: 'pending' };
    setLeaves([...leaves, newLeave]);
  };

  const updateLeaveStatus = (id: string, status: Leave['status']) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      attendance,
      leaves,
      login,
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
