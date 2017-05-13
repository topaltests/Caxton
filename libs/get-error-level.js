'use strict';

const assert = require('assert');

function getErrorLevel(expectedValue, value) {
  assert(expectedValue && expectedValue.length);
  assert(value && value.length);
  assert(expectedValue.length === value.length);
  expectedValue.forEach(v => assert(!isNaN(v)));
  value.forEach(v => assert(!isNaN(v)));

  const difference = expectedValue.reduce((res, currExpected, i) => {
    return res + Math.abs(currExpected - value[i]);
  }, 0);
  const expectedValuesSum = expectedValue.reduce((sum, curr) => sum+curr, 0);

  if (expectedValuesSum === 0) {
    return difference === 0 ? 0 : 1;
  } else {
    return difference / expectedValuesSum;
  }
}

module.exports = getErrorLevel;