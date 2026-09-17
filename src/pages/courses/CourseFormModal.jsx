import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';

const CATEGORIES = ['Web Development', 'Data Science', 'UI/UX Design', 'Mobile Development', 'Cloud Computing', 'Cyber Security', 'Business', 'Marketing'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CourseFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      reset(
        initialData || {
          name: '',
          instructor: '',
          category: CATEGORIES[0],
          duration: '',
          level: LEVELS[0],
          price: '',
          description: '',
          rating: '',
          thumbnail: '',
        }
      );
    }
  }, [isOpen, initialData, reset]);

  const submit = (data) => {
    onSubmit({ ...data, price: Number(data.price), rating: Number(data.rating) || 0 });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Course' : 'Add New Course'} size="lg">
      <form onSubmit={handleSubmit(submit)} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Course Name" error={errors.name}>
          <input className="input" {...register('name', { required: 'Course name is required' })} />
        </Field>
        <Field label="Instructor Name" error={errors.instructor}>
          <input className="input" {...register('instructor', { required: 'Instructor name is required' })} />
        </Field>
        <Field label="Category" error={errors.category}>
          <select className="input" {...register('category', { required: true })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Course Level" error={errors.level}>
          <select className="input" {...register('level', { required: true })}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Duration" error={errors.duration}>
          <input placeholder="e.g. 6 Weeks" className="input" {...register('duration', { required: 'Duration is required' })} />
        </Field>
        <Field label="Price (USD)" error={errors.price}>
          <input type="number" step="0.01" min="0" className="input" {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })} />
        </Field>
        <Field label="Rating (0-5)" error={errors.rating}>
          <input type="number" step="0.1" min="0" max="5" className="input" {...register('rating', { min: 0, max: 5 })} />
        </Field>
        <Field label="Thumbnail URL" error={errors.thumbnail}>
          <input className="input" placeholder="https://..." {...register('thumbnail')} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description" error={errors.description}>
            <textarea rows={3} className="input" {...register('description', { required: 'Description is required' })} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 sm:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {initialData ? 'Save Changes' : 'Add Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
