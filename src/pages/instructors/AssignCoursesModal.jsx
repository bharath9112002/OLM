import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import CourseThumbnail from '../../components/common/CourseThumbnail';
import { useCourses } from '../../context/CourseContext';

export default function AssignCoursesModal({ isOpen, onClose, instructor, onAssign }) {
  const { courses } = useCourses();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (isOpen && instructor) setSelected(instructor.assignedCourses || []);
  }, [isOpen, instructor]);

  const toggle = (courseId) => {
    setSelected((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]));
  };

  const save = () => {
    onAssign(selected);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Courses — ${instructor?.name || ''}`} size="lg">
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {courses.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
            <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} className="accent-indigo-600" />
            <CourseThumbnail src={c.thumbnail} alt={c.name} className="h-10 w-10 rounded" />
            <div>
              <p className="text-sm font-medium text-gray-800">{c.name}</p>
              <p className="text-xs text-gray-500">{c.category}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={save} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Save Assignments ({selected.length})
        </button>
      </div>
    </Modal>
  );
}
