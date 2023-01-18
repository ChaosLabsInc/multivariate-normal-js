const _ = require("lodash");
const {MultivariateNormal} = require("multivariate-normal");

export const generateData = (params) => {
    const dist = MultivariateNormal(params.means, params.cov);
    return _.times(params.points, dist.sample);
};
