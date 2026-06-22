import React, { useState, useEffect } from 'react';
import { Award, Calendar, ChevronRight, Download, FileText, TrendingUp, Users } from 'lucide-react';

function ParentPortal({ user, token, logout }) {
  const [children, setChildren] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null); // children object
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/parent/children', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setChildren(data);
      if (data.length > 0) {
        setSelectedKid(data[0]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleDownloadReport = (kidId) => {
    fetch(`/api/parent/report/${kidId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setReportData(data);
      // Simulate download by printing/viewing in browser
      setTimeout(() => {
        window.print();
      }, 500);
    })
    .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Portal Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-title">Parental Monitoring Workspace</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time attendance logs, mock percentiles, and faculty feedback.</p>
        </div>

        {/* Children dropdown selection */}
        {children.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Select Child:</span>
            <select 
              value={selectedKid ? selectedKid.profile.user_id : ''} 
              onChange={e => setSelectedKid(children.find(c => c.profile.user_id === parseInt(e.target.value)))}
              className="input-field py-1.5 text-xs"
            >
              {children.map(c => (
                <option key={c.profile.user_id} value={c.profile.user_id}>{c.profile.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedKid ? (
        <div className="space-y-8">
          
          {/* Overview Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center">
              <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Attendance Rate</span>
              <span className={`block text-2xl font-black mt-2 font-title ${selectedKid.attendancePct >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                {selectedKid.attendancePct}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Class Requirement: 75%</span>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Gamification Level</span>
              <span className="block text-2xl font-black text-blue-500 mt-2 font-title">
                Lvl {selectedKid.profile.current_level}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{selectedKid.profile.points} Points</span>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Academy Rank</span>
              <span className="block text-2xl font-black text-purple-500 mt-2 font-title">
                #{selectedKid.academyRank}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Out of coaching batch</span>
            </div>

            <div className="glass-card p-6 text-center">
              <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Assigned Batch</span>
              <span className="block text-sm font-black text-slate-700 dark:text-slate-200 mt-4 leading-tight">
                {selectedKid.profile.batch}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase mt-1 block">Target: {selectedKid.profile.exam_target}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Grade trends and history */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Performance trajectory */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-bold font-title">Academic Marks Development</h4>
                  <button 
                    onClick={() => handleDownloadReport(selectedKid.profile.user_id)}
                    className="btn-primary text-xs py-1.5 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Report
                  </button>
                </div>

                <div className="h-44 flex items-end justify-between border-b border-l border-slate-250 dark:border-slate-800 pb-4 px-4">
                  {selectedKid.testHistory.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center w-full py-8">No tests attempted by student yet.</p>
                  ) : (
                    selectedKid.testHistory.slice(0, 5).reverse().map((test, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className="w-8 bg-blue-600 rounded-t-md hover:bg-blue-500 transition-all cursor-pointer"
                          style={{ height: `${(test.score / test.total_marks) * 100}px` }}
                          title={`${test.score}/${test.total_marks} marks`}
                        ></div>
                        <span className="text-[9px] text-slate-400 max-w-[80px] text-center truncate">{test.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Test History List */}
              <div className="glass-card p-6">
                <h4 className="text-sm font-bold font-title mb-4">Complete Mock History</h4>
                {selectedKid.testHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No records found.</p>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {selectedKid.testHistory.map((test, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{test.title}</p>
                          <p className="text-slate-400 mt-1">{new Date(test.completed_at).toLocaleDateString()}</p>
                        </div>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{test.score}/{test.total_marks} marks</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Feedback and weak modules */}
            <div className="space-y-8">
              
              {/* Faculty remarks */}
              <div className="glass-card p-6 border-l-4 border-l-purple-500 bg-purple-500/5">
                <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400 font-title mb-3">Faculty Feedback</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "{selectedKid.remarks}"
                </p>
                <div className="mt-4 pt-3 border-t border-purple-550/10 text-[10px] text-slate-400">
                  Signed: Prof. Vivek Sharma (Director)
                </div>
              </div>

              {/* Weak areas flagged */}
              <div className="glass-card p-6 border-l-4 border-l-amber-500 bg-amber-500/5">
                <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 font-title mb-3">Weak Academic Modules</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedKid.weakAreas}
                </p>
              </div>

              {/* Attendance Tracker */}
              <div className="glass-card p-6">
                <h4 className="text-sm font-bold font-title mb-3">Attendance Quick View</h4>
                <div className="grid grid-cols-7 gap-1 mt-3">
                  {[...Array(28)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-bold ${
                        i < 20 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : i === 23 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-green-500"></span>
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
                    <span>Absent</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className="font-bold text-sm">No associated children found</h4>
          <p className="text-xs text-slate-400 mt-1">Please ask Vector Admin to register your email in your child's student profile.</p>
        </div>
      )}

      {/* printable report overlay (hidden in screen view, triggered during printing) */}
      {reportData && (
        <div className="hidden print:block p-8 space-y-6">
          <h2 className="text-3xl font-black text-center font-title">VECTOR SCIENCE ACADEMY</h2>
          <h3 className="text-xl text-center text-slate-400">OFFICIAL STUDENT PROGRESS REPORT</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-8 border-y py-4">
            <p><strong>Student Name:</strong> {reportData.studentName}</p>
            <p><strong>Report Date:</strong> {new Date(reportData.generatedAt).toLocaleDateString()}</p>
          </div>

          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-bold border-b pb-2">1. Attendance Report</h4>
            <p>Total logged lectures: {reportData.attendanceSummary.total}</p>
            <p>Attended: {reportData.attendanceSummary.present} days ({Math.round((reportData.attendanceSummary.present / reportData.attendanceSummary.total) * 100)}%)</p>
            <p>Absent: {reportData.attendanceSummary.absent} days</p>
          </div>

          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-bold border-b pb-2">2. Mock Examination History</h4>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Test Name</th>
                  <th className="py-2">Module Category</th>
                  <th className="py-2">Obtained Mark</th>
                </tr>
              </thead>
              <tbody>
                {reportData.testLogs.map((test, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{test.title}</td>
                    <td className="py-2">{test.category}</td>
                    <td className="py-2">{test.score} / {test.total_marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 p-4 border border-dashed rounded bg-slate-50">
            <h5 className="font-bold">Faculty Evaluator Summary:</h5>
            <p className="italic text-slate-600 mt-2">"{reportData.generalRemarks}"</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default ParentPortal;
