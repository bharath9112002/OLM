import { createContext, useContext, useState } from 'react';
import { seedIfEmpty, saveList, makeId } from '../utils/storage';

const EnrollmentContext = createContext(null);

export function EnrollmentProvider({ children }) {
  const [enrollments, setEnrollments] = useState(() => seedIfEmpty('enrollments', []));

  const isDuplicate = (studentId, courseId) =>
    enrollments.some((e) => e.studentId === studentId && e.courseId === courseId);

  const enrollStudent = (studentId, courseId) => {
    if (isDuplicate(studentId, courseId)) {
      throw new Error('This student is already enrolled in this course.');
    }
    const newEnrollment = {
      id: makeId('enr'),
      studentId,
      courseId,
      enrollmentDate: new Date().toISOString().slice(0, 10),
    };
    const updated = [newEnrollment, ...enrollments];
    setEnrollments(updated);
    saveList('enrollments', updated);
    return newEnrollment;
  };

  const removeEnrollment = (id) => {
    const updated = enrollments.filter((e) => e.id !== id);
    setEnrollments(updated);
    saveList('enrollments', updated);
  };

  const getEnrollmentsByStudent = (studentId) => enrollments.filter((e) => e.studentId === studentId);
  const getEnrollmentsByCourse = (courseId) => enrollments.filter((e) => e.courseId === courseId);

  const summary = {
    totalEnrollments: enrollments.length,
    uniqueStudents: new Set(enrollments.map((e) => e.studentId)).size,
    uniqueCourses: new Set(enrollments.map((e) => e.courseId)).size,
  };

  return (
    <EnrollmentContext.Provider
      value={{
        enrollments,
        isDuplicate,
        enrollStudent,
        removeEnrollment,
        getEnrollmentsByStudent,
        getEnrollmentsByCourse,
        summary,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollments() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error('useEnrollments must be used within EnrollmentProvider');
  return ctx;
}
