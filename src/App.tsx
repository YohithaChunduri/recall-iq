import React, { useState } from 'react';
import { RevisionProvider } from './context/RevisionContext';
import { Navbar } from './components/layout/Navbar';
import type { ActivePage } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { DiagnosticQuiz } from './components/quiz/DiagnosticQuiz';
import { RevisionPlanView } from './components/revision/RevisionPlanView';
import { KnowledgeMapView } from './components/map/KnowledgeMapView';
import { UploadMaterialsView } from './components/upload/UploadMaterialsView';
import { ProgressHistoryView } from './components/history/ProgressHistoryView';
import { LandingPageView } from './components/landing/LandingPageView';
import { MisconceptionDebunkModal } from './components/modals/MisconceptionDebunkModal';
import { TargetedRetestModal } from './components/modals/TargetedRetestModal';
import { TopicRevisionModal } from './components/modals/TopicRevisionModal';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<ActivePage>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header */}
      <Navbar currentPage={currentPage} onSelectPage={setCurrentPage} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentPage === 'dashboard' && <DashboardView onNavigate={setCurrentPage} />}
        {currentPage === 'diagnostic' && <DiagnosticQuiz onNavigate={setCurrentPage} />}
        {currentPage === 'revision-plan' && <RevisionPlanView />}
        {currentPage === 'knowledge-map' && <KnowledgeMapView />}
        {currentPage === 'upload' && <UploadMaterialsView onNavigate={setCurrentPage} />}
        {currentPage === 'history' && <ProgressHistoryView />}
        {currentPage === 'landing' && <LandingPageView onNavigate={setCurrentPage} />}
      </main>

      {/* Global Interactive Modals for Adaptive Loop */}
      <MisconceptionDebunkModal />
      <TargetedRetestModal />
      <TopicRevisionModal />

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-[10px]">
              R
            </div>
            <span className="font-bold text-slate-900">RecallIQ</span>
            <span className="text-slate-400">— AI Metacognitive Exam Revision Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Data Structures & Algorithms (DSA Demo Mode)</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Modular AI Layer (Gemini-Ready)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RevisionProvider>
      <AppContent />
    </RevisionProvider>
  );
}
