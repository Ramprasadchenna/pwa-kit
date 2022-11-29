/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const base = require('internal-lib-build/configs/jest/jest.config')

module.exports = {
    ...base,
    setupFilesAfterEnv: ['./setup-jest.js'],
    transformIgnorePatterns: [],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0
        }
    },
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],

    // this reporter hides console.error when tests succeed
    // this prevent expected errors from polluting jest logs
    // https://github.com/rickhanlonii/jest-silent-reporter
    reporters: [['jest-silent-reporter', {useDots: true, showPaths: true}]]
}
