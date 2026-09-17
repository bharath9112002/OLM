import { createContext, useContext, useEffect, useState } from 'react';
import { loadList, saveList, makeId } from '../utils/storage';
import { fetchCoursesFromApi } from '../api/courseApi';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = loadList('courses', null);
      if (cached && cached.length) {
        setCourses(cached);
      } else {
        const apiCourses = await fetchCoursesFromApi();
        saveList('courses', apiCourses);
        setCourses(apiCourses);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const addCourse = (course) => {
    const newCourse = { ...course, id: makeId('course') };
    const updated = [newCourse, ...courses];
    setCourses(updated);
    saveList('courses', updated);
    return newCourse;
  };

  const updateCourse = (id, updates) => {
    const updated = courses.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCourses(updated);
    saveList('courses', updated);
  };

  const deleteCourse = (id) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    saveList('courses', updated);
  };

  const getCourseById = (id) => courses.find((c) => c.id === id);

  return (
    <CourseContext.Provider
      value={{ courses, loading, error, reload: loadCourses, addCourse, updateCourse, deleteCourse, getCourseById }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourses must be used within CourseProvider');
  return ctx;
}
