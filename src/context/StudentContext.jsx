import { createContext, useContext, useState } from 'react';
import { seedIfEmpty, saveList, makeId } from '../utils/storage';

const StudentContext = createContext(null);

const SEED_STUDENTS = [
  { id: 'stu_1', fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', mobile: '9876543210', address: 'Chennai, Tamil Nadu', qualification: 'B.Tech', enrollmentDate: '2025-06-10' },
  { id: 'stu_2', fullName: 'Priya Nair', email: 'priya.nair@example.com', mobile: '9876501234', address: 'Bengaluru, Karnataka', qualification: 'B.Sc Computer Science', enrollmentDate: '2025-07-02' },
  { id: 'stu_3', fullName: 'Rohan Verma', email: 'rohan.verma@example.com', mobile: '9998887771', address: 'Pune, Maharashtra', qualification: 'BCA', enrollmentDate: '2025-08-15' },
];

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => seedIfEmpty('students', SEED_STUDENTS));

  const addStudent = (student) => {
    const newStudent = { ...student, id: makeId('stu') };
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveList('students', updated);
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    const updated = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setStudents(updated);
    saveList('students', updated);
  };

  const deleteStudent = (id) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    saveList('students', updated);
  };

  const getStudentById = (id) => students.find((s) => s.id === id);

  const findOrCreateByEmail = ({ fullName, email }) => {
    const existing = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;
    return addStudent({
      fullName,
      email,
      mobile: '',
      address: '',
      qualification: '',
      enrollmentDate: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <StudentContext.Provider
      value={{ students, addStudent, updateStudent, deleteStudent, getStudentById, findOrCreateByEmail }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudents must be used within StudentProvider');
  return ctx;
}
