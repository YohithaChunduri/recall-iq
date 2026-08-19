import React, { useState } from 'react';
import {
  Flame,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';

export const RevisionPlanView: React.FC = () => {
  const {
    subjectConfig,
    revisionPlan,
    openDebunkModal,
    openRetestModal,
    openRevisionModal,
    misconceptions
  } = useRevision();

  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const filteredItems = revisionPlan.filter((item) => {
    if (filterPriority === 'ALL') return true;
    return item.priority === filterPriority;
  });

  const highPriorityCount = revisionPlan.filter((i) => i.priority === 'HIGH').length;
  const mediumPriorityCount = revisionPlan.filter((i) => i.priority === 'MEDIUM').length;
  const lowPriorityCount = revisionPlan.filter((i) => i.priority === 'LOW').length;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-[11px] rounded-full uppercase tracking-wider">
              Exam-Adaptive Agenda
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Allocated for {subjectConfig.totalAvailableMinutes} Minutes
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Dynamic Revision Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Prioritized by your knowledge gaps, high-confidence misconceptions, and recurrence in past 5 years' papers.
          </p>
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto text-xs font-bold">
          <button
            onClick={() => setFilterPriority('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({revisionPlan.length})
          </button>
          <button
            onClick={() => setFilterPriority('HIGH')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              filterPriority === 'HIGH'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>High ({highPriorityCount})</span>
          </button>
          <button
            onClick={() => setFilterPriority('MEDIUM')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'MEDIUM'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            Medium ({mediumPriorityCount})
          </button>
          <button
            onClick={() => setFilterPriority('LOW')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterPriority === 'LOW'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Low ({lowPriorityCount})
          </button>
        </div>
      </div>

      {/* Time Allocation Summary Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-slate-300 font-medium">Total Revision Budget</div>
            <div className="text-lg font-black text-white">
              {subjectConfig.totalAvailableMinutes} Minutes Available
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">High: <strong>{revisionPlan.filter(i => i.priority === 'HIGH').reduce((a,c) => a + c.allocatedMinutes, 0)}m</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Medium: <strong>{revisionPlan.filter(i => i.priority === 'MEDIUM').reduce((a,c) => a + c.allocatedMinutes, 0)}m</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Low: <strong>{revisionPlan.filter(i => i.priority === 'LOW').reduce((a,c) => a + c.allocatedMinutes, 0)}m</strong></span>
          </div>
        </div>
      </div>

      {/* Revision Plan Cards */}
      <div className="space-y-3.5">
        {filteredItems.map((item) => {
          const isHighPriority = item.priority === 'HIGH';
          const isMediumPriority = item.priority === 'MEDIUM';

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-5 transition-all shadow-xs ${
                item.hasMisconception
                  ? 'border-rose-300 bg-rose-50/20'
                  : isHighPriority
                  ? 'border-rose-200'
                  : isMediumPriority
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left side info */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Priority Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        isHighPriority
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isMediumPriority
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isHighPriority && <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />}
                      <span>
                        {isHighPriority
                          ? '🔥 High Priority'
                          : isMediumPriority
                          ? '🟡 Medium Priority'
                          : '🟢 Low Priority'}
                      </span>
                    </span>

                    {/* Misconception flag */}
                    {item.hasMisconception && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>90% Confidence Trap</span>
                      </span>
                    )}

                    {/* Time budget */}
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.allocatedMinutes} mins</span>
                    </span>

                    {/* Module */}
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      {item.topicName}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {item.conceptName}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.reason}
                  </p>

                  {/* Mastery mini-bar */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs font-semibold text-slate-500">Mastery:</span>
                    <div className="w-36 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.masteryPercentage < 50
                            ? 'bg-rose-500'
                            : item.masteryPercentage < 75
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.masteryPercentage}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        item.masteryPercentage < 50
                          ? 'text-rose-600'
                          : item.masteryPercentage < 75
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {item.masteryPercentage}%
                    </span>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-shrink-0">
                  <button
                    onClick={() => openRevisionModal(item.conceptId)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Review Rules</span>
                  </button>

                  {item.hasMisconception ? (
                    <button
                      onClick={() => {
                        const misc = misconceptions.find((m) => m.conceptId === item.conceptId);
                        if (misc) openDebunkModal(misc.id);
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Debunk Trap</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openRetestModal(item.conceptId)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Take Re-Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
