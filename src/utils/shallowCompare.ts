export default function shallowCompare(arr1: unknown[], arr2: unknown[]) {
  return arr1.length === arr2.length && arr1.every((_, i) => arr1[i] === arr2[i]);
}
