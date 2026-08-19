import React, { useState } from 'react';
import {
  FileText,
  FileCode,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';
import { aiService } from '../../services/aiService';
import type { ActivePage } from '../layout/Navbar';

interface UploadMaterialsViewProps {
  onNavigate: (page: ActivePage) => void;
}

export const UploadMaterialsView: React.FC<UploadMaterialsViewProps> = ({ onNavigate }) => {
  const { loadExtractedCourseData, resetToDefaultDSA } = useRevision();

  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms (DSA)');
  const [examDate, setExamDate] = useState('Tomorrow, 9:00 AM');
  const [studyMinutes, setStudyMinutes] = useState(120);
  const [uploadedFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: 'DSA_Comprehensive_Syllabus_2026.pdf', size: '1.4 MB', type: 'syllabus' },
    { name: 'Binary_Search_Graphs_Notes.pdf', size: '3.9 MB', type: 'notes' },
    { name: 'University_DSA_Last_5_Years_PYQs.pdf', size: '2.5 MB', type: 'pyq' }
  ]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [extractedSummary, setExtractedSummary] = useState<any>(null);

  const handleSimulateExtraction = async () => {
    setIsExtracting(true);
    setExtractionComplete(false);

    try {
      const result = await aiService.extractConceptsFromDocument(
        uploadedFiles[0]?.name || 'DSA_Notes.pdf',
        'syllabus'
      );
      setExtractedSummary(result);
      setIsExtracting(false);
      setExtractionComplete(true);
    } catch {
      setIsExtracting(false);
    }
  };

  const handleApplyExtractedCourse = () => {
    if (!extractedSummary) return;

    const newTopics = extractedSummary.topics.map((t: any, idx: number) => ({
      id: `topic-ext-${idx}`,
      name: t.name,
      iconName: 'Grid',
      masteryPercentage: 35, // New course initial baseline
      examRelevance: t.examRelevance,
      totalExamQuestionsAppeared: 12,
      priority: 'HIGH' as const,
      colorClass: 'indigo',
      concepts: t.concepts.map((c: any, cIdx: number) => ({
        id: `concept-ext-${idx}-${cIdx}`,
        topicId: `topic-ext-${idx}`,
        title: c.title,
        masteryPercentage: 30,
        examFrequencyWeight: c.examFrequencyWeight,
        estimatedMinutesToRevise: c.estimatedMinutes,
        description: c.description,
        keyRule: c.keyRule,
        commonPitfall: c.commonPitfall
      }))
    }));

    loadExtractedCourseData(subjectName, studyMinutes, newTopics);
    onNavigate('diagnostic');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[11px] rounded-full uppercase tracking-wider">
              Material Ingestion & Concept Extraction
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Upload Exam Materials & Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            RecallIQ analyzes your lecture slides, notes, and past question papers (PYQs) to extract high-frequency algorithmic patterns.
          </p>
        </div>

        <button
          onClick={resetToDefaultDSA}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors self-start md:self-auto"
        >
          Reset Default DSA Demo
        </button>
      </div>

      {/* Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lecture Notes */}
        <div className="bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-5 text-center transition-all cursor-pointer space-y-2">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Lecture Slides & Code Notes</h3>
          <p className="text-[11px] text-slate-400">PDF, PPTX, TXT up to 50MB</p>
          <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            1 File Added
          </span>
        </div>

        {/* Syllabus */}
        <div className="bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-5 text-center transition-all cursor-pointer space-y-2">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Official DSA Syllabus</h3>
          <p className="text-[11px] text-slate-400">Curriculum units & topics</p>
          <span className="inline-block text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
            1 File Added
          </span>
        </div>

        {/* PYQs */}
        <div className="bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-5 text-center transition-all cursor-pointer space-y-2">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mx-auto">
            <FileCode className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Past Exam Papers (PYQs)</h3>
          <p className="text-[11px] text-slate-400">Used to weight exam frequency</p>
          <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
            1 File Added
          </span>
        </div>
      </div>

      {/* Exam Details Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Exam & Time Configuration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Exam Date / Countdown</label>
            <input
              type="text"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Available Revision Time: <strong className="text-indigo-600">{studyMinutes} mins</strong>
            </label>
            <input
              type="range"
              min={30}
              max={300}
              step={15}
              value={studyMinutes}
              onChange={(e) => setStudyMinutes(Number(e.target.value))}
              className="w-full mt-2 accent-indigo-600"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            disabled={isExtracting}
            onClick={handleSimulateExtraction}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Extracting Patterns & Weighting PYQs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Extraction & Build Revision Model</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extraction Results Preview */}
      {extractionComplete && extractedSummary && (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
              AI Concept Extraction Successful
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {extractedSummary.extractedSyllabusSummary}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900">
              🔥 Identified High-Yield Exam Hotspots (from PYQs):
            </div>
            <div className="flex flex-wrap gap-2">
              {extractedSummary.identifiedHotTopics.map((item: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 px-3 py-1 rounded-lg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleApplyExtractedCourse}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <span>Load Course & Start Diagnostic Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
