function sum(array: readonly number[]): number {
  return array.reduce((prev, value) => prev + value);
}

function addOne(array: readonly number[]): number[] {
  return array.map((value) => value + 1);
}
function add(array: readonly number[], operand: number): number[] {
  return array.map((value) => value + operand);
}
function subtract(array: readonly number[], operand: number): number[] {
  return array.map((value) => value - operand);
}
function multiply(array: readonly number[], operand: number): number[] {
  return array.map((value) => value * operand);
}
function divide(array: readonly number[], operand: number): number[] {
  return array.map((value) => value / operand);
}

function insertAverages(array: readonly number[]): number[] {
  const result: number[] = [];
  for (let index = 0; index < array.length - 1; index++) {
    result.push(array[index], (array[index] + array[index + 1]) / 2);
  }
  result.push(array[array.length - 1]);
  return result;
}

function removeAtOddIndexes<T>(array: readonly T[]): T[] {
  return array.filter((_, index) => index % 2 === 0);
}
function enclose<T>(array: readonly T[], value: T): T[] {
  const result: T[] = [];
  array.forEach((_, index) => {
    result.push(value, array[index]);
  });
  result.push(value);
  return result;
}

export {
  sum,
  addOne,
  add,
  subtract,
  multiply,
  divide,
  insertAverages,
  removeAtOddIndexes,
  enclose,
};
