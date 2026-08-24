import type { SubjectData, Question, Topic, Misconception } from '../types';

export const dsaSubjectPreset: SubjectData = {
  id: 'subj-dsa',
  name: 'Data Structures & Algorithms',
  code: 'CS-301',
  examDateText: 'Tomorrow, 9:00 AM',
  hoursUntilExam: 14,
  totalAvailableMinutes: 120,
  targetScore: 'Grade S / 90%+',
  syllabusCoveredPercentage: 78,
  topics: [
    {
      id: 'dsa-arrays',
      name: 'Arrays',
      iconName: 'Grid',
      masteryPercentage: 72,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 18,
      priority: 'MEDIUM',
      colorClass: 'indigo',
      concepts: [
        {
          id: 'dsa-prefix-sum',
          topicId: 'dsa-arrays',
          title: 'Prefix Sum & Range Query Invariant',
          masteryPercentage: 75,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 15,
          description: 'Constant time range sum calculation using precomputed cumulative sums.',
          keyRule: 'Range sum [L..R] = Prefix[R] - Prefix[L-1] (with Prefix[-1] = 0).',
          commonPitfall: 'Off-by-one errors when querying index 0 (handling L=0 edge-case).'
        },
        {
          id: 'dsa-kadane',
          topicId: 'dsa-arrays',
          title: 'Kadane’s Maximum Subarray Algorithm',
          masteryPercentage: 70,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 15,
          description: 'Dynamic programming approach in O(N) time and O(1) auxiliary space.',
          keyRule: 'currentMax = max(arr[i], currentMax + arr[i]); update globalMax accordingly.',
          commonPitfall: 'Resetting currentMax to 0 when all array elements are negative.'
        }
      ]
    },
    {
      id: 'dsa-binary-search',
      name: 'Binary Search',
      iconName: 'Search',
      masteryPercentage: 58,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 22,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: 'dsa-bs-preconditions',
          topicId: 'dsa-binary-search',
          title: 'Monotonicity & Search Space Invariant',
          masteryPercentage: 30, // Student's active misconception concept
          examFrequencyWeight: 10,
          estimatedMinutesToRevise: 25,
          description: 'Binary search requires a strictly monotonic or predicate-partitioned search space (P(x) is true then false).',
          keyRule: 'Never apply binary search on unsorted/non-monotonic sequences without sorting first or using a monotonic predicate function.',
          commonPitfall: 'Assuming binary search works on any array or blindly applying it to unsorted lists.'
        },
        {
          id: 'dsa-bs-boundary',
          topicId: 'dsa-binary-search',
          title: 'Lower Bound & Upper Bound Calculation',
          masteryPercentage: 65,
          examFrequencyWeight: 8,
          estimatedMinutesToRevise: 15,
          description: 'Finding first element >= X vs first element > X with overflow-safe mid calculations.',
          keyRule: 'mid = low + Math.floor((high - low) / 2) prevents 32-bit integer overflow.',
          commonPitfall: 'Infinite loop due to mid calculation bias (low <= high vs low < high).'
        }
      ]
    },
    {
      id: 'dsa-sliding-window',
      name: 'Sliding Window',
      iconName: 'Sliders',
      masteryPercentage: 48,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 14,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: 'dsa-sw-dynamic',
          topicId: 'dsa-sliding-window',
          title: 'Dynamic Window Contraction Invariant',
          masteryPercentage: 48,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 20,
          description: 'Expanding right pointer and contracting left pointer incrementally to maintain window property in O(N).',
          keyRule: 'Expand right pointer until invalid, then contract left pointer incrementally until valid again.',
          commonPitfall: 'Resetting the left pointer back to 0 instead of incrementing, causing O(N^2) complexity.'
        }
      ]
    },
    {
      id: 'dsa-two-pointers',
      name: 'Two Pointers',
      iconName: 'GitFork',
      masteryPercentage: 74,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 12,
      priority: 'LOW',
      colorClass: 'emerald',
      concepts: [
        {
          id: 'dsa-tp-converging',
          topicId: 'dsa-two-pointers',
          title: 'Converging Pointers on Sorted Arrays',
          masteryPercentage: 74,
          examFrequencyWeight: 8,
          estimatedMinutesToRevise: 15,
          description: 'Starting at ends (0, N-1) and moving inward based on comparison with target.',
          keyRule: 'If sum < target, low++; if sum > target, high--; guaranteed O(N) on sorted arrays.',
          commonPitfall: 'Using converging pointers on unsorted data without sorting first.'
        }
      ]
    },
    {
      id: 'dsa-sorting',
      name: 'Sorting',
      iconName: 'ArrowUpDown',
      masteryPercentage: 81,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 16,
      priority: 'LOW',
      colorClass: 'emerald',
      concepts: [
        {
          id: 'dsa-sort-quicksort',
          topicId: 'dsa-sorting',
          title: 'QuickSort Partitioning & Worst-Case Invariant',
          masteryPercentage: 81,
          examFrequencyWeight: 8,
          estimatedMinutesToRevise: 15,
          description: 'Average O(N log N) but degrades to O(N^2) on sorted inputs with naive pivot selection.',
          keyRule: 'Randomized pivot or 3-way partitioning prevents O(N^2) degeneration on duplicate/sorted inputs.',
          commonPitfall: 'Assuming QuickSort is stable (it is in-place and non-stable by default).'
        }
      ]
    },
    {
      id: 'dsa-hashing',
      name: 'Hashing',
      iconName: 'Hash',
      masteryPercentage: 86,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 15,
      priority: 'LOW',
      colorClass: 'emerald',
      concepts: [
        {
          id: 'dsa-hash-collisions',
          topicId: 'dsa-hashing',
          title: 'Collision Resolution & Load Factor',
          masteryPercentage: 86,
          examFrequencyWeight: 7,
          estimatedMinutesToRevise: 10,
          description: 'Chaining vs Open Addressing (Linear Probing) and rehashing thresholds.',
          keyRule: 'Keep load factor lambda <= 0.75 to maintain O(1) average lookup time.',
          commonPitfall: 'Ignoring secondary clustering in linear probing.'
        }
      ]
    },
    {
      id: 'dsa-linked-lists',
      name: 'Linked Lists',
      iconName: 'Link',
      masteryPercentage: 45,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 14,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: 'dsa-ll-fast-slow',
          topicId: 'dsa-linked-lists',
          title: 'Floyd’s Cycle Detection & Cycle Head Math',
          masteryPercentage: 45,
          examFrequencyWeight: 8,
          estimatedMinutesToRevise: 20,
          description: 'Tortoise and Hare algorithm: meeting point proof and finding loop starting node.',
          keyRule: 'After meeting point, reset one pointer to head; advance both at 1 step/tick to find entry node.',
          commonPitfall: 'Forgetting to check fast != null && fast.next != null leading to NullPointerExceptions.'
        }
      ]
    },
    {
      id: 'dsa-stack-queue',
      name: 'Stack & Queue',
      iconName: 'Layers',
      masteryPercentage: 65,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 15,
      priority: 'MEDIUM',
      colorClass: 'amber',
      concepts: [
        {
          id: 'dsa-sq-monotonic',
          topicId: 'dsa-stack-queue',
          title: 'Monotonic Stack for Next Greater Element',
          masteryPercentage: 65,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 20,
          description: 'Maintaining strictly decreasing or increasing stack to solve range queries in O(N).',
          keyRule: 'Pop elements smaller than current value before pushing to find Next Greater Element.',
          commonPitfall: 'Pushing values instead of indices when distances/widths are required.'
        }
      ]
    },
    {
      id: 'dsa-trees',
      name: 'Trees',
      iconName: 'GitBranch',
      masteryPercentage: 52,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 20,
      priority: 'MEDIUM',
      colorClass: 'amber',
      concepts: [
        {
          id: 'dsa-tree-bst-valid',
          topicId: 'dsa-trees',
          title: 'BST Invariant & Subtree Range Constraints',
          masteryPercentage: 52,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 20,
          description: 'Valid BST requires all left subtree nodes < root < all right subtree nodes.',
          keyRule: 'Propagate (minVal, maxVal) ranges down recursive calls, not just comparing local parent-child.',
          commonPitfall: 'Only checking if leftChild < root and rightChild > root without checking entire subtree boundaries.'
        }
      ]
    },
    {
      id: 'dsa-graphs',
      name: 'Graphs',
      iconName: 'Network',
      masteryPercentage: 39,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 24,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: 'dsa-topo-sort',
          topicId: 'dsa-graphs',
          title: 'Topological Sort & Kahn’s Algorithm (In-degree)',
          masteryPercentage: 39,
          examFrequencyWeight: 10,
          estimatedMinutesToRevise: 25,
          description: 'Linear ordering of DAG vertices using BFS in-degree tracking and cycle detection.',
          keyRule: 'Topological ordering exists ONLY for DAGs. If processed vertex count < V, a directed cycle exists.',
          commonPitfall: 'Attempting to run topological sort on an undirected or cyclic graph.'
        }
      ]
    }
  ],
  misconceptions: [
    {
      id: 'misc-dsa-1',
      conceptId: 'dsa-bs-preconditions',
      conceptTitle: 'Binary Search Preconditions & Monotonicity',
      topicId: 'dsa-binary-search',
      topicTitle: 'Binary Search',
      questionPrompt: 'A function receives an unsorted array `arr = [45, 12, 89, 34, 67, 23]` and attempts to locate element `34` by computing `mid = Math.floor((low + high)/2)` and checking `arr[mid]`. Why will this approach fail?',
      studentAnswerText: 'Binary Search will always find the target in O(log N) as long as we compare target with mid element correctly.',
      correctAnswerText: 'Binary Search requires a strictly sorted or monotonic search space. On an unsorted array, halving the search space discards half the array that might contain the target.',
      confidencePercentage: 90,
      timestamp: '20 mins ago',
      isResolved: false,
      underlyingMisconception: 'Believed that the divide-and-conquer mechanism of Binary Search works on any arbitrary sequence without prerequisite monotonicity.',
      whyStudentWasConfident: 'Student remembered that Binary Search has O(log N) time and divides the problem in half, overlooking that discarding half the elements is only mathematically sound if elements are ordered.',
      counterExample: 'In array [45, 12, 89, 34, 67, 23], searching for 34: mid is arr[2]=89. Since 34 < 89, standard BS discards indices 3..5. But 34 is at index 3! It gets permanently discarded and never found.',
      clarifiedRule: 'Binary Search Invariant: The search space MUST satisfy a monotonic property P(x). If elements are unsorted, you must either sort in O(N log N) first or use linear search O(N).',
      retestQuestionId: 'retest-dsa-bs-1'
    }
  ],
  attempts: [
    {
      id: 'att-dsa-1',
      questionId: 'q-dsa-bs-1',
      topicId: 'dsa-binary-search',
      conceptId: 'dsa-bs-preconditions',
      selectedOptionIndex: 1,
      confidence: 'high',
      isCorrect: false,
      timestamp: '20 mins ago',
      category: 'MISCONCEPTION',
      timeSpentSeconds: 42
    },
    {
      id: 'att-dsa-2',
      questionId: 'q-dsa-arr-1',
      topicId: 'dsa-arrays',
      conceptId: 'dsa-kadane',
      selectedOptionIndex: 0,
      confidence: 'high',
      isCorrect: true,
      timestamp: '15 mins ago',
      category: 'SOLID_MASTERY',
      timeSpentSeconds: 28
    },
    {
      id: 'att-dsa-3',
      questionId: 'q-dsa-graphs-1',
      topicId: 'dsa-graphs',
      conceptId: 'dsa-topo-sort',
      selectedOptionIndex: 1,
      confidence: 'medium',
      isCorrect: true,
      timestamp: '10 mins ago',
      category: 'SOLID_MASTERY',
      timeSpentSeconds: 35
    }
  ],
  questions: [
    {
      id: 'q-dsa-bs-1',
      topicId: 'dsa-binary-search',
      conceptId: 'dsa-bs-preconditions',
      topicName: 'Binary Search',
      conceptName: 'Monotonicity & Search Space Invariant',
      prompt: 'Given an unsorted array `arr = [45, 12, 89, 34, 67, 23]`, why is it invalid to directly execute standard Binary Search to find the position of element `34`?',
      options: [
        {
          id: 'opt-bs-1',
          text: 'Binary Search strictly requires the search space to be monotonic or sorted; discarding half an unsorted array may eliminate the target.',
          isCorrect: true
        },
        {
          id: 'opt-bs-2',
          text: 'Binary Search will work correctly in O(log N) as long as we compare the target with arr[mid] on every step.',
          isCorrect: false,
          trapReason: 'High-confidence misconception: Discarding half the search space requires order monotonicity. On unsorted data, the target may lie in the discarded half.'
        },
        {
          id: 'opt-bs-3',
          text: 'Binary Search is only compatible with linked lists, not indexed arrays.',
          isCorrect: false
        },
        {
          id: 'opt-bs-4',
          text: 'Binary Search fails only when there are duplicate keys in the input.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'HARD',
      examFrequencyYears: ['2023', '2024', '2025'],
      detailedExplanation: 'Binary Search fundamentally relies on the invariant that if target < arr[mid], the target CANNOT exist in the right half [mid..high]. In an unsorted array, this assumption fails and leads to silent false negatives.',
      socraticHint: 'If arr[mid] is 89 and target is 34, can 34 be located to the right of index mid in an unsorted list?',
      corePrinciple: 'Binary Search Invariant: Monotonic search space is mandatory before halving.'
    },
    {
      id: 'q-dsa-sw-1',
      topicId: 'dsa-sliding-window',
      conceptId: 'dsa-sw-dynamic',
      topicName: 'Sliding Window',
      conceptName: 'Dynamic Window Invariant',
      prompt: 'When finding the longest substring with at most K distinct characters in string S, how should the left and right window pointers be adjusted?',
      options: [
        {
          id: 'opt-sw-1',
          text: 'Advance right pointer to expand window; when distinct count exceeds K, advance left pointer until distinct count <= K.',
          isCorrect: true
        },
        {
          id: 'opt-sw-2',
          text: 'When distinct count exceeds K, reset left pointer back to index 0 and recompute.',
          isCorrect: false,
          trapReason: 'Resetting left pointer loses O(N) amortized efficiency and causes O(N^2) redundant iterations.'
        },
        {
          id: 'opt-sw-3',
          text: 'Keep right pointer fixed and only advance left pointer until string ends.',
          isCorrect: false
        },
        {
          id: 'opt-sw-4',
          text: 'Restart window from right + 1 whenever distinct count exceeds K.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2024'],
      detailedExplanation: 'In dynamic sliding window, right pointer advances to expand the window. Whenever the window invariant is broken (distinct characters > K), the left pointer incrementally contracts the window until the invariant is restored.',
      socraticHint: 'Think about how to maintain the valid window state without re-evaluating already visited characters.',
      corePrinciple: 'Sliding Window: Expand with right pointer; contract incrementally with left pointer to maintain the invariant in O(N) total time.'
    },
    {
      id: 'q-dsa-graphs-1',
      topicId: 'dsa-graphs',
      conceptId: 'dsa-topo-sort',
      topicName: 'Graphs',
      conceptName: 'Topological Sort Applicability & Invariant',
      prompt: 'Which of the following graphs CANNOT have a valid Topological Ordering?',
      options: [
        {
          id: 'opt-g-1',
          text: 'A Directed Acyclic Graph (DAG) with 5 vertices and 4 edges.',
          isCorrect: false
        },
        {
          id: 'opt-g-2',
          text: 'A Directed Graph containing at least one directed cycle (e.g. A -> B -> C -> A).',
          isCorrect: true
        },
        {
          id: 'opt-g-3',
          text: 'A Directed Tree with a single root source.',
          isCorrect: false
        },
        {
          id: 'opt-g-4',
          text: 'A Disconnected Directed Graph consisting of two separate DAG components.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 1,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2024', '2025'],
      detailedExplanation: 'Topological ordering requires that for every directed edge U -> V, vertex U appears before V in the order. In a cycle, this is mathematically impossible. Therefore, topological sort exists ONLY on DAGs.',
      socraticHint: 'Can you linearize dependencies if task A depends on task B and task B depends on task A?',
      corePrinciple: 'Topological sorting is strictly impossible on cyclic graphs. Kahn’s algorithm detects cycles when processed vertex count < V.'
    },
    {
      id: 'q-dsa-arr-1',
      topicId: 'dsa-arrays',
      conceptId: 'dsa-kadane',
      topicName: 'Arrays',
      conceptName: 'Kadane’s Maximum Subarray Algorithm',
      prompt: 'In Kadane’s algorithm for finding the maximum contiguous subarray sum, what is the correct state transition at index i for element arr[i]?',
      options: [
        {
          id: 'opt-arr-1',
          text: 'Decide whether to extend the previous subarray (currentMax + arr[i]) or start a new subarray at arr[i].',
          isCorrect: true
        },
        {
          id: 'opt-arr-2',
          text: 'Always add arr[i] regardless of whether currentMax is positive or negative.',
          isCorrect: false,
          trapReason: 'If currentMax < 0, adding it produces a smaller sum than starting fresh with arr[i].'
        },
        {
          id: 'opt-arr-3',
          text: 'Reset currentMax to 0 whenever arr[i] is odd.',
          isCorrect: false
        },
        {
          id: 'opt-arr-4',
          text: 'Sort the array first in O(N log N) before running Kadane’s algorithm.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2023', '2024'],
      detailedExplanation: 'Kadane algorithm invariant: currentMax at index i is max(arr[i], currentMax + arr[i]). If currentMax becomes negative, starting fresh at index i is superior to carrying a negative sum.',
      socraticHint: 'If your current running sum is -10 and current element is 5, does adding -10 help or hurt?',
      corePrinciple: 'Kadane: currentMax = max(arr[i], currentMax + arr[i]); globalMax = max(globalMax, currentMax).'
    }
  ],
  targetedRetestQuestions: {
    'dsa-bs-preconditions': [
      {
        id: 'rt-bs-1',
        topicId: 'dsa-binary-search',
        conceptId: 'dsa-bs-preconditions',
        topicName: 'Binary Search',
        conceptName: 'Search Space Monotonicity',
        prompt: 'Targeted Verification (Question 1 of 2): An array has elements `[10, 20, 5, 40, 50]`. You want to query for element `5`. What must you do before using binary search?',
        options: [
          {
            id: 'rt-bs-opt-1',
            text: 'Sort the array into ascending order `[5, 10, 20, 40, 50]` or use linear search O(N).',
            isCorrect: true
          },
          {
            id: 'rt-bs-opt-2',
            text: 'Run Binary Search immediately without modification.',
            isCorrect: false,
            trapReason: 'Array is unsorted (5 < 20), so Binary Search will discard valid elements.'
          },
          {
            id: 'rt-bs-opt-3',
            text: 'Reverse the array.',
            isCorrect: false
          },
          {
            id: 'rt-bs-opt-4',
            text: 'Compute hash code of middle element.',
            isCorrect: false
          }
        ],
        correctOptionIndex: 0,
        difficulty: 'MEDIUM',
        examFrequencyYears: ['2024'],
        detailedExplanation: 'Binary search requires sorted input. Since 5 appears after 20, the array is not monotonic. Sorting or linear scan is mandatory.',
        socraticHint: 'Is the array strictly non-decreasing?',
        corePrinciple: 'Monotonicity is the prerequisite invariant for Binary Search.'
      },
      {
        id: 'rt-bs-2',
        topicId: 'dsa-binary-search',
        conceptId: 'dsa-bs-preconditions',
        topicName: 'Binary Search',
        conceptName: 'Predicate Monotonicity (Binary Search on Answer)',
        prompt: 'Targeted Verification (Question 2 of 2): In "Binary Search on Answer" problems (e.g. Koko Eating Bananas, Capacity to Ship Packages), what property must the feasibility check function `canFinish(speed)` satisfy?',
        options: [
          {
            id: 'rt-bs-opt-2-1',
            text: 'The function must be monotonic: if speed X is feasible, every speed > X must also be feasible (FFFF...TTTT).',
            isCorrect: true
          },
          {
            id: 'rt-bs-opt-2-2',
            text: 'The function can return random booleans as long as search range is small.',
            isCorrect: false
          },
          {
            id: 'rt-bs-opt-2-3',
            text: 'The array of package weights must be strictly sorted beforehand.',
            isCorrect: false
          },
          {
            id: 'rt-bs-opt-2-4',
            text: 'The number of packages must be an exact power of 2.',
            isCorrect: false
          }
        ],
        correctOptionIndex: 0,
        difficulty: 'HARD',
        examFrequencyYears: ['2024', '2025'],
        detailedExplanation: 'Binary Search on Answer operates on the monotonicity of the predicate function `canFinish(speed)`. As speed increases, feasibility transitions once from False to True.',
        socraticHint: 'Think about predicate partition: does a higher speed ever make a feasible task infeasible?',
        corePrinciple: 'Binary Search on Answer requires monotonic predicate output (F -> T or T -> F).'
      }
    ]
  }
};

export const dbmsSubjectPreset: SubjectData = {
  id: 'subj-dbms',
  name: 'Database Management Systems',
  code: 'CS-402',
  examDateText: 'Friday, 2:00 PM',
  hoursUntilExam: 36,
  totalAvailableMinutes: 120,
  targetScore: 'Grade S / 90%+',
  syllabusCoveredPercentage: 84,
  topics: [
    {
      id: 'dbms-norm',
      name: 'Normalization',
      iconName: 'Database',
      masteryPercentage: 42,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 26,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: 'dbms-3nf-bcnf',
          topicId: 'dbms-norm',
          title: '3NF vs BCNF & Dependency Preservation',
          masteryPercentage: 42,
          examFrequencyWeight: 10,
          estimatedMinutesToRevise: 25,
          description: '3NF allows A in X->A to be a prime attribute; BCNF strictly requires X to be a superkey. BCNF decomposition cannot always preserve functional dependencies.',
          keyRule: '3NF guarantees dependency preservation and lossless join. BCNF guarantees lossless join, but does NOT guarantee functional dependency preservation.',
          commonPitfall: 'Believing that every relation can be decomposed into BCNF while simultaneously preserving all functional dependencies.'
        }
      ]
    },
    {
      id: 'dbms-trans',
      name: 'Transactions & Concurrency',
      iconName: 'RefreshCw',
      masteryPercentage: 61,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 20,
      priority: 'MEDIUM',
      colorClass: 'amber',
      concepts: [
        {
          id: 'dbms-strict-2pl',
          topicId: 'dbms-trans',
          title: 'Strict 2PL & Cascading Abort Prevention',
          masteryPercentage: 61,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 20,
          description: 'Strict 2PL requires holding all exclusive locks until commit/abort, guaranteeing recoverable and cascadeless schedules.',
          keyRule: 'Holding exclusive locks until the end of transaction eliminates cascading rollbacks.',
          commonPitfall: 'Assuming Basic 2PL prevents deadlocks (it only guarantees conflict serializability, not deadlock freedom).'
        }
      ]
    },
    {
      id: 'dbms-sql',
      name: 'SQL & Query Optimization',
      iconName: 'Code',
      masteryPercentage: 91,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 18,
      priority: 'LOW',
      colorClass: 'emerald',
      concepts: [
        {
          id: 'dbms-sql-exec-order',
          topicId: 'dbms-sql',
          title: 'Logical Query Processing Order',
          masteryPercentage: 91,
          examFrequencyWeight: 8,
          estimatedMinutesToRevise: 15,
          description: 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.',
          keyRule: 'WHERE filters rows before aggregation; HAVING filters aggregated groups.',
          commonPitfall: 'Using aggregate functions (e.g. SUM, COUNT) inside WHERE clause.'
        }
      ]
    },
    {
      id: 'dbms-index',
      name: 'Indexing & B+ Trees',
      iconName: 'HardDrive',
      masteryPercentage: 55,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 16,
      priority: 'MEDIUM',
      colorClass: 'amber',
      concepts: [
        {
          id: 'dbms-bplus-structure',
          topicId: 'dbms-index',
          title: 'B+ Tree Structure & Leaf Pointers',
          masteryPercentage: 55,
          examFrequencyWeight: 8,
          estimatedMinutesToRevise: 15,
          description: 'All records stored in doubly-linked leaf nodes; internal nodes store routing keys.',
          keyRule: 'Leaves contain actual data records / pointers and are linked sequentially for O(log N) point lookups + fast range scans.',
          commonPitfall: 'Thinking B-Trees store data only at leaves (that is B+ Tree, not standard B-Tree).'
        }
      ]
    }
  ],
  misconceptions: [
    {
      id: 'misc-dbms-1',
      conceptId: 'dbms-3nf-bcnf',
      conceptTitle: '3NF vs BCNF Dependency Preservation',
      topicId: 'dbms-norm',
      topicTitle: 'Normalization',
      questionPrompt: 'A relational schema R(A, B, C) has functional dependencies {AB -> C, C -> B}. Candidate keys are AB and AC. Which statement regarding decomposing R into BCNF is correct?',
      studentAnswerText: 'Any relation can be decomposed into BCNF such that both lossless join and dependency preservation are always guaranteed.',
      correctAnswerText: 'Decomposing R into BCNF guarantees lossless join, but the dependency AB -> C CANNOT be preserved in BCNF.',
      confidencePercentage: 90,
      timestamp: '1 hour ago',
      isResolved: false,
      underlyingMisconception: 'Believed that BCNF is strictly superior in every way and always preserves functional dependencies.',
      whyStudentWasConfident: 'Student remembered that BCNF eliminates all redundancy based on functional dependencies, assuming higher normal forms retain all properties of 3NF.',
      counterExample: 'For R(A,B,C) with {AB->C, C->B}, BCNF relations are R1(C,B) and R2(C,A). In this decomposition, the original dependency AB->C is lost and requires a costly join to enforce.',
      clarifiedRule: '3NF guarantees lossless join AND dependency preservation. BCNF guarantees lossless join, but NOT dependency preservation.',
      retestQuestionId: 'retest-dbms-bcnf-1'
    }
  ],
  attempts: [
    {
      id: 'att-dbms-1',
      questionId: 'q-dbms-norm-1',
      topicId: 'dbms-norm',
      conceptId: 'dbms-3nf-bcnf',
      selectedOptionIndex: 1,
      confidence: 'high',
      isCorrect: false,
      timestamp: '1 hour ago',
      category: 'MISCONCEPTION',
      timeSpentSeconds: 38
    }
  ],
  questions: [
    {
      id: 'q-dbms-norm-1',
      topicId: 'dbms-norm',
      conceptId: 'dbms-3nf-bcnf',
      topicName: 'Normalization',
      conceptName: '3NF vs BCNF & Dependency Preservation',
      prompt: 'For a relational schema R(A, B, C) with FDs {AB -> C, C -> B}, what is the fundamental trade-off when deciding between 3NF and BCNF normalization?',
      options: [
        {
          id: 'opt-dbms-1',
          text: '3NF preserves all functional dependencies and lossless join; BCNF achieves zero redundancy but loses the dependency AB -> C.',
          isCorrect: true
        },
        {
          id: 'opt-dbms-2',
          text: 'BCNF always guarantees both lossless join and dependency preservation for any relational schema.',
          isCorrect: false,
          trapReason: 'Classic university exam trap: BCNF does NOT guarantee dependency preservation.'
        },
        {
          id: 'opt-dbms-3',
          text: '3NF allows insertion and deletion anomalies to persist without bound.',
          isCorrect: false
        },
        {
          id: 'opt-dbms-4',
          text: 'BCNF requires relations to have at least 4 candidate keys.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'HARD',
      examFrequencyYears: ['2023', '2024', '2025'],
      detailedExplanation: 'In R(A,B,C) with {AB->C, C->B}, candidate keys are AB and AC. Relation is in 3NF because in C->B, B is a prime attribute. It is NOT in BCNF because C is not a superkey. Decomposing to BCNF loses AB->C.',
      socraticHint: 'Can you enforce AB -> C without computing a table join if R is split into (C, B) and (C, A)?',
      corePrinciple: '3NF preserves FDs. BCNF eliminates redundancy but may sacrifice dependency preservation.'
    }
  ],
  targetedRetestQuestions: {
    'dbms-3nf-bcnf': [
      {
        id: 'rt-dbms-1',
        topicId: 'dbms-norm',
        conceptId: 'dbms-3nf-bcnf',
        topicName: 'Normalization',
        conceptName: '3NF Invariant Verification',
        prompt: 'Targeted Verification (Question 1 of 2): In 3NF, what condition allows the functional dependency X -> Y to be valid even if X is NOT a superkey?',
        options: [
          {
            id: 'rt-dbms-opt-1',
            text: 'Every attribute in Y is a prime attribute (part of at least one candidate key).',
            isCorrect: true
          },
          {
            id: 'rt-dbms-opt-2',
            text: 'Y contains only integer data types.',
            isCorrect: false
          },
          {
            id: 'rt-dbms-opt-3',
            text: 'X is null in all rows.',
            isCorrect: false
          },
          {
            id: 'rt-dbms-opt-4',
            text: 'The table has no primary key defined.',
            isCorrect: false
          }
        ],
        correctOptionIndex: 0,
        difficulty: 'MEDIUM',
        examFrequencyYears: ['2024'],
        detailedExplanation: '3NF definition allows X -> Y if either X is a superkey OR Y is a prime attribute (part of a candidate key).',
        socraticHint: 'What is the relaxing clause in 3NF that BCNF removes?',
        corePrinciple: '3NF allows prime attribute on RHS of non-superkey dependencies.'
      }
    ]
  }
};

export const osSubjectPreset: SubjectData = {
  id: 'subj-os',
  name: 'Operating Systems',
  code: 'CS-401',
  examDateText: 'In 3 Days',
  hoursUntilExam: 72,
  totalAvailableMinutes: 120,
  targetScore: 'Grade S / 90%+',
  syllabusCoveredPercentage: 80,
  topics: [
    {
      id: 'os-sync',
      name: 'Process Synchronization',
      iconName: 'Cpu',
      masteryPercentage: 48,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 24,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: 'os-semaphores',
          topicId: 'os-sync',
          title: 'Counting Semaphores & Deadlock Invariants',
          masteryPercentage: 48,
          examFrequencyWeight: 10,
          estimatedMinutesToRevise: 25,
          description: 'Atomic wait (P) and signal (V) operations, mutex locks, and condition variables.',
          keyRule: 'wait() decrements semaphore; signal() increments. Negative values represent waiting processes count.',
          commonPitfall: 'Calling signal() before wait() causing race conditions and critical section breaches.'
        }
      ]
    },
    {
      id: 'os-deadlocks',
      name: 'Deadlocks',
      iconName: 'AlertTriangle',
      masteryPercentage: 62,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 18,
      priority: 'MEDIUM',
      colorClass: 'amber',
      concepts: [
        {
          id: 'os-bankers',
          topicId: 'os-deadlocks',
          title: 'Banker’s Algorithm & Safe State Verification',
          masteryPercentage: 62,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 20,
          description: 'Resource allocation matrix, Need = Max - Allocation, and safe sequence determination.',
          keyRule: 'A system is safe if there exists at least one sequence <P1, P2... Pn> where Need_i <= Available + sum(Allocated).',
          commonPitfall: 'Assuming an unsafe state is guaranteed deadlock (an unsafe state merely has deadlock potential).'
        }
      ]
    },
    {
      id: 'os-memory',
      name: 'Memory Management',
      iconName: 'HardDrive',
      masteryPercentage: 70,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 20,
      priority: 'LOW',
      colorClass: 'emerald',
      concepts: [
        {
          id: 'os-paging-tlb',
          topicId: 'os-memory',
          title: 'Paging, TLB Hit Rates & Effective Access Time',
          masteryPercentage: 70,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 20,
          description: 'Translating logical to physical address, TLB cache hits/misses, and page fault penalties.',
          keyRule: 'Effective Access Time (EAT) = (Hit_Rate * (TLB + Mem)) + ((1 - Hit_Rate) * (TLB + 2*Mem)).',
          commonPitfall: 'Forgetting that a TLB miss requires 2 memory accesses in simple single-level paging.'
        }
      ]
    }
  ],
  misconceptions: [],
  attempts: [],
  questions: [
    {
      id: 'q-os-sync-1',
      topicId: 'os-sync',
      conceptId: 'os-semaphores',
      topicName: 'Process Synchronization',
      conceptName: 'Counting Semaphores & Deadlock Invariants',
      prompt: 'A counting semaphore S is initialized to 7. Then 12 wait() operations and 8 signal() operations are completed on S. What is the resulting value of S?',
      options: [
        {
          id: 'opt-os-1',
          text: '3 (7 - 12 + 8 = 3, with 0 processes blocked).',
          isCorrect: true
        },
        {
          id: 'opt-os-2',
          text: '-5 with 5 processes blocked.',
          isCorrect: false,
          trapReason: 'Forgot to add the 8 signal() operations that increment the semaphore.'
        },
        {
          id: 'opt-os-3',
          text: '0',
          isCorrect: false
        },
        {
          id: 'opt-os-4',
          text: '7',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2023', '2024'],
      detailedExplanation: 'Semaphore value = Initial + Signals - Waits = 7 + 8 - 12 = 3. Since 3 > 0, three additional resources remain free.',
      socraticHint: 'Track net additions (+1 per signal) and net subtractions (-1 per wait).',
      corePrinciple: 'Semaphore arithmetic: Final Value = Initial + Signals - Waits.'
    }
  ],
  targetedRetestQuestions: {}
};

export const cnSubjectPreset: SubjectData = {
  id: 'subj-cn',
  name: 'Computer Networks',
  code: 'CS-403',
  examDateText: 'In 5 Days',
  hoursUntilExam: 120,
  totalAvailableMinutes: 120,
  targetScore: 'Grade S / 90%+',
  syllabusCoveredPercentage: 75,
  topics: [
    {
      id: 'cn-transport',
      name: 'Transport Layer',
      iconName: 'Globe',
      masteryPercentage: 54,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 22,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: 'cn-tcp-window',
          topicId: 'cn-transport',
          title: 'TCP Flow Control & Congestion Window',
          masteryPercentage: 54,
          examFrequencyWeight: 10,
          estimatedMinutesToRevise: 25,
          description: 'TCP 3-way handshake, slow start, AIMD, and sender window = min(rwnd, cwnd).',
          keyRule: 'The effective sender window is bounded by the minimum of Congestion Window (cwnd) and Receiver Advertised Window (rwnd).',
          commonPitfall: 'Assuming sender can send data equal to cwnd when receiver buffer (rwnd) is smaller.'
        }
      ]
    }
  ],
  misconceptions: [],
  attempts: [],
  questions: [
    {
      id: 'q-cn-tcp-1',
      topicId: 'cn-transport',
      conceptId: 'cn-tcp-window',
      topicName: 'Transport Layer',
      conceptName: 'TCP Flow Control & Congestion Window',
      prompt: 'In TCP protocol, if the sender’s congestion window (cwnd) is 64 KB and the receiver advertised window (rwnd) is 24 KB, what is the maximum amount of unacknowledged data the sender can transmit?',
      options: [
        {
          id: 'opt-cn-1',
          text: '24 KB (Sender Window = min(cwnd, rwnd)).',
          isCorrect: true
        },
        {
          id: 'opt-cn-2',
          text: '64 KB (The network capacity allows sending cwnd).',
          isCorrect: false,
          trapReason: 'Sending 64 KB would overflow receiver’s 24 KB buffer causing packet drops.'
        },
        {
          id: 'opt-cn-3',
          text: '88 KB (Sum of both windows).',
          isCorrect: false
        },
        {
          id: 'opt-cn-4',
          text: '40 KB (Difference between windows).',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2024'],
      detailedExplanation: 'TCP flow control mandates that Sender Window = min(cwnd, rwnd) to avoid network congestion and receiver buffer overflow.',
      socraticHint: 'If receiver can accept 24KB but router pipeline can take 64KB, what limits transmission?',
      corePrinciple: 'Effective TCP Window = min(cwnd, rwnd).'
    }
  ],
  targetedRetestQuestions: {}
};

/**
 * Intelligent Procedural Subject Generator
 * Generates authentic domain-specific concepts, questions, misconceptions, and retests
 * for ANY custom subject name entered by the user.
 */
export function generateCustomSubject(
  name: string,
  examDateText: string = 'Tomorrow, 9:00 AM',
  totalAvailableMinutes: number = 120
): SubjectData {
  const cleanId = `subj-custom-${Date.now()}`;
  const code = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') + '-201';
  const lower = name.toLowerCase();

  // If matches known preset exactly, clone and personalize
  if (lower.includes('dsa') || lower.includes('data structure') || lower.includes('algorithm')) {
    return {
      ...dsaSubjectPreset,
      id: cleanId,
      name: name,
      examDateText: examDateText,
      totalAvailableMinutes: totalAvailableMinutes
    };
  }

  if (lower.includes('dbms') || lower.includes('database') || lower.includes('sql')) {
    return {
      ...dbmsSubjectPreset,
      id: cleanId,
      name: name,
      examDateText: examDateText,
      totalAvailableMinutes: totalAvailableMinutes
    };
  }

  if (lower.includes('os') || lower.includes('operating system')) {
    return {
      ...osSubjectPreset,
      id: cleanId,
      name: name,
      examDateText: examDateText,
      totalAvailableMinutes: totalAvailableMinutes
    };
  }

  if (lower.includes('network') || lower.includes('cn')) {
    return {
      ...cnSubjectPreset,
      id: cleanId,
      name: name,
      examDateText: examDateText,
      totalAvailableMinutes: totalAvailableMinutes
    };
  }

  // Machine Learning / AI
  if (lower.includes('machine learning') || lower.includes('ml') || lower.includes('ai') || lower.includes('neural')) {
    const t1Id = `${cleanId}-t-ml1`;
    const t2Id = `${cleanId}-t-ml2`;
    const t3Id = `${cleanId}-t-ml3`;
    const c1Id = `${cleanId}-c-grad`;
    const c2Id = `${cleanId}-c-bias`;
    const c3Id = `${cleanId}-c-eval`;

    const generatedTopics: Topic[] = [
      {
        id: t1Id,
        name: 'Optimization & Gradient Descent',
        iconName: 'Sparkles',
        masteryPercentage: 42,
        examRelevance: 'CRITICAL',
        totalExamQuestionsAppeared: 22,
        priority: 'HIGH',
        colorClass: 'rose',
        concepts: [
          {
            id: c1Id,
            topicId: t1Id,
            title: 'Learning Rate, Invariants & Vanishing Gradients',
            masteryPercentage: 42,
            examFrequencyWeight: 10,
            estimatedMinutesToRevise: 25,
            description: 'Hyperparameter tuning, step size convergence, and non-convex loss surface navigation.',
            keyRule: 'Too large learning rate diverges/oscillates; too small learning rate traps in local minima / halts progress.',
            commonPitfall: 'Assuming high learning rate always speeds up convergence to global minimum.'
          }
        ]
      },
      {
        id: t2Id,
        name: 'Model Generalization & Regularization',
        iconName: 'Layers',
        masteryPercentage: 65,
        examRelevance: 'CRITICAL',
        totalExamQuestionsAppeared: 18,
        priority: 'MEDIUM',
        colorClass: 'amber',
        concepts: [
          {
            id: c2Id,
            topicId: t2Id,
            title: 'Bias-Variance Tradeoff & L1/L2 Penalties',
            masteryPercentage: 65,
            examFrequencyWeight: 9,
            estimatedMinutesToRevise: 20,
            description: 'Underfitting vs Overfitting; L1 (Lasso) produces sparse weights, L2 (Ridge) shrinks weights continuously.',
            keyRule: 'High Variance = Overfitting (needs regularization / more data); High Bias = Underfitting (needs more model complexity).',
            commonPitfall: 'Confusing L1 sparsity with L2 weight shrinkage.'
          }
        ]
      },
      {
        id: t3Id,
        name: 'Model Evaluation & Loss Metrics',
        iconName: 'CheckCircle2',
        masteryPercentage: 80,
        examRelevance: 'HIGH',
        totalExamQuestionsAppeared: 14,
        priority: 'LOW',
        colorClass: 'emerald',
        concepts: [
          {
            id: c3Id,
            topicId: t3Id,
            title: 'Precision, Recall, ROC-AUC on Imbalanced Data',
            masteryPercentage: 80,
            examFrequencyWeight: 8,
            estimatedMinutesToRevise: 15,
            description: 'Evaluating classification performance when positive class is rare (e.g. medical/fraud detection).',
            keyRule: 'Accuracy is misleading on imbalanced datasets; use F1-Score or PR-AUC.',
            commonPitfall: 'Using 99% accuracy as proof of good model performance when 99% of samples belong to negative class.'
          }
        ]
      }
    ];

    const generatedQuestions: Question[] = [
      {
        id: `q-${cleanId}-ml-1`,
        topicId: t1Id,
        conceptId: c1Id,
        topicName: 'Optimization & Gradient Descent',
        conceptName: 'Learning Rate & Convergence Invariant',
        prompt: `When training a neural network using Gradient Descent, what happens if the learning rate alpha is set excessively high?`,
        options: [
          {
            id: 'opt-ml-1',
            text: 'The loss oscillates wildly and may diverge, failing to reach the local/global minimum.',
            isCorrect: true
          },
          {
            id: 'opt-ml-2',
            text: 'The model guarantees convergence in fewer epochs.',
            isCorrect: false,
            trapReason: 'High confidence trap: Large step sizes overshoot the valleys of the loss surface.'
          },
          {
            id: 'opt-ml-3',
            text: 'Gradient norms automatically scale down to zero.',
            isCorrect: false
          },
          {
            id: 'opt-ml-4',
            text: 'The model converts into a linear model.',
            isCorrect: false
          }
        ],
        correctOptionIndex: 0,
        difficulty: 'MEDIUM',
        examFrequencyYears: ['2024'],
        detailedExplanation: 'Excessive learning rate overshoots the minimum and causes loss divergence.',
        socraticHint: 'If you take giant leaps on a steep mountain path, will you land gently at the bottom of the valley?',
        corePrinciple: 'Learning rate must be tuned to step down the gradient slope without overshooting.'
      }
    ];

    const generatedMisconception: Misconception = {
      id: `misc-${cleanId}-ml`,
      conceptId: c1Id,
      conceptTitle: 'Learning Rate & Convergence Invariant',
      topicId: t1Id,
      topicTitle: 'Optimization & Gradient Descent',
      questionPrompt: 'When training a neural network using Gradient Descent, what happens if the learning rate alpha is set excessively high?',
      studentAnswerText: 'The model guarantees convergence in fewer epochs by taking larger steps.',
      correctAnswerText: 'The loss oscillates wildly and may diverge, failing to reach the local/global minimum.',
      confidencePercentage: 90,
      timestamp: 'Just now',
      isResolved: false,
      underlyingMisconception: 'Believed that larger step size directly correlates with faster and guaranteed convergence.',
      whyStudentWasConfident: 'Intuitively thought bigger steps mean finishing the training journey faster.',
      counterExample: 'Consider loss function f(x) = x^2. With learning rate alpha = 1.1, starting at x=2 yields x_next = 2 - 1.1*(4) = -2.4 -> x_next2 = 2.88 (diverging to infinity).',
      clarifiedRule: 'Gradient Descent Invariant: Step size must satisfy the Lipschitz continuity condition to ensure monotonic loss reduction.',
      retestQuestionId: `retest-${c1Id}`
    };

    return {
      id: cleanId,
      name: name,
      code: code,
      examDateText: examDateText,
      hoursUntilExam: 48,
      totalAvailableMinutes: totalAvailableMinutes,
      targetScore: 'Grade S / 90%+',
      syllabusCoveredPercentage: 82,
      topics: generatedTopics,
      misconceptions: [generatedMisconception],
      attempts: [
        {
          id: `att-${cleanId}-1`,
          questionId: `q-${cleanId}-ml-1`,
          topicId: t1Id,
          conceptId: c1Id,
          selectedOptionIndex: 1,
          confidence: 'high',
          isCorrect: false,
          timestamp: 'Just now',
          category: 'MISCONCEPTION',
          timeSpentSeconds: 30
        }
      ],
      questions: generatedQuestions,
      targetedRetestQuestions: {
        [c1Id]: [
          {
            id: `rt-${c1Id}-1`,
            topicId: t1Id,
            conceptId: c1Id,
            topicName: 'Optimization & Gradient Descent',
            conceptName: 'Learning Rate Invariant',
            prompt: `Targeted Verification: How does Learning Rate Decay or Adam optimizer prevent gradient divergence?`,
            options: [
              {
                id: 'rt-ml-opt-1',
                text: 'By progressively reducing step sizes as parameters approach the loss minimum.',
                isCorrect: true
              },
              {
                id: 'rt-ml-opt-2',
                text: 'By eliminating all gradients.',
                isCorrect: false
              },
              {
                id: 'rt-ml-opt-3',
                text: 'By ignoring negative gradients.',
                isCorrect: false
              },
              {
                id: 'rt-ml-opt-4',
                text: 'By doubling the step size at each epoch.',
                isCorrect: false
              }
            ],
            correctOptionIndex: 0,
            difficulty: 'MEDIUM',
            examFrequencyYears: ['2024'],
            detailedExplanation: 'Decaying step size ensures smooth convergence near the minimum.',
            socraticHint: 'Why slow down as you approach the destination?',
            corePrinciple: 'Adaptive learning rates ensure convergence.'
          }
        ]
      }
    };
  }

  // General Subject Generator for ANY User-Entered Subject
  const t1Id = `${cleanId}-t1`;
  const t2Id = `${cleanId}-t2`;
  const t3Id = `${cleanId}-t3`;
  const t4Id = `${cleanId}-t4`;
  const c1Id = `${cleanId}-c1`;
  const c2Id = `${cleanId}-c2`;
  const c3Id = `${cleanId}-c3`;
  const c4Id = `${cleanId}-c4`;

  const customTopics: Topic[] = [
    {
      id: t1Id,
      name: `${name} Core Fundamentals & Architecture`,
      iconName: 'BookOpen',
      masteryPercentage: 38,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 24,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: c1Id,
          topicId: t1Id,
          title: `Foundational Invariants & Preconditions in ${name}`,
          masteryPercentage: 38,
          examFrequencyWeight: 10,
          estimatedMinutesToRevise: 25,
          description: `Essential definitions, architectural rules, and theoretical boundary conditions tested in ${name} exams.`,
          keyRule: `Always verify that state preconditions are satisfied before applying optimizations in ${name}.`,
          commonPitfall: `Applying standard formulas without verifying that domain constraints are met.`
        }
      ]
    },
    {
      id: t2Id,
      name: `Core Theorems & Applied Patterns`,
      iconName: 'Sparkles',
      masteryPercentage: 58,
      examRelevance: 'CRITICAL',
      totalExamQuestionsAppeared: 18,
      priority: 'HIGH',
      colorClass: 'rose',
      concepts: [
        {
          id: c2Id,
          topicId: t2Id,
          title: `Key Algorithmic & Analytical Techniques`,
          masteryPercentage: 58,
          examFrequencyWeight: 9,
          estimatedMinutesToRevise: 20,
          description: `Standard solution patterns, trade-off analysis, and exam problem models.`,
          keyRule: `Analyze time-space trade-offs and resource bounds before choosing implementation.`,
          commonPitfall: `Confusing average-case behavior with worst-case constraints under exam stress.`
        }
      ]
    },
    {
      id: t3Id,
      name: `Boundary Conditions & Edge-Case Traps`,
      iconName: 'AlertTriangle',
      masteryPercentage: 68,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 15,
      priority: 'MEDIUM',
      colorClass: 'amber',
      concepts: [
        {
          id: c3Id,
          topicId: t3Id,
          title: `Edge Cases & Common Distractor Patterns`,
          masteryPercentage: 68,
          examFrequencyWeight: 8,
          estimatedMinutesToRevise: 15,
          description: `Common traps set by university exam setters in ${name} questions.`,
          keyRule: `Explicitly validate extreme values, null states, and boundary conditions.`,
          commonPitfall: `Assuming inputs always fall strictly within ideal standard ranges.`
        }
      ]
    },
    {
      id: t4Id,
      name: `Practical Synthesis & Exam Problem Solving`,
      iconName: 'Layers',
      masteryPercentage: 86,
      examRelevance: 'HIGH',
      totalExamQuestionsAppeared: 12,
      priority: 'LOW',
      colorClass: 'emerald',
      concepts: [
        {
          id: c4Id,
          topicId: t4Id,
          title: `Synthesis, Proofs & Applied Implementations`,
          masteryPercentage: 86,
          examFrequencyWeight: 7,
          estimatedMinutesToRevise: 15,
          description: `End-to-end question workflows and comprehensive multi-step reasoning.`,
          keyRule: `Structure proofs and calculations systematically with clear intermediate steps.`,
          commonPitfall: `Skipping intermediate verification steps leading to propagated arithmetic errors.`
        }
      ]
    }
  ];

  const customQuestions: Question[] = [
    {
      id: `q-${cleanId}-1`,
      topicId: t1Id,
      conceptId: c1Id,
      topicName: `${name} Core Fundamentals & Architecture`,
      conceptName: `Foundational Invariants & Preconditions in ${name}`,
      prompt: `In ${name} exam questions, which principle is most critical for avoiding edge-case errors?`,
      options: [
        {
          id: `opt-${cleanId}-1`,
          text: `Strictly verify that foundational boundary conditions and structural invariants in ${name} are satisfied before state transitions.`,
          isCorrect: true
        },
        {
          id: `opt-${cleanId}-2`,
          text: 'Apply shortcuts blindly without verifying input domain constraints.',
          isCorrect: false,
          trapReason: `Classic distractor: Exam questions in ${name} specifically test scenarios where shortcuts fail.`
        },
        {
          id: `opt-${cleanId}-3`,
          text: 'Ignore boundary invariants to optimize runtime.',
          isCorrect: false
        },
        {
          id: `opt-${cleanId}-4`,
          text: 'Assume edge cases never appear in university examinations.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'HARD',
      examFrequencyYears: ['2023', '2024', '2025'],
      detailedExplanation: `Foundational exam questions in ${name} test understanding of essential boundaries and invariant constraints.`,
      socraticHint: 'What breaks most systems and algorithms when given unexpected inputs?',
      corePrinciple: `Always verify edge cases and invariant constraints before applying operational transitions in ${name}.`
    },
    {
      id: `q-${cleanId}-2`,
      topicId: t2Id,
      conceptId: c2Id,
      topicName: `Core Theorems & Applied Patterns`,
      conceptName: `Key Algorithmic & Analytical Techniques`,
      prompt: `When evaluating efficiency in ${name}, what is the primary consideration?`,
      options: [
        {
          id: `opt-${cleanId}-2-1`,
          text: 'Balancing time complexity, space overhead, and resource limits under worst-case bounds.',
          isCorrect: true
        },
        {
          id: `opt-${cleanId}-2-2`,
          text: 'Always optimizing for best-case performance only.',
          isCorrect: false
        },
        {
          id: `opt-${cleanId}-2-3`,
          text: 'Ignoring hardware and memory constraints entirely.',
          isCorrect: false
        },
        {
          id: `opt-${cleanId}-2-4`,
          text: 'Assuming infinite memory availability.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2024'],
      detailedExplanation: `Robust analysis in ${name} balances space and time requirements under worst-case limits.`,
      socraticHint: 'Consider why worst-case guarantees matter in exam questions.',
      corePrinciple: 'Always evaluate algorithms under worst-case boundaries.'
    }
  ];

  const customMisconception: Misconception = {
    id: `misc-${cleanId}`,
    conceptId: c1Id,
    conceptTitle: `Foundational Invariants & Preconditions in ${name}`,
    topicId: t1Id,
    topicTitle: `${name} Core Fundamentals & Architecture`,
    questionPrompt: `In ${name} exam questions, which principle is most critical for avoiding edge-case errors?`,
    studentAnswerText: 'Apply shortcuts blindly without verifying input domain constraints.',
    correctAnswerText: `Strictly verify that foundational boundary conditions and structural invariants in ${name} are satisfied before state transitions.`,
    confidencePercentage: 90,
    timestamp: 'Just now',
    isResolved: false,
    underlyingMisconception: `Believed that surface shortcuts work in ${name} without validating fundamental preconditions.`,
    whyStudentWasConfident: 'Intuitively recalled formula shortcuts without checking constraints.',
    counterExample: `Applying shortcuts without verifying invariants causes fatal runtime failures or incorrect calculation in ${name}.`,
    clarifiedRule: `Invariant Rule: Always validate domain preconditions before applying state transformations in ${name}.`,
    retestQuestionId: `retest-${c1Id}`
  };

  return {
    id: cleanId,
    name: name,
    code: code,
    examDateText: examDateText,
    hoursUntilExam: 48,
    totalAvailableMinutes: totalAvailableMinutes,
    targetScore: 'Grade A (85%+)',
    syllabusCoveredPercentage: 78,
    topics: customTopics,
    misconceptions: [customMisconception],
    attempts: [
      {
        id: `att-${cleanId}-1`,
        questionId: `q-${cleanId}-1`,
        topicId: t1Id,
        conceptId: c1Id,
        selectedOptionIndex: 1,
        confidence: 'high',
        isCorrect: false,
        timestamp: 'Just now',
        category: 'MISCONCEPTION',
        timeSpentSeconds: 32
      }
    ],
    questions: customQuestions,
    targetedRetestQuestions: {
      [c1Id]: [
        {
          id: `rt-${c1Id}-1`,
          topicId: t1Id,
          conceptId: c1Id,
          topicName: `${name} Core Fundamentals`,
          conceptName: `Invariant Verification Drill`,
          prompt: `Targeted Verification (Question 1 of 2): Which statement describes the essential invariant for ${name}?`,
          options: [
            {
              id: 'rt-c-opt-1',
              text: `Verify all structural constraints and base conditions before executing operations in ${name}.`,
              isCorrect: true
            },
            {
              id: 'rt-c-opt-2',
              text: 'Operate blindly on raw inputs without validation.',
              isCorrect: false,
              trapReason: 'Common misconception'
            },
            {
              id: 'rt-c-opt-3',
              text: 'Ignore resource bounds.',
              isCorrect: false
            },
            {
              id: 'rt-c-opt-4',
              text: 'None of the above.',
              isCorrect: false
            }
          ],
          correctOptionIndex: 0,
          difficulty: 'MEDIUM',
          examFrequencyYears: ['2024'],
          detailedExplanation: `Validates that the mental model was calibrated for ${name}.`,
          socraticHint: 'Recall the golden rule.',
          corePrinciple: `Verify constraints before executing operations in ${name}.`
        },
        {
          id: `rt-${c1Id}-2`,
          topicId: t1Id,
          conceptId: c1Id,
          topicName: `${name} Core Fundamentals`,
          conceptName: `Edge Case Verification`,
          prompt: `Targeted Verification (Question 2 of 2): How should boundary values in ${name} be handled?`,
          options: [
            {
              id: 'rt-c-opt-2-1',
              text: 'Explicitly test boundary invariants to prevent runtime exceptions and false states.',
              isCorrect: true
            },
            {
              id: 'rt-c-opt-2-2',
              text: 'Ignore boundary values.',
              isCorrect: false
            },
            {
              id: 'rt-c-opt-2-3',
              text: 'Assume boundary values never occur.',
              isCorrect: false
            },
            {
              id: 'rt-c-opt-2-4',
              text: 'Restart from scratch on every error.',
              isCorrect: false
            }
          ],
          correctOptionIndex: 0,
          difficulty: 'MEDIUM',
          examFrequencyYears: ['2024', '2025'],
          detailedExplanation: 'Defensive validation of edge cases ensures robust exam answers.',
          socraticHint: 'Why does edge case testing matter in exams?',
          corePrinciple: 'Explicitly validate edge cases with defensive assertions.'
        }
      ]
    }
  };
}

export const defaultSubjectsMap: Record<string, SubjectData> = {
  'subj-dsa': dsaSubjectPreset,
  'subj-dbms': dbmsSubjectPreset,
  'subj-os': osSubjectPreset,
  'subj-cn': cnSubjectPreset
};
