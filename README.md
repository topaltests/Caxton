# Building
This code uses only `mocha` package from external libraries
`npm install`

# Testing
`npm run test`

# task 1
Distributions described in `./libs/distributions.js`

Recursive distribution described via creating object of class `RecursiveDistribution`.
You should pass array of distributions and its probabilities in `RecursiveDistribution` constructor.
Class `RecursiveDistributionPart` is helper for passing probability and distribution.

Example:
```
const recursiveDistribution = new RecursiveDistribution([
    new RecursiveDistributionPart(0.3, new DiscreteDistribution([0, 1, 2])),
    new RecursiveDistributionPart(0.7, new DiscreteDistribution([10]))
]);
```

Implemented simple distributions:
- `UniformDistribution`,
- `DiscreteDistribution`,
- `NormalDistribution`,
- `ExponentialDistribution`.

Recursive distribution objects can be passed as a distribution for another recursive distribution too.

For getting value from distribution you should use getter `value` implemented in all types of distributions, for example:
```
const recursiveDistribution = new RecursiveDistribution([
    new RecursiveDistributionPart(0.3, new DiscreteDistribution([0, 1, 2])),
    new RecursiveDistributionPart(0.7, new DiscreteDistribution([10]))
]);

console.log('Recursive distribution value:', recursiveDistribution.value);

console.log('Discrete distribution value:', (new DiscreteDistribution([5])).value);
```