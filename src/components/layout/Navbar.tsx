import React from 'react';
import {
  Brain,
  Clock,
  LayoutDashboard,
  HelpCircle,
  CalendarCheck,
  Network,
  UploadCloud,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Home
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';

export type ActivePage =
  | 'dashboard'
  | 'diagnostic'
  | 'revision-plan'
  | 'knowledge-map'
  | 'upload'
  | 'history'
  | 'landing';

interface NavbarProps {
  currentPage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onSelectPage }) => {
  const { subjectConfig, resetToDefaultDSA, misconceptions, overallMastery } = useRevision();
  const unresolvedMisconceptions = misconceptions.filter((m) => !m.isResolved).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner: Exam Countdown & Quick Status */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Exam:</span>
            </span>
            <span className="font-semibold text-slate-200">{subjectConfig.name}</span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline-flex items-center gap-1 text-amber-300 font-semibold">
              <Clock className="w-3 h-3" />
              {subjectConfig.examDateText} ({subjectConfig.hoursUntilExam}h left)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded-full text-[11px]">
              <span className="text-slate-400">Study Budget:</span>
              <span className="font-bold text-indigo-300">
                {Math.floor(subjectConfig.totalAvailableMinutes / 60)}h {subjectConfig.totalAvailableMinutes % 60}m
              </span>
            </div>

            <button
              onClick={resetToDefaultDSA}
              title="Reset Demo Scenario"
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset DSA Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectPage('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900">Recall</span>
                <span className="font-black text-lg tracking-tight text-indigo-600">IQ</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                  AI Adaptive
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                AI that knows what you don't know
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectPage('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
              {unresolvedMisconceptions > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => onSelectPage('diagnostic')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'diagnostic'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => onSelectPage('revision-plan')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'revision-plan'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Revision Plan</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">
                🔥 Priority
              </span>
            </button>

            <button
              onClick={() => onSelectPage('knowledge-map')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'knowledge-map'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Knowledge Map</span>
            </button>

            <button
              onClick={() => onSelectPage('upload')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'upload'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Notes/PYQs</span>
            </button>

            <button
              onClick={() => onSelectPage('history')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'history'
                  ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Progress</span>
            </button>
          </nav>

          {/* Right Action / Mastery Meter */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Mastery:</span>
              <span className={`text-xs font-black ${
                overallMastery < 50 ? 'text-rose-600' : overallMastery < 75 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {overallMastery}%
              </span>
            </div>

            <button
              onClick={() => onSelectPage('landing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentPage === 'landing'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>About</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 px-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => onSelectPage('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold ${
            currentPage === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => onSelectPage('diagnostic')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold ${
            currentPage === 'diagnostic' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Quiz</span>
        </button>
        <button
          onClick={() => onSelectPage('revision-plan')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold ${
            currentPage === 'revision-plan' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Plan</span>
        </button>
        <button
          onClick={() => onSelectPage('knowledge-map')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold ${
            currentPage === 'knowledge-map' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Map</span>
        </button>
        <button
          onClick={() => onSelectPage('upload')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold ${
            currentPage === 'upload' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
};
