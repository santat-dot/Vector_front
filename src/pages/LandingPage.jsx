import React, { useState } from 'react';
import { Target, Trophy, TrendingUp, Compass, Award, Shield, Users, Mail, ArrowRight, BookOpen, Star, HelpCircle } from 'lucide-react';
import hero1 from '../assets/hero1.svg';
import hero2 from '../assets/hero2.svg';
import hero3 from '../assets/hero3.svg';
import hero4 from '../assets/hero4.svg';

function LandingPage({ onOpenAuth }) {
  const [selectedExam, setSelectedExam] = useState('JEE');
  const [percentilePreview, setPercentilePreview] = useState('98.5');
  const [previewResult, setPreviewResult] = useState('');

  // Use local SVG assets for hero images
  const heroImages = [hero1, hero2, hero3, hero4];

  const handlePredictPreview = (e) => {
    e.preventDefault();
    const p = parseFloat(percentilePreview);
    if (isNaN(p) || p < 0 || p > 100) {
      setPreviewResult('Please enter a valid percentile.');
      return;
    }

    if (selectedExam === 'JEE') {
      if (p >= 99.4) {
        setPreviewResult('Dream/Target: COEP Computer Engineering (99.45% cutoff) - Admission Probable!');
      } else if (p >= 98.5) {
        setPreviewResult('Dream/Target: PICT Computer Engineering (98.85% cutoff) - High Chance!');
      } else if (p >= 92.0) {
        setPreviewResult('Safe: MMCOE Computer Engineering (93.5% cutoff) - Admission Secure.');
      } else {
        setPreviewResult('Target: Local engineering options under Open category available.');
      }
    } else if (selectedExam === 'NEET') {
      if (p >= 99.8) {
        setPreviewResult('Dream/Target: BJ Medical College, Pune (99.82% cutoff) - Highly Competitive!');
      } else if (p >= 98.9) {
        setPreviewResult('Safe/Target: Rajiv Gandhi Medical College, Kalwa (98.9% cutoff) - Solid Probability.');
      } else {
        setPreviewResult('Target: Semi-government & Private MBBS/BDS options recommended.');
      }
    } else {
      if (p >= 99.0) {
        setPreviewResult('Dream/Target: VJTI Information Technology (99.85% cutoff) - Reachable!');
      } else if (p >= 95.0) {
        setPreviewResult('Safe: MMCOE Computer Engineering (95.8% cutoff) - Match Secured!');
      } else {
        setPreviewResult('Target: State level private engineering academies.');
      }
    }
  };

  return (
    <div className="w-full pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-20 pb-24 flex flex-col items-center text-center overflow-hidden">
        {/* Decorative continuous slidebar behind hero content */}
        <div className="hero-slider" aria-hidden="true">
          <div className="hero-slider-track px-6">
            {heroImages.concat(heroImages).map((src, i) => (
              <div className="hero-slide" key={i}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-float"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            🚀 The Future of Competitive Prep
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-black font-title tracking-tight leading-none">
            Master Your Focus. <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Elevate Your Rank.
            </span>
          </h2>
          
          <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Vector Science Academy's gamified learning portal integrates automated test analysis, interactive leaderboards, AI doubt solvers, and accurate college predictors for JEE, NEET, and MHT-CET.
          </p>

          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onOpenAuth('register')}
              className="btn-primary px-8 py-4 text-base shadow-lg shadow-blue-500/20"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onOpenAuth('login')}
              className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Student Portal Access
            </button>
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold font-title">Empowering Academic Performance</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Comprehensive features tailored for students, teachers, and parents.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-title">Duolingo Gamification</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Earn XP, level up your profile, solve daily streaks, and achieve master badges by attending lectures and solving DPPs.</p>
          </div>

          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-title">Analytics Tracker</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Detailed line graphs and radar profiles mapping strengths and weaknesses by physics, chemistry, and math sub-topics.</p>
          </div>

          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-title">College Predictor</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter your percentile scores to instantly predict Dream, Target, and Safe branches based on cutoff data (with PDF report).</p>
          </div>

          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-title">AI Study Assistant</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ask questions, request 30-day revision schedules, get formula derivations, and request chapter reviews at any time.</p>
          </div>
        </div>
      </section>

      {/* 2a. Promo Video Section */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-700 font-semibold">YouTube Showcase</p>
          <h3 className="text-3xl font-bold font-title mt-3">Watch Our Most Impactful Promo Videos</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
            Discover how Vector Science Academy helps students dominate entrance exams, improve classroom performance, and stay motivated through guided learning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { id: 'oY4ShrBVJMo', title: 'JEE Mastery Strategy', description: 'A short promo demonstrating our exam preparation ecosystem and student success journey.' },
            { id: 'frBh6Bmeg-I', title: 'Parent-School Transparency', description: 'Highlighting parent portal analytics, attendance tracking, and score visibility.' },
            { id: '-DBW1OVP8xU', title: 'Teacher Empowerment Tools', description: 'Showcasing teacher dashboards, test creation, and meaningful student interventions.' },
            { id: 'd7ohXNpPbnA', title: 'AI-Driven Learning Support', description: 'Introducing the AI study assistant, revision planning, and college prediction workflows.' }
          ].map((video) => (
            <div key={video.id} className="glass-card overflow-hidden rounded-[24px]">
              <div className="relative aspect-[16/9] bg-slate-900">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold font-title mb-2 text-slate-900">{video.title}</h4>
                <p className="text-sm text-slate-500 mb-4">{video.description}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
                >
                  Watch full video
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Gamification & Leaderboard Preview */}
      <section className="px-6 py-16 bg-slate-100/50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-850">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider">
              🎮 Competitive Environment
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold font-title">Gaming-style Rank Progression</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-body">
              Make test preparation engaging. Our academy leaderboard ranks students across class, subject, and time ranges. Completing test modules unlocks achievements like **Consistency Champion**, **Fast Learner**, or **Physics Master** to build study consistency.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                <span className="text-sm font-semibold">8 custom badges</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold">Class and Academy Rank</span>
              </div>
            </div>
          </div>

          {/* Interactive Leaderboard Card */}
          <div className="glass-card p-6 space-y-4 max-w-md mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h4 className="text-md font-bold font-title flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Academy Top Rankers
              </h4>
              <span className="text-xs text-slate-400">Weekly Update</span>
            </div>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Rahul Tathe', points: '1,420 pts', level: 'Lvl 4', badge: 'Consistency Champ' },
                { rank: 2, name: 'Aditi Joshi', points: '850 pts', level: 'Lvl 2', badge: 'Attendance Star' },
                { rank: 3, name: 'Siddhesh Patil', points: '790 pts', level: 'Lvl 2', badge: 'Fast Learner' },
              ].map((r, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-black ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-400' : 'text-amber-700'}`}>#{r.rank}</span>
                    <div>
                      <p className="text-sm font-bold">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.badge} • {r.level}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{r.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. College Predictor Interactive Demo */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Interactive Calculator Demo */}
          <div className="glass-card p-8 max-w-lg mx-auto w-full space-y-6">
            <h4 className="text-lg font-bold font-title">Test Drive: College Predictor</h4>
            
            <form onSubmit={handlePredictPreview} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Exam</label>
                  <select 
                    value={selectedExam} 
                    onChange={e => { setSelectedExam(e.target.value); setPreviewResult(''); }} 
                    className="input-field"
                  >
                    <option value="JEE">JEE Mains</option>
                    <option value="NEET">NEET UG</option>
                    <option value="MHT-CET">MHT-CET</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Percentile</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={percentilePreview} 
                    onChange={e => { setPercentilePreview(e.target.value); setPreviewResult(''); }}
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary justify-center">
                Calculate Admission Probability
              </button>
            </form>

            {previewResult && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 text-sm font-semibold text-blue-600 dark:text-blue-400 animate-fade-in">
                {previewResult}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              🎓 Career Counseling
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold font-title">AI-Powered Cutoff Predictor</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-body">
              Make decisions with real numbers. Enter your exam type, score percentile, category quota, gender, and preferred location. Our platform cross-references state and national cutoff logs to classify colleges into:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <strong>Dream Colleges</strong> - ambitious cutoffs (20%-50% chance)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <strong>Target Colleges</strong> - competitive fit (50%-80% chance)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <strong>Safe Colleges</strong> - highly secure backup (85%-99% chance)
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 5. Parent Portal Section */}
      <section className="px-6 py-16 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-850">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider">
              👪 Parent Portal
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold font-title">Complete Attendance & Score Transparency</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Enable parent supervision without friction. Parents can log in to a custom portal containing:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                <h5 className="font-bold text-sm">Weekly Progress Reports</h5>
                <p className="text-xs text-slate-400 mt-1">Direct PDF downloads summarizing test trends.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40">
                <h5 className="font-bold text-sm">Weak Areas Highlighter</h5>
                <p className="text-xs text-slate-400 mt-1">AI flagging of specific low-performing topics.</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 max-w-md mx-auto w-full space-y-4">
            <h5 className="font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-2">Parent Tracker Overview</h5>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-bold">Rahul Tathe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class Attendance:</span>
                <span className="font-bold text-green-500">100% (Present)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Test:</span>
                <span className="font-bold">30/40 marks (JEE Practice 1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Teacher Note:</span>
                <span className="italic text-slate-300">"Excellent understanding of Mechanics."</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold font-title">Trusted by Scholars</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Hear from students who unlocked top percentiles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-warning fill-warning" />)}
            </div>
            <p className="text-sm italic text-slate-500 dark:text-slate-400">"The gamified badges kept me motivated. Solving DPPs and getting points felt like leveling up in a game. Placed under top 500 in JEE!"</p>
            <p className="font-bold text-xs mt-4">— Aditya K. (JEE Advanced Rank 142)</p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-warning fill-warning" />)}
            </div>
            <p className="text-sm italic text-slate-500 dark:text-slate-400">"The college predictor report predicted my BJMC Pune placement accurately based on my mock scores. Absolute life-saver during counseling."</p>
            <p className="font-bold text-xs mt-4">— Aditi J. (NEET score 682/720)</p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-warning fill-warning" />)}
            </div>
            <p className="text-sm italic text-slate-500 dark:text-slate-400">"As a parent, logging in to check weekly attendance calendar and performance trend charts gave me complete transparency of my daughter's progress."</p>
            <p className="font-bold text-xs mt-4">— Sanjay Joshi (Parent of Aditi)</p>
          </div>
        </div>
      </section>

      {/* 7. Contact Section */}
      <section className="px-6 py-16 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 dark:from-blue-950/20 dark:to-indigo-950/20 border-t border-slate-200 dark:border-slate-850">
        <div className="max-w-4xl mx-auto glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="text-2xl font-bold font-title">Need custom platform extensions?</h4>
            <p className="text-sm text-slate-400 mt-2">Get in touch with the lead system developer for coaching customizations.</p>
            
            <div className="mt-6 space-y-2 text-sm">
              <p className="font-semibold text-blue-600 dark:text-blue-400">Sanskar Tathe</p>
              <p className="text-slate-500 dark:text-slate-400">Web Developer, MMCOE Pune</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                <Mail className="w-4 h-4" />
                <span>sanskartathe2024.comp@mmcoe.edu.in</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => onOpenAuth('register')} 
              className="btn-primary w-full justify-center px-6 py-3"
            >
              Sign Up As Student
            </button>
            <a 
              href="mailto:sanskartathe2024.comp@mmcoe.edu.in" 
              className="px-6 py-3 text-center border border-slate-200 dark:border-slate-800 text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Contact Developer
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
