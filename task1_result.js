'use strict';

const {
  RecursiveDistribution,
  RecursiveDistributionPart,
  DiscreteDistribution,
  NormalDistribution,
  UniformDistribution
} = require('./libs/distributions');

const normalDistribution = new NormalDistribution(1, Math.sqrt(0.3));
normalDistribution.setMin(0.5);
normalDistribution.setMax(1.5);

const resultDistribution = new RecursiveDistribution([
  // кусок 1: 0 (вероятность 70%)
  new RecursiveDistributionPart(0.7, new DiscreteDistribution([0])),

  // кусок 2: нормальное с центром в 1, дисперсия 0.3, мин 0.5, макс 1.5 (вероятность 25%)
  new RecursiveDistributionPart(0.25, normalDistribution),

  // кусок 3: равномерное от 2 до 5 (вероятность 5%)
  new RecursiveDistributionPart(0.05, new UniformDistribution(2, 5))
]);

// function returns different values of test recursive distribution for every call
module.exports = function() {
  return resultDistribution.value;
};