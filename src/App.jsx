import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import logo from './assets/logo.jpg';
import StudentPortal from './pages/StudentPortal';
import ParentPortal from './pages/ParentPortal';
import TeacherPortal from './pages/TeacherPortal';
import SuperAdminPortal from './pages/SuperAdminPortal';
import { Sun, Moon, LogIn, UserPlus, LogOut, BookOpen } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Registration form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [batch, setBatch] = useState('JEE Master Batch 2027');
  const [examTarget, setExamTarget] = useState('JEE');
  const [contactNumber, setContactNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [subject, setSubject] = useState('Physics');

  const [authError, setAuthError] = useState('');

  // Apply dark mode theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch profile when token changes
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Token verification failed');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        logout();
        setLoading(false);
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authMode === 'login' 
      ? { email, password }
      : { email, password, role, name, batch, exam_target: examTarget, parent_email: parentEmail, contact_number: contactNumber, subject };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setShowAuthModal(false);
      // Reset forms
      setEmail('');
      setPassword('');
      setName('');
    } catch (err) {
      setAuthError('Server is currently offline. Please check connection.');
    }
  };

  const renderActivePortal = () => {
    if (!user) return null;
    switch (user.role) {
      case 'student':
        return <StudentPortal user={user} token={token} logout={logout} />;
      case 'parent':
        return <ParentPortal user={user} token={token} logout={logout} />;
      case 'teacher':
        return <TeacherPortal user={user} token={token} logout={logout} />;
      case 'admin':
        return <SuperAdminPortal user={user} token={token} logout={logout} />;
      default:
        return <div>Invalid Role Profile. Contact administrator.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => user ? null : logout()}>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 bg-white flex items-center justify-center">
            <img src={logo} alt="Vector Science Academy" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight font-title leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              VECTOR SCIENCE ACADEMY
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">Digital Learning Ecosystem</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize mt-1">{user.role}</p>
              </div>
              <button 
                onClick={logout}
                className="btn-primary px-4 py-2 text-sm bg-red-600 hover:bg-red-700 shadow-red-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="btn-primary py-2 text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Portal Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full">
        {loading ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400">Loading your profile environment...</p>
          </div>
        ) : user ? (
          renderActivePortal()
        ) : (
          <LandingPage onOpenAuth={(mode) => { setAuthMode(mode); setShowAuthModal(true); }} />
        )}
      </main>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-card p-8 animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-2 font-title">
              {authMode === 'login' ? 'Welcome Back!' : 'Create Platform Account'}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {authMode === 'login' ? 'Access your performance analyzer, assignments and resources.' : 'Sign up to enter the competitive gamified student ranking loop.'}
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-500 rounded-lg text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="e.g. Sanskar Tathe"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform Role</label>
                    <select 
                      value={role} 
                      onChange={e => setRole(e.target.value)}
                      className="input-field"
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="teacher">Teacher (Faculty)</option>
                    </select>
                  </div>

                  {role === 'student' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assigned Batch</label>
                        <select value={batch} onChange={e => setBatch(e.target.value)} className="input-field">
                          <option value="JEE Master Batch 2027">JEE Master Batch 2027</option>
                          <option value="NEET Achiever Batch 2026">NEET Achiever Batch 2026</option>
                          <option value="MHT-CET Rankers 2026">MHT-CET Rankers 2026</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Exam</label>
                        <select value={examTarget} onChange={e => setExamTarget(e.target.value)} className="input-field">
                          <option value="JEE">JEE</option>
                          <option value="NEET">NEET</option>
                          <option value="MHT-CET">MHT-CET</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Parent's Registered Email</label>
                        <input 
                          type="email" 
                          value={parentEmail} 
                          onChange={e => setParentEmail(e.target.value)} 
                          placeholder="parent1@vector.com"
                          className="input-field"
                        />
                      </div>
                    </div>
                  )}

                  {role === 'parent' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contact Number</label>
                      <input 
                        type="text" 
                        required 
                        value={contactNumber} 
                        onChange={e => setContactNumber(e.target.value)} 
                        placeholder="+91 9876543210"
                        className="input-field"
                      />
                    </div>
                  )}

                  {role === 'teacher' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Faculty Subject</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)} className="input-field">
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              <button type="submit" className="w-full btn-primary justify-center mt-6 py-3">
                {authMode === 'login' ? 'Sign In to Portal' : 'Register Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              {authMode === 'login' ? (
                <p className="text-slate-400">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p className="text-slate-400">
                  Already registered?{' '}
                  <button 
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
