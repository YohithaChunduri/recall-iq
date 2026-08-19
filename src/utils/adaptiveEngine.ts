import type {
  Topic,
  Concept,
  Misconception,
  RevisionPlanItem,
  PriorityLevel,
  UserQuestionAttempt,
  MetacognitiveCategory
} from '../types';

/**
 * Calculates Urgency Score for a specific concept.
 * High Urgency = (High Exam Weight * Misconception/Gap Penalty) / (Mastery + 10)
 */
export function calculateConceptUrgency(
  concept: Concept,
  hasActiveMisconception: boolean,
  hasRecentMistake: boolean
): number {
  const masteryFactor = (100 - concept.masteryPercentage) / 100; // 0 (100% mastery) to 1 (0% mastery)
  const examFactor = concept.examFrequencyWeight / 10; // 0.1 to 1.0

  let penaltyMultiplier = 1.0;
  if (hasActiveMisconception) {
    // High-confidence mistakes get maximum urgency multiplier
    penaltyMultiplier = 3.5;
  } else if (hasRecentMistake) {
    penaltyMultiplier = 2.0;
  }

  // Score roughly ranges from 0 to 100
  const score = Math.round(masteryFactor * examFactor * penaltyMultiplier * 100);
  return Math.min(100, Math.max(1, score));
}

/**
 * Classifies Urgency Score into 🔥 High, 🟡 Medium, 🟢 Low
 */
export function getPriorityFromScore(score: number, mastery: number): PriorityLevel {
  if (score >= 60 || mastery < 45) {
    return 'HIGH';
  }
  if (score >= 35 || mastery < 75) {
    return 'MEDIUM';
  }
  return 'LOW';
}

/**
 * Generates an adaptive, time-budgeted revision plan.
 * Takes the user's available time (e.g., 120 mins) and distributes it proportionally.
 */
export function generateAdaptiveRevisionPlan(
  topics: Topic[],
  misconceptions: Misconception[],
  attempts: UserQuestionAttempt[],
  totalAvailableMinutes: number
): RevisionPlanItem[] {
  const activeMisconceptionConceptIds = new Set(
    misconceptions.filter((m) => !m.isResolved).map((m) => m.conceptId)
  );

  const recentMistakeConceptIds = new Set(
    attempts.filter((a) => !a.isCorrect).map((a) => a.conceptId)
  );

  // 1. Gather all concepts with urgency scores
  const allConceptItems: {
    topic: Topic;
    concept: Concept;
    urgency: number;
    hasMisconception: boolean;
    priority: PriorityLevel;
  }[] = [];

  topics.forEach((topic) => {
    topic.concepts.forEach((concept) => {
      const hasMisc = activeMisconceptionConceptIds.has(concept.id);
      const hasMistake = recentMistakeConceptIds.has(concept.id);
      const urgency = calculateConceptUrgency(concept, hasMisc, hasMistake);
      const priority = getPriorityFromScore(urgency, concept.masteryPercentage);

      allConceptItems.push({
        topic,
        concept,
        urgency,
        hasMisconception: hasMisc,
        priority
      });
    });
  });

  // 2. Sort by urgency descending
  allConceptItems.sort((a, b) => b.urgency - a.urgency);

  // 3. Allocate available minutes proportionally based on urgency
  const totalUrgency = allConceptItems.reduce((acc, curr) => acc + curr.urgency, 0);

  // Dedicate 15% buffer for rapid re-testing & practice
  const allocatableMinutes = Math.max(20, Math.floor(totalAvailableMinutes * 0.85));

  const planItems: RevisionPlanItem[] = allConceptItems.map((item) => {
    // Proportional minute slice
    const rawMinutes = totalUrgency > 0
      ? Math.round((item.urgency / totalUrgency) * allocatableMinutes)
      : Math.round(allocatableMinutes / allConceptItems.length);

    // Clamp between 5 mins minimum and 35 mins maximum per topic
    const allocatedMinutes = Math.max(5, Math.min(35, rawMinutes));

    let actionType: RevisionPlanItem['actionType'] = 'CONCEPT_REVIEW';
    let actionTitle = `Review core rules of ${item.concept.title}`;
    let reason = `Mastery at ${item.concept.masteryPercentage}% with ${item.concept.examFrequencyWeight}/10 exam recurrence.`;

    if (item.hasMisconception) {
      actionType = 'DEBUNK_MISCONCEPTION';
      actionTitle = `🚨 Debunk High-Confidence Trap: ${item.concept.title}`;
      reason = `You answered this with 90% confidence incorrectly. High-priority blindspot for tomorrow's exam!`;
    } else if (item.concept.masteryPercentage < 50) {
      actionType = 'CONCEPT_REVIEW';
      actionTitle = `Re-learn foundation: ${item.concept.title}`;
      reason = `Critical foundation gap. Appeared in recent papers.`;
    } else if (item.concept.masteryPercentage < 80) {
      actionType = 'EDGE_CASE_DRILL';
      actionTitle = `Practice tricky edge cases for ${item.concept.title}`;
      reason = `Good foundation (${item.concept.masteryPercentage}%), but need edge-case drill.`;
    } else {
      actionType = 'FORMULA_RECALL';
      actionTitle = `Quick 5-min speed recall for ${item.concept.title}`;
      reason = `High mastery (${item.concept.masteryPercentage}%). Quick refresher only.`;
    }

    return {
      id: `plan-${item.concept.id}`,
      topicId: item.topic.id,
      topicName: item.topic.name,
      conceptId: item.concept.id,
      conceptName: item.concept.title,
      priority: item.priority,
      allocatedMinutes,
      masteryPercentage: item.concept.masteryPercentage,
      urgencyScore: item.urgency,
      reason,
      hasMisconception: item.hasMisconception,
      isCompleted: false,
      actionTitle,
      actionType
    };
  });

  return planItems;
}

/**
 * Identifies the top "Revise Now" AI recommendation
 */
export function getNextRecommendedTopic(
  planItems: RevisionPlanItem[],
  misconceptions: Misconception[]
): RevisionPlanItem | null {
  const unresolvedMisconceptions = misconceptions.filter((m) => !m.isResolved);

  // If there is an active high-confidence misconception, that is ALWAYS #1 Revise Now
  if (unresolvedMisconceptions.length > 0) {
    const targetMisc = unresolvedMisconceptions[0];
    const matchingPlanItem = planItems.find((p) => p.conceptId === targetMisc.conceptId);
    if (matchingPlanItem) {
      return matchingPlanItem;
    }
  }

  // Otherwise return the uncompleted plan item with highest urgency score
  const uncompleted = planItems.filter((p) => !p.isCompleted);
  if (uncompleted.length > 0) {
    return uncompleted[0];
  }

  return planItems[0] || null;
}

/**
 * Calculates Metacognitive Calibration Stats (2x2 Grid)
 */
export function calculateMetacognitiveBreakdown(attempts: UserQuestionAttempt[]) {
  if (attempts.length === 0) {
    return {
      misconceptions: 0,
      knowledgeGaps: 0,
      fragileKnowledge: 0,
      solidMastery: 0,
      calibrationScore: 100
    };
  }

  const counts: Record<MetacognitiveCategory, number> = {
    MISCONCEPTION: 0,
    KNOWLEDGE_GAP: 0,
    FRAGILE_KNOWLEDGE: 0,
    SOLID_MASTERY: 0
  };

  attempts.forEach((a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });

  // Calibration score: penalizes High Confidence Wrong (Misconceptions) and Low Confidence Right (Fragile)
  const calibratedAttempts = attempts.filter(
    (a) => (a.isCorrect && a.confidence === 'high') || (!a.isCorrect && a.confidence === 'low')
  ).length;

  const calibrationScore = Math.round((calibratedAttempts / attempts.length) * 100);

  return {
    misconceptions: counts.MISCONCEPTION,
    knowledgeGaps: counts.KNOWLEDGE_GAP,
    fragileKnowledge: counts.FRAGILE_KNOWLEDGE,
    solidMastery: counts.SOLID_MASTERY,
    calibrationScore
  };
}

/**
 * Recalculates topic mastery after a targeted retest or quiz attempt
 */
export function recalculateMastery(
  currentMastery: number,
  pointsGained: number
): number {
  return Math.min(100, Math.max(0, Math.round(currentMastery + pointsGained)));
}
