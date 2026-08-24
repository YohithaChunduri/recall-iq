import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Check,
  HelpCircle
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';
import type { ConfidenceLevel, QuestionOption } from '../../types';
import type { ActivePage } from '../layout/Navbar';

interface DiagnosticQuizProps {
  onNavigate: (page: ActivePage) => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({ onNavigate }) => {
  const { questions, handleQuestionAnswered, subjectConfig } = useRevision();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [isAnswerEvaluated, setIsAnswerEvaluated] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerEvaluated) return;
    setSelectedOption(idx);
    if (!confidence) {
      setConfidence('high'); // Default to high
    }
  };

  const handleSelectConfidence = (level: ConfidenceLevel) => {
    if (isAnswerEvaluated) return;
    setConfidence(level);
  };

  const handleEvaluateAnswer = async () => {
    if (!currentQ || selectedOption === null || !confidence || isSubmitting) return;

    setIsSubmitting(true);
    const result = await handleQuestionAnswered(currentQ, selectedOption, confidence);
    setEvaluationResult(result);
    setIsAnswerEvaluated(true);
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setConfidence(null);
      setIsAnswerEvaluated(false);
      setEvaluationResult(null);
    } else {
      // Quiz complete, navigate to dashboard
      onNavigate('dashboard');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setConfidence(null);
    setIsAnswerEvaluated(false);
    setEvaluationResult(null);
  };

  if (!currentQ || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
        <HelpCircle className="w-12 h-12 mx-auto text-indigo-500" />
        <h2 className="text-xl font-bold text-slate-900">No Questions Available for {subjectConfig.name}</h2>
        <p className="text-xs text-slate-500">Upload notes or add syllabus topics to generate adaptive diagnostic questions.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Quiz Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[11px] rounded-full uppercase tracking-wider">
              {subjectConfig.name} Diagnostic Assessment
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Confidence & Misconception Tracker
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            Question {currentIndex + 1} of {questions.length}
          </h1>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-1.5">
          {questions.map((_, idx: number) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                currentIndex === idx
                  ? 'bg-indigo-600 text-white shadow-xs scale-105'
                  : idx < currentIndex
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {idx < currentIndex ? <Check className="w-3.5 h-3.5" /> : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              {currentQ.topicName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium">{currentQ.conceptName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg font-semibold">
            <span>🔥 Exam Recurrence:</span>
            <span>{currentQ.examFrequencyYears?.join(', ') || '2024'}</span>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-3">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.prompt}
          </p>

          {currentQ.codeSnippet && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select the most accurate answer:
          </div>
          {currentQ.options.map((opt: QuestionOption, optIdx: number) => {
            const isSelected = selectedOption === optIdx;
            const isCorrectOption = optIdx === currentQ.correctOptionIndex;

            let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-slate-50/50';

            if (isAnswerEvaluated) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500';
              } else if (isSelected) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500';
              } else {
                optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs ring-1 ring-indigo-500';
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswerEvaluated}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 ${optionStyle}`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
                    isAnswerEvaluated && isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : isAnswerEvaluated && isSelected
                      ? 'bg-rose-600 text-white'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Metacognitive Confidence Selector (Visible before evaluation) */}
        {!isAnswerEvaluated && selectedOption !== null && (
          <div className="bg-slate-50 border border-indigo-100 rounded-2xl p-5 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Rate your confidence level before submitting:
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                (Detects misconceptions vs lucky guesses)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectConfidence('high')}
                className={`p-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  confidence === 'high'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-2'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                <span className="text-sm">🟢 High Confidence</span>
                <span className="text-[10px] opacity-80 font-normal">I am 100% certain</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectConfidence('medium')}
                className={`p-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  confidence === 'medium'
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500 ring-offset-2'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50'
                }`}
              >
                <span className="text-sm">🟡 Medium Confidence</span>
                <span className="text-[10px] opacity-80 font-normal">Reasonably sure</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectConfidence('low')}
                className={`p-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  confidence === 'low'
                    ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-500 ring-offset-2'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50'
                }`}
              >
                <span className="text-sm">🟠 Low Confidence</span>
                <span className="text-[10px] opacity-80 font-normal">Educated guess</span>
              </button>
            </div>
          </div>
        )}

        {/* AI Answer Evaluation & Socratic Feedback Banner (Post submission) */}
        {isAnswerEvaluated && evaluationResult && (
          <div className="space-y-4 animate-fadeIn">
            <div
              className={`p-5 rounded-2xl border ${
                evaluationResult.misconceptionDetected
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950 misconception-glow'
                  : evaluationResult.isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {evaluationResult.misconceptionDetected ? (
                  <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                ) : evaluationResult.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                )}

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider">
                      {evaluationResult.feedback.verdict}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-medium">
                    {evaluationResult.feedback.correctMentalModel}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 bg-white/70 p-3 rounded-xl">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      🎯 Exam Golden Principle:
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {evaluationResult.feedback.examTrapWarning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleRestartQuiz}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Quiz</span>
          </button>

          <div className="flex items-center gap-3">
            {!isAnswerEvaluated ? (
              <button
                disabled={selectedOption === null || !confidence || isSubmitting}
                onClick={handleEvaluateAnswer}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit & AI Evaluate</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Revised Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
