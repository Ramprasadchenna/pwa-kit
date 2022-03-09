/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {whichLocaleToLoad, loadLocaleData, getLocaleConfig, getPreferredCurrency} from './locale'

import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from './test-utils'

const supportedLocales = SUPPORTED_LOCALES.map((locale) => locale.id)
const isMultiLocales = supportedLocales.length > 1
const nonSupportedLocale = 'nl-NL'
// Make sure this supported locale is not the default locale.
// Otherwise, our code would fall back to default and incorrectly pass the tests
const supportedLocale = isMultiLocales
    ? supportedLocales.find((locale) => locale !== DEFAULT_LOCALE)
    : supportedLocales[0]

const testId1 = 'footer.link.privacy_policy'
const testId2 = 'account.accordion.button.my_account'

test('our assumptions before further testing', () => {
    expect(supportedLocales.includes(nonSupportedLocale)).toBe(false)
    if (isMultiLocales) {
        expect(DEFAULT_LOCALE).toBe('en-GB')
        expect(supportedLocale).not.toBe(DEFAULT_LOCALE)
    }
})

describe('whichLocaleToLoad', () => {
    test('default to fallback locale', () => {
        const locale = whichLocaleToLoad([nonSupportedLocale], supportedLocales, DEFAULT_LOCALE)
        expect(locale).toBe(DEFAULT_LOCALE)
    })
    test('matches one of the supported locales', () => {
        const locale = whichLocaleToLoad([supportedLocale], supportedLocales, DEFAULT_LOCALE)
        expect(locale).toBe(supportedLocale)
    })
})

describe('loadLocaleData', () => {
    test('loading the target locale', async () => {
        const messages = await loadLocaleData(supportedLocale)
        expect(messages[testId2]).toBeDefined()
    })
    test('loading the pseudo locale', async () => {
        const messages = await loadLocaleData('en-XB')
        expect(messages[testId1][0].value).toMatch(/^\[!! Ṕŕíííṿâćććẏ ṔṔṔŏĺíííćẏ !!]$/)
    })
    test('handling a not-found translation file', async () => {
        const messages = await loadLocaleData('xx-XX')
        const emptyMessages = {}
        expect(messages).toEqual(emptyMessages)
    })
})

describe('getLocaleConfig', () => {
    const originalEnv = {...process.env}
    let windowSpy

    const l10nConfig = {
        defaultLocale: DEFAULT_LOCALE,
        supportedLocales: SUPPORTED_LOCALES
    }
    beforeEach(() => {
        windowSpy = jest.spyOn(window, 'window', 'get')
    })
    afterEach(() => {
        // Reset
        process.env = {...originalEnv}
        windowSpy.mockRestore()
    })

    test('without getUserPreferredLocales parameter', async () => {
        const config = await getLocaleConfig({l10nConfig})
        expect(config.targetLocale).toBe(DEFAULT_LOCALE)
    })
    test('with getUserPreferredLocales parameter', async () => {
        const locale = supportedLocale
        if (isMultiLocales) {
            expect(locale).not.toBe(DEFAULT_LOCALE)
        }
        const config = await getLocaleConfig({
            getUserPreferredLocales: () => [locale],
            l10nConfig
        })
        expect(config.targetLocale).toBe(locale)
    })
    test('with pseudo locale', async () => {
        process.env.USE_PSEUDOLOCALE = 'true'
        // Simulate server side
        windowSpy.mockImplementation(() => undefined)

        const config = await getLocaleConfig({l10nConfig})

        // The app should still think its target locale is the default one
        expect(config.targetLocale).toBe(DEFAULT_LOCALE)
        // But the actual translation should be using the pseudo locale
        expect(config.messages[testId1][0].value).toMatch(/^\[!! Ṕŕíííṿâćććẏ ṔṔṔŏĺíííćẏ !!]$/)
    })
})

describe('getCurrency', () => {
    test('returns the preferred currency for a supported locale', () => {
        const currency = getPreferredCurrency(SUPPORTED_LOCALES[0].id, SUPPORTED_LOCALES)
        expect(currency).toBe(SUPPORTED_LOCALES[0].preferredCurrency)
    })

    test('returns undefined for a unsupported locale', () => {
        const currency = getPreferredCurrency(nonSupportedLocale, SUPPORTED_LOCALES)
        expect(currency).toBeFalsy()
    })
})
