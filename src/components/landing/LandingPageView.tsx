import React from 'react';
import {
  Sparkles,
  Flame,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import type { ActivePage } from '../layout/Navbar';
import { useRevision } from '../../context/RevisionContext';

interface LandingPageViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
  const { resetToDefaultDSA } = useRevision();

  const handleLaunchDemo = () => {
    resetToDefaultDSA();
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-16 pb-20 animate-fadeIn text-slate-800">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Next-Gen Metacognitive Exam Prep</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
          AI that knows what you don’t know — <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            and tells you what to revise next.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Stop passively re-reading hundreds of pages of algorithm notes. RecallIQ tracks your <strong>confidence vs. correctness</strong> to pinpoint high-risk algorithmic misconceptions, schedule your exact remaining hours, and verify mastery with targeted re-tests.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleLaunchDemo}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Live DSA Demo (2h Left)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
          >
            Upload Your Own Notes / PYQs
          </button>
        </div>

        {/* Live Scenario Pill */}
        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            <Flame className="w-3.5 h-3.5" />
            <span>Target Exam: Data Structures & Algorithms (DSA) • 14h left • 2h revision budget</span>
          </div>
        </div>
      </section>

      {/* The 4-Step Metacognitive Loop */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How the Adaptive Revision Loop Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Not just a flashcard app. A real-time closed feedback loop designed for exam survival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Upload & Diagnostic</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Take a 5-question diagnostic test on core DSA patterns. You rate confidence (Low / Med / High) on every choice.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="font-bold text-rose-950 text-sm">Misconception Detection</h3>
            <p className="text-xs text-rose-900/80 leading-relaxed">
              Answered incorrectly with 90% confidence on Binary Search? AI flags it as a lethal exam trap and reveals your flawed invariant.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Priority Revision Plan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Allocates your remaining 2 hours into 🔥 High, 🟡 Medium, and 🟢 Low priority micro-sessions across all 10 DSA topics.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
              4
            </div>
            <h3 className="font-bold text-emerald-950 text-sm">Targeted Re-Test & Boost</h3>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Pass a 2-min targeted re-test: Binary Search mastery jumps from 30% to 80%+, resolving the blindspot on the map!
            </p>
          </div>
        </div>
      </section>

      {/* Comparison: Traditional Studying vs RecallIQ */}
      <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Why Standard Cramming Fails vs RecallIQ
          </h2>
          <p className="text-xs text-slate-500">
            Exam anxiety happens when you spend 80% of your time re-reading things you already know like basic Arrays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Traditional */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-rose-700 text-sm">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Standard Revision / Quiz Apps</span>
            </div>
            <ul className="space-y-2.5 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Passive reading without detecting confidence gaps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Treats a 90% confidence mistake the same as an honest blank guess</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>No time budget allocation fitted to exam countdown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Leaves you guessing what algorithmic pattern to study next</span>
              </li>
            </ul>
          </div>

          {/* RecallIQ */}
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>RecallIQ Adaptive Platform</span>
            </div>
            <ul className="space-y-2.5 text-indigo-950 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>2x2 Metacognitive Matrix</strong> separates knowledge gaps from dangerous misconceptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Instant Socratic Debunk</strong> uncovers why you were tricked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Dynamic Time Budgeting</strong> divides 2h realistically across topics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>"Revise Now" Engine</strong> tells you the single best next action</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom Launch Banner */}
      <section className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black">
          Ready to experience the DSA adaptive loop?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Start with the Binary Search 90% confidence misconception, take the targeted re-test, and watch mastery jump from 30% to 80%+.
        </p>
        <button
          onClick={handleLaunchDemo}
          className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
        >
          <span>Open Interactive Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
