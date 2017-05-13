'use strict';

const assert = require('assert');
const {
  DiscreteDistribution,
  UniformDistribution,
  NormalDistribution,
  ExponentialDistribution,
  RecursiveDistribution,
  RecursiveDistributionPart
} = require('../libs/distributions');
const getErrorLevel = require('../libs/get-error-level');

const TOLERANCE_LEVEL = 0.05;
const TEST_COUNT = 10000;

describe('Distributions', function() {
  describe('DiscreteDistribution', () => {
    it('only value', function() {
      const discreteDistribution = new DiscreteDistribution([1]);
      for (let i = 0; i < 10; i++) {
        assert(discreteDistribution.value === 1);
      }
    });

    it('several values', () => {
      const discreteDistribution = new DiscreteDistribution([0, 1]);
      const res = [0, 0];
      for (let i = 0; i < TEST_COUNT; i++) {
        res[discreteDistribution.value]++;
      }

      const expectedRes = [0.5, 0.5];
      const normalizedRes = res.map(r => r / TEST_COUNT);
      const error = getErrorLevel(expectedRes, normalizedRes);
      assert(error < TOLERANCE_LEVEL);
    });
  });

  describe('UniformDistribution', () => {
    it('distribution by 10 check points', () => {
      const start = 3;
      const finish = 8;
      const uniformDistribution = new UniformDistribution(start, finish);
      const checkPointsCount = 10;

      const res = Array(checkPointsCount).fill(0);
      for (let i = 0; i < TEST_COUNT; i++) {
        const normalizedValue = (uniformDistribution.value - start) / (finish - start);
        res[Math.floor(normalizedValue * checkPointsCount)]++;
      }

      const expectedRes = Array(checkPointsCount).fill(1 / checkPointsCount);
      const normalizedRes = res.map(r => r / TEST_COUNT);
      const error = getErrorLevel(expectedRes, normalizedRes);
      assert(error < TOLERANCE_LEVEL);
    });
  });

  describe('NormalDistribution', () => {
    it('standart normal distribution', () => {
      const normalDistribution = new NormalDistribution(0, 1);
      const checkPoints = [-5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5, Math.MAX_VALUE];

      const res = Array(checkPoints.length).fill(0);
      for (let i = 0; i < TEST_COUNT; i++) {
        const value = normalDistribution.value;

        for (let j = 0; j < res.length; j++) {
          if (value <= checkPoints[j]) {
            res[j]++;
            break;
          }
        }
      }

      const normalizedRes = res.map(r => r / TEST_COUNT);
      // expected values are given from quantiles of standard normal distribution
      const expectedValues = [
        0.00000029,               // -inf .. -5.0
        0.00620967 - 0.00000029,  // -5.0 .. -2.5
        0.158655 - 0.00620967,    // -2.5 .. -1.0
        0.308538 - 0.158655,      // -1.0 .. -0.5
        0.500000 - 0.308538,      // -0.5 ..  0.0
        0.691462 - 0.500000,      //  0.0 ..  0.5
        0.841345 - 0.691462,      //  0.5 ..  1.0
        0.99379033 - 0.841345,    //  1.0 ..  2.5
        0.99999971 - 0.99379033,  //  2.5 ..  5.0
        1 - 0.99999971            //  5.0 .. +inf
      ];
      const error = getErrorLevel(expectedValues, normalizedRes);
      assert(error < TOLERANCE_LEVEL);
    });
  });

  describe('ExponentialDistribution', () => {
    it('exponential distribution by check points', () => {
      const getCumulativeDistributionFunction = lambda => {
        return x => (1 - Math.exp(-lambda * x));
      };

      const lambda = 0.5;
      const exponentialDistribution = new ExponentialDistribution(lambda);
      const cumulativeDistributionFunction = getCumulativeDistributionFunction(lambda);

      const checkPoints = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

      const res = Array(checkPoints.length).fill(0);
      for (let i = 0; i < TEST_COUNT; i++) {
        const value = exponentialDistribution.value;

        for (let j = 0; j < checkPoints.length; j++) {
          if (value <= checkPoints[j]) {
            res[j]++;
            break;
          }
        }
      }

      const normalizedRes = res.map(r => r / TEST_COUNT);
      const expectedValues = checkPoints
        .map((x, i) => cumulativeDistributionFunction(x) - (i && cumulativeDistributionFunction(checkPoints[i-1])));
      const error = getErrorLevel(expectedValues, normalizedRes);
      assert(error < TOLERANCE_LEVEL);
    });
  });

  describe('RecursiveDistribution', () => {
    it('only distribution part', () => {
      const discreteDistribution = new DiscreteDistribution([0, 1]);
      const recursiveDistribution = new RecursiveDistribution([
        new RecursiveDistributionPart(1, discreteDistribution)
      ]);

      const res = [0, 0];
      for (let i = 0; i < TEST_COUNT; i++) {
        res[recursiveDistribution.value]++;
      }

      const normalizedRes = [res[0] / TEST_COUNT, res[1] / TEST_COUNT];
      const expectedValues = [0.5, 0.5];
      const error = getErrorLevel(normalizedRes, expectedValues);
      assert(error < TOLERANCE_LEVEL);
    });

    it('several distribution parts', () => {
      const discreteDistribution = new DiscreteDistribution([0, 1, 2]);
      const uniformDistribution1 = new UniformDistribution(3, 5);
      const uniformDistribution2 = new UniformDistribution(10, 15);

      const recursiveDistribution = new RecursiveDistribution([
        new RecursiveDistributionPart(0.1, discreteDistribution),
        new RecursiveDistributionPart(0.8, uniformDistribution1),
        new RecursiveDistributionPart(0.1, uniformDistribution2)
      ]);

      const res = [0, 0, 0];
      for (let i = 0; i < TEST_COUNT; i++) {
        const value = recursiveDistribution.value;
        if ([0, 1, 2].includes(value)) {
          res[0]++;
        } else if ((value >= 3) && (value <= 5)) {
          res[1]++;
        } else if ((value >= 10) && (value <= 15)) {
          res[2]++;
        }
      }

      const normalizedRes = res.map(r => r / TEST_COUNT);
      const expectedValues = [0.1, 0.8, 0.1];
      const error = getErrorLevel(normalizedRes, expectedValues);
      assert(error < TOLERANCE_LEVEL);
    });

    it('inner recursive distributions', () => {
      const discreteDistribution1 = new DiscreteDistribution([0]);
      const recursiveDistribution1 = new RecursiveDistribution([
        new RecursiveDistributionPart(1, discreteDistribution1)
      ]);

      const discreteDistribution2 = new DiscreteDistribution([1]);
      const recursiveDistribution = new RecursiveDistribution([
        new RecursiveDistributionPart(0.3, recursiveDistribution1),
        new RecursiveDistributionPart(0.7, discreteDistribution2)
      ]);

      const res = [0, 0];
      for (let i = 0; i < TEST_COUNT; i++) {
        res[recursiveDistribution.value]++;
      }

      const normalizedRes = res.map(r => r / TEST_COUNT);
      const expectedValues = [0.3, 0.7];
      const error = getErrorLevel(expectedValues, normalizedRes);
      assert(error < TOLERANCE_LEVEL);
    });
  });

  describe('additional options', () => {
    it('min/max', () => {
      const discreteDistribution = new DiscreteDistribution([0, 1, 2]);
      discreteDistribution.setMin(0.5);
      discreteDistribution.setMax(1.5);

      let res1Count = 0;
      for (let i = 0; i < TEST_COUNT; i++) {
        if (discreteDistribution.value === 1) {
          res1Count++;
        }
      }

      assert(res1Count === TEST_COUNT);
    });
  });
});