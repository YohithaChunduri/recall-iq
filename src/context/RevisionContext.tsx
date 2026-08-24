import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  User,
  SubjectData,
  Topic,
  Misconception,
  UserQuestionAttempt,
  RevisionPlanItem,
  Question,
  ConfidenceLevel,
  MetacognitiveCategory,
  SubjectConfig,
  PriorityLevel
} from '../types';
import {
  dsaSubjectPreset,
  dbmsSubjectPreset,
  generateCustomSubject
} from '../data/subjectPresets';
import {
  generateAdaptiveRevisionPlan,
  getNextRecommendedTopic,
  calculateMetacognitiveBreakdown,
  recalculateMastery
} from '../utils/adaptiveEngine';
import { aiService } from '../services/aiService';

interface ModalState {
  type: 'none' | 'debunk' | 'retest' | 'revision' | 'subject_setup';
  conceptId?: string;
  misconceptionId?: string;
  questionId?: string;
}

interface RevisionContextType {
  // Auth state
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;

  // Multi-Subject state
  subjects: SubjectData[];
  activeSubjectId: string;
  currentSubject: SubjectData;
  subjectConfig: SubjectConfig;
  switchSubject: (subjectId: string) => void;
  addNewSubject: (name: string, examDateText?: string, revisionMinutes?: number) => void;
  deleteSubject: (subjectId: string) => void;

  // Active Subject Derived data
  topics: Topic[];
  misconceptions: Misconception[];
  attempts: UserQuestionAttempt[];
  questions: Question[];
  revisionPlan: RevisionPlanItem[];
  nextRecommended: RevisionPlanItem | null;
  overallMastery: number;
  metacognitiveStats: ReturnType<typeof calculateMetacognitiveBreakdown>;
  activeModal: ModalState;

  // Modals & Navigation
  openDebunkModal: (misconceptionId: string) => void;
  openRetestModal: (conceptId: string, misconceptionId?: string) => void;
  openRevisionModal: (conceptId: string) => void;
  openSubjectSetupModal: () => void;
  closeModal: () => void;

  // Theme state
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Action Pipelines
  handleQuestionAnswered: (
    question: Question,
    selectedOptionIndex: number,
    confidence: ConfidenceLevel,
    timeSpentSeconds?: number
  ) => Promise<{
    isCorrect: boolean;
    category: MetacognitiveCategory;
    misconceptionDetected: boolean;
    feedback: any;
  }>;

  completeTargetedRetest: (
    conceptId: string,
    scorePercentage: number,
    misconceptionId?: string
  ) => void;

  updateAvailableMinutes: (newMinutes: number) => void;
  markPlanItemComplete: (planItemId: string) => void;
  resetCurrentSubjectDemo: () => void;
  loadExtractedCourseData: (courseName: string, minutes: number, topics: Topic[], newQuestions?: Question[]) => void;
}

const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

// Storage keys
const AUTH_USER_KEY = 'recalliq_auth_user';
const THEME_KEY = 'recalliq_theme';
const getSubjectsKey = (userId: string) => `recalliq_subjects_${userId}`;
const getActiveSubjectKey = (userId: string) => `recalliq_active_subj_${userId}`;

// Demo user definition
export const DEMO_USER: User = {
  id: 'user-yohitha-1',
  name: 'Yohitha',
  email: 'demo@recalliq.com'
};

export const RevisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // fallback
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 1. Auth state initialization
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      // Default to demo user for first run
      return DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  // 2. Multi-subject state initialization
  const [subjects, setSubjects] = useState<SubjectData[]>(() => {
    try {
      const userId = currentUser?.id || DEMO_USER.id;
      const saved = localStorage.getItem(getSubjectsKey(userId));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Default subjects for Yohitha
      return [dsaSubjectPreset, dbmsSubjectPreset];
    } catch {
      return [dsaSubjectPreset, dbmsSubjectPreset];
    }
  });

  const [activeSubjectId, setActiveSubjectId] = useState<string>(() => {
    try {
      const userId = currentUser?.id || DEMO_USER.id;
      const savedId = localStorage.getItem(getActiveSubjectKey(userId));
      if (savedId && subjects.some((s) => s.id === savedId)) {
        return savedId;
      }
      return subjects[0]?.id || dsaSubjectPreset.id;
    } catch {
      return subjects[0]?.id || dsaSubjectPreset.id;
    }
  });

  const [activeModal, setActiveModal] = useState<ModalState>({ type: 'none' });

  // Sync to localStorage on state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
      localStorage.setItem(getSubjectsKey(currentUser.id), JSON.stringify(subjects));
      localStorage.setItem(getActiveSubjectKey(currentUser.id), activeSubjectId);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [currentUser, subjects, activeSubjectId]);

  // Find currently active subject (with safe fallback)
  const currentSubject: SubjectData = useMemo(() => {
    const found = subjects.find((s) => s.id === activeSubjectId);
    return found || subjects[0] || dsaSubjectPreset;
  }, [subjects, activeSubjectId]);

  // Derived subjectConfig
  const subjectConfig: SubjectConfig = useMemo(() => {
    return {
      id: currentSubject.id,
      name: currentSubject.name,
      code: currentSubject.code,
      examDateText: currentSubject.examDateText,
      hoursUntilExam: currentSubject.hoursUntilExam,
      totalAvailableMinutes: currentSubject.totalAvailableMinutes,
      targetScore: currentSubject.targetScore,
      syllabusCoveredPercentage: currentSubject.syllabusCoveredPercentage
    };
  }, [currentSubject]);

  const topics = currentSubject.topics;
  const misconceptions = currentSubject.misconceptions;
  const attempts = currentSubject.attempts;
  const questions = currentSubject.questions;

  // 1. Dynamic Revision Plan for current subject
  const revisionPlan = useMemo(() => {
    return generateAdaptiveRevisionPlan(
      topics,
      misconceptions,
      attempts,
      currentSubject.totalAvailableMinutes
    );
  }, [topics, misconceptions, attempts, currentSubject.totalAvailableMinutes]);

  // 2. "Revise Now" AI recommendation for current subject
  const nextRecommended = useMemo(() => {
    return getNextRecommendedTopic(revisionPlan, misconceptions);
  }, [revisionPlan, misconceptions]);

  // 3. Overall aggregated mastery for current subject
  const overallMastery = useMemo(() => {
    if (topics.length === 0) return 0;
    const total = topics.reduce((acc, t) => acc + t.masteryPercentage, 0);
    return Math.round(total / topics.length);
  }, [topics]);

  // 4. Metacognitive calibration stats for current subject
  const metacognitiveStats = useMemo(() => {
    return calculateMetacognitiveBreakdown(attempts);
  }, [attempts]);

  // Helper to mutate and persist current subject in subjects list
  const updateCurrentSubject = (updater: (prevSubject: SubjectData) => SubjectData) => {
    setSubjects((prevSubjects) => {
      return prevSubjects.map((s) => {
        if (s.id === currentSubject.id) {
          return updater(s);
        }
        return s;
      });
    });
  };

  // Auth Handlers
  const login = (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || (cleanEmail === DEMO_USER.email ? DEMO_USER.name : email.split('@')[0]);
    const userId = `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const user: User = {
      id: userId,
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      email: cleanEmail
    };

    setCurrentUser(user);

    // Load or initialize user's subjects
    try {
      const saved = localStorage.getItem(getSubjectsKey(userId));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSubjects(parsed);
          setActiveSubjectId(parsed[0].id);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default starter subjects for new users
    const defaultSubs = [dsaSubjectPreset, dbmsSubjectPreset];
    setSubjects(defaultSubs);
    setActiveSubjectId(defaultSubs[0].id);
  };

  const signup = (name: string, email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || 'Student';
    const userId = `user-${Date.now()}`;

    const user: User = {
      id: userId,
      name: cleanName,
      email: cleanEmail
    };

    setCurrentUser(user);
    // Initialize with empty subjects so onboarding setup modal triggers
    setSubjects([]);
    setActiveSubjectId('');
    setActiveModal({ type: 'subject_setup' });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Multi-Subject Actions
  const switchSubject = (subjectId: string) => {
    const found = subjects.find((s) => s.id === subjectId);
    if (found) {
      setActiveSubjectId(subjectId);
    }
  };

  const addNewSubject = (name: string, examDateText: string = 'In 2 Days', revisionMinutes: number = 120) => {
    // Check if name matches preset or is custom
    const lower = name.toLowerCase();
    let newSub: SubjectData;

    if (lower.includes('dbms') || lower.includes('database')) {
      newSub = { ...dbmsSubjectPreset, id: `subj-dbms-${Date.now()}` };
    } else if (lower.includes('dsa') || lower.includes('algorithm') || lower.includes('data structure')) {
      newSub = { ...dsaSubjectPreset, id: `subj-dsa-${Date.now()}` };
    } else {
      newSub = generateCustomSubject(name, examDateText, revisionMinutes);
    }

    setSubjects((prev) => [...prev, newSub]);
    setActiveSubjectId(newSub.id);
    closeModal();
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects((prev) => {
      const remaining = prev.filter((s) => s.id !== subjectId);
      if (remaining.length > 0 && activeSubjectId === subjectId) {
        setActiveSubjectId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Modal Handlers
  const openDebunkModal = (misconceptionId: string) => {
    const misc = misconceptions.find((m) => m.id === misconceptionId);
    setActiveModal({
      type: 'debunk',
      misconceptionId,
      conceptId: misc?.conceptId
    });
  };

  const openRetestModal = (conceptId: string, misconceptionId?: string) => {
    setActiveModal({
      type: 'retest',
      conceptId,
      misconceptionId
    });
  };

  const openRevisionModal = (conceptId: string) => {
    setActiveModal({
      type: 'revision',
      conceptId
    });
  };

  const openSubjectSetupModal = () => {
    setActiveModal({ type: 'subject_setup' });
  };

  const closeModal = () => {
    setActiveModal({ type: 'none' });
  };

  // Main Question Answer Pipeline (Mutates ONLY Current Subject)
  const handleQuestionAnswered = async (
    question: Question,
    selectedOptionIndex: number,
    confidence: ConfidenceLevel,
    timeSpentSeconds: number = 30
  ) => {
    const evalResult = await aiService.evaluateAnswer(question, selectedOptionIndex, confidence);

    const newAttempt: UserQuestionAttempt = {
      id: `att-${Date.now()}`,
      questionId: question.id,
      topicId: question.topicId,
      conceptId: question.conceptId,
      selectedOptionIndex,
      confidence,
      isCorrect: evalResult.isCorrect,
      timestamp: new Date().toISOString(),
      category: evalResult.category,
      timeSpentSeconds
    };

    updateCurrentSubject((subj) => {
      const updatedAttempts = [newAttempt, ...subj.attempts];
      let updatedMisconceptions = subj.misconceptions;

      if (evalResult.misconceptionDetected && evalResult.misconceptionDetails) {
        updatedMisconceptions = [evalResult.misconceptionDetails, ...updatedMisconceptions];
      }

      const updatedTopics = subj.topics.map((topic) => {
        if (topic.id !== question.topicId) return topic;

        const updatedConcepts = topic.concepts.map((concept) => {
          if (concept.id !== question.conceptId) return concept;

          const delta = evalResult.isCorrect ? (confidence === 'high' ? 8 : 4) : (confidence === 'high' ? -12 : -6);
          const newMastery = recalculateMastery(concept.masteryPercentage, delta);

          return {
            ...concept,
            masteryPercentage: newMastery
          };
        });

        const avgMastery = Math.round(
          updatedConcepts.reduce((acc, c) => acc + c.masteryPercentage, 0) / (updatedConcepts.length || 1)
        );

        return {
          ...topic,
          concepts: updatedConcepts,
          masteryPercentage: avgMastery,
          priority: (avgMastery < 50 ? 'HIGH' : avgMastery < 75 ? 'MEDIUM' : 'LOW') as PriorityLevel
        };
      });

      return {
        ...subj,
        attempts: updatedAttempts,
        misconceptions: updatedMisconceptions,
        topics: updatedTopics
      };
    });

    return {
      isCorrect: evalResult.isCorrect,
      category: evalResult.category,
      misconceptionDetected: evalResult.misconceptionDetected,
      feedback: evalResult.socraticFeedback
    };
  };

  // Complete Targeted Retest -> Jumps mastery & clears misconception for current subject
  const completeTargetedRetest = (
    conceptId: string,
    scorePercentage: number,
    misconceptionId?: string
  ) => {
    if (scorePercentage >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    }

    updateCurrentSubject((subj) => {
      const updatedMisconceptions = subj.misconceptions.map((m) => {
        if (misconceptionId && m.id === misconceptionId) {
          return { ...m, isResolved: true };
        }
        if (m.conceptId === conceptId) {
          return { ...m, isResolved: true };
        }
        return m;
      });

      const updatedTopics = subj.topics.map((topic) => {
        const hasConcept = topic.concepts.some((c) => c.id === conceptId);
        if (!hasConcept) return topic;

        const updatedConcepts = topic.concepts.map((concept) => {
          if (concept.id !== conceptId) return concept;

          const targetConceptMastery = scorePercentage >= 90 ? 88 : scorePercentage >= 50 ? 70 : 50;
          return {
            ...concept,
            masteryPercentage: targetConceptMastery
          };
        });

        const newTopicMastery = Math.round(
          updatedConcepts.reduce((acc, c) => acc + c.masteryPercentage, 0) / (updatedConcepts.length || 1)
        );

        return {
          ...topic,
          concepts: updatedConcepts,
          masteryPercentage: newTopicMastery,
          priority: (newTopicMastery < 50 ? 'HIGH' : newTopicMastery < 75 ? 'MEDIUM' : 'LOW') as PriorityLevel
        };
      });

      return {
        ...subj,
        misconceptions: updatedMisconceptions,
        topics: updatedTopics
      };
    });

    closeModal();
  };

  const updateAvailableMinutes = (newMinutes: number) => {
    updateCurrentSubject((subj) => ({
      ...subj,
      totalAvailableMinutes: newMinutes
    }));
  };

  const markPlanItemComplete = (planItemId: string) => {
    const planItem = revisionPlan.find((p) => p.id === planItemId);
    if (planItem) {
      updateCurrentSubject((subj) => {
        const updatedTopics = subj.topics.map((t) => {
          if (t.id !== planItem.topicId) return t;
          return {
            ...t,
            concepts: t.concepts.map((c) =>
              c.id === planItem.conceptId
                ? { ...c, masteryPercentage: Math.min(100, c.masteryPercentage + 15) }
                : c
            )
          };
        });
        return { ...subj, topics: updatedTopics };
      });
    }
  };

  const resetCurrentSubjectDemo = () => {
    if (currentSubject.id.includes('dbms') || currentSubject.name.toLowerCase().includes('dbms')) {
      updateCurrentSubject(() => dbmsSubjectPreset);
    } else {
      updateCurrentSubject(() => dsaSubjectPreset);
    }
    closeModal();
  };

  const loadExtractedCourseData = (courseName: string, minutes: number, newTopics: Topic[], newQuestions?: Question[]) => {
    updateCurrentSubject((subj) => ({
      ...subj,
      name: courseName,
      totalAvailableMinutes: minutes,
      topics: newTopics,
      questions: newQuestions && newQuestions.length > 0 ? newQuestions : subj.questions,
      misconceptions: [],
      attempts: []
    }));
  };

  return (
    <RevisionContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        subjects,
        activeSubjectId,
        currentSubject,
        subjectConfig,
        switchSubject,
        addNewSubject,
        deleteSubject,
        topics,
        misconceptions,
        attempts,
        questions,
        revisionPlan,
        nextRecommended,
        overallMastery,
        metacognitiveStats,
        activeModal,
        openDebunkModal,
        openRetestModal,
        openRevisionModal,
        openSubjectSetupModal,
        closeModal,
        handleQuestionAnswered,
        completeTargetedRetest,
        updateAvailableMinutes,
        markPlanItemComplete,
        resetCurrentSubjectDemo,
        loadExtractedCourseData,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </RevisionContext.Provider>
  );
};

export const useRevision = (): RevisionContextType => {
  const context = useContext(RevisionContext);
  if (!context) {
    throw new Error('useRevision must be used within a RevisionProvider');
  }
  return context;
};
