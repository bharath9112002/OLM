import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠', roles: ['admin', 'student'] },
  { to: '/courses', label: 'Courses', icon: '📚', roles: ['admin', 'student'] },
  { to: '/students', label: 'Students', icon: '🧑‍🎓', roles: ['admin'] },
  { to: '/enrollments', label: 'Enrollments', icon: '📝', roles: ['admin', 'student'] },
  { to: '/instructors', label: 'Instructors', icon: '👨‍🏫', roles: ['admin', 'student'] },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 text-gray-100 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-5">
          <span className="text-2xl">🎓</span>
          <span className="text-lg font-bold tracking-wide">OLM</span>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
