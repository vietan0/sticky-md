// this file is just a place to test logic quickly
// console.log(typeof null);
// console.log(null === null);

function extractedLabelIsUnique(x: string): boolean {
  const allLabelNames = ['gorilla', 'goku', 'arsenal', 'gaming'];
  return allLabelNames.some((label_name) => {
    console.log(label_name.match(x));
    return label_name.match(x);
  });
}

console.log(extractedLabelIsUnique('ar'));
