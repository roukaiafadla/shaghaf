import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaTags, FaCamera } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { imgUrl } from '../utils/imageUrl';

const CreatePost = () => {
  const [form, setForm] = useState({ title: '', category: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingImage, setExistingImage] = useState('');
  const [loadingPost, setLoadingPost] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id); // same form is used for creating and editing

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  // Edit mode: load the post and prefill the form
  useEffect(() => {
    if (!id) return;
    setLoadingPost(true);
    api
      .get(`/posts/${id}`)
      .then(({ data }) => {
        if (user && data.author?._id !== user.id) {
          navigate(`/posts/${id}`, { replace: true });
          return;
        }
        setForm({
          title: data.title,
          category: data.category?.slug || '',
          description: data.description,
        });
        setExistingImage(data.image || '');
      })
      .catch(() => setError('Could not load this post'))
      .finally(() => setLoadingPost(false));
  }, [id, user, navigate]);

  // Free the temporary preview URL when it changes or the page closes
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.category || !form.description.trim()) {
      setError('Please fill in the title, category and description.');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('category', form.category);
      fd.append('description', form.description.trim());
      if (photo) fd.append('image', photo);
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = isEdit
        ? await api.put(`/posts/${id}`, fd, config)
        : await api.post('/posts', fd, config);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || (isEdit ? 'Could not save your changes' : 'Could not publish your post'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPost) return <div className="text-center py-24 text-gray-400">Loading…</div>;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-xl font-semibold mb-1">{isEdit ? 'Edit your post' : 'Share an activity'}</h1>
        <p className="text-sm text-gray-400 mb-6">
          {isEdit ? 'Update the details or replace the photo.' : "Show the community what you've been working on."}
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex items-center border border-gray-200 rounded-lg px-3 mb-4">
          <FaFileAlt className="text-gray-400 mr-2" />
          <input
            type="text" name="title" placeholder="Title" maxLength={120}
            value={form.title} onChange={handleChange}
            className="w-full py-2.5 text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center border border-gray-200 rounded-lg px-3 mb-4">
          <FaTags className="text-gray-400 mr-2" />
          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full py-2.5 text-sm focus:outline-none bg-transparent"
          >
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <textarea
          name="description" placeholder="Description" rows={5} maxLength={2000}
          value={form.description} onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-4 focus:outline-none"
        />

        {(preview || existingImage) && (
          <img
            src={preview || imgUrl(existingImage)}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-xl mb-4"
          />
        )}
        <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2.5 mb-6 cursor-pointer text-sm text-gray-500">
          <FaCamera /> {photo ? photo.name : isEdit ? 'Replace photo (optional, max 5MB)' : 'Upload photo (jpg, png, webp - max 5MB)'}
          <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm font-medium">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="flex-1 bg-brand-500 text-white rounded-full py-2.5 text-sm font-medium hover:bg-brand-600 disabled:opacity-50">
            {submitting ? (isEdit ? 'Saving…' : 'Publishing…') : isEdit ? 'Save changes' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
