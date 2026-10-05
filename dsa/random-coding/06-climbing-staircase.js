/**
 * Calculates the number of distinct ways to climb to the top of a staircase of `n` steps.
 * You can climb either 1 or 2 steps at a time.
 *
 * Recurrence: ways(n) = ways(n - 1) + ways(n - 2)
 *
 * Time Complexity:  O(n) — "Big O of n" (single pass loop)
 * Space Complexity: O(1) — "Big O of one" (constant auxiliary space using two variables)
 *
 * @param {number} n - Number of steps in the staircase
 * @returns {number} Total distinct ways to reach the top
 */
function climbingStaircase(n) {
  if (n <= 0) return 0;
  if (n <= 2) return n;

  let prev2 = 1; // ways for 1 step
  let prev1 = 2; // ways for 2 steps

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// console.log(climbingStaircase(1)); // 1
// console.log(climbingStaircase(2)); // 2
// console.log(climbingStaircase(3)); // 3
// console.log(climbingStaircase(4)); // 5
// console.log(climbingStaircase(5)); // 8

/**
 * Calculates the number of distinct ways to climb `n` steps using recursion.
 *
 * Time Complexity:  O(2^n) — "Big O of 2 to the power n" (exponential time)
 * Space Complexity: O(n) — "Big O of n" (due to recursion call stack depth)
 *
 * @param {number} n - Number of steps in the staircase
 * @returns {number} Total distinct ways to reach the top
 */
function climbingStaircaseRecursive(n) {
  if (n <= 2) return Math.max(0, n);
  return climbingStaircaseRecursive(n - 1) + climbingStaircaseRecursive(n - 2);
}

// console.log(climbingStaircaseRecursive(4)); // 5
