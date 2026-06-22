import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, FileText, TrendingUp, Plus, Edit2, Trash2, 
  Upload, Sparkles, BookOpen, AlertCircle, CheckCircle, Video
} from 'lucide-react';

function TeacherPortal({ user, token, logout }) {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Student modal states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('password123');
  const [studentName, setStudentName] = useState('');
  const [studentBatch, setStudentBatch] = useState('JEE Master Batch 2027');
  const [studentTarget, setStudentTarget] = useState('JEE');
  const [studentParentEmail, setStudentParentEmail] = useState('');

  // Attendance management states
  const [selectedBatch, setSelectedBatch] = useState('JEE Master Batch 2027');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: 'Present'/'Absent'/'Late' }

  // Test construction states
  const [testTitle, setTestTitle] = useState('');
  const [testCategory, setTestCategory] = useState('Chapter Test');
  const [testDuration, setTestDuration] = useState('60');
  const [testTotalMarks, setTestTotalMarks] = useState('40');
  const [testNegativeMarks, setTestNegativeMarks] = useState('1');
  const [testScheduledTime, setTestScheduledTime] = useState('');
  const [newTestId, setNewTestId] = useState(null); // id of test created
  
  // Test Questions creation states
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('MCQ');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState('');
  const [qMarks, setQMarks] = useState('4');

  // Materials uploading
  const [matTitle, setMatTitle] = useState('');
  const [matCategory, setMatCategory] = useState('Notes');
  const [matSubject, setMatSubject] = useState('Physics');
  const [matChapter, setMatChapter] = useState('');
  const [matFile, setMatFile] = useState('');

  // Announcements
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annRole, setAnnRole] = useState('all');

  const [loading, setLoading] = useState(false);

  // Load students
  const loadStudents = () => {
    fetch('/api/teacher/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setStudents(data))
    .catch(err => console.error(err));
  };

  useEffect(() => {
    loadStudents();
  }, [activeTab]);

  // Load Analytics
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetch('/api/teacher/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));
    }
  }, [activeTab]);

  // Student Add Submit
  const handleAddStudent = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('/api/teacher/students', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: studentEmail,
        password: studentPassword,
        name: studentName,
        batch: studentBatch,
        exam_target: studentTarget,
        parent_email: studentParentEmail
      })
    })
    .then(res => res.json())
    .then(data => {
      setLoading(false);
      if (data.error) {
        alert(data.error);
        return;
      }
      setShowAddStudent(false);
      // Reset forms
      setStudentEmail('');
      setStudentName('');
      setStudentParentEmail('');
      loadStudents();
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  // Student delete
  const handleDeleteStudent = (studId) => {
    if (!confirm('Are you sure you want to remove this student?')) return;
    
    fetch(`/api/teacher/students/${studId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(() => loadStudents())
    .catch(err => console.error(err));
  };

  // Attendance update
  const handleMarkAttendance = (studId, status) => {
    setAttendanceRecords(prev => ({ ...prev, [studId]: status }));
    
    fetch('/api/teacher/attendance', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id: studId,
        date: attendanceDate,
        status: status
      })
    })
    .then(res => res.json())
    .catch(err => console.error(err));
  };

  // Test construction submit
  const handleCreateTest = (e) => {
    e.preventDefault();
    
    fetch('/api/teacher/tests', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: testTitle,
        category: testCategory,
        duration_minutes: parseInt(testDuration),
        total_marks: parseInt(testTotalMarks),
        negative_marks: parseInt(testNegativeMarks),
        scheduled_time: testScheduledTime
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }
      setNewTestId(data.testId);
      alert('Test constructed! Now add questions below.');
    })
    .catch(err => console.error(err));
  };

  // Question construction submit
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newTestId) return;

    const options = qType === 'MCQ' ? [qOptA, qOptB, qOptC, qOptD] : null;

    fetch(`/api/teacher/tests/${newTestId}/questions`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question_text: qText,
        question_type: qType,
        options,
        correct_answer: qCorrect,
        positive_marks: parseInt(qMarks)
      })
    })
    .then(res => res.json())
    .then(() => {
      alert('Question added successfully!');
      // reset question forms
      setQText('');
      setQOptA('');
      setQOptB('');
      setQOptC('');
      setQOptD('');
      setQCorrect('');
    })
    .catch(err => console.error(err));
  };

  // Upload study material
  const handleUploadMaterial = (e) => {
    e.preventDefault();
    
    fetch('/api/teacher/materials', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: matTitle,
        category: matCategory,
        subject: matSubject,
        chapter: matChapter,
        file_path: matFile || 'default_note.pdf'
      })
    })
    .then(res => res.json())
    .then(() => {
      alert('Material published in Library!');
      setMatTitle('');
      setMatChapter('');
      setMatFile('');
    })
    .catch(err => console.error(err));
  };

  // Publish Announcement
  const handlePublishAnn = (e) => {
    e.preventDefault();

    fetch('/api/teacher/announcements', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: annTitle,
        content: annContent,
        target_role: annRole
      })
    })
    .then(res => res.json())
    .then(() => {
      alert('Notice Board Announcement published!');
      setAnnTitle('');
      setAnnContent('');
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[90vh]">
      
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 shrink-0">
        {[
          { id: 'students', label: 'Students Directory', icon: <Users className="w-5 h-5" /> },
          { id: 'attendance', label: 'Attendance Sheets', icon: <Calendar className="w-5 h-5" /> },
          { id: 'tests', label: 'Test Creator', icon: <Clock className="w-5 h-5" /> },
          { id: 'content', label: 'Upload Materials', icon: <Upload className="w-5 h-5" /> },
          { id: 'announcements', label: 'Notice Publisher', icon: <FileText className="w-5 h-5" /> },
          { id: 'analytics', label: 'Class Analytics', icon: <TrendingUp className="w-5 h-5" /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
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
        
        {/* Students Directory Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-title">Students Registry</h3>
                <p className="text-xs text-slate-400 mt-1">Manage active class lists, batch divisions, and parent linkages.</p>
              </div>
              <button 
                onClick={() => setShowAddStudent(true)}
                className="btn-primary py-2 text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Student Profile
              </button>
            </div>

            {/* Students list */}
            <div className="glass-card overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Batch</th>
                    <th className="p-4">Exam Target</th>
                    <th className="p-4 text-center">Score points</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-250 dark:divide-slate-800">
                  {students.map((stud) => (
                    <tr key={stud.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/10">
                      <td className="p-4 font-bold">{stud.name}</td>
                      <td className="p-4 text-slate-400">{stud.email}</td>
                      <td className="p-4">{stud.batch}</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">{stud.exam_target}</span></td>
                      <td className="p-4 text-center font-bold text-blue-600">{stud.points} pts</td>
                      <td className="p-4 text-center flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleDeleteStudent(stud.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Student Modal */}
            {showAddStudent && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg glass-card p-8 animate-fade-in relative max-h-[90vh] overflow-y-auto">
                  <button 
                    onClick={() => setShowAddStudent(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-2xl font-bold"
                  >
                    &times;
                  </button>

                  <h3 className="text-xl font-bold mb-2 font-title">Add Student Profile</h3>
                  <p className="text-xs text-slate-400 mb-6">Create credentials and define target pathways.</p>

                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={studentName} 
                        onChange={e => setStudentName(e.target.value)} 
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Student Email</label>
                      <input 
                        type="email" 
                        required 
                        value={studentEmail} 
                        onChange={e => setStudentEmail(e.target.value)} 
                        className="input-field text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Login Password</label>
                      <input 
                        type="text" 
                        required 
                        value={studentPassword} 
                        onChange={e => setStudentPassword(e.target.value)} 
                        className="input-field text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Exam</label>
                        <select value={studentTarget} onChange={e => setStudentTarget(e.target.value)} className="input-field text-xs">
                          <option value="JEE">JEE</option>
                          <option value="NEET">NEET</option>
                          <option value="MHT-CET">MHT-CET</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Batch Assignment</label>
                        <select value={studentBatch} onChange={e => setStudentBatch(e.target.value)} className="input-field text-xs">
                          <option value="JEE Master Batch 2027">JEE Master Batch 2027</option>
                          <option value="NEET Achiever Batch 2026">NEET Achiever Batch 2026</option>
                          <option value="MHT-CET Rankers 2026">MHT-CET Rankers 2026</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Parent Registered Email (Linkage)</label>
                      <input 
                        type="email" 
                        value={studentParentEmail} 
                        onChange={e => setStudentParentEmail(e.target.value)} 
                        placeholder="parent1@vector.com"
                        className="input-field text-xs"
                      />
                    </div>

                    <button type="submit" className="w-full btn-primary justify-center py-2.5" disabled={loading}>
                      {loading ? 'Creating...' : 'Register Profile'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attendance Sheet Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold font-title">Daily Attendance Tracker</h3>
              <p className="text-xs text-slate-400 mt-1">Batch registers mapping attendance status.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Select Batch</label>
                <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="input-field text-xs">
                  <option value="JEE Master Batch 2027">JEE Master Batch 2027</option>
                  <option value="NEET Achiever Batch 2026">NEET Achiever Batch 2026</option>
                  <option value="MHT-CET Rankers 2026">MHT-CET Rankers 2026</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Date</label>
                <input 
                  type="date" 
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h4 className="text-sm font-bold font-title border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">Roll Register</h4>
              <div className="space-y-3">
                {students.filter(s => s.batch === selectedBatch).map((stud) => (
                  <div key={stud.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-850">
                    <span className="text-xs font-bold">{stud.name}</span>
                    
                    <div className="flex gap-2">
                      {['Present', 'Absent', 'Late'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleMarkAttendance(stud.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            attendanceRecords[stud.id] === status
                              ? status === 'Present' ? 'bg-green-500 text-white' : status === 'Absent' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Test Creator Tab */}
        {activeTab === 'tests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            
            {/* Step 1: Create Test */}
            <div className="glass-card p-6 space-y-6">
              <h4 className="text-sm font-bold font-title border-b border-slate-200 dark:border-slate-800 pb-2">Step 1: Test Meta Configuration</h4>
              
              <form onSubmit={handleCreateTest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Test Title</label>
                  <input 
                    type="text" 
                    required 
                    value={testTitle} 
                    onChange={e => setTestTitle(e.target.value)} 
                    placeholder="e.g. Thermodynamics Practice II"
                    className="input-field text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Test Category</label>
                    <select value={testCategory} onChange={e => setTestCategory(e.target.value)} className="input-field text-xs">
                      <option value="Chapter Test">Chapter Test</option>
                      <option value="Subject Test">Subject Test</option>
                      <option value="Full Mock Test">Full Mock Test</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Scheduled Time</label>
                    <input 
                      type="datetime-local" 
                      required
                      value={testScheduledTime} 
                      onChange={e => setTestScheduledTime(e.target.value)} 
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Duration (min)</label>
                    <input 
                      type="number" 
                      required
                      value={testDuration} 
                      onChange={e => setTestDuration(e.target.value)} 
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Total Marks</label>
                    <input 
                      type="number" 
                      required
                      value={testTotalMarks} 
                      onChange={e => setTestTotalMarks(e.target.value)} 
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Negative Mark</label>
                    <input 
                      type="number" 
                      required
                      value={testNegativeMarks} 
                      onChange={e => setTestNegativeMarks(e.target.value)} 
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary justify-center py-2.5">
                  Initialize Examination Sheet
                </button>
              </form>
            </div>

            {/* Step 2: Add Questions */}
            <div className="glass-card p-6 space-y-6">
              <h4 className="text-sm font-bold font-title border-b border-slate-200 dark:border-slate-800 pb-2">
                Step 2: Add Questions {newTestId ? `(Test ID: ${newTestId})` : '(Initialize step 1 first)'}
              </h4>

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Question Text</label>
                  <textarea 
                    required 
                    rows="3"
                    value={qText} 
                    onChange={e => setQText(e.target.value)} 
                    placeholder="Enter question text or latex code here..."
                    className="input-field text-xs"
                    disabled={!newTestId}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Question Type</label>
                    <select 
                      value={qType} 
                      onChange={e => setQType(e.target.value)} 
                      className="input-field text-xs"
                      disabled={!newTestId}
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="Numerical">Numerical</option>
                      <option value="Subjective">Subjective</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Marks Weight</label>
                    <input 
                      type="number" 
                      value={qMarks} 
                      onChange={e => setQMarks(e.target.value)} 
                      className="input-field text-xs"
                      disabled={!newTestId}
                    />
                  </div>
                </div>

                {qType === 'MCQ' && (
                  <div className="space-y-2 border-t pt-4">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Options</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Option A" value={qOptA} onChange={e => setQOptA(e.target.value)} className="input-field text-xs" disabled={!newTestId} required />
                      <input type="text" placeholder="Option B" value={qOptB} onChange={e => setQOptB(e.target.value)} className="input-field text-xs" disabled={!newTestId} required />
                      <input type="text" placeholder="Option C" value={qOptC} onChange={e => setQOptC(e.target.value)} className="input-field text-xs" disabled={!newTestId} required />
                      <input type="text" placeholder="Option D" value={qOptD} onChange={e => setQOptD(e.target.value)} className="input-field text-xs" disabled={!newTestId} required />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Correct Target Value (Option A/B/C/D, or Integer Value)</label>
                  <input 
                    type="text" 
                    required 
                    value={qCorrect} 
                    onChange={e => setQCorrect(e.target.value)} 
                    placeholder="e.g. B or 42"
                    className="input-field text-xs"
                    disabled={!newTestId}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full btn-primary justify-center py-2.5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10"
                  disabled={!newTestId}
                >
                  Append Question to Test
                </button>
              </form>
            </div>

          </div>
        )}

        {/* Upload content tab */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in max-w-4xl mx-auto">
            
            {/* Study Material form */}
            <div className="glass-card p-6 space-y-6">
              <h4 className="text-sm font-bold font-title border-b border-slate-200 dark:border-slate-800 pb-2">Upload study resources</h4>
              
              <form onSubmit={handleUploadMaterial} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Resource Title</label>
                  <input 
                    type="text" 
                    required 
                    value={matTitle} 
                    onChange={e => setMatTitle(e.target.value)} 
                    placeholder="e.g. IUPAC Organic Chemistry Naming Rules"
                    className="input-field text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Category</label>
                    <select value={matCategory} onChange={e => setMatCategory(e.target.value)} className="input-field text-xs">
                      <option value="Notes">Notes</option>
                      <option value="DPPs">DPPs</option>
                      <option value="PYQs">PYQs</option>
                      <option value="Formula Sheets">Formula Sheets</option>
                      <option value="Revision Notes">Revision Notes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Subject</label>
                    <select value={matSubject} onChange={e => setMatSubject(e.target.value)} className="input-field text-xs">
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Chapter name</label>
                  <input 
                    type="text" 
                    required 
                    value={matChapter} 
                    onChange={e => setMatChapter(e.target.value)} 
                    placeholder="e.g. Organic naming"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">File Path / Mock File URL</label>
                  <input 
                    type="text" 
                    required 
                    value={matFile} 
                    onChange={e => setMatFile(e.target.value)} 
                    placeholder="e.g. organic_naming.pdf"
                    className="input-field text-xs"
                  />
                </div>

                <button type="submit" className="w-full btn-primary justify-center py-2.5">
                  Publish Resource
                </button>
              </form>
            </div>

            {/* Video uploads */}
            <div className="glass-card p-6 space-y-6">
              <h4 className="text-sm font-bold font-title border-b border-slate-200 dark:border-slate-800 pb-2">Publish Guidance Videos</h4>
              <p className="text-xs text-slate-400">Add toppers lectures, study tips, or time planners to the student hub.</p>

              {/* simulated form inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Video Session Name</label>
                  <input type="text" placeholder="How to master organic reactions" className="input-field text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">YouTube Embed link</label>
                  <input type="text" placeholder="https://www.youtube.com/embed/..." className="input-field text-xs" />
                </div>
                <button 
                  onClick={() => alert('Video session added to student hub!')}
                  className="w-full btn-primary justify-center py-2.5"
                >
                  Upload Video Metadata
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Notices publishing */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="glass-card p-6 space-y-6">
              <h4 className="text-sm font-bold font-title border-b border-slate-200 dark:border-slate-800 pb-2">Noticeboard Publisher</h4>
              
              <form onSubmit={handlePublishAnn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Notice Title</label>
                  <input 
                    type="text" 
                    required 
                    value={annTitle} 
                    onChange={e => setAnnTitle(e.target.value)} 
                    placeholder="PTM virtual link, test release, holidays"
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Notice Content</label>
                  <textarea 
                    required 
                    rows="4"
                    value={annContent} 
                    onChange={e => setAnnContent(e.target.value)} 
                    placeholder="Write announcement description here..."
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Target Roles</label>
                  <select value={annRole} onChange={e => setAnnRole(e.target.value)} className="input-field text-xs">
                    <option value="all">All Profiles</option>
                    <option value="student">Students Only</option>
                    <option value="parent">Parents Only</option>
                  </select>
                </div>

                <button type="submit" className="w-full btn-primary justify-center py-2.5">
                  Publish Notice
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card p-6 text-center">
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Average Test Score</span>
                <span className="block text-3xl font-black text-blue-600 mt-2 font-title">{analytics.averageScore}%</span>
                <span className="text-[10px] text-slate-400">Class wide aggregate marks</span>
              </div>
              <div className="glass-card p-6 text-center">
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Enrolled</span>
                <span className="block text-3xl font-black text-purple-600 mt-2 font-title">{analytics.totalStudents}</span>
                <span className="text-[10px] text-slate-400">Linked student profiles</span>
              </div>
              <div className="glass-card p-6 text-center">
                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">At-Risk Count</span>
                <span className="block text-3xl font-black text-red-500 mt-2 font-title">{analytics.atRiskStudents.length}</span>
                <span className="text-[10px] text-slate-400">Score &lt; 20% or Attendance &lt; 75%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Top Scholars list */}
              <div className="glass-card p-6">
                <h4 className="text-sm font-bold text-green-500 flex items-center gap-2 mb-4 font-title">
                  <CheckCircle className="w-4 h-4" />
                  Top Performers
                </h4>
                <div className="space-y-3">
                  {analytics.topPerformers.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40">
                      <div>
                        <p className="text-xs font-bold">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.batch}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-black text-blue-500 font-title">{p.points} pts</span>
                        <span className="text-[9px] text-slate-400">Avg score: {p.avgScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* At-Risk list */}
              <div className="glass-card p-6">
                <h4 className="text-sm font-bold text-red-500 flex items-center gap-2 mb-4 font-title">
                  <AlertCircle className="w-4 h-4 animate-bounce" />
                  At-Risk Students (Need urgent intervention)
                </h4>
                {analytics.atRiskStudents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No students classified as at-risk. Great job!</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.atRiskStudents.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.batch}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-black text-red-500 font-title">Attendance: {p.attendance}%</span>
                          <span className="text-[9px] text-slate-400">Avg Score: {p.avgScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </section>
    </div>
  );
}

export default TeacherPortal;
