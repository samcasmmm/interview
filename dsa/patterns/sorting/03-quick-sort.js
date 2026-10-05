/**
 * Sorts an array in ascending order using QuickSort (Divide and Conquer).
 * Picks a pivot and partitions elements into smaller and greater subarrays.
 *
 * Time Complexity:
 *   - Best Case:    O(n log n) — "Big O of n log n" (balanced partitions)
 *   - Average Case: O(n log n) — "Big O of n log n"
 *   - Worst Case:   O(n^2) — "Big O of n squared" (already sorted array with bad pivot)
 * Space Complexity: O(n) — "Big O of n" (allocates new partition arrays)
 * Stability:        Unstable
 *
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} The sorted array
 */
function quickSort(arr) {
  if (arr.length < 2) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  // Iterate up to arr.length - 1 to exclude the pivot itself
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// let nums = [5, 4, 8, 1, 3];
// console.log(quickSort(nums)); // [1, 3, 4, 5, 8]
