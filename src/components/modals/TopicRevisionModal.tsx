import React from 'react';
import { BookOpen, Sparkles, AlertCircle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';

export const TopicRevisionModal: React.FC = () => {
  const { activeModal, closeModal, openRetestModal, topics } = useRevision();

  if (activeModal.type !== 'revision' || !activeModal.conceptId) {
    return null;
  }

  const conceptId = activeModal.conceptId;
  const topic = topics.find((t) => t.concepts.some((c) => c.id === conceptId));
  const concept = topic?.concepts.find((c) => c.id === conceptId);

  if (!concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800">
                  Concept Micro-Module
                </span>
                <span className="text-xs text-slate-300">
                  {topic?.name}
                </span>
              </div>
              <h2 className="text-lg font-bold mt-1">
                {concept.title}
              </h2>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Concept Overview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Concept Summary
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">
              {concept.description}
            </p>
          </div>

          {/* Golden Rule */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Core Formula & Definition
            </div>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed bg-white/80 p-3 rounded-lg border border-emerald-100">
              {concept.keyRule}
            </p>
          </div>

          {/* Common Pitfall / Trap */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Common Exam Trap / Misconception
            </div>
            <p className="text-xs text-rose-950 font-medium leading-relaxed">
              {concept.commonPitfall}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Mastery</div>
              <div className={`text-base font-extrabold mt-0.5 ${
                concept.masteryPercentage < 50 ? 'text-rose-600' : concept.masteryPercentage < 75 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {concept.masteryPercentage}%
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Exam Recurrence</div>
              <div className="text-base font-extrabold text-indigo-600 mt-0.5">
                {concept.examFrequencyWeight}/10 High
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Est. Revision</div>
              <div className="text-base font-extrabold text-slate-700 mt-0.5">
                {concept.estimatedMinutesToRevise} mins
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={() => openRetestModal(concept.id)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test My Mastery Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
