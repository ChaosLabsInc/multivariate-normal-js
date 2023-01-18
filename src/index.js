const isArray = require("lodash.isarray");
const { validateMean, validateCovAndGetSVD } = require("./validation.js");
const { Distribution } = require("./distribution.js");

const MultivariateNormal = (unvalidatedMean, unvalidatedCov, seed) => {
    if (!isArray(unvalidatedMean)) {
        throw new Error("mean must be an array");
    }

    const n = unvalidatedMean.length;
    const mean = validateMean(unvalidatedMean, n);
    const { cov, svd } = validateCovAndGetSVD(unvalidatedCov, n);

    return Distribution(n, mean, cov, svd, seed);
};

Object.defineProperty(exports, "__esModule", {
    value: true,
});
module.exports = {MultivariateNormal};
