'use strict';

const assert = require('assert');
const combinations = require('../libs/combinations');

describe('Combinations test', () => {
  describe('shift function test', () => {
    const shift = combinations.t.shift;

    it('trivial shift', () => {
      const res = shift([0, 0, 0], 5);
      assert.deepEqual(res, [0, 0, 1]);
    });

    it('shift on the only line', () => {
      const res = shift([4, 3, 3], 5);
      assert.deepEqual(res, [4, 3, 4]);
    });

    it('second line changing', () => {
      const res = shift([4, 3, 4], 5);
      assert.deepEqual(res, [4, 4, 0]);
    });

    it('all lines changing', () => {
      const res = shift([3, 4, 4], 5);
      assert.deepEqual(res, [4, 0, 0]);
    });

    it('cyclic changing', () => {
      const res = shift([4, 4, 4], 5);
      assert.deepEqual(res, [0, 0, 0]);
    });
  });

  describe('calcFieldPoints function test', () => {
    const calcFieldPoints = combinations.t.calcFieldPoints;

    it('no points', () => {
      const res = calcFieldPoints([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 6]
      ]);
      assert.equal(res, 0);
    });

    it('horizontal points', () => {
      const res = calcFieldPoints([
        [1, 1, 1],
        [4, 4, 4],
        [7, 8, 6]
      ]);
      assert.equal(res, 5);
    });

    it('vertical points', () => {
      const res = calcFieldPoints([
        [1, 2, 3],
        [4, 2, 6],
        [7, 2, 6]
      ]);
      assert.equal(res, 2);
    });

    it('diagonal points', () => {
      const res = calcFieldPoints([
        [1, 2, 3],
        [4, 3, 6],
        [3, 2, 6]
      ]);
      assert.equal(res, 3);
    });

    it('all types of points', () => {
      const res = calcFieldPoints([
        [5, 0, 5],
        [5, 5, 5],
        [5, 0, 5]
      ]);
      assert.equal(res, 25);
    });
  });

  describe('getFieldByShift function test', () => {
    const getFieldByShift = combinations.t.getFieldByShift;

    it('trivial shifts', () => {
      const res = getFieldByShift([
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        [5, 4, 3, 2, 1, 0, 1, 2, 3, 4]
      ], [0, 0, 0]);
      assert.deepEqual(res, [
        [0, 1, 2],
        [9, 8, 7],
        [5, 4, 3]
      ]);
    });

    it('non-trivial shifts', () => {
      const res = getFieldByShift([
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        [5, 4, 3, 2, 1, 0, 1, 2, 3, 4]
      ], [3, 4, 8]);
      assert.deepEqual(res, [
        [3, 4, 5],
        [5, 4, 3],
        [3, 4, 5]
      ]);
    });
  });

  describe('combinations function test', () => {
    it('trivial values without points', () => {
      const res = combinations([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ]);
      assert.deepEqual(Object.keys(res), ['0']);
      assert.equal(res[0].length, 27);
    });

    it('trivial values without non-zero points', () => {
      const res = combinations([
        [0, 1, 2],
        [5, 5, 5],
        [6, 7, 8]
      ]);
      assert.deepEqual(Object.keys(res), ['5']);
      assert.equal(res[5].length, 27);
    });

    it('non-trivial values', () => {
      const res = combinations([
        [0, 1, 2, 4],
        [0, 5, 5, 5],
        [6, 7, 8, 6]
      ]);
      assert.equal(Object.keys(res).length, 2);
      assert(res[0]);
      assert(res[5]);
      assert.equal(res[0].length, 48);
      assert.equal(res[5].length, 16);
    });

    it('test with recalculations', () => {
      const calcFieldPoints = combinations.t.calcFieldPoints;
      const getFieldByShift = combinations.t.getFieldByShift;

      const lines = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        [5, 4, 3, 2, 1, 0, 1, 2, 3, 4]
      ];
      const res = combinations(lines);

      const points = Object.keys(res);
      const combinationsCount = points.reduce((sum, curr) => sum + res[curr].length, 0);
      assert.equal(combinationsCount, Math.pow(lines[0].length, lines.length));

      for (let i = 0; i < points.length; i++) {
        const pointsValue = +points[i];
        for (let j = 0; j < points[i].length; j++) {
          const field = getFieldByShift(lines, res[points[i]][j]);
          const recalculatedPoints = calcFieldPoints(field);
          assert.equal(recalculatedPoints, pointsValue);
        }
      }
    });
  });
});