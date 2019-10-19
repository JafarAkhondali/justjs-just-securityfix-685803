module.exports = {
    'rootDir': '../../', // where package.json lives.
    'moduleNameMapper': {
        '^@src(.*)': '<rootDir>/src$1',
        '^@lib(.*)': '<rootDir>/src/lib$1',
        '^@test(.*)': '<rootDir>/test$1'
    },
    'globalSetup': '<rootDir>/test/jest/setup.js',
    'globalTeardown': '<rootDir>/test/jest/teardown.js',
    'testURL': 'http://localhost:7890',
    'coverageReporters': ['text-summary', 'html'],
    'testEnvironmentOptions': {
        'resources': 'usable'
    }
};
