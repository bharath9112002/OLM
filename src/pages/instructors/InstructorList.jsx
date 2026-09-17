import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useInstructors } from '../../context/InstructorContext';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InstructorFormModal from './InstructorFormModal';
import AssignCoursesModal from './AssignCoursesModal';

export default function InstructorList() {
  const { instructors, addInstructor, updateInstructor, deleteInstructor, assignCourses } = useInstructors();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [deletingInstructor, setDeletingInstructor] = useState(null);
  const [assigningInstructor, setAssigningInstructor] = useState(null);

  const filtered = useMemo(
    () =>
      instructors.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.specialization.toLowerCase().includes(search.toLowerCase())
      ),
    [instructors, search]
  );

  const handleAdd = (data) => {
    addInstructor(data);
    toast.success('Instructor added successfully.');
  };

  const handleEdit = (data) => {
    updateInstructor(editingInstructor.id, data);
    toast.success('Instructor updated successfully.');
    setEditingInstructor(null);
  };

  const handleDelete = () => {
    deleteInstructor(deletingInstructor.id);
    toast.success('Instructor removed successfully.');
  };

  const handleAssign = (courseIds) => {
    assignCourses(assigningInstructor.id, courseIds);
    toast.success('Course assignments updated.');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Instructors</h2>
          <p className="text-sm text-gray-500">{filtered.length} instructor{filtered.length !== 1 && 's'}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Add Instructor
          </button>
        )}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or specialization..."
        className="input max-w-sm"
      />

      {filtered.length === 0 ? (
        <EmptyState title="No instructors found" message="Try a different search term." icon="👨‍🏫" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
              <img
                src={ins.profileImage || `https://i.pravatar.cc/150?u=${ins.id}`}
                alt={ins.name}
                className="mx-auto mb-3 h-20 w-20 rounded-full object-cover"
              />
              <Link to={`/instructors/${ins.id}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600">
                {ins.name}
              </Link>
              <p className="text-xs text-gray-500">{ins.specialization}</p>
              <p className="mt-1 text-xs text-gray-400">{ins.experience} experience</p>
              <p className="mt-2 text-xs font-medium text-indigo-600">{(ins.assignedCourses || []).length} course(s) assigned</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link to={`/instructors/${ins.id}`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  View Profile
                </Link>
                {isAdmin && (
                  <>
                    <button onClick={() => setAssigningInstructor(ins)} className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
                      Assign
                    </button>
                    <button onClick={() => setEditingInstructor(ins)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      Edit
                    </button>
                    <button onClick={() => setDeletingInstructor(ins)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <InstructorFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} />
      <InstructorFormModal
        isOpen={!!editingInstructor}
        onClose={() => setEditingInstructor(null)}
        onSubmit={handleEdit}
        initialData={editingInstructor}
      />
      <AssignCoursesModal
        isOpen={!!assigningInstructor}
        onClose={() => setAssigningInstructor(null)}
        instructor={assigningInstructor}
        onAssign={handleAssign}
      />
      <ConfirmDialog
        isOpen={!!deletingInstructor}
        onClose={() => setDeletingInstructor(null)}
        onConfirm={handleDelete}
        title="Delete Instructor"
        message={`Are you sure you want to remove "${deletingInstructor?.name}"?`}
      />
    </div>
  );
}
