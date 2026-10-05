/**
 * Checks if a given integer n is a power of two using bitwise AND.
 *
 * Time Complexity:  O(1) — "Big O of one" (constant-time bitwise operations)
 * Space Complexity: O(1) — "Big O of one" (constant auxiliary space)
 *
 * @param {number} n - Integer to check
 * @returns {boolean} True if n is a power of two, false otherwise
 */
function powerOfTwo(n) {
  if (n <= 0) return false;
  return (n & (n - 1)) === 0;
}

// console.log(powerOfTwo(1));  // true (2^0)
// console.log(powerOfTwo(2));  // true (2^1)
// console.log(powerOfTwo(5));  // false
// console.log(powerOfTwo(16)); // true (2^4)

// recursive solution
/**
 * Calculates the power of a non-negative integer n using recursion (n^2).
 *
 * Time Complexity:  O(2^n) — "Big O of 2 to the power n" (exponential time)
 * Space Complexity: O(n) — "Big O of n" (due to recursion stack depth)
 *
 * @param {number} n - Non-negative integer
 * @returns {number} Power of n
 */

function powerOfTwoRecursive(n) {
  if (n <= 0) return false;
  if (n === 1) return true;
  if (n % 2 !== 0) return false;
  return powerOfTwoRecursive(n / 2);
}

// console.log(powerOfTwoRecursive(16)); // true
