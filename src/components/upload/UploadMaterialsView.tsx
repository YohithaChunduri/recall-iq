import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  FileCode,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  RefreshCw,
  UploadCloud,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';
import { aiService } from '../../services/aiService';
import type { ActivePage } from '../layout/Navbar';
import type { ConceptExtractionResult } from '../../services/aiService';

interface UploadMaterialsViewProps {
  onNavigate: (page: ActivePage) => void;
}

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: 'syllabus' | 'notes' | 'pyq';
  categoryLabel: string;
  uploadTime: string;
}

export const UploadMaterialsView: React.FC<UploadMaterialsViewProps> = ({ onNavigate }) => {
  const { subjectConfig, loadExtractedCourseData, resetCurrentSubjectDemo } = useRevision();

  const [subjectName, setSubjectName] = useState(subjectConfig.name);
  const [examDate, setExamDate] = useState(subjectConfig.examDateText);
  const [studyMinutes, setStudyMinutes] = useState(subjectConfig.totalAvailableMinutes);

  // Sync state when subjectConfig changes
  useEffect(() => {
    setSubjectName(subjectConfig.name);
    setExamDate(subjectConfig.examDateText);
    setStudyMinutes(subjectConfig.totalAvailableMinutes);
  }, [subjectConfig]);

  // Initial demo files based on current subject
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([
    {
      id: 'f-1',
      name: `${subjectConfig.name.replace(/\s+/g, '_')}_Lecture_Notes_2026.pdf`,
      size: '2.8 MB',
      type: 'notes',
      categoryLabel: 'Lecture Notes',
      uploadTime: 'Just now'
    },
    {
      id: 'f-2',
      name: `${subjectConfig.name.replace(/\s+/g, '_')}_Official_Syllabus.pdf`,
      size: '1.2 MB',
      type: 'syllabus',
      categoryLabel: 'Syllabus',
      uploadTime: 'Just now'
    },
    {
      id: 'f-3',
      name: `University_Last_5_Years_PYQs_${subjectConfig.code || 'EXAM'}.pdf`,
      size: '3.4 MB',
      type: 'pyq',
      categoryLabel: 'Past Papers',
      uploadTime: 'Just now'
    }
  ]);

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStage, setExtractionStage] = useState<string>('');
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [extractedSummary, setExtractedSummary] = useState<ConceptExtractionResult | null>(null);
  const [dragActiveCategory, setDragActiveCategory] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // File input refs for each dropzone
  const notesInputRef = useRef<HTMLInputElement>(null);
  const syllabusInputRef = useRef<HTMLInputElement>(null);
  const pyqInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'syllabus' | 'notes' | 'pyq',
    categoryLabel: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedFileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newItems.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: formatFileSize(file.size),
        type: type,
        categoryLabel: categoryLabel,
        uploadTime: 'Just now'
      });
    }

    setUploadedFiles((prev) => [...prev, ...newItems]);
    setSuccessMessage(`Attached ${newItems.length} file(s) to ${categoryLabel}!`);
    setTimeout(() => setSuccessMessage(null), 3500);

    // Reset file input value
    e.target.value = '';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: 'syllabus' | 'notes' | 'pyq',
    categoryLabel: string
  ) => {
    e.preventDefault();
    setDragActiveCategory(null);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedFileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newItems.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: formatFileSize(file.size),
        type: type,
        categoryLabel: categoryLabel,
        uploadTime: 'Just now'
      });
    }

    setUploadedFiles((prev) => [...prev, ...newItems]);
    setSuccessMessage(`Uploaded ${newItems.length} file(s) into ${categoryLabel}!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddSampleFiles = () => {
    const sample: UploadedFileItem = {
      id: `sample-${Date.now()}`,
      name: `${subjectConfig.name.replace(/\s+/g, '_')}_Revision_Notes.pdf`,
      size: '2.1 MB',
      type: 'notes',
      categoryLabel: 'Lecture Notes',
      uploadTime: 'Just now'
    };
    setUploadedFiles((prev) => [...prev, sample]);
    setSuccessMessage('Added sample study material!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRunAIExtraction = async () => {
    if (uploadedFiles.length === 0) {
      setSuccessMessage('Please attach at least one notes or syllabus file before running extraction.');
      return;
    }

    setIsExtracting(true);
    setExtractionComplete(false);
    setExtractedSummary(null);

    // Simulated multi-stage AI pipeline
    setExtractionStage('Scanning document headings, theorems, and code patterns...');
    await new Promise((r) => setTimeout(r, 600));

    setExtractionStage('Cross-referencing recurring exam questions from past papers (PYQs)...');
    await new Promise((r) => setTimeout(r, 600));

    setExtractionStage('Synthesizing concept frequency weights & building adaptive revision model...');

    try {
      const result = await aiService.extractConceptsFromDocument(
        uploadedFiles[0]?.name || `${subjectConfig.name}_Notes.pdf`,
        'syllabus',
        subjectName
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

    const newTopics = extractedSummary.topics.map((t, idx) => ({
      id: `topic-ext-${Date.now()}-${idx}`,
      name: t.name,
      iconName: 'Grid',
      masteryPercentage: 40,
      examRelevance: t.examRelevance,
      totalExamQuestionsAppeared: 15,
      priority: 'HIGH' as const,
      colorClass: 'indigo',
      concepts: t.concepts.map((c, cIdx) => ({
        id: `concept-ext-${Date.now()}-${idx}-${cIdx}`,
        topicId: `topic-ext-${Date.now()}-${idx}`,
        title: c.title,
        masteryPercentage: 35,
        examFrequencyWeight: c.examFrequencyWeight,
        estimatedMinutesToRevise: c.estimatedMinutes,
        description: c.description,
        keyRule: c.keyRule,
        commonPitfall: c.commonPitfall
      }))
    }));

    loadExtractedCourseData(
      subjectName,
      studyMinutes,
      newTopics,
      extractedSummary.generatedQuestions
    );

    onNavigate('diagnostic');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={notesInputRef}
        onChange={(e) => handleFileChange(e, 'notes', 'Lecture Notes')}
        multiple
        accept=".pdf,.pptx,.ppt,.docx,.doc,.txt,.md"
        className="hidden"
      />
      <input
        type="file"
        ref={syllabusInputRef}
        onChange={(e) => handleFileChange(e, 'syllabus', 'Syllabus')}
        multiple
        accept=".pdf,.docx,.doc,.txt,.md"
        className="hidden"
      />
      <input
        type="file"
        ref={pyqInputRef}
        onChange={(e) => handleFileChange(e, 'pyq', 'Past Papers')}
        multiple
        accept=".pdf,.docx,.doc,.txt,.md"
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[11px] rounded-full uppercase tracking-wider">
              {subjectConfig.name} Material Ingestion
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Upload {subjectConfig.name} Materials & Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Attach your lecture slides, textbooks, and past question papers (PYQs). RecallIQ extracts high-frequency exam concepts and weights them automatically.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={resetCurrentSubjectDemo}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Reset {subjectConfig.name} State
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold p-3.5 rounded-2xl flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* 3 Interactive Upload Dropzone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lecture Notes Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActiveCategory('notes'); }}
          onDragLeave={() => setDragActiveCategory(null)}
          onDrop={(e) => handleDrop(e, 'notes', 'Lecture Notes')}
          onClick={() => notesInputRef.current?.click()}
          className={`bg-white border-2 border-dashed rounded-3xl p-5 text-center transition-all cursor-pointer space-y-2 shadow-xs group ${
            dragActiveCategory === 'notes'
              ? 'border-indigo-600 bg-indigo-50/50 scale-[1.02]'
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="p-3 bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 rounded-2xl w-fit mx-auto transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-extrabold text-slate-900">{subjectConfig.name} Notes & Slides</h3>
          <p className="text-[11px] text-slate-400">Click or drag PDF, PPTX, TXT</p>
          <div className="pt-1">
            <button
              type="button"
              className="text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 transition-colors inline-flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>+ Choose Notes File</span>
            </button>
          </div>
        </div>

        {/* Syllabus Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActiveCategory('syllabus'); }}
          onDragLeave={() => setDragActiveCategory(null)}
          onDrop={(e) => handleDrop(e, 'syllabus', 'Syllabus')}
          onClick={() => syllabusInputRef.current?.click()}
          className={`bg-white border-2 border-dashed rounded-3xl p-5 text-center transition-all cursor-pointer space-y-2 shadow-xs group ${
            dragActiveCategory === 'syllabus'
              ? 'border-purple-600 bg-purple-50/50 scale-[1.02]'
              : 'border-slate-200 hover:border-purple-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="p-3 bg-purple-50 group-hover:bg-purple-100 text-purple-600 rounded-2xl w-fit mx-auto transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-extrabold text-slate-900">Official Exam Syllabus</h3>
          <p className="text-[11px] text-slate-400">Curriculum units & topics</p>
          <div className="pt-1">
            <button
              type="button"
              className="text-[11px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full border border-purple-200 transition-colors inline-flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>+ Choose Syllabus File</span>
            </button>
          </div>
        </div>

        {/* PYQs Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActiveCategory('pyq'); }}
          onDragLeave={() => setDragActiveCategory(null)}
          onDrop={(e) => handleDrop(e, 'pyq', 'Past Papers')}
          onClick={() => pyqInputRef.current?.click()}
          className={`bg-white border-2 border-dashed rounded-3xl p-5 text-center transition-all cursor-pointer space-y-2 shadow-xs group ${
            dragActiveCategory === 'pyq'
              ? 'border-amber-600 bg-amber-50/50 scale-[1.02]'
              : 'border-slate-200 hover:border-amber-400 hover:bg-slate-50/60'
          }`}
        >
          <div className="p-3 bg-amber-50 group-hover:bg-amber-100 text-amber-600 rounded-2xl w-fit mx-auto transition-colors">
            <FileCode className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-extrabold text-slate-900">Past Exam Papers (PYQs)</h3>
          <p className="text-[11px] text-slate-400">Used to weight exam frequency</p>
          <div className="pt-1">
            <button
              type="button"
              className="text-[11px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 transition-colors inline-flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>+ Choose PYQ File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attached Files List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Attached Study Materials ({uploadedFiles.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={handleAddSampleFiles}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>+ Add Sample Document</span>
          </button>
        </div>

        {uploadedFiles.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
            No files attached yet. Click on any box above or drag files to upload.
          </div>
        ) : (
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-indigo-600 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {file.size} • Category: <strong className="text-slate-600">{file.categoryLabel}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Ready</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(file.id)}
                    title="Remove file"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revision Parameters & AI Extraction Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>{subjectConfig.name} Revision Target Settings</span>
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
              Study Time Budget: <strong className="text-indigo-600">{studyMinutes} mins</strong>
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

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={isExtracting}
            onClick={handleRunAIExtraction}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Analyzing Document Structures & PYQs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Extraction & Build {subjectConfig.name} Revision Model</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Extraction in-progress stage indicator */}
        {isExtracting && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 font-semibold flex items-center gap-3 animate-fadeIn">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 flex-shrink-0" />
            <span>{extractionStage}</span>
          </div>
        )}
      </div>

      {/* Extraction Results Preview */}
      {extractionComplete && extractedSummary && (
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-lg space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="text-base font-black text-emerald-950">
                AI Concept Extraction Successful for {extractedSummary.subjectName}
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {extractedSummary.topics.length} Modules Extracted
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {extractedSummary.extractedSyllabusSummary}
          </p>

          {/* High-Frequency Exam Hotspots */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>🔥 Identified High-Yield Exam Hotspots (from PYQs):</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {extractedSummary.identifiedHotTopics.map((item: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs font-semibold bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl shadow-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Extracted Modules Breakdown */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Extracted Curriculum Modules:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extractedSummary.topics.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{t.name}</span>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {t.examRelevance}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {t.concepts.map((c, cIdx) => (
                      <span key={cIdx} className="text-[10px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {c.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>Applying will update your revision plan and load targeted diagnostic questions.</span>
            </div>

            <button
              type="button"
              onClick={handleApplyExtractedCourse}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply Extracted Syllabus & Take Diagnostic Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
