import type { SubjectConfig, Topic, Question, Misconception, UserQuestionAttempt } from '../types';

export const initialSubjectConfig: SubjectConfig = {
  id: 'dsa-cs201',
  name: 'Data Structures & Algorithms (DSA)',
  code: 'CS-201',
  examDateText: 'Tomorrow, 9:00 AM',
  hoursUntilExam: 14,
  totalAvailableMinutes: 120, // 2 Hours revision budget
  targetScore: 'Grade A (90%+)',
  syllabusCoveredPercentage: 90,
};

export const initialTopics: Topic[] = [
  {
    id: 'topic-bs',
    name: 'Binary Search',
    iconName: 'BinarySearch',
    masteryPercentage: 30, // Specified by user (~30%, High Priority)
    examRelevance: 'CRITICAL',
    totalExamQuestionsAppeared: 19,
    priority: 'HIGH',
    colorClass: 'rose',
    concepts: [
      {
        id: 'concept-bs-monotonic',
        topicId: 'topic-bs',
        title: 'Search Space Monotonicity & Sortedness Invariant',
        masteryPercentage: 24,
        examFrequencyWeight: 10,
        estimatedMinutesToRevise: 25,
        description: 'Understanding that standard Binary Search fundamentally relies on monotonic order (or predicate monotonicity) across the entire search space, and cannot be applied to unsorted or arbitrary arrays without prior sorting or a transformed monotonic predicate.',
        keyRule: 'Binary search requires the search space (or decision predicate) to be strictly MONOTONIC: if P(mid) is true, then all x >= mid (or <= mid) must also evaluate predictably.',
        commonPitfall: 'Assuming binary search can divide-and-conquer an arbitrary unsorted array to find elements in O(log N) without preprocessing.',
      },
      {
        id: 'concept-bs-bounds',
        topicId: 'topic-bs',
        title: 'Lower Bound, Upper Bound & Search on Answer',
        masteryPercentage: 36,
        examFrequencyWeight: 9,
        estimatedMinutesToRevise: 15,
        description: 'Implementing exact left/right boundary bisections and binary searching on answer spaces (e.g., Koko Eating Bananas, Capacity to Ship Packages).',
        keyRule: 'To prevent infinite loops with integer division: when updating left = mid, use mid = left + (right - left + 1) / 2.',
        commonPitfall: 'Off-by-one errors when adjusting left = mid vs left = mid + 1, causing infinite recursion/loops.',
      }
    ]
  },
  {
    id: 'topic-graphs',
    name: 'Graphs',
    iconName: 'Network',
    masteryPercentage: 40,
    examRelevance: 'CRITICAL',
    totalExamQuestionsAppeared: 18,
    priority: 'HIGH',
    colorClass: 'rose',
    concepts: [
      {
        id: 'concept-topo-sort',
        topicId: 'topic-graphs',
        title: 'Topological Sort & Cycle Detection (Kahn’s Algorithm)',
        masteryPercentage: 38,
        examFrequencyWeight: 9,
        estimatedMinutesToRevise: 20,
        description: 'In-degree array computation, queue processing for DAG ordering, and cycle detection when processed count < V.',
        keyRule: 'Topological sort is ONLY valid on Directed Acyclic Graphs (DAGs). If Kahn’s BFS processes fewer than V vertices, a cycle exists.',
        commonPitfall: 'Attempting to run topological sort on undirected graphs or graphs containing cycles.',
      },
      {
        id: 'concept-dijkstra',
        topicId: 'topic-graphs',
        title: 'Shortest Path (Dijkstra vs Bellman-Ford)',
        masteryPercentage: 42,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 18,
        description: 'Min-heap priority queue relaxation O((V+E) log V) and why negative edge weights break Dijkstra greedy choices.',
        keyRule: 'Dijkstra assumes distances to settled vertices never decrease. Negative edges require Bellman-Ford or SPFA.',
        commonPitfall: 'Applying Dijkstra to graphs with negative weight edges, leading to incorrect shortest paths.',
      }
    ]
  },
  {
    id: 'topic-sliding-window',
    name: 'Sliding Window',
    iconName: 'Sliders',
    masteryPercentage: 45, // Specified by user (Wrong + Low Conf → Knowledge Gap)
    examRelevance: 'HIGH',
    totalExamQuestionsAppeared: 15,
    priority: 'MEDIUM',
    colorClass: 'amber',
    concepts: [
      {
        id: 'concept-dynamic-window',
        topicId: 'topic-sliding-window',
        title: 'Dynamic Window Expansion & Contraction',
        masteryPercentage: 44,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 18,
        description: 'Expanding right pointer to satisfy window condition, and shrinking left pointer when invariant is violated (e.g. Longest Substring with At Most K Distinct Characters).',
        keyRule: 'Maintain invariant: Expand right pointer until invalid, then contract left pointer until valid again.',
        commonPitfall: 'Resetting the left pointer to the beginning instead of incrementally contracting it.',
      },
      {
        id: 'concept-fixed-window',
        topicId: 'topic-sliding-window',
        title: 'Fixed Size Window Aggregations',
        masteryPercentage: 46,
        examFrequencyWeight: 7,
        estimatedMinutesToRevise: 12,
        description: 'Sliding a fixed-size K window across an array in O(N) time without recomputing sums or frequencies from scratch.',
        keyRule: 'Subtract outgoing element at (i - K) and add incoming element at (i).',
        commonPitfall: 'Forgetting to handle initial window initialization before entering the sliding loop.',
      }
    ]
  },
  {
    id: 'topic-trees',
    name: 'Trees',
    iconName: 'GitBranch',
    masteryPercentage: 52,
    examRelevance: 'CRITICAL',
    totalExamQuestionsAppeared: 17,
    priority: 'MEDIUM',
    colorClass: 'amber',
    concepts: [
      {
        id: 'concept-tree-lca',
        topicId: 'topic-trees',
        title: 'Lowest Common Ancestor (LCA) in Binary Trees & BSTs',
        masteryPercentage: 50,
        examFrequencyWeight: 9,
        estimatedMinutesToRevise: 15,
        description: 'Recursive bottom-up traversal for general binary trees vs directional comparison in BSTs.',
        keyRule: 'In BST: if both nodes are smaller, move left; if both are larger, move right; otherwise current node is LCA.',
        commonPitfall: 'Traversing both children in a BST when BST ordering allows O(H) single-path descent.',
      },
      {
        id: 'concept-bst-valid',
        topicId: 'topic-trees',
        title: 'Validate Binary Search Tree & Inorder Traversal',
        masteryPercentage: 54,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 12,
        description: 'Passing min/max valid range intervals down recursion to prevent descendant violations.',
        keyRule: 'Checking only left < root < right is insufficient; all left descendants must be < root and all right descendants > root.',
        commonPitfall: 'Only checking immediate left and right child nodes instead of global ancestor bounds.',
      }
    ]
  },
  {
    id: 'topic-sorting',
    name: 'Sorting',
    iconName: 'ArrowUpDown',
    masteryPercentage: 58, // Specified by user (Correct + Low Conf → Fragile Knowledge)
    examRelevance: 'HIGH',
    totalExamQuestionsAppeared: 14,
    priority: 'MEDIUM',
    colorClass: 'amber',
    concepts: [
      {
        id: 'concept-quickselect',
        topicId: 'topic-sorting',
        title: 'Quickselect & Partitioning (Lomuto vs Hoare)',
        masteryPercentage: 56,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 15,
        description: 'Finding K-th smallest/largest element in O(N) average time by pruning unneeded partition halves.',
        keyRule: 'Quickselect recurses ONLY into the half containing index K, achieving O(N) average time complexity.',
        commonPitfall: 'Recursing on both sub-arrays like Quicksort, which degrades complexity to O(N log N).',
      },
      {
        id: 'concept-merge-sort',
        topicId: 'topic-sorting',
        title: 'Merge Sort, Stability & Inversion Count',
        masteryPercentage: 60,
        examFrequencyWeight: 7,
        estimatedMinutesToRevise: 12,
        description: 'Counting cross-inversions during the merge step in O(N log N) time.',
        keyRule: 'When right array element is chosen before left array element, it forms (mid - i + 1) inversions.',
        commonPitfall: 'Assuming unstable sorting algorithms preserve original equal-key relative order.',
      }
    ]
  },
  {
    id: 'topic-stack-queue',
    name: 'Stack & Queue',
    iconName: 'Layers',
    masteryPercentage: 65,
    examRelevance: 'HIGH',
    totalExamQuestionsAppeared: 13,
    priority: 'MEDIUM',
    colorClass: 'amber',
    concepts: [
      {
        id: 'concept-monotonic-stack',
        topicId: 'topic-stack-queue',
        title: 'Monotonic Stack (Next Greater Element & Histogram Area)',
        masteryPercentage: 62,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 15,
        description: 'Maintaining strictly increasing/decreasing elements to resolve nearest greater/smaller queries in linear O(N) time.',
        keyRule: 'Pop elements from stack while incoming element breaks the monotonicity property.',
        commonPitfall: 'Using nested loops yielding O(N^2) instead of a single O(N) monotonic stack pass.',
      }
    ]
  },
  {
    id: 'topic-linked-lists',
    name: 'Linked Lists',
    iconName: 'Link',
    masteryPercentage: 70,
    examRelevance: 'MODERATE',
    totalExamQuestionsAppeared: 11,
    priority: 'MEDIUM',
    colorClass: 'amber',
    concepts: [
      {
        id: 'concept-fast-slow',
        topicId: 'topic-linked-lists',
        title: 'Fast & Slow Pointer (Floyd’s Cycle Detection)',
        masteryPercentage: 70,
        examFrequencyWeight: 7,
        estimatedMinutesToRevise: 10,
        description: 'Detecting loops with slow (1x) and fast (2x) pointers, and locating the cycle entrance node.',
        keyRule: 'After meeting inside cycle, reset one pointer to head; advance both 1 step at a time to meet at the cycle entry.',
        commonPitfall: 'Accessing fast.next.next without verifying fast and fast.next are non-null.',
      }
    ]
  },
  {
    id: 'topic-two-pointers',
    name: 'Two Pointers',
    iconName: 'GitFork',
    masteryPercentage: 74,
    examRelevance: 'HIGH',
    totalExamQuestionsAppeared: 14,
    priority: 'MEDIUM',
    colorClass: 'amber',
    concepts: [
      {
        id: 'concept-opposite-pointers',
        topicId: 'topic-two-pointers',
        title: 'Opposite-Direction Pointers (2Sum Sorted, 3Sum, Container Water)',
        masteryPercentage: 74,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 10,
        description: 'Greedy pruning by moving left pointer forward or right pointer backward based on target comparisons.',
        keyRule: 'Sorting array allows eliminating entire search sub-spaces: if sum < target, left++ is guaranteed the only way to increase sum.',
        commonPitfall: 'Applying opposite-direction pointers on unsorted data without sorting first.',
      }
    ]
  },
  {
    id: 'topic-hashing',
    name: 'Hashing',
    iconName: 'Hash',
    masteryPercentage: 86,
    examRelevance: 'HIGH',
    totalExamQuestionsAppeared: 15,
    priority: 'LOW',
    colorClass: 'emerald',
    concepts: [
      {
        id: 'concept-prefix-hash',
        topicId: 'topic-hashing',
        title: 'Prefix Sums with HashMap (Subarray Sum Equals K)',
        masteryPercentage: 86,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 8,
        description: 'Storing running prefix sums in a hash table to find subarrays summing to K in O(N) time.',
        keyRule: 'If (current_prefix_sum - K) exists in hash map, a valid subarray ending at current index has been found.',
        commonPitfall: 'Forgetting to initialize hash map with {0: 1} to handle subarrays starting at index 0.',
      }
    ]
  },
  {
    id: 'topic-arrays',
    name: 'Arrays',
    iconName: 'Grid',
    masteryPercentage: 92, // Specified by user (Correct + High Conf → Solid Mastery)
    examRelevance: 'HIGH',
    totalExamQuestionsAppeared: 16,
    priority: 'LOW',
    colorClass: 'emerald',
    concepts: [
      {
        id: 'concept-kadane',
        topicId: 'topic-arrays',
        title: 'Kadane’s Algorithm (Maximum Subarray Sum)',
        masteryPercentage: 94,
        examFrequencyWeight: 8,
        estimatedMinutesToRevise: 5,
        description: 'Dynamic programming state: maxEndingHere = max(num, maxEndingHere + num).',
        keyRule: 'If current running sum drops below 0, start a fresh subarray from current element.',
        commonPitfall: 'Initializing max sum to 0 instead of -Infinity, causing bugs with all-negative arrays.',
      },
      {
        id: 'concept-matrix-traversal',
        topicId: 'topic-arrays',
        title: 'Matrix Spiral & Diagonal Traversals',
        masteryPercentage: 90,
        examFrequencyWeight: 6,
        estimatedMinutesToRevise: 6,
        description: 'Boundary tracking (top, bottom, left, right) for clockwise grid traversal.',
        keyRule: 'Shrink boundaries after completing each row/column traversal to avoid duplicate element processing.',
        commonPitfall: 'Traversing the same row twice in single-row or single-column matrices.',
      }
    ]
  }
];

export const initialMisconceptions: Misconception[] = [
  {
    id: 'misc-bs-unsorted-1',
    conceptId: 'concept-bs-monotonic',
    conceptTitle: 'Search Space Monotonicity & Sortedness Invariant',
    topicId: 'topic-bs',
    topicTitle: 'Binary Search',
    questionPrompt: 'You are given an arbitrary unsorted array of N integers: [14, 3, 27, 8, 19, 5, 2, 33]. A student proposes running binary search by calculating mid = (low + high) / 2 and comparing target = 19 with arr[mid]. If arr[mid] < target, they search the right half [mid+1...high]. Will this algorithm reliably find the element in O(log N) time?',
    studentAnswerText: 'Yes, binary search will always work because divide-and-conquer splits the search space in half regardless of array order.',
    correctAnswerText: 'No, binary search is invalid because discarding a half relies strictly on the sorted/monotonic order invariant. In an unsorted array, target 19 could be in the discarded half.',
    confidencePercentage: 90, // Specified by user: 90% confidence mistake
    timestamp: '1 hour ago',
    isResolved: false,
    underlyingMisconception: 'You believed that divide-and-conquer itself guarantees finding the element, forgetting that discarding half the elements requires strict monotonicity across the partition.',
    whyStudentWasConfident: 'The logic of comparing target with arr[mid] and splitting indices in half feels universally recursive, leading to the false intuition that binary search works on any array.',
    counterExample: 'In arr = [14, 3, 27, 8, 19, 5, 2, 33] with low=0, high=7: mid = 3 (arr[3] = 8). Target is 3. Since 3 < 8, the algorithm looks left and finds 3. BUT if Target was 5 (located at index 5), since 5 < 8, binary search discards the right half [4..7] where 5 actually resides! The element is permanently lost!',
    clarifiedRule: 'Binary Search STRICTLY requires the array or evaluation predicate to be sorted/monotonic. On arbitrary unsorted arrays, linear scan O(N) or pre-sorting O(N log N) is required.',
    retestQuestionId: 'retest-bs-monotonic-1'
  }
];

export const initialAttempts: UserQuestionAttempt[] = [
  {
    id: 'att-1',
    questionId: 'q-bs-1',
    topicId: 'topic-bs',
    conceptId: 'concept-bs-monotonic',
    selectedOptionIndex: 0,
    confidence: 'high',
    isCorrect: false, // 90% confidence wrong on Binary Search unsorted array!
    timestamp: '2026-08-19T17:30:00Z',
    category: 'MISCONCEPTION',
    timeSpentSeconds: 40
  },
  {
    id: 'att-2',
    questionId: 'q-sw-1',
    topicId: 'topic-sliding-window',
    conceptId: 'concept-dynamic-window',
    selectedOptionIndex: 2,
    confidence: 'low',
    isCorrect: false, // Sliding Window: Wrong + Low Confidence → Knowledge Gap
    timestamp: '2026-08-19T17:32:00Z',
    category: 'KNOWLEDGE_GAP',
    timeSpentSeconds: 65
  },
  {
    id: 'att-3',
    questionId: 'q-sort-1',
    topicId: 'topic-sorting',
    conceptId: 'concept-quickselect',
    selectedOptionIndex: 0,
    confidence: 'low',
    isCorrect: true, // Sorting: Correct + Low Confidence → Fragile Knowledge (Lucky guess)
    timestamp: '2026-08-19T17:34:00Z',
    category: 'FRAGILE_KNOWLEDGE',
    timeSpentSeconds: 30
  },
  {
    id: 'att-4',
    questionId: 'q-arr-1',
    topicId: 'topic-arrays',
    conceptId: 'concept-kadane',
    selectedOptionIndex: 0,
    confidence: 'high',
    isCorrect: true, // Arrays: Correct + High Confidence → Solid Mastery
    timestamp: '2026-08-19T17:36:00Z',
    category: 'SOLID_MASTERY',
    timeSpentSeconds: 18
  },
  {
    id: 'att-5',
    questionId: 'q-graphs-1',
    topicId: 'topic-graphs',
    conceptId: 'concept-topo-sort',
    selectedOptionIndex: 1,
    confidence: 'medium',
    isCorrect: false,
    timestamp: '2026-08-19T17:38:00Z',
    category: 'KNOWLEDGE_GAP',
    timeSpentSeconds: 45
  }
];

export const diagnosticQuestionBank: Question[] = [
  {
    id: 'q-bs-1',
    topicId: 'topic-bs',
    conceptId: 'concept-bs-monotonic',
    topicName: 'Binary Search',
    conceptName: 'Search Space Monotonicity & Invariant',
    prompt: 'You are asked to search for target integer X in an unsorted array of N elements. A student suggests applying Binary Search directly: checking mid = (low + high) / 2 and branching left or right. What is fundamentally TRUE regarding this approach?',
    options: [
      {
        id: 'opt-1',
        text: 'It works correctly in O(log N) time because each comparison halves the remaining search range.',
        isCorrect: false,
        trapReason: 'Dangerous misconception: assuming divide-and-conquer halving works without monotonic ordering.'
      },
      {
        id: 'opt-2',
        text: 'It is fundamentally incorrect and will fail to find elements, because discarding a half requires elements to be sorted.',
        isCorrect: true
      },
      {
        id: 'opt-3',
        text: 'It works only if the array length N is an exact power of 2.',
        isCorrect: false,
        trapReason: 'Array size parity is unrelated to the correctness of binary search.'
      },
      {
        id: 'opt-4',
        text: 'It works with O(N) worst-case time complexity on unsorted data.',
        isCorrect: false,
        trapReason: 'It will return wrong answers or fail to locate existing items, not just take O(N).'
      }
    ],
    correctOptionIndex: 1,
    difficulty: 'HARD',
    examFrequencyYears: ['2022', '2023', '2024', '2025'],
    detailedExplanation: 'Binary search is only valid when the search space possesses monotonicity. In an unsorted array, target X could reside in the discarded half, causing binary search to falsely conclude the element does not exist. On unsorted arrays, linear search O(N) or pre-sorting O(N log N) is mandatory.',
    socraticHint: 'If arr[mid] = 10 and target = 15, can you guarantee 15 is NOT located in the left subarray if the array is unsorted?',
    corePrinciple: 'Binary Search requires strict monotonicity. Never apply binary search to an arbitrary unsorted array without prior sorting or a monotonic predicate function.'
  },
  {
    id: 'q-sw-1',
    topicId: 'topic-sliding-window',
    conceptId: 'concept-dynamic-window',
    topicName: 'Sliding Window',
    conceptName: 'Dynamic Window Invariant',
    prompt: 'When finding the longest substring with at most K distinct characters in string S, how should the left and right window pointers be adjusted?',
    options: [
      {
        id: 'opt-1',
        text: 'Advance right pointer to expand window; when distinct count exceeds K, advance left pointer until distinct count <= K.',
        isCorrect: true
      },
      {
        id: 'opt-2',
        text: 'When distinct count exceeds K, reset left pointer back to index 0 and recompute.',
        isCorrect: false,
        trapReason: 'Resetting left pointer loses O(N) amortized efficiency and causes O(N^2) redundant iterations.'
      },
      {
        id: 'opt-3',
        text: 'Keep right pointer fixed and only advance left pointer until string ends.',
        isCorrect: false
      },
      {
        id: 'opt-4',
        text: 'Restart window from right + 1 whenever distinct count exceeds K.',
        isCorrect: false,
        trapReason: 'Jumping past right causes valid substrings between left and right to be missed.'
      }
    ],
    correctOptionIndex: 0,
    difficulty: 'MEDIUM',
    examFrequencyYears: ['2023', '2024'],
    detailedExplanation: 'In dynamic sliding window, right pointer advances to expand the window. Whenever the window invariant is broken (distinct characters > K), the left pointer incrementally contracts the window until the invariant is restored. Since both pointers traverse at most N steps, the algorithm runs in O(N) time.',
    socraticHint: 'Think about how to maintain the valid window state without re-evaluating already visited characters.',
    corePrinciple: 'Sliding Window: Expand with right pointer; contract incrementally with left pointer to maintain the invariant in O(N) total time.'
  },
  {
    id: 'q-sort-1',
    topicId: 'topic-sorting',
    conceptId: 'concept-quickselect',
    topicName: 'Sorting',
    conceptName: 'Quickselect K-th Element Complexity',
    prompt: 'What is the average time complexity of finding the K-th smallest element in an unsorted array of N elements using the Quickselect algorithm?',
    options: [
      {
        id: 'opt-1',
        text: 'O(N) average time complexity because only one partition partition half is recursed into.',
        isCorrect: true
      },
      {
        id: 'opt-2',
        text: 'O(N log N) because sorting both halves is always required.',
        isCorrect: false,
        trapReason: 'Confusing Quickselect (which discards one half) with full Quicksort.'
      },
      {
        id: 'opt-3',
        text: 'O(1) constant time.',
        isCorrect: false
      },
      {
        id: 'opt-4',
        text: 'O(log N) worst case time.',
        isCorrect: false,
        trapReason: 'Partitioning the array takes O(N) work per step: N + N/2 + N/4 + ... = 2N = O(N).'
      }
    ],
    correctOptionIndex: 0,
    difficulty: 'MEDIUM',
    examFrequencyYears: ['2022', '2024'],
    detailedExplanation: 'Quickselect partitions the array around a pivot like Quicksort. However, once the pivot is in its final index P, if P == K, we return immediately. If K < P, we recurse ONLY into the left half; if K > P, ONLY into the right half. The work is N + N/2 + N/4 + ... = O(N) on average.',
    socraticHint: 'Does Quickselect need to sort the half that does NOT contain index K?',
    corePrinciple: 'Quickselect achieves O(N) average time by discarding one partition half at each recursive step.'
  },
  {
    id: 'q-arr-1',
    topicId: 'topic-arrays',
    conceptId: 'concept-kadane',
    topicName: 'Arrays',
    conceptName: 'Kadane’s Maximum Subarray Algorithm',
    prompt: 'In Kadane’s algorithm for finding the maximum contiguous subarray sum, what is the correct state transition at index i for element arr[i]?',
    codeSnippet: 'currentMax = Math.max(arr[i], currentMax + arr[i]);\nglobalMax = Math.max(globalMax, currentMax);',
    options: [
      {
        id: 'opt-1',
        text: 'Decide whether to extend the previous subarray (currentMax + arr[i]) or start a new subarray at arr[i].',
        isCorrect: true
      },
      {
        id: 'opt-2',
        text: 'Always add arr[i] regardless of whether currentMax is positive or negative.',
        isCorrect: false,
        trapReason: 'If currentMax < 0, adding it to arr[i] produces a smaller sum than starting fresh with arr[i].'
      },
      {
        id: 'opt-3',
        text: 'Reset currentMax to 0 whenever arr[i] is odd.',
        isCorrect: false
      },
      {
        id: 'opt-4',
        text: 'Sort the array first in O(N log N) before running Kadane’s algorithm.',
        isCorrect: false,
        trapReason: 'Kadane requires the original contiguous order; sorting destroys contiguity.'
      }
    ],
    correctOptionIndex: 0,
    difficulty: 'EASY',
    examFrequencyYears: ['2023', '2024', '2025'],
    detailedExplanation: 'Kadane’s DP state defines maxEndingHere[i] = max(arr[i], maxEndingHere[i-1] + arr[i]). If previous running sum was negative, starting a new subarray at arr[i] is strictly superior.',
    socraticHint: 'If your previous accumulated subarray sum was -10 and current element is 5, is it better to take (-10 + 5 = -5) or start fresh at 5?',
    corePrinciple: 'Kadane’s Algorithm evaluates at each step whether to extend the previous contiguous subarray or start anew.'
  },
  {
    id: 'q-graphs-1',
    topicId: 'topic-graphs',
    conceptId: 'concept-topo-sort',
    topicName: 'Graphs',
    conceptName: 'Topological Sort Applicability & Invariant',
    prompt: 'Which of the following graphs CANNOT have a valid Topological Ordering?',
    options: [
      {
        id: 'opt-1',
        text: 'A Directed Acyclic Graph (DAG) with 5 vertices and 4 edges.',
        isCorrect: false
      },
      {
        id: 'opt-2',
        text: 'A Directed Graph containing at least one directed cycle (e.g. A -> B -> C -> A).',
        isCorrect: true
      },
      {
        id: 'opt-3',
        text: 'A Directed Tree with a single root source.',
        isCorrect: false
      },
      {
        id: 'opt-4',
        text: 'A Disconnected Directed Graph consisting of two separate DAG components.',
        isCorrect: false
      }
    ],
    correctOptionIndex: 1,
    difficulty: 'MEDIUM',
    examFrequencyYears: ['2024', '2025'],
    detailedExplanation: 'Topological ordering requires that for every directed edge U -> V, vertex U appears before V in the order. In a cycle (A -> B -> C -> A), A must appear before B, B before C, and C before A, which is mathematically impossible. Therefore, topological sort exists ONLY on DAGs.',
    socraticHint: 'Can you linearize dependencies if task A depends on task B and task B depends on task A?',
    corePrinciple: 'Topological sorting is strictly impossible on cyclic graphs. Kahn’s algorithm detects cycles when processed vertex count < V.'
  }
];

export const targetedRetestQuestions: Record<string, Question[]> = {
  'concept-bs-monotonic': [
    {
      id: 'retest-bs-1',
      topicId: 'topic-bs',
      conceptId: 'concept-bs-monotonic',
      topicName: 'Binary Search',
      conceptName: 'Monotonic Search Space Requirement',
      prompt: 'TARGETED RETEST (Question 1 of 2): Why is it mathematically invalid to discard half of an array during binary search if the array is unsorted?',
      options: [
        {
          id: 'rt-bs-opt-1',
          text: 'Because in an unsorted array, the relation arr[mid] < target does NOT imply that target cannot exist in the left subarray [0...mid-1].',
          isCorrect: true
        },
        {
          id: 'rt-bs-opt-2',
          text: 'Because binary search can only run on arrays of prime length.',
          isCorrect: false,
          trapReason: 'Array length parity is irrelevant.'
        },
        {
          id: 'rt-bs-opt-3',
          text: 'Because mid calculation causes integer overflow in unsorted arrays only.',
          isCorrect: false
        },
        {
          id: 'rt-bs-opt-4',
          text: 'Because pointers low and high cannot cross in unsorted arrays.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'HARD',
      examFrequencyYears: ['2024', '2025'],
      detailedExplanation: 'Binary search decisions rely on the sorted property: if arr[mid] < target, then all elements to the left (<= mid) must also be <= arr[mid] < target, guaranteeing the target cannot be on the left. In an unsorted array, this guarantee is completely absent.',
      socraticHint: 'What guarantees that all elements in the left half are smaller than arr[mid]?',
      corePrinciple: 'Discarding half of the search space is only valid when sortedness or monotonic predicate ensures the target cannot reside in the discarded half.'
    },
    {
      id: 'retest-bs-2',
      topicId: 'topic-bs',
      conceptId: 'concept-bs-monotonic',
      topicName: 'Binary Search',
      conceptName: 'Rotated Sorted Array Binary Search Invariant',
      prompt: 'TARGETED RETEST (Question 2 of 2): In a rotated sorted array like [4, 5, 6, 7, 0, 1, 2], how does modified binary search still achieve O(log N) time?',
      options: [
        {
          id: 'rt-bs-opt-2-1',
          text: 'At any split mid, at least ONE half ([low..mid] or [mid..high]) is strictly sorted and monotonic, allowing deterministic range checks before discarding.',
          isCorrect: true
        },
        {
          id: 'rt-bs-opt-2-2',
          text: 'By sorting the array first in O(N log N) inside the while loop.',
          isCorrect: false,
          trapReason: 'Sorting inside loop would make it O(N log^2 N).'
        },
        {
          id: 'rt-bs-opt-2-3',
          text: 'By running two simultaneous linear searches from both ends.',
          isCorrect: false
        },
        {
          id: 'rt-bs-opt-2-4',
          text: 'Rotated sorted arrays cannot be searched in O(log N).',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'HARD',
      examFrequencyYears: ['2024', '2025'],
      detailedExplanation: 'Even after rotation, dividing at mid yields at least one perfectly sorted half (checked via arr[low] <= arr[mid]). If target falls within that sorted half’s range [arr[low], arr[mid]], we search it; otherwise we search the other half. This preserves O(log N) time by preserving monotonicity locally!',
      socraticHint: 'Look at [4, 5, 6, 7] vs [0, 1, 2]. Is one half always sorted?',
      corePrinciple: 'In modified binary search, identify which half is strictly sorted/monotonic to safely make the halving decision.'
    }
  ],
  'concept-topo-sort': [
    {
      id: 'retest-topo-1',
      topicId: 'topic-graphs',
      conceptId: 'concept-topo-sort',
      topicName: 'Graphs',
      conceptName: 'Kahn’s Algorithm Cycle Detection',
      prompt: 'TARGETED RETEST: In Kahn’s BFS algorithm for Topological Sort, how do you detect that the graph contains a directed cycle?',
      options: [
        {
          id: 'rt-topo-opt-1',
          text: 'The total number of vertices popped from the queue is strictly LESS than the total number of vertices V in the graph.',
          isCorrect: true
        },
        {
          id: 'rt-topo-opt-2',
          text: 'The queue size exceeds V at any point in time.',
          isCorrect: false,
          trapReason: 'Queue size is bounded by V.'
        },
        {
          id: 'rt-topo-opt-3',
          text: 'All in-degrees become negative.',
          isCorrect: false
        },
        {
          id: 'rt-topo-opt-4',
          text: 'The graph has more edges than vertices.',
          isCorrect: false
        }
      ],
      correctOptionIndex: 0,
      difficulty: 'MEDIUM',
      examFrequencyYears: ['2024'],
      detailedExplanation: 'In Kahn’s algorithm, only vertices with in-degree 0 are pushed to the queue. Vertices participating in a directed cycle never reach in-degree 0 because they depend circularly on each other. Thus, if count of processed vertices < V, a cycle is present.',
      socraticHint: 'Can a vertex inside a cycle A -> B -> A ever have in-degree 0?',
      corePrinciple: 'Kahn’s Algorithm: If processed vertex count < V, vertices trapped in a cycle were never enqueued.'
    }
  ]
};
