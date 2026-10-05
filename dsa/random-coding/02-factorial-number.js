/**
 * Calculates the factorial of a non-negative integer n (n!).
 *
 * Time Complexity:  O(n) — "Big O of n" (single loop running n - 1 times)
 * Space Complexity: O(1) — "Big O of one" (constant auxiliary space)
 *
 * @param {number} n - Non-negative integer
 * @returns {number} Factorial of n
 */
function factorialNumber(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// console.log(factorialNumber(5)); // 120

/**
 * Calculates the factorial of a non-negative integer n using recursion (n!).
 *
 * Time Complexity:  O(n) — "Big O of n" (linear recursive chain of n frames)
 * Space Complexity: O(n) — "Big O of n" (call stack depth up to n)
 *
 * @param {number} n - Non-negative integer
 * @returns {number} Factorial of n
 */
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

// console.log(factorialRecursive(5)); // 120
