/**
 * Generates the first `n` numbers of the Fibonacci sequence.
 *
 * Time Complexity:  O(n) — "Big O of n" (single loop running n - 2 times)
 * Space Complexity: O(n) total to store sequence, O(1) auxiliary space
 *
 * @param {number} n - Number of Fibonacci elements to return
 * @returns {number[]} Array containing the first `n` Fibonacci numbers
 */
function fibonacciSeq(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const res = [0, 1];

  for (let i = 2; i < n; i++) {
    res[i] = res[i - 1] + res[i - 2];
  }

  return res;
}

// console.log(fibonacciSeq(6)); // [ 0, 1, 1, 2, 3, 5 ]
// console.log(fibonacciSeq(7)); // [ 0, 1, 1, 2, 3, 5, 8 ]

/**
 * Generates the first `n` numbers of the Fibonacci sequence.
 *
 * Time Complexity:  O(2^n) — "Big O of 2 to the power n" (exponential time)
 * Space Complexity: O(n) — "Big O of n" (due to recursion stack depth)
 *
 * @param {number} n - Number of Fibonacci elements to return
 * @returns {number[]} Array containing the first `n` Fibonacci numbers
 */

function fibonacciRecursive(n) {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// console.log(fibonacciRecursive(6));
