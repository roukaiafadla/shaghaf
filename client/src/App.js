import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CategoryPage from './pages/CategoryPage';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
