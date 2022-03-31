/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

require('pwa-kit-build/configs/jest/jest-setup')
const mockConfig = require('config/__mocks__/default')
jest.mock('pwa-kit-runtime/utils/ssr-config', () => {
    return {
        getConfig: () => mockConfig
    }
})