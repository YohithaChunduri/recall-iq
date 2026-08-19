import React, { createContext, useContext, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type {
  SubjectConfig,
  Topic,
  Misconception,
  UserQuestionAttempt,
  RevisionPlanItem,
  Question,
  ConfidenceLevel,
  MetacognitiveCategory
} from '../types';
import {
  initialSubjectConfig,
  initialTopics,
  initialMisconceptions,
  initialAttempts
} from '../data/dsaData';
import {
  generateAdaptiveRevisionPlan,
  getNextRecommendedTopic,
  calculateMetacognitiveBreakdown,
  recalculateMastery
} from '../utils/adaptiveEngine';
import { aiService } from '../services/aiService';

interface ModalState {
  type: 'none' | 'debunk' | 'retest' | 'revision' | 'quiz_result' | 'time_adjust';
  conceptId?: string;
  misconceptionId?: string;
  questionId?: string;
}

interface RevisionContextType {
  subjectConfig: SubjectConfig;
  topics: Topic[];
  misconceptions: Misconception[];
  attempts: UserQuestionAttempt[];
  revisionPlan: RevisionPlanItem[];
  nextRecommended: RevisionPlanItem | null;
  overallMastery: number;
  metacognitiveStats: ReturnType<typeof calculateMetacognitiveBreakdown>;
  activeModal: ModalState;
  
  // Actions
  openDebunkModal: (misconceptionId: string) => void;
  openRetestModal: (conceptId: string, misconceptionId?: string) => void;
  openRevisionModal: (conceptId: string) => void;
  closeModal: () => void;
  
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
  resetToDefaultDSA: () => void;
  loadExtractedCourseData: (courseName: string, minutes: number, topics: Topic[]) => void;
}

const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

export const RevisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjectConfig, setSubjectConfig] = useState<SubjectConfig>(initialSubjectConfig);
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [misconceptions, setMisconceptions] = useState<Misconception[]>(initialMisconceptions);
  const [attempts, setAttempts] = useState<UserQuestionAttempt[]>(initialAttempts);
  const [activeModal, setActiveModal] = useState<ModalState>({ type: 'none' });

  // 1. Compute dynamic revision plan
  const revisionPlan = useMemo(() => {
    return generateAdaptiveRevisionPlan(
      topics,
      misconceptions,
      attempts,
      subjectConfig.totalAvailableMinutes
    );
  }, [topics, misconceptions, attempts, subjectConfig.totalAvailableMinutes]);

  // 2. Compute top "Revise Now" AI recommendation
  const nextRecommended = useMemo(() => {
    return getNextRecommendedTopic(revisionPlan, misconceptions);
  }, [revisionPlan, misconceptions]);

  // 3. Compute overall aggregated mastery
  const overallMastery = useMemo(() => {
    if (topics.length === 0) return 0;
    const total = topics.reduce((acc, t) => acc + t.masteryPercentage, 0);
    return Math.round(total / topics.length);
  }, [topics]);

  // 4. Metacognitive calibration stats
  const metacognitiveStats = useMemo(() => {
    return calculateMetacognitiveBreakdown(attempts);
  }, [attempts]);

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

  const closeModal = () => {
    setActiveModal({ type: 'none' });
  };

  // Main Question Answer Pipeline
  const handleQuestionAnswered = async (
    question: Question,
    selectedOptionIndex: number,
    confidence: ConfidenceLevel,
    timeSpentSeconds: number = 30
  ) => {
    // 1. Ask AI Layer to evaluate answer & detect misconceptions
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

    setAttempts((prev) => [newAttempt, ...prev]);

    // 2. If a misconception is detected, add to misconceptions list
    if (evalResult.misconceptionDetected && evalResult.misconceptionDetails) {
      setMisconceptions((prev) => [evalResult.misconceptionDetails!, ...prev]);
    }

    // 3. Adjust Concept and Topic Mastery
    setTopics((prevTopics) => {
      return prevTopics.map((topic) => {
        if (topic.id !== question.topicId) return topic;

        const updatedConcepts = topic.concepts.map((concept) => {
          if (concept.id !== question.conceptId) return concept;

          // Points shift
          const delta = evalResult.isCorrect ? (confidence === 'high' ? 8 : 4) : (confidence === 'high' ? -12 : -6);
          const newMastery = recalculateMastery(concept.masteryPercentage, delta);

          return {
            ...concept,
            masteryPercentage: newMastery
          };
        });

        const avgMastery = Math.round(
          updatedConcepts.reduce((acc, c) => acc + c.masteryPercentage, 0) / updatedConcepts.length
        );

        return {
          ...topic,
          concepts: updatedConcepts,
          masteryPercentage: avgMastery,
          priority: avgMastery < 50 ? 'HIGH' : avgMastery < 75 ? 'MEDIUM' : 'LOW'
        };
      });
    });

    return {
      isCorrect: evalResult.isCorrect,
      category: evalResult.category,
      misconceptionDetected: evalResult.misconceptionDetected,
      feedback: evalResult.socraticFeedback
    };
  };

  // Complete Targeted Retest -> Jump Mastery, Clear Misconception & Trigger Confetti!
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
        // Safe fallback
      }
    }

    // 1. Mark misconception as resolved
    if (misconceptionId) {
      setMisconceptions((prev) =>
        prev.map((m) => (m.id === misconceptionId ? { ...m, isResolved: true } : m))
      );
    } else {
      setMisconceptions((prev) =>
        prev.map((m) => (m.conceptId === conceptId ? { ...m, isResolved: true } : m))
      );
    }

    // 2. Increase mastery dynamically (e.g. Binary Search jumps from 30% -> 80%+)
    setTopics((prevTopics) => {
      return prevTopics.map((topic) => {
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
          updatedConcepts.reduce((acc, c) => acc + c.masteryPercentage, 0) / updatedConcepts.length
        );

        return {
          ...topic,
          concepts: updatedConcepts,
          masteryPercentage: newTopicMastery,
          priority: newTopicMastery < 50 ? 'HIGH' : newTopicMastery < 75 ? 'MEDIUM' : 'LOW'
        };
      });
    });

    closeModal();
  };

  const updateAvailableMinutes = (newMinutes: number) => {
    setSubjectConfig((prev) => ({
      ...prev,
      totalAvailableMinutes: newMinutes
    }));
  };

  const markPlanItemComplete = (planItemId: string) => {
    const planItem = revisionPlan.find((p) => p.id === planItemId);
    if (planItem) {
      setTopics((prev) =>
        prev.map((t) => {
          if (t.id !== planItem.topicId) return t;
          return {
            ...t,
            concepts: t.concepts.map((c) =>
              c.id === planItem.conceptId
                ? { ...c, masteryPercentage: Math.min(100, c.masteryPercentage + 15) }
                : c
            )
          };
        })
      );
    }
  };

  const resetToDefaultDSA = () => {
    setSubjectConfig(initialSubjectConfig);
    setTopics(initialTopics);
    setMisconceptions(initialMisconceptions);
    setAttempts(initialAttempts);
    setActiveModal({ type: 'none' });
  };

  const loadExtractedCourseData = (courseName: string, minutes: number, newTopics: Topic[]) => {
    setSubjectConfig({
      id: `course-${Date.now()}`,
      name: courseName,
      code: 'EXAM-2026',
      examDateText: 'In 2 Days',
      hoursUntilExam: 48,
      totalAvailableMinutes: minutes,
      targetScore: 'Grade A (85%+)',
      syllabusCoveredPercentage: 100
    });
    setTopics(newTopics);
    setMisconceptions([]);
    setAttempts([]);
  };

  return (
    <RevisionContext.Provider
      value={{
        subjectConfig,
        topics,
        misconceptions,
        attempts,
        revisionPlan,
        nextRecommended,
        overallMastery,
        metacognitiveStats,
        activeModal,
        openDebunkModal,
        openRetestModal,
        openRevisionModal,
        closeModal,
        handleQuestionAnswered,
        completeTargetedRetest,
        updateAvailableMinutes,
        markPlanItemComplete,
        resetToDefaultDSA,
        loadExtractedCourseData
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
