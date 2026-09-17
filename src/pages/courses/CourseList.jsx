import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { useEnrollments } from '../../context/EnrollmentContext';
import { SkeletonGrid } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CourseFormModal from './CourseFormModal';

const PAGE_SIZE = 8;

export default function CourseList() {
  const { courses, loading, error, reload, addCourse, updateCourse, deleteCourse } = useCourses();
  const { user } = useAuth();
  const { isDuplicate, enrollStudent } = useEnrollments();
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const categories = useMemo(() => ['All', ...new Set(courses.map((c) => c.category))], [courses]);

  const filtered = useMemo(() => {
    let list = courses.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') list = list.filter((c) => c.category === category);
    list = [...list].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0;
    });
    return list;
  }, [courses, search, category, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const handleAdd = (data) => {
    addCourse(data);
    toast.success('Course added successfully.');
  };

  const handleEdit = (data) => {
    updateCourse(editingCourse.id, data);
    toast.success('Course updated successfully.');
    setEditingCourse(null);
  };

  const handleDelete = () => {
    deleteCourse(deletingCourse.id);
    toast.success('Course deleted successfully.');
  };

  const handleEnroll = (course) => {
    try {
      enrollStudent(user.studentId, course.id);
      toast.success(`Enrolled in ${course.name}!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Courses</h2>
          <p className="text-sm text-gray-500">{filtered.length} course{filtered.length !== 1 && 's'} available</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Add Course
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          placeholder="Search courses by name..."
          className="input sm:max-w-xs"
        />
        <select value={category} onChange={(e) => { setCategory(e.target.value); resetPage(); }} className="input sm:max-w-[180px]">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input sm:max-w-[200px]">
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low-High)</option>
          <option value="price-desc">Price (High-Low)</option>
          <option value="rating-desc">Rating (High-Low)</option>
        </select>
      </div>

      {loading && <SkeletonGrid count={8} />}

      {!loading && error && (
        <EmptyState
          icon="⚠️"
          title="Failed to load courses"
          message={error}
          action={
            <button onClick={reload} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Retry
            </button>
          }
        />
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No courses found" message="Try adjusting your search or filter criteria." icon="🔍" />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((course) => {
              const enrolled = user?.studentId ? isDuplicate(user.studentId, course.id) : false;
              return (
                <div key={course.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <Link to={`/courses/${course.id}`}>
                    <img src={course.thumbnail} alt={course.name} className="h-36 w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="mb-1 w-fit rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">
                      {course.category}
                    </span>
                    <Link to={`/courses/${course.id}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-indigo-600">
                      {course.name}
                    </Link>
                    <p className="mt-1 text-xs text-gray-500">by {course.instructor}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>⏱ {course.duration}</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">${course.price}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{course.level}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link to={`/courses/${course.id}`} className="flex-1 rounded-lg border border-gray-300 py-1.5 text-center text-xs font-medium text-gray-700 hover:bg-gray-50">
                        View Details
                      </Link>
                      {isAdmin ? (
                        <>
                          <button onClick={() => setEditingCourse(course)} className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                            ✏️
                          </button>
                          <button onClick={() => setDeletingCourse(course)} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                            🗑️
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course)}
                          disabled={enrolled}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                            enrolled ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {enrolled ? '✓ Enrolled' : 'Enroll'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <CourseFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} />
      <CourseFormModal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        onSubmit={handleEdit}
        initialData={editingCourse}
      />
      <ConfirmDialog
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${deletingCourse?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
