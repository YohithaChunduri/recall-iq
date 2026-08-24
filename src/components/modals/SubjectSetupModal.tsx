import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  X,
  FileText,
  UploadCloud,
  Check,
  BookOpen,
  Clock,
  Trash2
} from 'lucide-react';
import { useRevision } from '../../context/RevisionContext';

export const SubjectSetupModal: React.FC = () => {
  const { activeModal, closeModal, addNewSubject, currentUser, subjects } = useRevision();

  const [subjectName, setSubjectName] = useState<string>('Data Structures & Algorithms');
  const [examDate, setExamDate] = useState<string>('Tomorrow, 9:00 AM');
  const [studyMinutes, setStudyMinutes] = useState<number>(120);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([
    { name: 'Subject_Comprehensive_Syllabus.pdf', size: '1.4 MB' }
  ]);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (activeModal.type !== 'subject_setup') return null;

  const isFirstTime = subjects.length === 0;

  const suggestionPills = [
    'Data Structures & Algorithms',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'Machine Learning',
    'Python Programming',
    'Compiler Design',
    'Digital Electronics',
    'Web Development'
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: { name: string; size: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      newFiles.push({
        name: files[i].name,
        size: formatFileSize(files[i].size)
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newFiles: { name: string; size: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      newFiles.push({
        name: files[i].name,
        size: formatFileSize(files[i].size)
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = subjectName.trim() || 'Custom Subject';
    addNewSubject(finalName, examDate, studyMinutes);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8 relative">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.pptx,.ppt,.docx,.doc,.txt,.md"
          className="hidden"
        />

        {/* Close button (only if not mandatory first time) */}
        {!isFirstTime && (
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-extrabold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFirstTime ? `Welcome, ${currentUser?.name || 'Student'} 👋` : 'Add New Exam Subject'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isFirstTime ? "What exam are you preparing for?" : "Set up a new exam revision model"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            Enter <strong>any subject or course name</strong>. RecallIQ will tailor all topics, misconception traps, and re-tests dynamically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Subject Name Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block flex items-center justify-between">
              <span>Enter Subject / Course Name:</span>
              <span className="text-[11px] text-slate-400 font-normal">Type anything you want</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Microprocessors 8086, Machine Learning, DBMS, Organic Chemistry"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs"
              />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quick Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestionPills.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setSubjectName(pill)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                      subjectName === pill
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exam Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Exam Date & Time</span>
              </label>
              <input
                type="text"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Study Time Budget: <strong className="text-indigo-600">{studyMinutes}m</strong></span>
              </label>
              <select
                value={studyMinutes}
                onChange={(e) => setStudyMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-indigo-600"
              >
                <option value={60}>1 Hour (Quick Cram)</option>
                <option value={120}>2 Hours (Recommended)</option>
                <option value={180}>3 Hours (Deep Review)</option>
                <option value={240}>4 Hours (Full Mastery)</option>
              </select>
            </div>
          </div>

          {/* Document / PDF Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
              <span>Upload Notes, Syllabus or Past Papers (PDF/Docs):</span>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </label>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-indigo-600 bg-indigo-50/60 scale-[1.01]'
                  : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                <UploadCloud className="w-5 h-5" />
                <span className="text-xs font-bold">Click to choose PDF / Slides / Notes</span>
              </div>
              <p className="text-[11px] text-slate-400">or drag and drop your course files here</p>
            </div>

            {/* Uploaded files preview list */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">({file.size})</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2"
            >
              <span>Build Revision Model for "{subjectName}"</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
