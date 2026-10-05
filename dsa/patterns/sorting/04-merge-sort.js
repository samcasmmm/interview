/**
 * Sorts an array in ascending order using Merge Sort (Divide and Conquer).
 * Recursively splits the array into halves, sorts them, and merges the sorted halves.
 *
 * Time Complexity:
 *   - Best Case:    O(n log n) — "Big O of n log n"
 *   - Average Case: O(n log n) — "Big O of n log n"
 *   - Worst Case:   O(n log n) — "Big O of n log n" (guaranteed O(n log n))
 * Space Complexity: O(n) — "Big O of n" (temporary arrays created during merge)
 * Stability:        Stable (preserves relative order of equal elements)
 *
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} The sorted array
 */
function mergeSort(arr) {
  if (arr.length < 2) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

/**
 * Merges two sorted arrays into a single sorted array.
 */
function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Append any remaining elements
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// let nums = [5, 4, 8, 1, 3];
// console.log(mergeSort(nums)); // [1, 3, 4, 5, 8]
