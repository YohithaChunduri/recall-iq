export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type MetacognitiveCategory = 
  | 'MISCONCEPTION'   // High confidence, Wrong answer (Dangerous blindspot)
  | 'KNOWLEDGE_GAP'   // Low/Medium confidence, Wrong answer
  | 'FRAGILE_KNOWLEDGE' // Low confidence, Correct answer (Lucky guess)
  | 'SOLID_MASTERY';  // High/Medium confidence, Correct answer

export interface Concept {
  id: string;
  topicId: string;
  title: string;
  masteryPercentage: number;
  examFrequencyWeight: number; // 1-10
  estimatedMinutesToRevise: number;
  description: string;
  keyRule: string;
  commonPitfall: string;
}

export interface Topic {
  id: string;
  name: string;
  iconName: string;
  masteryPercentage: number;
  concepts: Concept[];
  examRelevance: 'CRITICAL' | 'HIGH' | 'MODERATE';
  totalExamQuestionsAppeared: number;
  priority: PriorityLevel;
  colorClass: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  trapReason?: string; // Why a student might mistakenly pick this
}

export interface Question {
  id: string;
  topicId: string;
  conceptId: string;
  topicName: string;
  conceptName: string;
  prompt: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionIndex: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  examFrequencyYears: string[]; // e.g. ['2023', '2024']
  detailedExplanation: string;
  socraticHint: string;
  corePrinciple: string;
}

export interface UserQuestionAttempt {
  id: string;
  questionId: string;
  topicId: string;
  conceptId: string;
  selectedOptionIndex: number;
  confidence: ConfidenceLevel;
  isCorrect: boolean;
  timestamp: string;
  category: MetacognitiveCategory;
  timeSpentSeconds: number;
}

export interface Misconception {
  id: string;
  conceptId: string;
  conceptTitle: string;
  topicId: string;
  topicTitle: string;
  questionPrompt: string;
  studentAnswerText: string;
  correctAnswerText: string;
  confidencePercentage: number; // e.g. 90%
  timestamp: string;
  isResolved: boolean;
  
  // AI analysis fields
  underlyingMisconception: string;
  whyStudentWasConfident: string;
  counterExample: string;
  clarifiedRule: string;
  retestQuestionId?: string;
}

export interface RevisionPlanItem {
  id: string;
  topicId: string;
  topicName: string;
  conceptId: string;
  conceptName: string;
  priority: PriorityLevel;
  allocatedMinutes: number;
  masteryPercentage: number;
  urgencyScore: number;
  reason: string;
  hasMisconception: boolean;
  isCompleted: boolean;
  actionTitle: string;
  actionType: 'DEBUNK_MISCONCEPTION' | 'CONCEPT_REVIEW' | 'EDGE_CASE_DRILL' | 'FORMULA_RECALL';
}

export interface SubjectConfig {
  id: string;
  name: string;
  code: string;
  examDateText: string;
  hoursUntilExam: number;
  totalAvailableMinutes: number;
  targetScore: string;
  syllabusCoveredPercentage: number;
}

export interface ProgressSummary {
  overallMastery: number;
  totalQuestionsAnswered: number;
  accuracyRate: number;
  misconceptionsDetected: number;
  misconceptionsResolved: number;
  revisionTimeSpentMinutes: number;
  calibrationScore: number; // 0-100% how well confidence matches reality
}
