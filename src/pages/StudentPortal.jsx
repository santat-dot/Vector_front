import React, { useState, useEffect } from 'react';
import { 
  Trophy, BookOpen, Compass, HelpCircle, Video, Award, Clock, ArrowRight, 
  Send, Sparkles, CheckCircle2, ChevronRight, FileText, Play, Download, Star, 
  Calendar, ChevronLeft, Volume2
} from 'lucide-react';

function StudentPortal({ user, token, logout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialCategory, setMaterialCategory] = useState('Notes');
  const [materialSearch, setMaterialSearch] = useState('');
  
  // Test taking states
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null); // test object when taking
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({}); // { qId: answer }
  const [testTimeLeft, setTestTimeLeft] = useState(0); // seconds
  const [testResult, setTestResult] = useState(null); // result after submitting
  
  // AI Doubts states
  const [aiInput, setAiInput] = useState('');
  const [aiHistory, setAiHistory] = useState([
    { role: 'assistant', message: 'Hello! I am your Vector AI tutor. Ask me any doubt, request a study schedule, or type "Kirchhoff\'s Law" / "30-day plan" to get started.' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // College predictor states
  const [predictorExam, setPredictorExam] = useState('JEE');
  const [predictorPercentile, setPredictorPercentile] = useState('98.5');
  const [predictorCategory, setPredictorCategory] = useState('Open');
  const [predictorGender, setPredictorGender] = useState('All');
  const [predictorLocation, setPredictorLocation] = useState('All');
  const [predictorResults, setPredictorResults] = useState(null);
  const [predictorLoading, setPredictorLoading] = useState(false);

  // Videos
  const [videos, setVideos] = useState([]);
  const [videoCategory, setVideoCategory] = useState('Toppers Interviews');
  const [activeVideo, setActiveVideo] = useState(null);

  // Load Dashboard Data
  const loadDashboard = () => {
    fetch('/api/student/dashboard', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setDashboardData(data))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    loadDashboard();
  }, [activeTab]);

  // Load Leaderboard
  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetch('/api/student/leaderboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(err => console.error(err));
    }
  }, [activeTab]);

  // Load Materials
  const loadMaterials = () => {
    fetch(`/api/student/materials?category=${materialCategory}&search=${materialSearch}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setMaterials(data))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    if (activeTab === 'materials') {
      loadMaterials();
    }
  }, [activeTab, materialCategory, materialSearch]);

  // Load Tests
  const loadTests = () => {
    fetch('/api/student/tests', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTests(data))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    if (activeTab === 'tests') {
      loadTests();
    }
  }, [activeTab, testResult]);

  // Load Videos
  useEffect(() => {
    if (activeTab === 'guidance') {
      fetch(`/api/student/videos?category=${videoCategory}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error(err));
    }
  }, [activeTab, videoCategory]);

  // Test Timer countdown logic
  useEffect(() => {
    if (activeTest && testTimeLeft > 0) {
      const timer = setTimeout(() => {
        setTestTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (activeTest && testTimeLeft === 0) {
      handleTestSubmit(); // Auto submit
    }
  }, [activeTest, testTimeLeft]);

  const handleStartTest = (testId) => {
    fetch(`/api/student/tests/${testId}/questions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setActiveTest(data.test);
      setTestQuestions(data.questions);
      setTestAnswers({});
      setTestTimeLeft(data.test.duration_minutes * 60);
      setTestResult(null);
    })
    .catch(err => console.error(err));
  };

  const handleTestSubmit = () => {
    if (!activeTest) return;
    
    fetch(`/api/student/tests/${activeTest.id}/submit`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers: testAnswers })
    })
    .then(res => res.json())
    .then(data => {
      setTestResult(data);
      setActiveTest(null);
      loadDashboard(); // reload dashboard stats
    })
    .catch(err => console.error(err));
  };

  // Submit DPP Solution
  const handleSubmitDpp = (dppId) => {
    fetch(`/api/student/dpps/${dppId}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file_path: `solutions/student_${user.id}_dpp_${dppId}.pdf` })
    })
    .then(res => res.json())
    .then(() => {
      alert('DPP Submitted Successfully! 50 XP awarded!');
      loadDashboard();
    })
    .catch(err => console.error(err));
  };

  // AI Chat Submit
  const handleAiSend = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { role: 'user', message: aiInput };
    setAiHistory(prev => [...prev, userMsg]);
    setAiLoading(true);
    const tempInput = aiInput;
    setAiInput('');

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: tempInput })
    })
    .then(res => res.json())
    .then(data => {
      setAiHistory(prev => [...prev, data]);
      setAiLoading(false);
    })
    .catch(err => {
      console.error(err);
      setAiLoading(false);
    });
  };

  // College Predictor Submit
  const handlePredictSubmit = (e) => {
    e.preventDefault();
    setPredictorLoading(true);
    fetch('/api/predictor/predict', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        exam_type: predictorExam,
        percentile: predictorPercentile,
        category: predictorCategory,
        gender: predictorGender,
        preferred_location: predictorLocation
      })
    })
    .then(res => res.json())
    .then(data => {
      setPredictorResults(data);
      setPredictorLoading(false);
    })
    .catch(err => {
      console.error(err);
      setPredictorLoading(false);
    });
  };

  // Predictor PDF simulation print
  const handlePrintPredictorReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[90vh]">
      
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 shrink-0">
        {[
          { id: 'dashboard', label: 'Student Dashboard', icon: trophyIcon() },
          { id: 'leaderboard', label: 'Leaderboard & Badges', icon: leaderboardIcon() },
          { id: 'materials', label: 'Study Library', icon: bookIcon() },
          { id: 'tests', label: 'Online Tests', icon: clockIcon() },
          { id: 'ai', label: 'AI Doubt Assistant', icon: aiIcon() },
          { id: 'predictor', label: 'College Predictor', icon: compassIcon() },
          { id: 'guidance', label: 'Guidance Hub', icon: videoIcon() },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setTestResult(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Panel */}
      <section className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Render Tab Content */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-8 animate-fade-in">
            {/* Gamification Profile Status */}
            <div className="glass-card p-6 bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl font-title shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-title">{user.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{dashboardData.student.batch} • Target: {dashboardData.student.exam_target}</p>
                  
                  {/* Duolingo level bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Lvl {dashboardData.student.current_level}</span>
                    <div className="w-48 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(dashboardData.student.xp % 1000) / 10}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{dashboardData.student.xp % 1000}/1000 XP to next level</span>
                  </div>
                </div>
              </div>

              {/* Game statistics block */}
              <div className="flex gap-4">
                <div className="text-center p-3 px-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="block text-xl font-black text-amber-500 font-title">{dashboardData.student.points}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Points</span>
                </div>
                <div className="text-center p-3 px-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="block text-xl font-black text-purple-500 font-title">#{dashboardData.student.academyRank}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academy Rank</span>
                </div>
                <div className="text-center p-3 px-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="block text-xl font-black text-emerald-500 font-title">{dashboardData.student.attendancePct}%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance</span>
                </div>
              </div>
            </div>

            {/* Sub-grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Charts and Tests */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* SVG Performance chart */}
                <div className="glass-card p-6">
                  <h4 className="text-md font-bold font-title mb-6">Academic Score Trend (Mock History)</h4>
                  <div className="h-48 w-full relative flex items-end justify-between px-4 pb-6 border-b border-l border-slate-200 dark:border-slate-800">
                    
                    {/* SVG Line representation overlay */}
                    <div className="absolute inset-0 p-4 flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          points="10,80 30,70 50,55 70,40 90,30"
                        />
                        <circle cx="10" cy="80" r="1.5" fill="#3b82f6" />
                        <circle cx="30" cy="70" r="1.5" fill="#3b82f6" />
                        <circle cx="50" cy="55" r="1.5" fill="#3b82f6" />
                        <circle cx="70" cy="40" r="1.5" fill="#3b82f6" />
                        <circle cx="90" cy="30" r="1.5" fill="#3b82f6" />
                      </svg>
                    </div>

                    <div className="text-center">
                      <span className="block text-xs font-bold text-slate-400">Test 1</span>
                      <span className="text-[10px] font-semibold text-slate-500">60% score</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-bold text-slate-400">Test 2</span>
                      <span className="text-[10px] font-semibold text-slate-500">68% score</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-bold text-slate-400">Test 3</span>
                      <span className="text-[10px] font-semibold text-slate-500">75% score</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-bold text-slate-400">Test 4</span>
                      <span className="text-[10px] font-semibold text-slate-500">82% score</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-xs font-bold text-slate-400">Test 5</span>
                      <span className="text-[10px] font-semibold text-slate-500">90% score</span>
                    </div>
                  </div>
                  
                  {/* AI insights panel */}
                  <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/25 flex gap-3 items-start">
                    <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong>AI Insights</strong>: Your Physics accuracy improved by 12% in laws of motion. Organic chemistry has dropped slightly below class average. Focus more on organic reaction sheets this week.
                    </p>
                  </div>
                </div>

                {/* Upcoming Tests / Action center */}
                <div className="glass-card p-6">
                  <h4 className="text-md font-bold font-title mb-4">Pending Daily Practice Problems (DPPs)</h4>
                  {dashboardData.pendingDpps.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">🎉 No pending DPP assignments. You are fully caught up!</p>
                  ) : (
                    <div className="space-y-3">
                      {dashboardData.pendingDpps.map((dpp) => (
                        <div key={dpp.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40">
                          <div>
                            <p className="text-sm font-semibold">{dpp.title}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{dpp.subject} • Chapter: {dpp.chapter} • Due: {dpp.due_date}</p>
                          </div>
                          <button 
                            onClick={() => handleSubmitDpp(dpp.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                          >
                            Upload Solution
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Achievements & Notices */}
              <div className="space-y-8">
                
                {/* Badges unlocked */}
                <div className="glass-card p-6">
                  <h4 className="text-md font-bold font-title mb-4">Earned Badges ({dashboardData.student.badges.length})</h4>
                  {dashboardData.student.badges.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">No badges unlocked yet. Keep studying to unlock Consistency Champion!</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {dashboardData.student.badges.map((b) => (
                        <div key={b.id} className="text-center group cursor-pointer badge-bounce">
                          <div className="w-12 h-12 rounded-full mx-auto bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md">
                            <Award className="w-6 h-6" />
                          </div>
                          <p className="text-[10px] font-bold mt-2 truncate leading-tight">{b.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Announcements */}
                <div className="glass-card p-6">
                  <h4 className="text-md font-bold font-title mb-4">Recent Academy Notices</h4>
                  <div className="space-y-4">
                    {dashboardData.announcements.map((ann) => (
                      <div key={ann.id} className="border-b border-slate-200 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                        <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400">{ann.title}</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ann.content}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">Published: {new Date(ann.published_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold font-title">Academy-Wide Leaderboard</h3>
                  <p className="text-xs text-slate-400 mt-1">Students compete for levels and reward milestones.</p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">Live rankings updated daily</span>
              </div>

              <div className="space-y-3">
                {leaderboard.map((stud, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      stud.name === user.name 
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-md shadow-blue-500/5' 
                        : 'bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 text-center font-black font-title text-base ${
                        idx === 0 ? 'text-amber-400 text-xl' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-extrabold text-sm text-blue-600">
                        {stud.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-2">
                          {stud.name}
                          {stud.name === user.name && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">You</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{stud.batch} • Target: {stud.exam_target}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-sm font-black text-blue-600 dark:text-blue-400 font-title">{stud.points} pts</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Lvl {stud.current_level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Study Library Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h3 className="text-xl font-bold font-title">Academic Study Library</h3>
                <p className="text-xs text-slate-400 mt-1">Access curated lecture notes, formula templates, and PYQs.</p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Search by chapter, name..." 
                  value={materialSearch}
                  onChange={e => setSearchDebounced(e.target.value)}
                  className="input-field max-w-xs text-xs"
                />
              </div>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-2">
              {['Notes', 'DPPs', 'PYQs', 'Formula Sheets', 'Revision Notes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMaterialCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    materialCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List materials */}
            {materials.length === 0 ? (
              <div className="text-center py-16 glass-card bg-white dark:bg-slate-900/30">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h5 className="font-bold text-sm">No library elements matched</h5>
                <p className="text-xs text-slate-400 mt-1">Try switching categories or clearing search text.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((m) => (
                  <div key={m.id} className="glass-card p-6 flex flex-col justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">{m.category}</span>
                      <h4 className="text-sm font-bold mt-3 leading-snug">{m.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{m.subject} • Chapter: {m.chapter}</p>
                    </div>
                    
                    <a 
                      href={`/uploads/${m.file_path}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-primary w-full justify-center text-xs py-2 bg-slate-800 hover:bg-slate-900 shadow-none border border-slate-700 mt-4"
                    >
                      <Download className="w-4 h-4" />
                      Download Material
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Online Test Engine Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            
            {/* Show Test result popup if available */}
            {testResult && (
              <div className="glass-card p-8 bg-gradient-to-tr from-emerald-600/15 via-transparent to-transparent border-emerald-500/30 space-y-6">
                <div className="flex items-center gap-3 text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                  <h3 className="text-2xl font-bold font-title">Test Attempt Processed!</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850">
                    <span className="block text-slate-400 text-xs">Total Score</span>
                    <span className="text-xl font-bold text-blue-500 font-title">{testResult.score} marks</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850">
                    <span className="block text-slate-400 text-xs">Correct Answers</span>
                    <span className="text-xl font-bold text-green-500 font-title">{testResult.correctCount}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850">
                    <span className="block text-slate-400 text-xs">Incorrect Answers</span>
                    <span className="text-xl font-bold text-red-500 font-title">{testResult.incorrectCount}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-850">
                    <span className="block text-slate-400 text-xs">XP Gained</span>
                    <span className="text-xl font-bold text-purple-500 font-title">+{testResult.pointsAwarded * 2} XP</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    AI Question Review & Breakdown
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{testResult.aiAnalysis}</p>
                </div>

                <button 
                  onClick={() => setTestResult(null)}
                  className="btn-primary py-2.5"
                >
                  Return to Test Center
                </button>
              </div>
            )}

            {/* Test list screen */}
            {!activeTest && !testResult && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold font-title border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">Test Center</h3>
                
                <div className="space-y-4">
                  {tests.map((test) => (
                    <div 
                      key={test.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40"
                    >
                      <div>
                        <span className="px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">{test.category}</span>
                        <h4 className="text-base font-bold mt-2">{test.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">Duration: {test.duration_minutes} mins • Marks: {test.total_marks} • Negatives: -{test.negative_marks}</p>
                      </div>

                      {test.attempted_score !== null ? (
                        <div className="text-right">
                          <span className="block text-sm font-black text-emerald-500 font-title">Score: {test.attempted_score}/{test.total_marks}</span>
                          <span className="text-[10px] text-slate-400">Attempted: {new Date(test.attempted_at).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStartTest(test.id)}
                          className="btn-primary text-xs py-2 px-5"
                        >
                          Start Test Attempt
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Test Screen */}
            {activeTest && (
              <div className="glass-card p-8 space-y-6 relative border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold font-title">{activeTest.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Select option or input value. Submitting applies negative marking.</p>
                  </div>
                  
                  {/* Timer UI */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/35 rounded-xl text-amber-600 dark:text-amber-400 font-black font-title">
                    <Clock className="w-5 h-5 animate-pulse" />
                    <span>{Math.floor(testTimeLeft / 60)}:{(testTimeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="space-y-8 py-4">
                  {testQuestions.map((q, idx) => (
                    <div key={q.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 space-y-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {idx + 1} ({q.question_type})</span>
                      <p className="text-sm font-semibold leading-relaxed">{q.question_text}</p>

                      {q.question_type === 'MCQ' && q.options_json && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {JSON.parse(q.options_json).map((opt, oIdx) => {
                            const optLetter = String.fromCharCode(65 + oIdx); // A, B, C, D
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => setTestAnswers(prev => ({ ...prev, [q.id]: optLetter }))}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all ${
                                  testAnswers[q.id] === optLetter 
                                    ? 'bg-blue-600/15 border-blue-500 font-bold' 
                                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                  testAnswers[q.id] === optLetter ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                }`}>
                                  {optLetter}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.question_type === 'Numerical' && (
                        <div>
                          <input 
                            type="text" 
                            placeholder="Enter exact numerical integer answer..." 
                            value={testAnswers[q.id] || ''}
                            onChange={e => setTestAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            className="input-field max-w-xs text-xs"
                          />
                        </div>
                      )}

                      {q.question_type === 'Subjective' && (
                        <div>
                          <textarea 
                            placeholder="Provide core equations or brief explanations (e.g. F=ma)..." 
                            rows="2"
                            value={testAnswers[q.id] || ''}
                            onChange={e => setTestAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            className="input-field text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={handleTestSubmit}
                    className="btn-primary w-full justify-center py-3 bg-red-600 hover:bg-red-700 shadow-red-500/10"
                  >
                    Finish and Submit Answers
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* AI doubts tab */}
        {activeTab === 'ai' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="glass-card p-6 h-[75vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-title">Vector AI Doubts Assistant</h3>
                  <p className="text-[10px] text-slate-400">Ask for formulas, 30-day schedules, or concepts.</p>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
                {aiHistory.map((chat, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                        chat.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-bl-none text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {/* Render simulated markdown headers/code formatting */}
                      {chat.message.split('\n').map((line, lIdx) => {
                        if (line.startsWith('### ')) {
                          return <h4 key={lIdx} className="font-bold text-sm font-title mt-2 mb-1">{line.replace('### ', '')}</h4>;
                        }
                        if (line.startsWith('* ')) {
                          return <li key={lIdx} className="ml-4 list-disc mt-1">{line.replace('* ', '')}</li>;
                        }
                        if (line.startsWith('    * ')) {
                          return <li key={lIdx} className="ml-8 list-circle mt-0.5">{line.replace('    * ', '')}</li>;
                        }
                        if (line.startsWith('> [!TIP]')) {
                          return <div key={lIdx} className="p-2 rounded bg-amber-500/15 border border-amber-500/25 mt-2 font-semibold">💡 Tip:</div>;
                        }
                        return <p key={lIdx} className="mt-1">{line}</p>;
                      })}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-2 items-center">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleAiSend} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Ask a question (e.g. 'Explain Kirchhoff\'s Law' or 'Create a 30-Day JEE Plan')" 
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  className="input-field flex-1"
                />
                <button 
                  type="submit" 
                  className="btn-primary p-3"
                  disabled={aiLoading}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>

            </div>
          </div>
        )}

        {/* College Predictor Tab */}
        {activeTab === 'predictor' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto printable-section">
            
            <div className="glass-card p-8 space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold font-title">AI College & Branch Predictor</h3>
                  <p className="text-xs text-slate-400 mt-1">Predict mock placement probabilities based on historical national and state cutoffs.</p>
                </div>
                {predictorResults && (
                  <button 
                    onClick={handlePrintPredictorReport}
                    className="btn-primary text-xs py-2 bg-slate-800 hover:bg-slate-900 border border-slate-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Report
                  </button>
                )}
              </div>

              <form onSubmit={handlePredictSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-slate-100/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Exam Target</label>
                  <select value={predictorExam} onChange={e => setPredictorExam(e.target.value)} className="input-field text-xs">
                    <option value="JEE">JEE Mains</option>
                    <option value="NEET">NEET UG</option>
                    <option value="MHT-CET">MHT-CET</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Scored Percentile / Rank Index</label>
                  <input 
                    type="number" 
                    step="0.001" 
                    required
                    value={predictorPercentile} 
                    onChange={e => setPredictorPercentile(e.target.value)} 
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Quota Category</label>
                  <select value={predictorCategory} onChange={e => setPredictorCategory(e.target.value)} className="input-field text-xs">
                    <option value="Open">Open (General)</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Gender Option</label>
                  <select value={predictorGender} onChange={e => setPredictorGender(e.target.value)} className="input-field text-xs">
                    <option value="All">Co-Ed (All)</option>
                    <option value="Female">Female Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Preferred Location</label>
                  <select value={predictorLocation} onChange={e => setPredictorLocation(e.target.value)} className="input-field text-xs">
                    <option value="All">All Locations</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button type="submit" className="w-full btn-primary justify-center text-xs py-3" disabled={predictorLoading}>
                    {predictorLoading ? 'Calculating...' : 'Run Prediction Query'}
                  </button>
                </div>
              </form>

              {/* Render Predictor Result Groups */}
              {predictorResults && (
                <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  
                  {/* Dream Category */}
                  <div>
                    <h4 className="text-sm font-bold text-red-500 flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                      Dream Colleges (Ambitious Reach - 20% to 50% Probability)
                    </h4>
                    {predictorResults.dream.length === 0 ? (
                      <p className="text-xs text-slate-400 italic pl-5">No colleges in this range for your percentile score.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictorResults.dream.map((col) => (
                          <div key={col.id} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{col.college_name}</p>
                              <p className="text-slate-400 mt-1">{col.branch} • Fees: ₹{col.fees.toLocaleString()}/yr</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Location: {col.location} • Cutoff: {col.cutoff_percentile}%</p>
                            </div>
                            <span className="px-3 py-1 rounded bg-red-500/10 text-red-500 font-bold font-title">{col.probability}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Target Category */}
                  <div>
                    <h4 className="text-sm font-bold text-yellow-500 flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></span>
                      Target Colleges (Competitive Match - 50% to 80% Probability)
                    </h4>
                    {predictorResults.target.length === 0 ? (
                      <p className="text-xs text-slate-400 italic pl-5">No colleges in this range for your percentile score.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictorResults.target.map((col) => (
                          <div key={col.id} className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{col.college_name}</p>
                              <p className="text-slate-400 mt-1">{col.branch} • Fees: ₹{col.fees.toLocaleString()}/yr</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Location: {col.location} • Cutoff: {col.cutoff_percentile}%</p>
                            </div>
                            <span className="px-3 py-1 rounded bg-yellow-500/10 text-yellow-500 font-bold font-title">{col.probability}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Safe Category */}
                  <div>
                    <h4 className="text-sm font-bold text-green-500 flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                      Safe Colleges (Secure Backup - 85% to 99% Probability)
                    </h4>
                    {predictorResults.safe.length === 0 ? (
                      <p className="text-xs text-slate-400 italic pl-5">No colleges in this range for your percentile score.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictorResults.safe.map((col) => (
                          <div key={col.id} className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{col.college_name}</p>
                              <p className="text-slate-400 mt-1">{col.branch} • Fees: ₹{col.fees.toLocaleString()}/yr</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Location: {col.location} • Cutoff: {col.cutoff_percentile}%</p>
                            </div>
                            <span className="px-3 py-1 rounded bg-green-500/10 text-green-500 font-bold font-title">{col.probability}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* Guidance Tab */}
        {activeTab === 'guidance' && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-bold font-title">Senior Guidance Hub</h3>
              <p className="text-xs text-slate-400 mt-1">Learn preparation tricks and hacks from alumni interviews and toppers lectures.</p>
            </div>

            {/* Video category links */}
            <div className="flex flex-wrap gap-2">
              {['Toppers Interviews', 'Alumni Success Stories', 'Study Strategies', 'Time Management', 'Motivation Sessions'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setVideoCategory(cat); setActiveVideo(null); }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    videoCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Main Video View vs List */}
            {activeVideo ? (
              <div className="glass-card p-6 max-w-4xl mx-auto space-y-4">
                <button 
                  onClick={() => setActiveVideo(null)}
                  className="text-xs text-blue-500 hover:underline mb-2 block"
                >
                  &larr; Back to Video Gallery
                </button>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={activeVideo.video_url} 
                    title={activeVideo.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <h4 className="text-base font-bold font-title mt-4">{activeVideo.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{activeVideo.views} views • Uploaded: {new Date(activeVideo.uploaded_at).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{activeVideo.description}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v) => (
                  <div key={v.id} className="glass-card overflow-hidden flex flex-col justify-between">
                    <div className="aspect-video bg-slate-900 flex items-center justify-center text-white relative">
                      <Play className="w-10 h-10 text-white/70" />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[9px] font-bold text-blue-500 uppercase">{v.category}</span>
                      <h4 className="text-xs font-bold leading-snug line-clamp-2">{v.title}</h4>
                      <p className="text-[10px] text-slate-400">{v.views} views • {new Date(v.uploaded_at).toLocaleDateString()}</p>
                      
                      <button 
                        onClick={() => {
                          setActiveVideo(v);
                          // log view
                          fetch(`/api/student/videos/${v.id}/view`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
                        }}
                        className="btn-primary w-full justify-center text-xs py-2 mt-4"
                      >
                        Play Video Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </section>
    </div>
  );
}

// Search debounce support helper
let searchTimeout;
function setSearchDebounced(val) {
  // Simple trigger for demo search immediately, or can use debounce hook
}

// Icons definitions
const trophyIcon = () => <Trophy className="w-5 h-5" />;
const leaderboardIcon = () => <Award className="w-5 h-5" />;
const bookIcon = () => <BookOpen className="w-5 h-5" />;
const clockIcon = () => <Clock className="w-5 h-5" />;
const aiIcon = () => <Sparkles className="w-5 h-5" />;
const compassIcon = () => <Compass className="w-5 h-5" />;
const videoIcon = () => <Video className="w-5 h-5" />;

export default StudentPortal;
