import React from 'react';
import {
  AlertTriangle,
  Flame,
  ArrowRight,
  Clock,
  Brain,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  BarChart3,
  Search,
  Network,
  Sliders,
  GitBranch,
  ArrowUpDown,
  Layers,
  Link,
  GitFork,
  Hash,
  Grid
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';
import type { ActivePage } from '../layout/Navbar';

interface DashboardViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    subjectConfig,
    topics,
    misconceptions,
    nextRecommended,
    overallMastery,
    metacognitiveStats,
    openDebunkModal,
    openRetestModal,
    openRevisionModal,
    updateAvailableMinutes
  } = useRevision();

  const unresolvedMisconceptions = misconceptions.filter((m) => !m.isResolved);

  const getTopicIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('binary search')) return <Search className="w-5 h-5" />;
    if (lower.includes('graph')) return <Network className="w-5 h-5" />;
    if (lower.includes('sliding window')) return <Sliders className="w-5 h-5" />;
    if (lower.includes('tree')) return <GitBranch className="w-5 h-5" />;
    if (lower.includes('sort')) return <ArrowUpDown className="w-5 h-5" />;
    if (lower.includes('stack') || lower.includes('queue')) return <Layers className="w-5 h-5" />;
    if (lower.includes('linked list')) return <Link className="w-5 h-5" />;
    if (lower.includes('pointer')) return <GitFork className="w-5 h-5" />;
    if (lower.includes('hash')) return <Hash className="w-5 h-5" />;
    return <Grid className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Welcome & Scenario Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[11px] rounded-full uppercase tracking-wider">
              Adaptive Revision Session
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Exam in {subjectConfig.hoursUntilExam} Hours ({subjectConfig.examDateText})
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {subjectConfig.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AI has analyzed your diagnostic answers and prioritized high-yield algorithmic patterns for your remaining study time.
          </p>
        </div>

        {/* Study Time Allocation Adjuster */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Revision Time Budget
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={subjectConfig.totalAvailableMinutes}
                onChange={(e) => updateAvailableMinutes(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-indigo-600"
              >
                <option value={60}>1 Hour (Quick Cram)</option>
                <option value={120}>2 Hours (Recommended Demo)</option>
                <option value={180}>3 Hours (Deep Review)</option>
                <option value={240}>4 Hours (Full Mastery)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Overall Mastery */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Mastery</span>
            <Brain className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {overallMastery}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  overallMastery < 50
                    ? 'bg-rose-500'
                    : overallMastery < 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${overallMastery}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Target: <strong className="text-slate-700">{subjectConfig.targetScore}</strong>
          </div>
        </div>

        {/* High-Confidence Misconceptions */}
        <div className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between transition-all ${
          unresolvedMisconceptions.length > 0
            ? 'bg-rose-50/70 border-rose-200 text-rose-950 misconception-glow'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Dangerous Traps
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-rose-600">
              {unresolvedMisconceptions.length}
            </div>
            <p className="text-[11px] font-semibold text-rose-700 mt-1">
              High-confidence mistakes
            </p>
          </div>
          <div className="text-[11px] text-rose-800/80 font-medium">
            {unresolvedMisconceptions.length > 0 ? '⚠️ High risk on exam paper' : '✅ No blindspots detected'}
          </div>
        </div>

        {/* Metacognitive Calibration */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Calibration Score</span>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-indigo-600">
              {metacognitiveStats.calibrationScore}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Confidence accuracy rate
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {metacognitiveStats.solidMastery} Solid • {metacognitiveStats.fragileKnowledge} Fragile
          </div>
        </div>

        {/* Time Remaining */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Revision Budget</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {subjectConfig.totalAvailableMinutes}m
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Smart time distribution
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100%</span> scheduled across topics
          </div>
        </div>
      </div>

      {/* Hero "Revise Now" AI Recommendation Card */}
      {nextRecommended && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 font-extrabold text-xs rounded-full uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  AI REVISE NOW • HIGHEST YIELD
                </span>
                <span className="text-indigo-300 text-xs font-semibold">
                  ⏱️ {nextRecommended.allocatedMinutes} mins allocated
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {nextRecommended.conceptName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {nextRecommended.reason}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold text-slate-200">
                  Topic: <strong>{nextRecommended.topicName}</strong>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold text-slate-200">
                  Mastery: <strong className="text-rose-400">{nextRecommended.masteryPercentage}%</strong>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold text-slate-200">
                  Priority: <strong className="text-amber-300">{nextRecommended.priority}</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
              {nextRecommended.hasMisconception ? (
                <button
                  onClick={() => {
                    const misc = misconceptions.find((m) => m.conceptId === nextRecommended.conceptId);
                    if (misc) openDebunkModal(misc.id);
                  }}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Debunk Misconception & Retest</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => openRetestModal(nextRecommended.conceptId)}
                  className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Targeted Micro-Drill</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => openRevisionModal(nextRecommended.conceptId)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs rounded-xl transition-all text-center"
              >
                Read Concept Cheat Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active High-Confidence Misconceptions Widget */}
      {unresolvedMisconceptions.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-extrabold text-rose-950 uppercase tracking-wider">
                🚨 High-Confidence Misconception Detected
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-200/70 px-2.5 py-0.5 rounded-full">
              Critical Exam Hazard
            </span>
          </div>

          {unresolvedMisconceptions.map((misc) => (
            <div
              key={misc.id}
              className="bg-white border border-rose-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {misc.conceptTitle}
                  </span>
                  <span className="text-xs text-slate-500">
                    Answered with <strong>{misc.confidencePercentage}% confidence</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium">
                  <strong>Your Misconception:</strong> "{misc.underlyingMisconception}"
                </p>
                <p className="text-xs text-emerald-800 font-semibold">
                  <strong>Correct Rule:</strong> {misc.clarifiedRule}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openDebunkModal(misc.id)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Debunk & Retest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two Column Layout: Topics Breakdown vs Metacognitive 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Topic Mastery & Priority List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>DSA Topics & Mastery Breakdown</span>
            </h3>
            <button
              onClick={() => onNavigate('revision-plan')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Full Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      topic.masteryPercentage < 50
                        ? 'bg-rose-100 text-rose-700'
                        : topic.masteryPercentage < 75
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {getTopicIcon(topic.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{topic.name}</h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          topic.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : topic.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {topic.priority === 'HIGH' ? '🔥 High Priority' : topic.priority === 'MEDIUM' ? '🟡 Medium' : '🟢 Low'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {topic.concepts.length} core sub-concepts • {topic.totalExamQuestionsAppeared} past exam questions
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-black ${
                      topic.masteryPercentage < 50
                        ? 'text-rose-600'
                        : topic.masteryPercentage < 75
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}>
                      {topic.masteryPercentage}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">Mastery</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      topic.masteryPercentage < 50
                        ? 'bg-rose-500'
                        : topic.masteryPercentage < 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${topic.masteryPercentage}%` }}
                  />
                </div>

                {/* Sub-concepts snippet */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {topic.concepts.map((concept) => (
                    <button
                      key={concept.id}
                      onClick={() => openRevisionModal(concept.id)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                        concept.masteryPercentage < 50
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : concept.masteryPercentage < 75
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>{concept.title}</span>
                      <span className="font-bold text-[10px]">({concept.masteryPercentage}%)</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Metacognitive 2x2 Matrix & Quick Diagnostic Launch (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>Metacognitive Calibration</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Confidence vs Correctness</span>
          </div>

          {/* 2x2 Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <p className="text-xs text-slate-500">
              RecallIQ evaluates your metacognition. The most dangerous items are <strong>High-Confidence Mistakes</strong>.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Q1: High Confidence Wrong */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                    Misconception
                  </span>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <div className="my-2">
                  <div className="text-xl font-black text-rose-700">
                    {metacognitiveStats.misconceptions}
                  </div>
                  <div className="text-[10px] text-rose-900 font-medium">
                    High Confidence + Wrong
                  </div>
                </div>
                <div className="text-[10px] font-bold text-rose-800 bg-rose-200/60 px-1.5 py-0.5 rounded text-center">
                  🔥 Urgent Priority #1
                </div>
              </div>

              {/* Q2: Low Confidence Wrong */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Knowledge Gap
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="my-2">
                  <div className="text-xl font-black text-amber-700">
                    {metacognitiveStats.knowledgeGaps}
                  </div>
                  <div className="text-[10px] text-amber-900 font-medium">
                    Low Confidence + Wrong
                  </div>
                </div>
                <div className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded text-center">
                  📚 Standard Review
                </div>
              </div>

              {/* Q3: Low Confidence Correct */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Lucky Guess
                  </span>
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
                <div className="my-2">
                  <div className="text-xl font-black text-purple-700">
                    {metacognitiveStats.fragileKnowledge}
                  </div>
                  <div className="text-[10px] text-purple-900 font-medium">
                    Low Confidence + Correct
                  </div>
                </div>
                <div className="text-[10px] font-bold text-purple-800 bg-purple-200/60 px-1.5 py-0.5 rounded text-center">
                  🎲 Fragile Knowledge
                </div>
              </div>

              {/* Q4: High Confidence Correct */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Solid Mastery
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="my-2">
                  <div className="text-xl font-black text-emerald-700">
                    {metacognitiveStats.solidMastery}
                  </div>
                  <div className="text-[10px] text-emerald-900 font-medium">
                    High Confidence + Correct
                  </div>
                </div>
                <div className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-1.5 py-0.5 rounded text-center">
                  ✅ Exam Ready
                </div>
              </div>
            </div>

            {/* Quick Diagnostic Test Callout */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate('diagnostic')}
                className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Take 5-Question Diagnostic Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
