import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      forgotPassword(data);
      setSubmitted(true);
      toast.success('Password reset link sent (demo only).');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-2xl text-white">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="mt-1 text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
        </div>

        {submitted ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
            <p className="text-sm font-medium text-emerald-700">✅ If an account exists, a reset link has been sent.</p>
            <p className="mt-1 text-xs text-emerald-600">This is a demo UI — no real email is sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
