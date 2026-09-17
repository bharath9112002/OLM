import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../components/common/Modal';

export default function StudentFormModal({ isOpen, onClose, onSubmit, initialData }) {
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
          fullName: '',
          email: '',
          mobile: '',
          address: '',
          qualification: '',
          enrollmentDate: new Date().toISOString().slice(0, 10),
        }
      );
    }
  }, [isOpen, initialData, reset]);

  const submit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Student' : 'Add New Student'} size="md">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
        <Field label="Full Name" error={errors.fullName}>
          <input className="input" {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Minimum 3 characters' } })} />
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
        <Field label="Mobile Number" error={errors.mobile}>
          <input
            className="input"
            placeholder="10-digit mobile number"
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit mobile number' },
            })}
          />
        </Field>
        <Field label="Address" error={errors.address}>
          <textarea rows={2} className="input" {...register('address', { required: 'Address is required' })} />
        </Field>
        <Field label="Qualification" error={errors.qualification}>
          <input className="input" {...register('qualification', { required: 'Qualification is required' })} />
        </Field>
        <Field label="Enrollment Date" error={errors.enrollmentDate}>
          <input type="date" className="input" {...register('enrollmentDate', { required: 'Enrollment date is required' })} />
        </Field>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            {initialData ? 'Save Changes' : 'Add Student'}
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
