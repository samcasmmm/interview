/**
 * Performs a binary search on a sorted array to find the index of a target element.
 *
 * Time Complexity:
 *   - Best Case:  O(1) — target is at the middle on the first check
 *   - Worst Case: O(log n) — "Big O of log n" (search space is halved each step)
 * Space Complexity: O(1) — "Big O of one" (constant auxiliary space)
 *
 * @param {number[]} arr - Sorted array of numbers
 * @param {number} target - Value to locate
 * @returns {number} Index of target if found, otherwise -1
 */
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (target < arr[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
}

// let nums = [1, 5, 7, 8, 10, 55, 67];
// console.log(binarySearch(nums, 10)); // 4
// console.log(binarySearch(nums, 1));  // 0
// console.log(binarySearch(nums, 67)); // 6
// console.log(binarySearch(nums, 99)); // -1
