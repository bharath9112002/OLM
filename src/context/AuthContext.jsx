import { createContext, useContext, useEffect, useState } from 'react';
import { loadList, saveList, makeId } from '../utils/storage';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'user_admin_demo',
    fullName: 'Admin User',
    email: 'admin@olm.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 'user_student_demo',
    fullName: 'Student User',
    email: 'student@olm.com',
    password: 'Student@123',
    role: 'student',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadList('current_user', null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always keep the demo accounts present and working, even if a
    // browser's localStorage already has a (possibly stale/corrupted)
    // 'users' entry from earlier testing — only seedIfEmpty would skip
    // re-adding them in that case, breaking the demo login shown on screen.
    const existing = loadList('users', []);
    const others = existing.filter(
      (u) => !DEFAULT_USERS.some((d) => d.email.toLowerCase() === u.email.toLowerCase())
    );
    saveList('users', [...DEFAULT_USERS, ...others]);
    setLoading(false);
  }, []);

  const login = ({ email, password, role }) => {
    const users = loadList('users', DEFAULT_USERS);
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) {
      throw new Error('Invalid email or password.');
    }
    if (match.role !== role) {
      throw new Error(`This account is registered as ${match.role}. Please select the correct role.`);
    }
    const sessionUser = { id: match.id, fullName: match.fullName, email: match.email, role: match.role };
    saveList('current_user', sessionUser);
    setUser(sessionUser);
    return sessionUser;
  };

  const register = ({ fullName, email, password, role }) => {
    const users = loadList('users', DEFAULT_USERS);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = { id: makeId('user'), fullName, email, password, role };
    saveList('users', [...users, newUser]);
    return newUser;
  };

  const forgotPassword = ({ email }) => {
    const users = loadList('users', DEFAULT_USERS);
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      throw new Error('No account found with this email.');
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem('olm_current_user');
    setUser(null);
  };

  const attachStudentId = (studentId) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, studentId };
      saveList('current_user', updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, forgotPassword, logout, attachStudentId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
