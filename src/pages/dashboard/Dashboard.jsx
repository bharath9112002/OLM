import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';
import { useStudents } from '../../context/StudentContext';
import { useInstructors } from '../../context/InstructorContext';
import { useEnrollments } from '../../context/EnrollmentContext';
import StatCard from '../../components/common/StatCard';
import Spinner from '../../components/common/Spinner';

const UPCOMING_CLASSES = [
  { course: 'React for Beginners', date: '2026-09-19', time: '10:00 AM' },
  { course: 'Data Structures Deep Dive', date: '2026-09-20', time: '2:00 PM' },
  { course: 'UI/UX Design Principles', date: '2026-09-22', time: '11:30 AM' },
];

function isCompleted(enrollmentDate) {
  const days = (Date.now() - new Date(enrollmentDate).getTime()) / (1000 * 60 * 60 * 24);
  return days > 30;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, loading: coursesLoading } = useCourses();
  const { students } = useStudents();
  const { instructors } = useInstructors();
  const { enrollments, getEnrollmentsByStudent } = useEnrollments();

  const isAdmin = user?.role === 'admin';
  const myEnrollments = user?.studentId ? getEnrollmentsByStudent(user.studentId) : [];
  const relevantEnrollments = isAdmin ? enrollments : myEnrollments;
  const completedCount = relevantEnrollments.filter((e) => isCompleted(e.enrollmentDate)).length;

  const recentActivities = [...relevantEnrollments]
    .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
    .slice(0, 5)
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId);
      const student = students.find((s) => s.id === e.studentId);
      return { id: e.id, text: isAdmin
        ? `${student?.fullName || 'A student'} enrolled in ${course?.name || 'a course'}`
        : `You enrolled in ${course?.name || 'a course'}`, date: e.enrollmentDate };
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome back, {user?.fullName?.split(' ')[0]} 👋
        </h2>
        <p className="text-sm text-gray-500">
          Here's what's happening with {isAdmin ? 'your platform' : 'your learning journey'} today.
        </p>
      </div>

      {coursesLoading ? (
        <Spinner size="lg" className="py-10" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isAdmin ? (
            <>
              <StatCard icon="📚" label="Total Courses" value={courses.length} color="indigo" />
              <StatCard icon="🧑‍🎓" label="Total Students" value={students.length} color="green" />
              <StatCard icon="👨‍🏫" label="Total Instructors" value={instructors.length} color="amber" />
              <StatCard icon="📝" label="Active Enrollments" value={enrollments.length} color="violet" />
            </>
          ) : (
            <>
              <StatCard icon="📚" label="Available Courses" value={courses.length} color="indigo" />
              <StatCard icon="📝" label="Enrolled Courses" value={myEnrollments.length} color="violet" />
              <StatCard icon="✅" label="Completed Courses" value={completedCount} color="green" />
              <StatCard icon="⏳" label="In Progress" value={myEnrollments.length - completedCount} color="amber" />
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">Recent Activities</h3>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-400">No recent activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivities.map((a) => (
                <li key={a.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-gray-700">{a.text}</span>
                  <span className="text-xs text-gray-400">{a.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">Upcoming Classes</h3>
          <ul className="space-y-3">
            {UPCOMING_CLASSES.map((c, i) => (
              <li key={i} className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-sm font-medium text-gray-800">{c.course}</p>
                <p className="text-xs text-gray-500">{c.date} · {c.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {isAdmin ? (
            <>
              <QuickAction to="/courses" icon="➕" label="Add Course" />
              <QuickAction to="/students" icon="🧑‍🎓" label="Add Student" />
              <QuickAction to="/instructors" icon="👨‍🏫" label="Add Instructor" />
              <QuickAction to="/enrollments" icon="📝" label="Manage Enrollments" />
            </>
          ) : (
            <>
              <QuickAction to="/courses" icon="📚" label="Browse Courses" />
              <QuickAction to="/enrollments" icon="📝" label="My Enrollments" />
              <QuickAction to="/instructors" icon="👨‍🏫" label="View Instructors" />
              <QuickAction to="/dashboard" icon="🏠" label="Dashboard" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </Link>
  );
}
