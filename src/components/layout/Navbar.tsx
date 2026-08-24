import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Plus,
  LogOut,
  Check,
  Sun,
  Moon,
  Menu,
  X
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
  const {
    currentUser,
    logout,
    subjectConfig,
    subjects,
    activeSubjectId,
    switchSubject,
    openSubjectSetupModal,
    resetCurrentSubjectDemo,
    misconceptions,
    overallMastery,
    isDarkMode,
    toggleDarkMode
  } = useRevision();

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subjectMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unresolvedMisconceptions = misconceptions.filter((m) => !m.isResolved).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectMenuRef.current && !subjectMenuRef.current.contains(event.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: unresolvedMisconceptions > 0 ? (
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
      ) : undefined
    },
    {
      id: 'diagnostic',
      label: 'Diagnostic Quiz',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: 'revision-plan',
      label: 'Revision Plan',
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: (
        <span className="text-[10px] bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-extrabold px-1.5 py-0.2 rounded-full">
          High
        </span>
      )
    },
    {
      id: 'knowledge-map',
      label: 'Knowledge Map',
      icon: <Network className="w-4 h-4" />
    },
    {
      id: 'upload',
      label: 'Upload Materials',
      icon: <UploadCloud className="w-4 h-4" />
    },
    {
      id: 'history',
      label: 'Progress',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Slim Exam Ticker Ribbon */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Active Exam & Countdown */}
          <div className="flex items-center gap-2.5 truncate">
            <span className="inline-flex items-center gap-1.5 text-indigo-400 font-extrabold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="hidden sm:inline">Exam Target:</span>
            </span>

            <span className="font-extrabold text-white bg-indigo-600/80 px-2.5 py-0.5 rounded-full text-xs truncate">
              {subjectConfig.name}
            </span>

            <span className="text-slate-500 hidden sm:inline">•</span>

            <span className="inline-flex items-center gap-1 text-amber-300 font-semibold text-xs truncate">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{subjectConfig.examDateText} ({subjectConfig.hoursUntilExam}h left)</span>
            </span>
          </div>

          {/* Right: Study Budget & Reset State Shortcut */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded-full text-[11px] text-slate-300">
              <span className="text-slate-400">Budget:</span>
              <strong className="text-indigo-300">{subjectConfig.totalAvailableMinutes}m</strong>
            </div>

            <button
              onClick={resetCurrentSubjectDemo}
              title="Reset current subject simulation"
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800/70 hover:bg-slate-800 px-2 py-0.5 rounded-full transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* 1. Left Section: Logo & Subject Switcher Dropdown */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            {/* Brand Logo */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => onSelectPage('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">Recall</span>
                <span className="font-black text-lg tracking-tight text-indigo-600 dark:text-indigo-400">IQ</span>
              </div>
            </div>

            {/* Subject Switcher Pill Dropdown */}
            <div className="relative" ref={subjectMenuRef}>
              <button
                type="button"
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                <span className="max-w-[110px] sm:max-w-[160px] truncate text-slate-900 dark:text-white font-extrabold">
                  {subjectConfig.name}
                </span>
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded-md">
                  {overallMastery}%
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Subject Switcher Menu */}
              {isSubjectDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                  <div className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 px-2 py-1 tracking-wider">
                    My Exam Subjects ({subjects.length})
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                    {subjects.map((subj) => {
                      const isSelected = subj.id === activeSubjectId;
                      const avgMastery = Math.round(
                        subj.topics.reduce((acc, t) => acc + t.masteryPercentage, 0) / (subj.topics.length || 1)
                      );

                      return (
                        <button
                          key={subj.id}
                          type="button"
                          onClick={() => {
                            switchSubject(subj.id);
                            setIsSubjectDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-200 font-bold border border-indigo-200 dark:border-indigo-800'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate font-bold text-slate-900 dark:text-white">{subj.name}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">{subj.examDateText}</div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              avgMastery < 50
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                : avgMastery < 75
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {avgMastery}%
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubjectDropdownOpen(false);
                        openSubjectSetupModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-extrabold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Exam Subject</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Center Section: Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge}
                </button>
              );
            })}
          </nav>

          {/* 3. Right Section: Theme Toggle, User Profile & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-[11px] font-black shadow-xs">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser?.name || 'Account'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">{currentUser?.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{currentUser?.email}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      openSubjectSetupModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>+ Add New Subject</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      toggleDarkMode();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                      <span>{isDarkMode ? 'Light Theme' : 'Dark Theme'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{isDarkMode ? 'Dark' : 'Light'}</span>
                  </button>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-bold flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Sticky Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-3 flex items-center justify-around text-[11px] shadow-lg">
        <button
          onClick={() => onSelectPage('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold transition-colors ${
            currentPage === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onSelectPage('diagnostic')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold transition-colors ${
            currentPage === 'diagnostic' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Quiz</span>
        </button>

        <button
          onClick={() => onSelectPage('revision-plan')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold transition-colors ${
            currentPage === 'revision-plan' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Plan</span>
        </button>

        <button
          onClick={() => onSelectPage('knowledge-map')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold transition-colors ${
            currentPage === 'knowledge-map' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          onClick={() => onSelectPage('upload')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 font-bold transition-colors ${
            currentPage === 'upload' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>
    </header>
  );
};
