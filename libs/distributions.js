'use strict';

const assert = require('assert');

function random() {
  return Math.random();
}

class Distribution {
  constructor() {
    this.min = undefined;
    this.max = undefined;
  }

  setMin(min) {
    assert(!isNaN(min));
    assert(isNaN(this.max) || (min < this.max), 'min > max');

    this.min = min;
  }

  setMax(max) {
    assert(!isNaN(max));
    assert(isNaN(this.min) || (max > this.min), 'max < min');

    this.max = max;
  }

  get value() {
    const res = this._value;

    if (!isNaN(this.min) && (res < this.min)) {
      return this.value;
    }

    if (!isNaN(this.max) && (res > this.max)) {
      return this.value;
    }

    return res;
  }

  get _value() {
    throw new Error('not implemented yet');
  }
}

class RecursiveDistributionPart {
  constructor(probability, distribution) {
    assert(!isNaN(probability));
    assert(distribution instanceof Distribution);

    this.probability = probability;
    this.distribution = distribution;
  }
}

class RecursiveDistribution extends Distribution {
  /**
   * List of distributions with probabilities.
   * @constructor
   * @distributionsList {array of RecursiveDistributionPart}
   */
  constructor(distributionsList) {
    super();

    assert(distributionsList && distributionsList.length);
    distributionsList.forEach(distributionPart => assert(distributionPart instanceof RecursiveDistributionPart));
    const probabilitiesSum = distributionsList.reduce((sum, curr) => sum + curr.probability, 0);
    assert(probabilitiesSum === 1);

    this.distributionsList = distributionsList;
  }

  get _value() {
    let value = random();
    for (let i = 0; i < this.distributionsList.length; i++) {
      const distributionPart = this.distributionsList[i];

      if (value < distributionPart.probability) {
        return distributionPart.distribution.value;
      }

      value -= distributionPart.probability;
    }
  }
}

class UniformDistribution extends Distribution {
  constructor(start, finish) {
    super();

    assert(!isNaN(start));
    assert(!isNaN(finish));

    this.start = +start;
    this.finish = +finish;
  }

  get _value() {
    return random() * (this.finish - this.start) + this.start;
  }
}

class DiscreteDistribution extends Distribution {
  constructor(values) {
    super();

    assert(values && values.length);

    this.values = values;
  }

  get _value() {
    const N = this.values.length;
    return this.values[Math.floor(random() * N)];
  }
}

class NormalDistribution extends Distribution {
  constructor(mean, standardDeviation) {
    super();

    assert(!isNaN(mean));
    assert(!isNaN(standardDeviation));

    this.mean = mean;
    this.standardDeviation = standardDeviation;
  }

  get _value() {
    // Box–Muller transform
    // https://en.wikipedia.org/wiki/Box–Muller_transform
    const a = 1 - random();
    const b = 1 - random();

    const standardNormalDistributionValue =
      Math.cos(2 * Math.PI * a) * Math.sqrt(-2 * Math.log(b));

    return this.mean + standardNormalDistributionValue * this.standardDeviation;
  }
}

class ExponentialDistribution extends Distribution {
  constructor(lambda) {
    super();

    assert(!isNaN(lambda));

    this.lambda = lambda;
  }

  get _value() {
    return -(1 / this.lambda) * Math.log(random());
  }
}

module.exports = {
  RecursiveDistribution,
  RecursiveDistributionPart,
  UniformDistribution,
  DiscreteDistribution,
  NormalDistribution,
  ExponentialDistribution
};