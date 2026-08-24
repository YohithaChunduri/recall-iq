import React, { useState } from 'react';
import { RevisionProvider, useRevision } from './context/RevisionContext';
import { AuthView } from './components/auth/AuthView';
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
import { SubjectSetupModal } from './components/modals/SubjectSetupModal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, subjectConfig, currentUser } = useRevision();
  const [currentPage, setCurrentPage] = useState<ActivePage>('dashboard');

  // Protected route check: If user is not authenticated, render AuthView
  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Global Navigation Header with Subject Switcher, Dark Mode & Profile */}
      <Navbar currentPage={currentPage} onSelectPage={setCurrentPage} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-16 lg:pb-6">
        {currentPage === 'dashboard' && <DashboardView onNavigate={setCurrentPage} />}
        {currentPage === 'diagnostic' && <DiagnosticQuiz onNavigate={setCurrentPage} />}
        {currentPage === 'revision-plan' && <RevisionPlanView />}
        {currentPage === 'knowledge-map' && <KnowledgeMapView />}
        {currentPage === 'upload' && <UploadMaterialsView onNavigate={setCurrentPage} />}
        {currentPage === 'history' && <ProgressHistoryView />}
        {currentPage === 'landing' && <LandingPageView onNavigate={setCurrentPage} />}
      </main>

      {/* Global Interactive Modals for Adaptive Loop & Onboarding */}
      <SubjectSetupModal />
      <MisconceptionDebunkModal />
      <TargetedRetestModal />
      <TopicRevisionModal />

      {/* Modern Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-[10px]">
              R
            </div>
            <span className="font-bold text-slate-900 dark:text-white">RecallIQ</span>
            <span className="text-slate-400 dark:text-slate-500">— AI Metacognitive Exam Revision Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <span>Signed in as <strong className="text-slate-700 dark:text-slate-300">{currentUser?.name}</strong></span>
            <span>•</span>
            <span>Active: <strong className="text-slate-700 dark:text-slate-300">{subjectConfig.name}</strong></span>
            <span>•</span>
            <span>Modular AI Layer</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RevisionProvider>
      <MainAppContent />
    </RevisionProvider>
  );
}
