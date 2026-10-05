/**
 * Performs a linear search to find the index of a target element in an array.
 *
 * Time Complexity:
 *   - Best Case:  O(1) — target is at index 0
 *   - Worst Case: O(n) — "Big O of n" (target is at the end or not present)
 * Space Complexity: O(1) — "Big O of one" (constant auxiliary space)
 *
 * @param {number[]} arr - Array of elements to search through
 * @param {number} target - Value to locate
 * @returns {number} Index of target if found, otherwise -1
 */
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

// let arr = [1, 2, 3, 4, 5];
// console.log(linearSearch(arr, 4)); // 3
// console.log(linearSearch(arr, 9)); // -1
