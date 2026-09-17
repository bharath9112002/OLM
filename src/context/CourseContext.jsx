import { createContext, useContext, useEffect, useState } from 'react';
import { loadList, saveList, makeId } from '../utils/storage';
import { fetchCoursesFromApi } from '../api/courseApi';
import { getCourseImage } from '../utils/courseImage';

const CourseContext = createContext(null);
const STORAGE_KEY = 'courses_v5';

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = loadList(STORAGE_KEY, null);
      if (cached && cached.length) {
        setCourses(cached);
      } else {
        const apiCourses = await fetchCoursesFromApi();
        saveList(STORAGE_KEY, apiCourses);
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
    const thumbnail = course.thumbnail?.trim() || getCourseImage(course.category, course.name);
    const newCourse = { ...course, thumbnail, id: makeId('course') };
    const updated = [newCourse, ...courses];
    setCourses(updated);
    saveList(STORAGE_KEY, updated);
    return newCourse;
  };

  const updateCourse = (id, updates) => {
    const thumbnail = updates.thumbnail?.trim() || getCourseImage(updates.category, updates.name);
    const updated = courses.map((c) => (c.id === id ? { ...c, ...updates, thumbnail } : c));
    setCourses(updated);
    saveList(STORAGE_KEY, updated);
  };

  const deleteCourse = (id) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    saveList(STORAGE_KEY, updated);
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
