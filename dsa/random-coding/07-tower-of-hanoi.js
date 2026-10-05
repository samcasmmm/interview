/**
 * Solves the Tower of Hanoi puzzle using recursion (Divide and Conquer).
 * Prints the sequence of moves to transfer `n` disks from `fromRod` to `toRod` using `usingRod`.
 *
 * Total Moves:      2^n - 1
 * Time Complexity:  O(2^n) — "Big O of 2 to the power n" (doubles with each disk)
 * Space Complexity: O(n) — "Big O of n" (call stack depth is n)
 *
 * @param {number} n - Number of disks
 * @param {string} fromRod - Identifier of the source rod (e.g. 'A')
 * @param {string} toRod - Identifier of the target rod (e.g. 'C')
 * @param {string} usingRod - Identifier of the auxiliary rod (e.g. 'B')
 */
function towerOfHanoi(n, fromRod, toRod, usingRod) {
  if (n === 1) {
    console.log(`Move disk 1 from ${fromRod} to ${toRod}`);
    return;
  }

  // 1. Shift top n - 1 disks from source to auxiliary rod
  towerOfHanoi(n - 1, fromRod, usingRod, toRod);

  // 2. Move the nth disk from source to target rod
  console.log(`Move disk ${n} from ${fromRod} to ${toRod}`);

  // 3. Shift the n - 1 disks from auxiliary rod to target rod
  towerOfHanoi(n - 1, usingRod, toRod, fromRod);
}

// towerOfHanoi(3, 'A', 'C', 'B');
// Output for 3 disks (7 moves):
// Move disk 1 from A to C
// Move disk 2 from A to B
// Move disk 1 from C to B
// Move disk 3 from A to C
// Move disk 1 from B to A
// Move disk 2 from B to C
// Move disk 1 from A to C
