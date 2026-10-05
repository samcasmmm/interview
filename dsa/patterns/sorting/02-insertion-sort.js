// insertion sort
/**
 * Sorts an array in ascending order using Insertion Sort.
 * Builds the sorted array one element at a time by inserting each element into its correct position.
 *
 * Time Complexity:
 *   - Best Case:    O(n) — "Big O of n" (already sorted array, minimal shifting)
 *   - Average Case: O(n^2) — "Big O of n squared"
 *   - Worst Case:   O(n^2) — "Big O of n squared" (reverse sorted array, maximum shifting)
 * Space Complexity: O(1) — "Big O of one" (in-place sort)
 * Stability:        Stable (maintains relative order of equal elements)
 *
 * @param {number[]} arr - Array of numbers to sort
 * @returns {number[]} The sorted array
 */

let nums = [5, 4, 8, 1, 3];

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = current;
  }
  return arr;
}

console.log(insertionSort(nums)); // [1, 3, 4, 5, 8]
