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
