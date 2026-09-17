import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden">
          ☰
        </button>
        <h1 className="text-base font-semibold text-gray-800 sm:text-lg">Online Learning Management</h1>
      </div>
      <div className="relative" ref={ref}>
        <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-full pl-2 pr-1">
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{user?.fullName}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {user?.fullName?.charAt(0).toUpperCase()}
          </span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <div className="border-b border-gray-100 px-4 py-2">
              <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium capitalize text-indigo-600">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
