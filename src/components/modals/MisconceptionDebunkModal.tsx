import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles, X } from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';

export const MisconceptionDebunkModal: React.FC = () => {
  const { activeModal, misconceptions, closeModal, openRetestModal } = useRevision();

  if (activeModal.type !== 'debunk' || !activeModal.misconceptionId) {
    return null;
  }

  const misconception = misconceptions.find((m) => m.id === activeModal.misconceptionId);
  if (!misconception) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  High-Confidence Misconception
                </span>
                <span className="text-xs font-semibold text-rose-600">
                  {misconception.confidencePercentage}% Confidence Mistake
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {misconception.conceptTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-rose-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Question Context */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Exam Question Context
            </p>
            <p className="font-medium text-slate-900 text-sm">{misconception.questionPrompt}</p>
          </div>

          {/* Contrast Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs mb-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                Your Selected Answer ({misconception.confidencePercentage}% Sure)
              </div>
              <p className="text-xs text-rose-950 font-medium leading-relaxed">
                "{misconception.studentAnswerText}"
              </p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                The Actual Exam Rule (Correct)
              </div>
              <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                "{misconception.correctAnswerText}"
              </p>
            </div>
          </div>

          {/* AI Root Cause Socratic Analysis */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Why this mental trap caught you
            </div>
            <p className="text-xs text-amber-950 leading-relaxed mb-2">
              {misconception.underlyingMisconception}
            </p>
            <p className="text-xs text-amber-900/80 italic">
              <strong>Context:</strong> {misconception.whyStudentWasConfident}
            </p>
          </div>

          {/* Counter-Example / Golden Rule */}
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Counter-Example to Remember in Exam
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed mb-3">
              {misconception.counterExample}
            </p>
            <div className="bg-indigo-600 text-white p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
              <span>🎯 Golden Rule:</span>
              <span>{misconception.clarifiedRule}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Review Later
          </button>
          <button
            onClick={() => openRetestModal(misconception.conceptId, misconception.id)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Take 2-Min Targeted Re-test Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
