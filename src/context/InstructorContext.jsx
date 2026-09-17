import { createContext, useContext, useState } from 'react';
import { seedIfEmpty, saveList, makeId } from '../utils/storage';

const InstructorContext = createContext(null);

const SEED_INSTRUCTORS = [
  {
    id: 'ins_1',
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@olm.com',
    experience: '12 years',
    specialization: 'Web Development',
    profileImage: 'https://i.pravatar.cc/150?img=47',
    assignedCourses: [],
  },
  {
    id: 'ins_2',
    name: 'Prof. James Carter',
    email: 'james.carter@olm.com',
    experience: '9 years',
    specialization: 'Data Science',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    assignedCourses: [],
  },
  {
    id: 'ins_3',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@olm.com',
    experience: '7 years',
    specialization: 'UI/UX Design',
    profileImage: 'https://i.pravatar.cc/150?img=32',
    assignedCourses: [],
  },
];

export function InstructorProvider({ children }) {
  const [instructors, setInstructors] = useState(() => seedIfEmpty('instructors', SEED_INSTRUCTORS));

  const addInstructor = (instructor) => {
    const newInstructor = { ...instructor, id: makeId('ins'), assignedCourses: instructor.assignedCourses || [] };
    const updated = [newInstructor, ...instructors];
    setInstructors(updated);
    saveList('instructors', updated);
    return newInstructor;
  };

  const updateInstructor = (id, updates) => {
    const updated = instructors.map((i) => (i.id === id ? { ...i, ...updates } : i));
    setInstructors(updated);
    saveList('instructors', updated);
  };

  const deleteInstructor = (id) => {
    const updated = instructors.filter((i) => i.id !== id);
    setInstructors(updated);
    saveList('instructors', updated);
  };

  const getInstructorById = (id) => instructors.find((i) => i.id === id);

  const assignCourses = (id, courseIds) => {
    updateInstructor(id, { assignedCourses: courseIds });
  };

  return (
    <InstructorContext.Provider
      value={{ instructors, addInstructor, updateInstructor, deleteInstructor, getInstructorById, assignCourses }}
    >
      {children}
    </InstructorContext.Provider>
  );
}

export function useInstructors() {
  const ctx = useContext(InstructorContext);
  if (!ctx) throw new Error('useInstructors must be used within InstructorProvider');
  return ctx;
}
