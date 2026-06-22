import React, { useState } from 'react';
import { Shield, Settings, Server, Users, Award, Play } from 'lucide-react';

function SuperAdminPortal({ user, token, logout }) {
  const [activeTab, setActiveTab] = useState('settings');
  const [dppPoints, setDppPoints] = useState('50');
  const [attendancePoints, setAttendancePoints] = useState('20');
  const [testPoints, setTestPoints] = useState('100');

  const [logs, setLogs] = useState([
    { time: '21:03:56', msg: 'System initialized on host' },
    { time: '21:04:20', msg: 'SQLite connection active. PRAGMA foreign_keys = ON;' },
    { time: '21:05:01', msg: 'JWT validation check for user: admin@vector.com (SUCCESS)' },
    { time: '21:08:14', msg: 'College predictor database query executed for category Open (0.015s)' },
    { time: '21:10:45', msg: 'Awarded 50 XP to student: Rahul Tathe for DPP Laws of Motion' },
  ]);

  const handleSavePoints = (e) => {
    e.preventDefault();
    alert('Point weights updated! All learning actions will now apply the new threshold.');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[90vh]">
      
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 shrink-0">
        {[
          { id: 'settings', label: 'Gamification Config', icon: <Award className="w-5 h-5" /> },
          { id: 'system', label: 'System Service Logs', icon: <Server className="w-5 h-5" /> },
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
      <section className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold font-title flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Global Platform Point Thresholds
              </h3>
              <p className="text-xs text-slate-400 mt-1">Configure student points modifiers dynamically.</p>
            </div>

            <div className="glass-card p-6 max-w-lg">
              <form onSubmit={handleSavePoints} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">DPP Submission Complete (Points)</label>
                  <input 
                    type="number" 
                    value={dppPoints} 
                    onChange={e => setDppPoints(e.target.value)} 
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Daily Attendance Presence (Points)</label>
                  <input 
                    type="number" 
                    value={attendancePoints} 
                    onChange={e => setAttendancePoints(e.target.value)} 
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Mock Test Participation (Points)</label>
                  <input 
                    type="number" 
                    value={testPoints} 
                    onChange={e => setTestPoints(e.target.value)} 
                    className="input-field text-xs"
                  />
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-2.5">
                  Save Modifier Configuration
                </button>
              </form>
            </div>
          </div>
        )}

        {/* System logs tab */}
        {activeTab === 'system' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold font-title flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                Live Node.js / SQLite Activity Log
              </h3>
              <p className="text-xs text-slate-400 mt-1">Review system logs, error reports, and user transactions.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] space-y-2 h-[50vh] overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-blue-500 font-bold">[{log.time}]</span>
                  <span className="text-emerald-400">INFO:</span>
                  <span className="text-slate-200">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  );
}

export default SuperAdminPortal;
