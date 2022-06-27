export const create4DigitNumber = () => {
  const usedNum = new Set();
  let digits = '';

  while (digits.length < 4) {
    const n = Math.floor(Math.random() * 10);

    if (!usedNum.has(n)) {
      digits += n;
      usedNum.add(n);
    }
  }

  return digits;
};

export const verify4DigitNumber = (input: string, expected: string) => {
  if (!/^[0-9]{4}$/.test(input)) {
    return null;
  }

  let a = 0;
  let b = 0;
  const usedSlots = new Array(4).fill(false);

  for (let i = 0; i < 4; i++) {
    const n = input[i];

    if (n === expected[i]) {
      a += 1;
      if (usedSlots[i] === true) {
        b -= 1;
      }
    } else {
      const j = expected.indexOf(n);
      if (j !== -1 && !usedSlots[j]) {
        b += 1;
        usedSlots[j] = true;
      }
    }
  }

  return { a, b };
};
