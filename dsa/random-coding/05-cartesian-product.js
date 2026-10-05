/**
 * Computes the Cartesian Product of two arrays (arr1 x arr2).
 * Returns all possible ordered pairs [a, b] where a is from arr1 and b is from arr2.
 *
 * Time Complexity:  O(m * n) — "Big O of m times n" (nested loops of lengths m and n)
 * Space Complexity: O(m * n) total to store pairs, O(1) auxiliary space
 *
 * @param {any[]} arr1 - First array of length m
 * @param {any[]} arr2 - Second array of length n
 * @returns {Array<[any, any]>} Array of all ordered pairs
 */
function cartesianProduct(arr1, arr2) {
  const result = [];

  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      result.push([arr1[i], arr2[j]]);
    }
  }

  return result;
}

// let a = [1, 2];
// let b = [3, 4, 5];
// console.log(cartesianProduct(a, b)); // [[1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]]
