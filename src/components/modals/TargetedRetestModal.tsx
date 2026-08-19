import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, HelpCircle, Flame, Award, RefreshCw, X } from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';
import { aiService } from '../../services/aiService';
import type { Question, ConfidenceLevel } from '../../types';

export const TargetedRetestModal: React.FC = () => {
  const { activeModal, closeModal, completeTargetedRetest, topics } = useRevision();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [confidences, setConfidences] = useState<Record<number, ConfidenceLevel>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const conceptId = activeModal.conceptId;
  const misconceptionId = activeModal.misconceptionId;

  // Find relevant concept and topic
  const relevantTopic = topics.find((t) => t.concepts.some((c) => c.id === conceptId));
  const relevantConcept = relevantTopic?.concepts.find((c) => c.id === conceptId);

  useEffect(() => {
    if (activeModal.type === 'retest' && conceptId) {
      setIsLoading(true);
      setIsSubmitted(false);
      setSelectedOptions({});
      setConfidences({});
      setCurrentIndex(0);

      aiService.generateTargetedRetest(conceptId, misconceptionId).then((retestQuestions) => {
        setQuestions(retestQuestions);
        setIsLoading(false);
      });
    }
  }, [activeModal.type, conceptId, misconceptionId]);

  if (activeModal.type !== 'retest' || !conceptId) {
    return null;
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => ({ ...prev, [currentIndex]: index }));
    if (!confidences[currentIndex]) {
      setConfidences((prev) => ({ ...prev, [currentIndex]: 'high' }));
    }
  };

  const handleSelectConfidence = (level: ConfidenceLevel) => {
    if (isSubmitted) return;
    setConfidences((prev) => ({ ...prev, [currentIndex]: level }));
  };

  const allAnswered = questions.length > 0 && questions.every((_, idx) => selectedOptions[idx] !== undefined);

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / questions.length) * 100);
  };

  const handleSubmitRetest = () => {
    setIsSubmitted(true);
  };

  const handleFinishAndApplyMastery = () => {
    const score = calculateScore();
    completeTargetedRetest(conceptId, score, misconceptionId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Targeted Adaptive Re-Test
                </span>
                <span className="text-xs text-indigo-100 font-medium">
                  {relevantTopic?.name}
                </span>
              </div>
              <h2 className="text-lg font-bold mt-1">
                {relevantConcept?.title || 'Concept Mastery Check'}
              </h2>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">AI is generating targeted questions for your exact gap...</p>
            </div>
          ) : isSubmitted ? (
            /* Results View */
            <div className="space-y-6 animate-fadeIn text-center py-4">
              <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                <Award className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {calculateScore() >= 80 ? '🎉 Misconception Successfully Debunked!' : 'Partial Mastery Progress'}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  You scored <strong className="text-indigo-600">{calculateScore()}%</strong> on this targeted verification test.
                </p>
              </div>

              {/* Dynamic Mastery Jump Indicator */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 max-w-lg mx-auto text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                    Mastery Calibration Update
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    +{calculateScore() >= 80 ? '36%' : '15%'} Mastery Gain
                  </span>
                </div>
                <div className="flex items-center gap-4 my-2">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-semibold">Previous</div>
                    <div className="text-lg font-bold text-rose-500">
                      {relevantConcept?.masteryPercentage || 42}%
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-400" />
                  <div className="text-center">
                    <div className="text-xs text-slate-400 font-semibold">New Mastery</div>
                    <div className="text-2xl font-extrabold text-emerald-600">
                      {calculateScore() >= 80 ? '88%' : '65%'}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-indigo-900 font-medium mt-3 bg-white/70 p-2.5 rounded-lg border border-indigo-100">
                  ✅ <strong>AI Update:</strong> High-confidence misconception marked as RESOLVED. Revision schedule has automatically shifted this topic down to lower priority.
                </p>
              </div>

              {/* Review Answers */}
              <div className="text-left space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Breakdown
                </h4>
                {questions.map((q, idx) => {
                  const userChoice = selectedOptions[idx];
                  const isCorrect = userChoice === q.correctOptionIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-xl border text-xs ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/70 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{q.prompt}</p>
                          <p className="mt-1 text-slate-700">
                            <strong>Key Takeaway:</strong> {q.corePrinciple}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : currentQ ? (
            /* Active Question View */
            <div className="space-y-5">
              {/* Question Progress & Navigation */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span className="font-semibold">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-1">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                        currentIndex === idx
                          ? 'bg-indigo-600 text-white'
                          : selectedOptions[idx] !== undefined
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Prompt */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Answer
                </p>
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedOptions[currentIndex] === optIdx;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-sm ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Metacognitive Confidence Selector */}
              {selectedOptions[currentIndex] !== undefined && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 animate-fadeIn space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>How confident are you in this choice?</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectConfidence('high')}
                      className={`p-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        confidences[currentIndex] === 'high'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span>🟢 High</span>
                      <span className="text-[10px] font-normal opacity-90">100% Sure</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectConfidence('medium')}
                      className={`p-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        confidences[currentIndex] === 'medium'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <span>🟡 Medium</span>
                      <span className="text-[10px] font-normal opacity-90">Pretty Sure</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectConfidence('low')}
                      className={`p-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                        confidences[currentIndex] === 'low'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <span>🟠 Low</span>
                      <span className="text-[10px] font-normal opacity-90">Educated Guess</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          {isSubmitted ? (
            <button
              onClick={handleFinishAndApplyMastery}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Apply Mastery Update & Return to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  disabled={selectedOptions[currentIndex] === undefined}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={!allAnswered}
                  onClick={handleSubmitRetest}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>Submit & Verify Mastery</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
