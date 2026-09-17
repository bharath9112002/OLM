import { useParams, useNavigate } from 'react-router-dom';
import { useInstructors } from '../../context/InstructorContext';
import { useCourses } from '../../context/CourseContext';
import EmptyState from '../../components/common/EmptyState';

export default function InstructorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInstructorById } = useInstructors();
  const { courses } = useCourses();

  const instructor = getInstructorById(id);
  if (!instructor) {
    return <EmptyState title="Instructor not found" message="This instructor may have been removed." icon="🔍" />;
  }

  const assignedCourses = courses.filter((c) => (instructor.assignedCourses || []).includes(c.id));

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to Instructors
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <img
            src={instructor.profileImage || `https://i.pravatar.cc/150?u=${instructor.id}`}
            alt={instructor.name}
            className="h-24 w-24 rounded-full object-cover"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-bold text-gray-900">{instructor.name}</h1>
            <p className="text-sm text-gray-500">{instructor.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">{instructor.specialization}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{instructor.experience} experience</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-800">Assigned Courses ({assignedCourses.length})</h3>
          {assignedCourses.length === 0 ? (
            <p className="text-sm text-gray-400">No courses assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {assignedCourses.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <img src={c.thumbnail} alt={c.name} className="h-12 w-12 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.category} · {c.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
