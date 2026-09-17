import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useEnrollments } from '../../context/EnrollmentContext';
import { useStudents } from '../../context/StudentContext';
import { useCourses } from '../../context/CourseContext';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EnrollFormModal from './EnrollFormModal';

export default function EnrollmentList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { enrollments, summary, enrollStudent, removeEnrollment, getEnrollmentsByStudent } = useEnrollments();
  const { getStudentById } = useStudents();
  const { getCourseById } = useCourses();

  const [formOpen, setFormOpen] = useState(false);
  const [removing, setRemoving] = useState(null);

  const visibleEnrollments = isAdmin ? enrollments : getEnrollmentsByStudent(user.studentId);

  const handleEnroll = (data) => {
    try {
      enrollStudent(data.studentId, data.courseId);
      toast.success('Student enrolled successfully.');
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemove = () => {
    removeEnrollment(removing.id);
    toast.success('Enrollment removed.');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isAdmin ? 'Enrollments' : 'My Enrollments'}</h2>
          <p className="text-sm text-gray-500">{visibleEnrollments.length} record{visibleEnrollments.length !== 1 && 's'}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Enroll Student
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon="📝" label="Total Enrollments" value={summary.totalEnrollments} color="indigo" />
          <StatCard icon="🧑‍🎓" label="Students Enrolled" value={summary.uniqueStudents} color="green" />
          <StatCard icon="📚" label="Courses with Enrollments" value={summary.uniqueCourses} color="amber" />
        </div>
      )}

      {visibleEnrollments.length === 0 ? (
        <EmptyState
          title="No enrollments yet"
          message={isAdmin ? 'Enroll a student into a course to get started.' : 'Browse courses and enroll to start learning.'}
          icon="📝"
          action={
            !isAdmin && (
              <Link to="/courses" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Browse Courses
              </Link>
            )
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                {isAdmin && <th className="px-4 py-3">Student</th>}
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Enrollment Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleEnrollments.map((e) => {
                const student = getStudentById(e.studentId);
                const course = getCourseById(e.courseId);
                return (
                  <tr key={e.id} className="hover:bg-gray-50">
                    {isAdmin && <td className="px-4 py-3 font-medium text-gray-800">{student?.fullName || 'Unknown'}</td>}
                    <td className="px-4 py-3 text-gray-700">{course?.name || 'Unknown course'}</td>
                    <td className="px-4 py-3 text-gray-600">{course?.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{e.enrollmentDate}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setRemoving(e)} className="text-red-600 hover:underline">
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <EnrollFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleEnroll} />
      <ConfirmDialog
        isOpen={!!removing}
        onClose={() => setRemoving(null)}
        onConfirm={handleRemove}
        title="Remove Enrollment"
        message="Are you sure you want to remove this enrollment?"
      />
    </div>
  );
}
