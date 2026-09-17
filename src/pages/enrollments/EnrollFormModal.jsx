import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';
import { useStudents } from '../../context/StudentContext';
import { useCourses } from '../../context/CourseContext';

export default function EnrollFormModal({ isOpen, onClose, onSubmit }) {
  const { students } = useStudents();
  const { courses } = useCourses();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) reset({ studentId: '', courseId: '' });
  }, [isOpen, reset]);

  const submit = (data) => {
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enroll Student in Course" size="md">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Student</label>
          <select className="input" {...register('studentId', { required: 'Please select a student' })}>
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>
            ))}
          </select>
          {errors.studentId && <p className="mt-1 text-xs text-red-500">{errors.studentId.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Course</label>
          <select className="input" {...register('courseId', { required: 'Please select a course' })}>
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.courseId && <p className="mt-1 text-xs text-red-500">{errors.courseId.message}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Enroll
          </button>
        </div>
      </form>
    </Modal>
  );
}
