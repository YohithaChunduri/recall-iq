import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';

export const ProgressHistoryView: React.FC = () => {
  const { attempts, misconceptions, topics, overallMastery, metacognitiveStats, subjectConfig } = useRevision();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredAttempts = attempts.filter((att) => {
    if (filterCategory === 'ALL') return true;
    return att.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[11px] rounded-full uppercase tracking-wider">
              {subjectConfig.name} Progress & Analytics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Revision Progress & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Detailed log of diagnostic questions, targeted re-tests, and calibration accuracy for <strong>{subjectConfig.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Attempts</div>
            <div className="text-base font-black text-slate-900">{attempts.length}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Mastery</div>
            <div className="text-base font-black text-emerald-600">{overallMastery}%</div>
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metacognitive Calibration Accuracy */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Calibration Accuracy
            </span>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">
              {metacognitiveStats.calibrationScore}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Confidence alignment</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Measures how accurately your subjective confidence matches objective exam reality. Higher scores reduce dangerous exam surprises.
          </p>
        </div>

        {/* Misconception Remediation Rate */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Misconception Remediation
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">
              {misconceptions.filter(m => m.isResolved).length} / {misconceptions.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Traps resolved</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            High-confidence mistakes that you successfully debunked with targeted follow-up questions.
          </p>
        </div>

        {/* Study Time Efficiency */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Revision Efficiency
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              3.2x
            </span>
            <span className="text-xs text-slate-500 font-medium">Speed vs passive reading</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            By focusing exclusively on what you don't know rather than re-reading already mastered topics in {subjectConfig.name}, you save ~65% of cram time.
          </p>
        </div>
      </div>

      {/* Attempt History Log */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Questions & Re-Tests Log</span>
          </h3>

          {/* Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterCategory === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({attempts.length})
            </button>
            <button
              onClick={() => setFilterCategory('MISCONCEPTION')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterCategory === 'MISCONCEPTION' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              Misconceptions
            </button>
            <button
              onClick={() => setFilterCategory('KNOWLEDGE_GAP')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterCategory === 'KNOWLEDGE_GAP' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Gaps
            </button>
            <button
              onClick={() => setFilterCategory('SOLID_MASTERY')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterCategory === 'SOLID_MASTERY' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Solid
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {filteredAttempts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No attempts logged yet for {subjectConfig.name}. Take the diagnostic quiz to populate your history!
            </div>
          ) : (
            filteredAttempts.map((attempt) => {
              const matchedTopic = topics.find((t) => t.id === attempt.topicId);
              const matchedConcept = matchedTopic?.concepts.find((c) => c.id === attempt.conceptId);

              return (
                <div
                  key={attempt.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    {attempt.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {matchedConcept?.title || 'Concept Attempt'}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{matchedTopic?.name || subjectConfig.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Selected Option {String.fromCharCode(65 + attempt.selectedOptionIndex)} • Confidence:{' '}
                        <strong className="capitalize">{attempt.confidence}</strong> ({attempt.timeSpentSeconds}s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                        attempt.category === 'MISCONCEPTION'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : attempt.category === 'KNOWLEDGE_GAP'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : attempt.category === 'FRAGILE_KNOWLEDGE'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {attempt.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
