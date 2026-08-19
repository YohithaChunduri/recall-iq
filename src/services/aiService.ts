import type {
  Concept,
  Question,
  ConfidenceLevel,
  Misconception,
  MetacognitiveCategory,
  Topic
} from '../types';
import { targetedRetestQuestions } from '../data/dsaData';

export interface ConceptExtractionResult {
  topics: {
    name: string;
    description: string;
    examRelevance: 'CRITICAL' | 'HIGH' | 'MODERATE';
    concepts: {
      title: string;
      description: string;
      keyRule: string;
      commonPitfall: string;
      examFrequencyWeight: number;
      estimatedMinutes: number;
    }[];
  }[];
  extractedSyllabusSummary: string;
  identifiedHotTopics: string[];
}

export interface QuestionEvaluationResult {
  isCorrect: boolean;
  category: MetacognitiveCategory;
  misconceptionDetected: boolean;
  misconceptionDetails?: Misconception;
  socraticFeedback: {
    verdict: string;
    studentThinkingAnalysis: string;
    correctMentalModel: string;
    examTrapWarning: string;
  };
}

export interface AIServiceProvider {
  extractConceptsFromDocument(
    fileName: string,
    fileType: 'syllabus' | 'notes' | 'pyq',
    contentPreview?: string
  ): Promise<ConceptExtractionResult>;

  evaluateAnswer(
    question: Question,
    selectedOptionIndex: number,
    confidence: ConfidenceLevel
  ): Promise<QuestionEvaluationResult>;

  generateSocraticDebunk(misconception: Misconception): Promise<{
    rootCause: string;
    whyYouWereConfident: string;
    visualContrast: { wrongAssumption: string; reality: string };
    goldenRule: string;
    examTip: string;
  }>;

  generateTargetedRetest(
    conceptId: string,
    misconceptionId?: string
  ): Promise<Question[]>;

  generateAdaptiveQuestion(
    topic: Topic,
    targetConcept: Concept
  ): Promise<Question>;
}

/**
 * Mock AI Implementation
 * Provides deterministic and contextual AI intelligence for offline/demo operation.
 */
class MockAIService implements AIServiceProvider {
  async extractConceptsFromDocument(
    fileName: string,
    _fileType: 'syllabus' | 'notes' | 'pyq',
    _contentPreview?: string
  ): Promise<ConceptExtractionResult> {
    // Simulate AI model processing time
    await new Promise((res) => setTimeout(res, 900));

    // Default DSA extraction result
    return {
      extractedSyllabusSummary: `Extracted from "${fileName}": Identified 10 core algorithmic patterns across 22 high-yield sub-concepts, weighted by recurrence in university exams and coding interview tests.`,
      identifiedHotTopics: [
        'Binary Search Monotonicity & Boundary Invariants (95% recurrence)',
        'Topological Sort & Kahn’s Cycle Detection (88% recurrence)',
        'Dynamic Sliding Window Condition Maintenance (82% recurrence)',
        'Lowest Common Ancestor in Binary Trees (79% recurrence)'
      ],
      topics: [
        {
          name: 'Binary Search',
          description: 'Search space reduction, monotonic predicates, lower/upper bounds.',
          examRelevance: 'CRITICAL',
          concepts: [
            {
              title: 'Search Space Monotonicity & Sortedness Invariant',
              description: 'Recognizing when binary search is mathematically valid and why unsorted arrays violate halving guarantees.',
              keyRule: 'Binary search requires monotonicity in the search range or evaluation predicate.',
              commonPitfall: 'Applying binary search on unsorted arrays without prior sorting or monotonic reduction.',
              examFrequencyWeight: 10,
              estimatedMinutes: 25
            }
          ]
        },
        {
          name: 'Graphs',
          description: 'Graph representations, traversals, DAG orderings, and shortest paths.',
          examRelevance: 'CRITICAL',
          concepts: [
            {
              title: 'Topological Sort & Cycle Detection (Kahn’s Algorithm)',
              description: 'In-degree tracking and queue processing for DAG ordering.',
              keyRule: 'Topological sort is strictly valid only on DAGs.',
              commonPitfall: 'Attempting to run topological sort on graphs containing cycles.',
              examFrequencyWeight: 9,
              estimatedMinutes: 20
            }
          ]
        }
      ]
    };
  }

  async evaluateAnswer(
    question: Question,
    selectedOptionIndex: number,
    confidence: ConfidenceLevel
  ): Promise<QuestionEvaluationResult> {
    const isCorrect = selectedOptionIndex === question.correctOptionIndex;
    const selectedOpt = question.options[selectedOptionIndex];

    let category: MetacognitiveCategory;
    let misconceptionDetected = false;
    let misconceptionDetails: Misconception | undefined;

    if (!isCorrect) {
      if (confidence === 'high') {
        category = 'MISCONCEPTION';
        misconceptionDetected = true;
        misconceptionDetails = {
          id: `misc-dyn-${Date.now()}`,
          conceptId: question.conceptId,
          conceptTitle: question.conceptName,
          topicId: question.topicId,
          topicTitle: question.topicName,
          questionPrompt: question.prompt,
          studentAnswerText: selectedOpt?.text || 'Selected wrong option',
          correctAnswerText: question.options[question.correctOptionIndex].text,
          confidencePercentage: 90,
          timestamp: 'Just now',
          isResolved: false,
          underlyingMisconception: selectedOpt?.trapReason || `You had high confidence in an incorrect assumption regarding ${question.conceptName}.`,
          whyStudentWasConfident: 'This choice is an intuitive surface pattern often confused with standard divide-and-conquer.',
          counterExample: question.detailedExplanation,
          clarifiedRule: question.corePrinciple,
          retestQuestionId: `retest-${question.conceptId}`
        };
      } else {
        category = 'KNOWLEDGE_GAP';
      }
    } else {
      if (confidence === 'low') {
        category = 'FRAGILE_KNOWLEDGE'; // Lucky guess
      } else {
        category = 'SOLID_MASTERY';
      }
    }

    return {
      isCorrect,
      category,
      misconceptionDetected,
      misconceptionDetails,
      socraticFeedback: {
        verdict: isCorrect
          ? confidence === 'low'
            ? 'Correct, but your confidence was LOW (Lucky Guess / Fragile Knowledge). Reinforce this algorithmic invariant.'
            : 'Excellent! Solid algorithmic understanding with well-calibrated confidence.'
          : confidence === 'high'
          ? '🚨 HIGH-CONFIDENCE MISCONCEPTION DETECTED! You were sure of this answer, but the underlying algorithmic invariant is flawed.'
          : 'Incorrect (Knowledge Gap). Review the core principle below before your exam.',
        studentThinkingAnalysis: !isCorrect
          ? selectedOpt?.trapReason || 'You fell into a classic algorithmic distractor trap.'
          : 'You accurately identified the discriminating invariant.',
        correctMentalModel: question.detailedExplanation,
        examTrapWarning: question.corePrinciple
      }
    };
  }

  async generateSocraticDebunk(misconception: Misconception) {
    return {
      rootCause: misconception.underlyingMisconception,
      whyYouWereConfident: misconception.whyStudentWasConfident,
      visualContrast: {
        wrongAssumption: misconception.studentAnswerText,
        reality: misconception.correctAnswerText
      },
      goldenRule: misconception.clarifiedRule,
      examTip: 'Exam setters frequently include questions checking whether you understand the fundamental preconditions of algorithms like Binary Search!'
    };
  }

  async generateTargetedRetest(conceptId: string, _misconceptionId?: string): Promise<Question[]> {
    if (targetedRetestQuestions[conceptId]) {
      return targetedRetestQuestions[conceptId];
    }

    return [
      {
        id: `retest-${conceptId}-1`,
        topicId: 'topic-bs',
        conceptId: conceptId,
        topicName: 'Targeted Review',
        conceptName: 'Invariant Verification',
        prompt: `Targeted Verification: Which statement correctly describes the key algorithmic invariant?`,
        options: [
          {
            id: 'rt-1',
            text: 'It strictly checks that the monotonic invariant is satisfied before discarding search ranges.',
            isCorrect: true
          },
          {
            id: 'rt-2',
            text: 'It ignores the sortedness requirement and operates purely on index positions.',
            isCorrect: false
          },
          {
            id: 'rt-3',
            text: 'It operates in O(1) time complexity always.',
            isCorrect: false
          },
          {
            id: 'rt-4',
            text: 'It can only be written iteratively, never recursively.',
            isCorrect: false
          }
        ],
        correctOptionIndex: 0,
        difficulty: 'MEDIUM',
        examFrequencyYears: ['2024'],
        detailedExplanation: 'This validates that the mental model was corrected from the initial misconception.',
        socraticHint: 'Recall the golden algorithmic invariant.',
        corePrinciple: 'Always verify monotonicity before halving the search space.'
      }
    ];
  }

  async generateAdaptiveQuestion(topic: Topic, targetConcept: Concept): Promise<Question> {
    return {
      id: `adapt-q-${Date.now()}`,
      topicId: topic.id,
      conceptId: targetConcept.id,
      topicName: topic.name,
      conceptName: targetConcept.title,
      prompt: `Adaptive Question on ${targetConcept.title}: In standard DSA exam scenarios, which of the following is the required invariant?`,
      options: [
        {
          id: 'opt-adapt-1',
          text: targetConcept.keyRule,
          isCorrect: true
        },
        {
          id: 'opt-adapt-2',
          text: targetConcept.commonPitfall,
          isCorrect: false,
          trapReason: 'Common misconception'
        },
        {
          id: 'opt-adapt-3',
          text: 'The data structure is emptied immediately.',
          isCorrect: false
        },
        {
          id: 'opt-adapt-4',
          text: 'None of the pointers are updated.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2024', '2025'],
      detailedExplanation: `${targetConcept.description} Key Rule: ${targetConcept.keyRule}`,
      socraticHint: 'Think about the formal invariant.',
      corePrinciple: targetConcept.keyRule
    };
  }
}

/**
 * Gemini AI Implementation Template
 * Ready to be connected to Google Generative AI API (@google/genai or fetch)
 */
class GeminiAIService implements AIServiceProvider {
  private apiKey: string = '';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  hasKey(): boolean {
    return !!this.apiKey;
  }

  async extractConceptsFromDocument(fileName: string, fileType: 'syllabus' | 'notes' | 'pyq', contentPreview?: string): Promise<ConceptExtractionResult> {
    if (!this.apiKey) {
      return new MockAIService().extractConceptsFromDocument(fileName, fileType, contentPreview);
    }
    return new MockAIService().extractConceptsFromDocument(fileName, fileType, contentPreview);
  }

  async evaluateAnswer(question: Question, selectedOptionIndex: number, confidence: ConfidenceLevel): Promise<QuestionEvaluationResult> {
    return new MockAIService().evaluateAnswer(question, selectedOptionIndex, confidence);
  }

  async generateSocraticDebunk(misconception: Misconception) {
    return new MockAIService().generateSocraticDebunk(misconception);
  }

  async generateTargetedRetest(conceptId: string, misconceptionId?: string): Promise<Question[]> {
    return new MockAIService().generateTargetedRetest(conceptId, misconceptionId);
  }

  async generateAdaptiveQuestion(topic: Topic, targetConcept: Concept): Promise<Question> {
    return new MockAIService().generateAdaptiveQuestion(topic, targetConcept);
  }
}

// Export singleton instance with interchangeable backend
export const aiService: AIServiceProvider = new MockAIService();
export const geminiServiceInstance = new GeminiAIService();
