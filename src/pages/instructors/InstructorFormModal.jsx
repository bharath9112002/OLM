import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';

export default function InstructorFormModal({ isOpen, onClose, onSubmit, initialData }) {
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
          email: '',
          experience: '',
          specialization: '',
          profileImage: '',
        }
      );
    }
  }, [isOpen, initialData, reset]);

  const submit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Instructor' : 'Add New Instructor'} size="md">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <Field label="Full Name" error={errors.name}>
          <input className="input" {...register('name', { required: 'Name is required' })} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className="input"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
          />
        </Field>
        <Field label="Experience" error={errors.experience}>
          <input placeholder="e.g. 8 years" className="input" {...register('experience', { required: 'Experience is required' })} />
        </Field>
        <Field label="Specialization" error={errors.specialization}>
          <input className="input" {...register('specialization', { required: 'Specialization is required' })} />
        </Field>
        <Field label="Profile Image URL" error={errors.profileImage}>
          <input placeholder="https://..." className="input" {...register('profileImage')} />
        </Field>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {initialData ? 'Save Changes' : 'Add Instructor'}
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
