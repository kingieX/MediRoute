const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^ioredis$': '<rootDir>/__mocks__/ioredis.ts',
    '^@/sockets/socket$': '<rootDir>/__mocks__/socket.ts',
  },
};
