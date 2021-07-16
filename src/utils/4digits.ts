export const generate4Digits = () => {
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

export const check4DigitFormat = (input: string) => /^[0-9]{4}$/.test(input);

export const verify4Digit = (actual: string, expected: string) => {
  let a = 0;
  let b = 0;

  for (let i = 0; i < 4; i++) {
    const n = actual[i];

    if (n === expected[i]) {
      a += 1;
    } else if (expected.indexOf(n) !== -1) {
      b += 1;
    }
  }

  return { a, b };
};
