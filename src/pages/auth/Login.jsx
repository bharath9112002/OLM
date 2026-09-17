import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@olm.com', password: 'Admin@123' },
  student: { email: 'student@olm.com', password: 'Student@123' },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: DEMO_CREDENTIALS.student });

  useEffect(() => {
    const { email, password } = DEMO_CREDENTIALS[role];
    setValue('email', email, { shouldValidate: false });
    setValue('password', password, { shouldValidate: false });
  }, [role, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      login({ ...data, role });
      toast.success(`Welcome back! Logged in as ${role}.`);
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
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
            🎓
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your Online Learning account</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
          {['student', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-md py-2 text-sm font-semibold capitalize transition-colors ${
                role === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r === 'admin' ? '🛡️ Admin' : '🧑‍🎓 Student'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
              {...register('email', {
                required: 'Email is required',
                validate: (value) => value.trim().length > 0 || 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  validate: (value) => value.trim().length > 0 || 'Password is required',
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : `Sign in as ${role === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        <p className="mt-5 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">
          Demo — Admin: <span className="font-medium">admin@olm.com / Admin@123</span> · Student:{' '}
          <span className="font-medium">student@olm.com / Student@123</span>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
