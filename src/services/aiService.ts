import type {
  Concept,
  Question,
  ConfidenceLevel,
  Misconception,
  MetacognitiveCategory,
  Topic
} from '../types';
import { dsaSubjectPreset, dbmsSubjectPreset, osSubjectPreset, cnSubjectPreset } from '../data/subjectPresets';

export interface ConceptExtractionResult {
  subjectName: string;
  extractedSyllabusSummary: string;
  identifiedHotTopics: string[];
  totalEstimatedMinutes: number;
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
  generatedQuestions: Question[];
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
    currentSubjectName?: string
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
    customRetestsMap?: Record<string, Question[]>
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
    currentSubjectName: string = 'Current Subject'
  ): Promise<ConceptExtractionResult> {
    // Simulate AI model processing time
    await new Promise((res) => setTimeout(res, 900));

    const lower = currentSubjectName.toLowerCase();

    // Contextual extraction depending on subject name
    if (lower.includes('dbms') || lower.includes('database')) {
      return {
        subjectName: currentSubjectName,
        extractedSyllabusSummary: `AI analyzed "${fileName}": Extracted 4 core database modules and 6 high-yield sub-concepts, weighted against university previous year papers (PYQs).`,
        identifiedHotTopics: [
          '3NF vs BCNF Dependency Preservation (96% exam recurrence)',
          'Strict 2PL & Cascading Abort Prevention (89% exam recurrence)',
          'B+ Tree Index Fanout & Leaf Pointers (84% exam recurrence)',
          'SQL GROUP BY vs HAVING Query Order (78% exam recurrence)'
        ],
        totalEstimatedMinutes: 120,
        topics: dbmsSubjectPreset.topics.map((t) => ({
          name: t.name,
          description: `Core exam topic for ${t.name}`,
          examRelevance: t.examRelevance,
          concepts: t.concepts.map((c) => ({
            title: c.title,
            description: c.description,
            keyRule: c.keyRule,
            commonPitfall: c.commonPitfall,
            examFrequencyWeight: c.examFrequencyWeight,
            estimatedMinutes: c.estimatedMinutesToRevise
          }))
        })),
        generatedQuestions: dbmsSubjectPreset.questions
      };
    }

    if (lower.includes('os') || lower.includes('operating system')) {
      return {
        subjectName: currentSubjectName,
        extractedSyllabusSummary: `AI analyzed "${fileName}": Extracted 3 core Operating Systems modules with emphasis on concurrency invariants and memory management.`,
        identifiedHotTopics: [
          'Semaphore wait/signal Ordering & Deadlocks (94% recurrence)',
          'Banker’s Algorithm Need Matrix & Safe States (88% recurrence)',
          'Virtual Memory Paging, TLB Hit Rates & LRU (85% recurrence)'
        ],
        totalEstimatedMinutes: 120,
        topics: osSubjectPreset.topics.map((t) => ({
          name: t.name,
          description: `Core exam topic for ${t.name}`,
          examRelevance: t.examRelevance,
          concepts: t.concepts.map((c) => ({
            title: c.title,
            description: c.description,
            keyRule: c.keyRule,
            commonPitfall: c.commonPitfall,
            examFrequencyWeight: c.examFrequencyWeight,
            estimatedMinutes: c.estimatedMinutesToRevise
          }))
        })),
        generatedQuestions: osSubjectPreset.questions
      };
    }

    if (lower.includes('network') || lower.includes('cn')) {
      return {
        subjectName: currentSubjectName,
        extractedSyllabusSummary: `AI analyzed "${fileName}": Extracted 2 core networking modules with focus on transport protocols and IP subnetting calculations.`,
        identifiedHotTopics: [
          'TCP 3-Way Handshake & Window Management (92% recurrence)',
          'CIDR Subnetting & Usable IP Calculation (87% recurrence)'
        ],
        totalEstimatedMinutes: 120,
        topics: cnSubjectPreset.topics.map((t) => ({
          name: t.name,
          description: `Core exam topic for ${t.name}`,
          examRelevance: t.examRelevance,
          concepts: t.concepts.map((c) => ({
            title: c.title,
            description: c.description,
            keyRule: c.keyRule,
            commonPitfall: c.commonPitfall,
            examFrequencyWeight: c.examFrequencyWeight,
            estimatedMinutes: c.estimatedMinutesToRevise
          }))
        })),
        generatedQuestions: cnSubjectPreset.questions
      };
    }

    // Default / DSA / Custom extraction
    return {
      subjectName: currentSubjectName,
      extractedSyllabusSummary: `AI analyzed "${fileName}" for ${currentSubjectName}: Identified high-yield exam patterns and recurring problem types weighted against previous year questions (PYQs).`,
      identifiedHotTopics: [
        `Core Invariants & Boundary Constraints in ${currentSubjectName} (95% recurrence)`,
        `High-Frequency Distractors & Traps in University Exams (89% recurrence)`,
        `Algorithm & Architecture Complexity Analysis (83% recurrence)`,
        `System Design & Invariant Invariance (78% recurrence)`
      ],
      totalEstimatedMinutes: 120,
      topics: [
        {
          name: `${currentSubjectName} Core Invariants`,
          description: `Foundational rules and theorems essential for ${currentSubjectName}.`,
          examRelevance: 'CRITICAL',
          concepts: [
            {
              title: `Search Space & State Monotonicity (${currentSubjectName})`,
              description: `Understanding preconditions and boundaries in ${currentSubjectName}.`,
              keyRule: `Always verify that state preconditions are satisfied before applying optimizations.`,
              commonPitfall: `Applying shortcuts without verifying input constraints.`,
              examFrequencyWeight: 10,
              estimatedMinutes: 25
            },
            {
              title: `Boundary Conditions & Edge Cases`,
              description: `Preventing off-by-one errors and invalid states in ${currentSubjectName}.`,
              keyRule: `Explicitly validate edge conditions (empty states, single elements, extreme values).`,
              commonPitfall: `Assuming standard range inputs only.`,
              examFrequencyWeight: 9,
              estimatedMinutes: 15
            }
          ]
        },
        {
          name: `Advanced Optimization & Patterns`,
          description: `Applied problem-solving and efficiency optimization for ${currentSubjectName}.`,
          examRelevance: 'HIGH',
          concepts: [
            {
              title: `Optimized State Transitions & Pruning`,
              description: `Techniques to minimize computational complexity and overhead.`,
              keyRule: `Prioritize time-space efficiency and prune redundant subproblems.`,
              commonPitfall: `Redundant recalculations in recursive branches.`,
              examFrequencyWeight: 8,
              estimatedMinutes: 20
            }
          ]
        }
      ],
      generatedQuestions: dsaSubjectPreset.questions
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
          whyStudentWasConfident: 'This choice is an intuitive surface pattern often confused with standard behavior under exam pressure.',
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
            ? 'Correct, but your confidence was LOW (Lucky Guess / Fragile Knowledge). Reinforce this core concept!'
            : 'Excellent! Solid understanding with well-calibrated confidence.'
          : confidence === 'high'
          ? '🚨 HIGH-CONFIDENCE MISCONCEPTION DETECTED! You were sure of this answer, but the underlying concept invariant is flawed.'
          : 'Incorrect (Knowledge Gap). Review the core principle below before your exam.',
        studentThinkingAnalysis: !isCorrect
          ? selectedOpt?.trapReason || 'You fell into a classic exam distractor trap.'
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
      examTip: `Exam setters frequently include distractor options targeting this exact misconception in ${misconception.topicTitle}!`
    };
  }

  async generateTargetedRetest(
    conceptId: string,
    customRetestsMap?: Record<string, Question[]>
  ): Promise<Question[]> {
    if (customRetestsMap && customRetestsMap[conceptId]) {
      return customRetestsMap[conceptId];
    }
    if (dsaSubjectPreset.targetedRetestQuestions[conceptId]) {
      return dsaSubjectPreset.targetedRetestQuestions[conceptId];
    }
    if (dbmsSubjectPreset.targetedRetestQuestions[conceptId]) {
      return dbmsSubjectPreset.targetedRetestQuestions[conceptId];
    }

    return [
      {
        id: `retest-${conceptId}-1`,
        topicId: 'topic-targeted',
        conceptId: conceptId,
        topicName: 'Targeted Review',
        conceptName: 'Concept Verification Drill',
        prompt: `Targeted Verification (Question 1 of 2): Which statement correctly describes the essential invariant for this concept?`,
        options: [
          {
            id: 'rt-1',
            text: 'It strictly verifies that fundamental boundary conditions and structural invariants are maintained before state changes.',
            isCorrect: true
          },
          {
            id: 'rt-2',
            text: 'It ignores structural constraints and operates blindly on raw inputs.',
            isCorrect: false,
            trapReason: 'Common misconception'
          },
          {
            id: 'rt-3',
            text: 'It always executes in constant O(1) time regardless of input size.',
            isCorrect: false
          },
          {
            id: 'rt-4',
            text: 'None of the above statements are correct.',
            isCorrect: false
          }
        ],
        correctOptionIndex: 0,
        difficulty: 'MEDIUM',
        examFrequencyYears: ['2024'],
        detailedExplanation: 'This validates that the mental model was corrected from the initial misconception.',
        socraticHint: 'Recall the golden rule.',
        corePrinciple: 'Always verify structural constraints before making state changes.'
      },
      {
        id: `retest-${conceptId}-2`,
        topicId: 'topic-targeted',
        conceptId: conceptId,
        topicName: 'Targeted Review',
        conceptName: 'Edge Case Verification',
        prompt: `Targeted Verification (Question 2 of 2): How should edge cases be handled under this principle?`,
        options: [
          {
            id: 'rt-2-1',
            text: 'Explicitly evaluate boundary invariants to prevent runtime exceptions and false states.',
            isCorrect: true
          },
          {
            id: 'rt-2-2',
            text: 'Ignore edge cases as they rarely appear in exam questions.',
            isCorrect: false
          },
          {
            id: 'rt-2-3',
            text: 'Rely solely on default fallback values.',
            isCorrect: false
          },
          {
            id: 'rt-2-4',
            text: 'Restart execution from scratch on every error.',
            isCorrect: false
          }
        ],
        correctOptionIndex: 0,
        difficulty: 'MEDIUM',
        examFrequencyYears: ['2024', '2025'],
        detailedExplanation: 'Edge case verification ensures robust understanding and prevents exam traps.',
        socraticHint: 'Consider why boundary testing matters.',
        corePrinciple: 'Explicitly handle edge cases with defensive validation.'
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
      prompt: `Adaptive Question on ${targetConcept.title}: In standard exam scenarios, which of the following is the required invariant?`,
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
          text: 'State is discarded without verification.',
          isCorrect: false
        },
        {
          id: 'opt-adapt-4',
          text: 'None of the pointers/references are updated.',
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

  async extractConceptsFromDocument(
    fileName: string,
    fileType: 'syllabus' | 'notes' | 'pyq',
    currentSubjectName?: string
  ): Promise<ConceptExtractionResult> {
    if (!this.apiKey) {
      return new MockAIService().extractConceptsFromDocument(fileName, fileType, currentSubjectName);
    }
    return new MockAIService().extractConceptsFromDocument(fileName, fileType, currentSubjectName);
  }

  async evaluateAnswer(question: Question, selectedOptionIndex: number, confidence: ConfidenceLevel): Promise<QuestionEvaluationResult> {
    return new MockAIService().evaluateAnswer(question, selectedOptionIndex, confidence);
  }

  async generateSocraticDebunk(misconception: Misconception) {
    return new MockAIService().generateSocraticDebunk(misconception);
  }

  async generateTargetedRetest(conceptId: string, customRetestsMap?: Record<string, Question[]>): Promise<Question[]> {
    return new MockAIService().generateTargetedRetest(conceptId, customRetestsMap);
  }

  async generateAdaptiveQuestion(topic: Topic, targetConcept: Concept): Promise<Question> {
    return new MockAIService().generateAdaptiveQuestion(topic, targetConcept);
  }
}

// Export singleton instance with interchangeable backend
export const aiService: AIServiceProvider = new MockAIService();
export const geminiServiceInstance = new GeminiAIService();
