/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {getConfig} from 'pwa-kit-react-sdk/ssr/universal/utils'
import {getParamsFromPath} from './utils'

/**
 * This functions takes an url and returns a site object,
 * an error will be thrown if no url is passed in or no site is found
 * @param {string} url
 * @returns {object} site - a site object
 */
export const resolveSiteFromUrl = (url) => {
    if (!url) {
        throw new Error('url is required to find a site object.')
    }
    const {pathname, search} = new URL(url)
    const path = `${pathname}${search}`
    let site

    const {site: siteIdentifierFromUrl} = getParamsFromPath(path)
    const sites = getSites()

    // get the site identifier from the url
    // step 1: look for the site based on the site identifier (id or alias) from the url
    site = sites.find(
        (site) => site.id === siteIdentifierFromUrl || site.alias === siteIdentifierFromUrl
    )
    if (site) {
        return site
    }

    //Step 2: if step 1 does not work, use the defaultSite value to get the default site
    site = getDefaultSite()
    // Step 3: throw an error if site can't be found by any of the above steps
    if (!site) {
        throw new Error("Can't find any site. Please check you sites configuration.")
    }
    return site
}

/**
 * Returns the default site based on the defaultSite value in the config
 * @returns {object} site - a site object
 */
export const getDefaultSite = () => {
    const {app} = getConfig()
    const sites = getSites()
    if (!sites) {
        throw new Error("Can't find any sites in the config. Please check your configuration")
    }

    if (sites.length === 1) {
        return sites[0]
    }

    // use the commerceAPIConfig.parameters.siteId as a fallback value if default site is not defined or set upt correctly
    return sites.find((site) => site.id === app.defaultSite)
}

/**
 * Return the list of sites that has included with aliases
 * @return {array} sites - site list including their aliases
 */
export const getSites = () => {
    const {sites = [], siteAliases = {}} = getConfig().app || {}

    if (!sites.length) {
        throw new Error("Can't find any sites from the config. Please check your configuration")
    }

    return sites.map((site) => {
        const alias = siteAliases[site.id]
        return {
            ...site,
            ...(alias ? {alias} : {})
        }
    })
}
