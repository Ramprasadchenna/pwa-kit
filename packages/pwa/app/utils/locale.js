/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import PropTypes from 'prop-types'

/**
 * Dynamically import the translations/messages for a given locale
 * @param {string} locale
 * @returns {Promise<Object>} The messages (compiled in AST format) in the given locale.
 *      If locale is not found, returns the default locale's messages.
 *      If the translation file is not found, return the default messages instead.
 */
export const fetchTranslations = async (locale) => {
    const targetLocale =
        typeof window === 'undefined'
            ? process.env.USE_PSEUDOLOCALE === 'true'
                ? 'en-XB'
                : locale
            : locale

    let module
    try {
        module = await import(`../translations/compiled/${targetLocale}.json`)
    } catch (err) {
        console.error(err)
        console.log(
            'Loading empty messages, so that react-intl would fall back to the inline default messages'
        )
        return {}
    }

    return module.default
}

/**
 * Get the target locale, given the locales user prefer to see and the current site's l10n configuration
 * @param {Object} options
 * @param {function} [options.getUserPreferredLocales] - Identify what set of locales the user prefers
 * @param {object} [options.l10nConfig] - l10n configuration object
 * @returns {string} The target locale
 */
export const getTargetLocale = ({getUserPreferredLocales, l10nConfig = {}} = {}) => {
    const userPreferredLocales = getUserPreferredLocales ? getUserPreferredLocales() : []
    const supportedLocales = l10nConfig.supportedLocales.map((locale) => locale.id)
    const defaultLocale = l10nConfig.defaultLocale

    const targetLocale = determineTargetLocale(
        userPreferredLocales,
        supportedLocales,
        defaultLocale
    )
    return targetLocale
}

/**
 * Decide which locale to load
 * @private
 * @param {string[]} preferredLocales - All locales that the user prefers
 * @param {string[]} supportedLocales - All locales that your app supports
 * @param {string} fallbackLocale - App's default locale
 * @returns {string} The target locale if there's a match. Otherwise, returns `fallbackLocale`.
 */
export const determineTargetLocale = (preferredLocales, supportedLocales, fallbackLocale) => {
    const targetLocale = preferredLocales.filter((locale) => supportedLocales.includes(locale))[0]
    return targetLocale || fallbackLocale
}

/**
 * Get the preferred currency for a given locale
 * @param locale The locale that we want the currency
 * @param supportedLocales The supported locales array that has preferredCurrency
 * @returns {string} The specific currency for the locale
 */
export const getPreferredCurrency = (locale, supportedLocales) => {
    return supportedLocales.find((supportedLocale) => supportedLocale.id === locale)
        ?.preferredCurrency
}

export const MESSAGE_PROPTYPE = PropTypes.shape({
    // NOTE: defaultMessage is typically written as a string
    // but its value can be an array when it comes from the compiled AST version
    defaultMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    id: PropTypes.string
})
