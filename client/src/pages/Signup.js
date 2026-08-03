import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaUser, FaEnvelope, FaLock, FaFileAlt, FaTags, FaCamera } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

// Rebuilt two-step SignupFlow: step 1 creates the real account (wired to
// /api/auth/signup), step 2 optionally creates the user's first post -
// skippable, since forcing a post at signup was the original's weakest UX call
const Signup = () => {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [postData, setPostData] = useState({ title: '', category: '', description: '', photo: null });
  const [categories, setCategories] = useState([]);

  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleAccountChange = (e) => setAccount({ ...account, [e.target.name]: e.target.value });

  const validateAccount = () => {
    const tempErrors = {};
    if (!account.username) tempErrors.username = 'Username is required';
    if (!account.email) tempErrors.email = 'Email is required';
    if (!account.password) tempErrors.password = 'Password is required';
    if (account.password !== account.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateAccount()) return;
    setSubmitting(true);
    try {
      await signup(account.username, account.email, account.password);
      setStep(2);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create your account');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostChange = (e) => {
    const { name, value, files } = e.target;
    setPostData({ ...postData, [name]: name === 'photo' ? files[0] : value });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', postData.title);
      fd.append('category', postData.category);
      fd.append('description', postData.description);
      if (postData.photo) fd.append('image', postData.photo);
      await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/profile');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create your first post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
      <form
        onSubmit={step === 1 ? handleAccountSubmit : handlePostSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        <div className="flex justify-center mb-4">
          <FaUserCircle className="text-5xl text-brand-400" />
        </div>

        {serverError && <p className="text-red-500 text-sm text-center mb-4">{serverError}</p>}

        {step === 1 ? (
          <>
            <h1 className="text-xl font-semibold text-center mb-6">Create your account</h1>
            {[
              { name: 'username', icon: FaUser, type: 'text', placeholder: 'Username' },
              { name: 'email', icon: FaEnvelope, type: 'email', placeholder: 'Email' },
              { name: 'password', icon: FaLock, type: 'password', placeholder: 'Password' },
              { name: 'confirmPassword', icon: FaLock, type: 'password', placeholder: 'Confirm Password' },
            ].map(({ name, icon: Icon, type, placeholder }) => (
              <div className="mb-4" key={name}>
                <div className="flex items-center border border-gray-200 rounded-lg px-3">
                  <Icon className="text-gray-400 mr-2" />
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={account[name]}
                    onChange={handleAccountChange}
                    className="w-full py-2.5 text-sm focus:outline-none"
                  />
                </div>
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
            <Link to="/login" className="block text-xs text-brand-600 hover:underline mb-6 text-right">Already have an account?</Link>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-500 text-white rounded-full py-2.5 text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
            >
              {submitting ? 'Creating account…' : 'Next'}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-center mb-1">Share your first activity</h1>
            <p className="text-xs text-gray-400 text-center mb-6">Optional — you can always add one later</p>

            <div className="mb-4">
              <div className="flex items-center border border-gray-200 rounded-lg px-3">
                <FaFileAlt className="text-gray-400 mr-2" />
                <input
                  type="text" name="title" placeholder="Title" value={postData.title}
                  onChange={handlePostChange} className="w-full py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center border border-gray-200 rounded-lg px-3">
                <FaTags className="text-gray-400 mr-2" />
                <select name="category" value={postData.category} onChange={handlePostChange} className="w-full py-2.5 text-sm focus:outline-none bg-transparent">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <textarea
                name="description" placeholder="Description" value={postData.description}
                onChange={handlePostChange} rows={3}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2.5 mb-6 cursor-pointer text-sm text-gray-500">
              <FaCamera /> {postData.photo ? postData.photo.name : 'Upload photo'}
              <input type="file" name="photo" accept="image/*" onChange={handlePostChange} className="hidden" />
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/profile')} className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm font-medium">
                Skip
              </button>
              <button type="submit" disabled={submitting} className="flex-1 bg-brand-500 text-white rounded-full py-2.5 text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
