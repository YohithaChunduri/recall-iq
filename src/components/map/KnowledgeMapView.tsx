import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Network,
  Search,
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
import type { Concept, Topic } from '../../types';

export const KnowledgeMapView: React.FC = () => {
  const { topics, misconceptions, openDebunkModal, openRetestModal, openRevisionModal } = useRevision();
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const activeMisconceptionConceptIds = new Set(
    misconceptions.filter((m) => !m.isResolved).map((m) => m.conceptId)
  );

  const handleSelectConcept = (topic: Topic, concept: Concept) => {
    setSelectedTopic(topic);
    setSelectedConcept(concept);
  };

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
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[11px] rounded-full uppercase tracking-wider">
              Metacognitive Concept Map
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Visual Weakness & Mastery Grid
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Knowledge & Blindspot Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click any concept node to inspect active misconceptions, recurrence rates, and launch targeted re-tests.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600">&lt;50% Weak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">50-75% Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">&gt;75% Strong</span>
          </div>
        </div>
      </div>

      {/* Grid: Concept Nodes Map + Side Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Modules (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between">
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
                    <h3 className="text-base font-bold text-slate-900">{topic.name}</h3>
                    <p className="text-xs text-slate-500">
                      Topic Mastery: <strong className={
                        topic.masteryPercentage < 50 ? 'text-rose-600' : topic.masteryPercentage < 75 ? 'text-amber-600' : 'text-emerald-600'
                      }>{topic.masteryPercentage}%</strong> • {topic.examRelevance} Exam Relevance
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  topic.masteryPercentage < 50
                    ? 'bg-rose-100 text-rose-800'
                    : topic.masteryPercentage < 75
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {topic.masteryPercentage}%
                </span>
              </div>

              {/* Concepts Grid / Tree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {topic.concepts.map((concept) => {
                  const hasMisc = activeMisconceptionConceptIds.has(concept.id);
                  const isSelected = selectedConcept?.id === concept.id;

                  return (
                    <div
                      key={concept.id}
                      onClick={() => handleSelectConcept(topic, concept)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-indigo-600 border-indigo-600 shadow-md bg-indigo-50/40'
                          : hasMisc
                          ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
                          : concept.masteryPercentage < 50
                          ? 'border-rose-200 bg-white hover:border-rose-300'
                          : concept.masteryPercentage < 75
                          ? 'border-amber-200 bg-white hover:border-amber-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {hasMisc && (
                              <span className="p-1 bg-rose-600 text-white rounded-md flex-shrink-0" title="High-confidence misconception active">
                                <AlertTriangle className="w-3 h-3" />
                              </span>
                            )}
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {concept.title}
                            </h4>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {concept.description}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span
                            className={`text-xs font-black px-2 py-0.5 rounded-full ${
                              concept.masteryPercentage < 50
                                ? 'bg-rose-100 text-rose-700'
                                : concept.masteryPercentage < 75
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {concept.masteryPercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            concept.masteryPercentage < 50
                              ? 'bg-rose-500'
                              : concept.masteryPercentage < 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${concept.masteryPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Selected Node Inspection Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-20 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            {selectedConcept ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Node Deep-Dive
                  </span>
                  <span className="text-xs text-slate-400">{selectedTopic?.name}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {selectedConcept.title}
                </h3>

                {/* Status Badges */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Mastery</div>
                    <div className={`text-base font-black ${
                      selectedConcept.masteryPercentage < 50 ? 'text-rose-600' : selectedConcept.masteryPercentage < 75 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {selectedConcept.masteryPercentage}%
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Exam Frequency</div>
                    <div className="text-base font-black text-indigo-600">
                      {selectedConcept.examFrequencyWeight}/10
                    </div>
                  </div>
                </div>

                {/* Golden Rule */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Golden Algorithmic Rule</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {selectedConcept.keyRule}
                  </p>
                </div>

                {/* Common Pitfall */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Common Exam Trap</span>
                  </div>
                  <p className="text-xs text-rose-950 font-medium leading-relaxed">
                    {selectedConcept.commonPitfall}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  {activeMisconceptionConceptIds.has(selectedConcept.id) ? (
                    <button
                      onClick={() => {
                        const misc = misconceptions.find((m) => m.conceptId === selectedConcept.id);
                        if (misc) openDebunkModal(misc.id);
                      }}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Debunk Misconception</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openRetestModal(selectedConcept.id)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Take 2-Min Targeted Retest</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => openRevisionModal(selectedConcept.id)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Concept Summary</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Network className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Select any concept node in the tree to inspect details and launch tests.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
