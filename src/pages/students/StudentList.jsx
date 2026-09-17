import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useStudents } from '../../context/StudentContext';
import { useEnrollments } from '../../context/EnrollmentContext';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StudentFormModal from './StudentFormModal';

const PAGE_SIZE = 8;

export default function StudentList() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const { getEnrollmentsByStudent } = useEnrollments();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = (data) => {
    addStudent(data);
    toast.success('Student added successfully.');
  };

  const handleEdit = (data) => {
    updateStudent(editingStudent.id, data);
    toast.success('Student updated successfully.');
    setEditingStudent(null);
  };

  const handleDelete = () => {
    deleteStudent(deletingStudent.id);
    toast.success('Student removed successfully.');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Students</h2>
          <p className="text-sm text-gray-500">{filtered.length} student{filtered.length !== 1 && 's'} registered</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add Student
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by name or email..."
        className="input max-w-sm"
      />

      {filtered.length === 0 ? (
        <EmptyState title="No students found" message="Add a new student or adjust your search." icon="🧑‍🎓" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Enrolled Courses</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{s.mobile || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.qualification || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{getEnrollmentsByStudent(s.id).length}</td>
                  <td className="px-4 py-3 text-gray-600">{s.enrollmentDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditingStudent(s)} className="mr-2 text-indigo-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeletingStudent(s)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <StudentFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} />
      <StudentFormModal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSubmit={handleEdit}
        initialData={editingStudent}
      />
      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to remove "${deletingStudent?.fullName}"? This action cannot be undone.`}
      />
    </div>
  );
}
