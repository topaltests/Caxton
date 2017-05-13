'use strict';

const assert = require('assert');

function shift(currentShifts, N) {
  for (let i = currentShifts.length - 1; i >= 0; i--) {
    if (currentShifts[i] < (N - 1)) {
      currentShifts[i]++;
      break;
    }

    currentShifts[i] = 0;
  }

  return currentShifts;
}

function calcFieldPoints(field) {
  const N = field.length;
  let res = 0;

  // horizontal values
  for (let i = 0; i < N; i++) {
    const value = field[i][0];
    for (let j = 1; j < N; j++) {
      if (field[i][j] !== value) {
        break;
      }

      if (j === N-1) {
        res += value;
      }
    }
  }

  // vertical values
  for (let i = 0; i < N; i++) {
    const value = field[0][i];
    for (let j = 1; j < N; j++) {
      if (field[j][i] !== value) {
        break;
      }

      if (j === N-1) {
        res += value;
      }
    }
  }

  // diagonal values
  const value1 = field[0][0];
  let diagonal1HasDifferentValues = false;
  const value2 = field[0][N-1];
  let diagonal2HasDifferentValues = false;
  for (let i = 0; i < N; i++) {
    if (!diagonal1HasDifferentValues && (field[i][i] !== value1)) {
      diagonal1HasDifferentValues = true;
    }

    if (!diagonal2HasDifferentValues && (field[N-1-i][i] !== value2)) {
      diagonal2HasDifferentValues = true;
    }
  }
  if (!diagonal1HasDifferentValues) {
    res += value1;
  }
  if (!diagonal2HasDifferentValues) {
    res += value2;
  }

  return res;
}

function getFieldByShift(lines, shifts) {
  const res = [];

  for (let i = 0; i < lines.length; i++) {
    res.push([]);

    let shift = shifts[i];
    for (let j = 0; j < lines.length; j++) {
      res[i].push(lines[i][shift]);
      shift = (shift === lines[i].length-1) ? 0 : shift+1;
    }
  }

  return res;
}

module.exports = function(lines) {
  const linesCount = 3;

  assert(lines && (lines.length === linesCount));
  lines.forEach(line => line.forEach(digit => assert(!isNaN(digit))));

  const N = lines[0].length;
  const res = {};

  const shifts = Array(lines.length).fill(N-1);
  for (let i = 0; i < Math.pow(N, linesCount); i++) {
    shift(shifts, N);

    const points = calcFieldPoints(getFieldByShift(lines, shifts));
    if (!res[points]) {
      res[points] = [];
    }

    res[points].push([].concat(shifts));
  }

  return res;
};

// additional functions exported for testing only
module.exports.t = {
  shift,
  calcFieldPoints,
  getFieldByShift
};