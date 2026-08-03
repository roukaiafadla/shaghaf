import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const TABS = ['profile', 'security', 'notifications', 'privacy', 'account'];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, updateUser, logout } = useAuth();
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveBio = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.put('/users/me', { bio });
      updateUser(data.user);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row gap-8">
      <aside className="md:w-56 shrink-0">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {TABS.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm capitalize w-full text-left ${
                  activeTab === tab ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {activeTab === 'profile' && (
          <form onSubmit={saveBio}>
            <h1 className="text-xl font-semibold mb-4">Profile Settings</h1>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={300}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="px-5 py-2 bg-brand-500 text-white rounded-full text-sm font-medium disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              {saved && <span className="text-xs text-green-600">Saved!</span>}
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <div>
            <h1 className="text-xl font-semibold mb-2">Security Settings</h1>
            <p className="text-sm text-gray-400 mb-4">Password change isn't wired up yet — planned next.</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h1 className="text-xl font-semibold mb-2">Notification Settings</h1>
            <p className="text-sm text-gray-400">Email notification preferences — coming soon.</p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h1 className="text-xl font-semibold mb-2">Privacy Settings</h1>
            <p className="text-sm text-gray-400">Profile visibility controls — coming soon.</p>
          </div>
        )}

        {activeTab === 'account' && (
          <div>
            <h1 className="text-xl font-semibold mb-4">Account</h1>
            <button onClick={logout} className="px-5 py-2 border border-red-300 text-red-500 rounded-full text-sm font-medium hover:bg-red-50">
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
