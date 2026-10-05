/**
 * Sorts an array in ascending order using Bubble Sort.
 * Compares adjacent elements and bubbles the largest unsorted value to the end.
 *
 * Time Complexity:
 *   - Best Case:    O(n) — "Big O of n" (already sorted array with early exit flag)
 *   - Average Case: O(n^2) — "Big O of n squared"
 *   - Worst Case:   O(n^2) — "Big O of n squared" (reverse sorted array)
 * Space Complexity: O(1) — "Big O of one" (in-place sort)
 * Stability:        Stable (does not swap equal elements)
 *
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} The sorted array
 */
function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    if (!swapped) break;
  }

  return arr;
}

// let nums = [5, 4, 8, 1, 3];
// console.log(bubbleSort(nums)); // [1, 3, 4, 5, 8]
