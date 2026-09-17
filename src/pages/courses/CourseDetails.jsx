import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { useEnrollments } from '../../context/EnrollmentContext';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById, loading } = useCourses();
  const { user } = useAuth();
  const { isDuplicate, enrollStudent } = useEnrollments();

  if (loading) return <Spinner size="lg" className="py-20" />;

  const course = getCourseById(id);
  if (!course) {
    return <EmptyState title="Course not found" message="This course may have been removed." icon="🔍" />;
  }

  const enrolled = user?.studentId ? isDuplicate(user.studentId, course.id) : false;

  const handleEnroll = () => {
    try {
      enrollStudent(user.studentId, course.id);
      toast.success(`Enrolled in ${course.name}!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to Courses
      </button>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <img src={course.thumbnail} alt={course.name} className="h-64 w-full object-cover" />
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">{course.category}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{course.level}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{course.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Instructor: <span className="font-medium text-gray-700">{course.instructor}</span></p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoBlock label="Duration" value={course.duration} />
            <InfoBlock label="Level" value={course.level} />
            <InfoBlock label="Rating" value={`⭐ ${course.rating}`} />
            <InfoBlock label="Price" value={`$${course.price}`} />
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">Description</h3>
            <p className="text-sm leading-relaxed text-gray-600">{course.description}</p>
          </div>

          {user?.role === 'student' && (
            <button
              onClick={handleEnroll}
              disabled={enrolled}
              className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold sm:w-auto sm:px-8 ${
                enrolled ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {enrolled ? '✓ Already Enrolled' : 'Enroll in this Course'}
            </button>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/courses"
              className="mt-6 inline-block rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Manage in Course List
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      <p className="text-sm font-semibold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
