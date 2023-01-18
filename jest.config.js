module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\\.ts?$": "ts-jest",
        "^.+\\.js?$": "ts-jest",
    },
    testPathIgnorePatterns: ["/node_modules/", "dist/", "test-dist/"],
};
