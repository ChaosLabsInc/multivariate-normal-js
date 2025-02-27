/* globals describe, it, expect */

const {MultivariateNormal} = require("../src");
const _ = require("lodash");
const { cov, randomCovarianceMatrix, shouldBeVector, matricesShouldBeApproxEqual } = require("./util");



describe("A Distribution", () => {

    it("should be able to be sampled", () => {
        // Here, we test some inputs that we know screw up some implementations
        // of e.g. the SVD algorithm.

        shouldBeVector(MultivariateNormal(
            [1, 2],
            [
                [1, 1],
                [1, 1],
            ]
        ).sample(), 2);

        shouldBeVector(MultivariateNormal(
            [1, 2],
            [
                [1, 0],
                [0, 1],
            ]
        ).sample(), 2);

        shouldBeVector(MultivariateNormal(
            [0, 0],
            [
                [1, 0.9],
                [0.9, 1],
            ]
        ).sample(), 2);

        shouldBeVector(MultivariateNormal(
            [1, 2, 0],
            [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ]
        ).sample(), 3);

        shouldBeVector(MultivariateNormal(
            [1, 2, 0],
            [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ]
        ).sample(), 3);

        shouldBeVector(MultivariateNormal(
            [0, -2, 0],
            [
                [1,   0, 0.9],
                [0,   1, 0],
                [0.9, 0, 1],
            ]
        ).sample(), 3);

        shouldBeVector(MultivariateNormal(
            [1, 2, 0],
            [
                [1,   0.9, 0.9],
                [0.9, 1,   0.8],
                [0.9, 0.8,   1],
            ]
        ).sample(), 3);
    });

    it("should produce correctly correlated data", () => {
        // to check correlation, we generate 2x2 and 3x3 covariance matrices,
        // generate data from them, and then compute correlations and
        // make sure they match the starting covariance matrix

        // 2x2
        _.times(10, () => {
            const actualCov = randomCovarianceMatrix(2);
            const means = _.times(2, () => Math.random() * 10 - 5);

            const dist = MultivariateNormal(means, actualCov);

            const data = _.times(25000, dist.sample);
            matricesShouldBeApproxEqual(cov(data), actualCov);
        });

        // 3x3
        _.times(10, () => {
            const actualCov = randomCovarianceMatrix(3);
            const means = _.times(3, () => Math.random() * 10 - 5);

            const dist = MultivariateNormal(means, actualCov);

            const data = _.times(50000, dist.sample);
            matricesShouldBeApproxEqual(cov(data), actualCov);
        });
    });

    it("should return its mean", () => {
        expect(MultivariateNormal(
            [1, 2, 0],
            [
                [1,   0.9, 0.9],
                [0.9, 1,   0.8],
                [0.9, 0.8,   1],
            ]
        ).getMean()).toEqual([1, 2, 0]);
    });

    it("should be able to set a new mean", () => {
        const dist1 = MultivariateNormal(
            [1, 2, 0],
            [
                [1,   0.9, 0.9],
                [0.9, 1,   0.8],
                [0.9, 0.8,   1],
            ]
        );

        const dist2 = dist1.setMean([0, -1, -2]);

        expect(dist1.getMean()).toEqual([1, 2, 0]);
        expect(dist2.getMean()).toEqual([0, -1, -2]);
    });

    it("should validate the new mean", () => {
        const dist = MultivariateNormal(
            [1, 2, 0],
            [
                [1,   0.9, 0.9],
                [0.9, 1,   0.8],
                [0.9, 0.8,   1],
            ]
        );

        expect(() => {
            dist.setMean([0, 1, 1, 1]);
        }).toThrowError(Error, "Expected mean to have length 3, but had length 4");
    });

    it("should return its covariance matrix", () => {
        const dist = MultivariateNormal(
            [1, 2, 0],
            [
                [1,   0.9, 0.9],
                [0.9, 1,   0.8],
                [0.9, 0.8,   1],
            ]
        );

        expect(dist.getCov()).toEqual([
            [1,   0.9, 0.9],
            [0.9, 1,   0.8],
            [0.9, 0.8,   1],
        ]);
    });

    it("should be able to set a new covariance matrix", () => {
        const dist1 = MultivariateNormal(
            [1, 2, 0],
            [
                [1,   0.9, 0.9],
                [0.9, 1,   0.8],
                [0.9, 0.8,   1],
            ]
        );

        const dist2 = dist1.setCov([
            [1,   0, 0.9],
            [0,   1, 0],
            [0.9, 0, 1],
        ]);

        expect(dist1.getCov()).toEqual([
            [1,   0.9, 0.9],
            [0.9, 1,   0.8],
            [0.9, 0.8,   1],
        ]);

        expect(dist2.getCov()).toEqual([
            [1,   0, 0.9],
            [0,   1, 0],
            [0.9, 0, 1],
        ]);
    });

    it("should validate the new covariance matrix", () => {
        const dist = MultivariateNormal(
            [1, 2, 0],
            [
                [1,   0.9, 0.9],
                [0.9, 1,   0.8],
                [0.9, 0.8,   1],
            ]
        );

        expect(() => {
            dist.setCov([
                [1, 0.9],
                [0.9, 1],
            ]);
        }).toThrowError(Error, "Covariance matrix had 2 rows, but it should be a 3x3 square matrix");
    });

    it("should return the same when using same seed", () => {
        const firstSample =   MultivariateNormal(
            [1, 2, 0],
            [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ],
            "seed"
        ).sample();
        const secondSample =   MultivariateNormal(
            [1, 2, 0],
            [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ],
            "seed"
        ).sample();


        expect(firstSample).toEqual(secondSample);
    });
    it("should return different sample when using no seed", () => {
        const firstSample =   MultivariateNormal(
            [1, 2, 0],
            [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ]
        ).sample();
        const secondSample =   MultivariateNormal(
            [1, 2, 0],
            [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ]
        ).sample();


        expect(firstSample).not.toEqual(secondSample);
    });
});
