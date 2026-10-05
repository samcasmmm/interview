/**
 * Checks if a given integer n is a prime number.
 *
 * Time Complexity:  O(sqrt(n)) — "Big O of square root n" (tests divisors up to sqrt(n))
 * Space Complexity: O(1) — "Big O of one" (constant auxiliary space)
 *
 * @param {number} n - Integer to check
 * @returns {boolean} True if n is prime, false otherwise
 */
function isPrime(n) {
  if (n <= 1) return false;

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      return false;
    }
  }

  return true;
}

// console.log(isPrime(1)); // false
// console.log(isPrime(2)); // true
// console.log(isPrime(4)); // false
// console.log(isPrime(5)); // true
// console.log(isPrime(9)); // false
