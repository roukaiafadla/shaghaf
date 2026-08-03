import React, { useState } from 'react';
import { FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const tempErrors = {};
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-5xl text-brand-400" />
        </div>
        <h1 className="text-xl font-semibold text-center mb-6">Log in to Shaghaf</h1>

        {serverError && <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>}

        <div className="mb-4">
          <div className="flex items-center border border-gray-200 rounded-lg px-3">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2.5 text-sm focus:outline-none"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-2">
          <div className="flex items-center border border-gray-200 rounded-lg px-3">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2.5 text-sm focus:outline-none"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div className="flex justify-end mb-6">
          <Link to="/signup" className="text-xs text-brand-600 hover:underline">Don't have an account?</Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-500 text-white rounded-full py-2.5 text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
        >
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
