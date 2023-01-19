/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useCommerceAPI} from '../commerce-api/contexts'
import {CAT_MENU_STALE_TIME} from '../constants'

/**
 * This is the global state for categories, we use this for navigation and for
 * the product list page.
 *
 * To use these context's simply import them into the component requiring context
 * like the below example:
 *
 * import React, {useContext} from 'react'
 * import {CategoriesContext} from './contexts'
 *
 * export const RootCategoryLabel = () => {
 *    const {categories} = useContext(CategoriesContext)
 *    return <div>{categories['root'].name}</div>
 * }
 *
 * Alternatively you can use the hook provided by us:
 *
 * import {useCategories} from './hooks'
 *
 * const {root, itemsKey, fetchCategoryNode} = useCategories()
 *
 */
export const CategoriesContext = React.createContext()
export const CategoriesProvider = ({treeRoot = {}, children, locale}) => {
    const itemsKey = 'categories'
    const DEFAULT_ROOT_CATEGORY = 'root'
    const LOCAL_STORAGE_PREFIX = `pwa-kit-cat-`

    const api = useCommerceAPI()
    const [root, setRoot] = useState({
        // map over the server-provided cat
        ...treeRoot[DEFAULT_ROOT_CATEGORY],
        [itemsKey]: treeRoot[DEFAULT_ROOT_CATEGORY]?.[itemsKey]?.map((item) => ({
            ...item
        }))
    })

    const fetchCategoryNode = async (id, levels = 1) => {
        // return early if there's one that is less than stale time
        const storageItem = JSON.parse(
            window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${id}-${locale}`)
        )
        if (storageItem && Date.now() < storageItem?.fetchTime + CAT_MENU_STALE_TIME) {
            return storageItem
        }
        const res = await api.shopperProducts.getCategory({
            parameters: {
                id,
                levels
            }
        })
        return res
    }

    useEffect(() => {
        // Server side, we only fetch level 0 categories, for performance, here
        // we request the remaining two levels of category depth
        Promise.all(
            root?.[itemsKey]?.map(async (cat) => {
                // check localstorage first for this data to help remediate O(n) server
                // load burden where n = top level categories
                const res = await fetchCategoryNode(cat?.id, 2)
                // store fetched data in local storage for faster access / reduced server load
                res.loaded = true
                window?.localStorage?.setItem(
                    `${LOCAL_STORAGE_PREFIX}${cat?.id}-${locale}`,
                    JSON.stringify({
                        ...res,
                        fetchTime: Date.now()
                    })
                )
                return res
            })
        ).then((data) => {
            const newTree = {
                ...root,
                [itemsKey]: data
            }
            setRoot(newTree)
        })
    }, [])

    return (
        <CategoriesContext.Provider
            value={{
                root,
                itemsKey,
                fetchCategoryNode
            }}
        >
            {children}
        </CategoriesContext.Provider>
    )
}

CategoriesProvider.propTypes = {
    children: PropTypes.node.isRequired,
    treeRoot: PropTypes.object,
    locale: PropTypes.string
}

/**
 * This is the global state for the multiples sites and locales supported in the App.
 *
 * To use the context simply import them into the component requiring context
 * like the below example:
 *
 * import React, {useContext} from 'react'
 * import {MultiSiteContext} from './contexts'
 *
 * export const RootCurrencyLabel = () => {
 *    const {site,locale,urlTemplate} = useContext(MultiSiteContext)
 *    return <div>{site} {locale}</div>
 * }
 *
 * Alternatively you can use the hook provided by us:
 *
 * import {useMultiSite} from './hooks'
 *
 * const {site, locale, buildUrl} = useMultiSite()
 * @type {React.Context<unknown>}
 */
export const MultiSiteContext = React.createContext()
export const MultiSiteProvider = ({
    site: initialSite = {},
    locale: initialLocale = {},
    buildUrl,
    children
}) => {
    const [site, setSite] = useState(initialSite)
    const [locale, setLocale] = useState(initialLocale)

    return (
        <MultiSiteContext.Provider value={{site, setSite, locale, setLocale, buildUrl}}>
            {children}
        </MultiSiteContext.Provider>
    )
}

MultiSiteProvider.propTypes = {
    children: PropTypes.node.isRequired,
    buildUrl: PropTypes.func,
    site: PropTypes.object,
    locale: PropTypes.object
}

/**
 * This is the global state for currency, we use this throughout the site. For example, on
 * the product-list, product-detail and cart and basket pages..
 *
 * To use these context's simply import them into the component requiring context
 * like the below example:
 *
 * import React, {useContext} from 'react'
 * import {CurrencyContext} from './contexts'
 *
 * export const RootCurrencyLabel = () => {
 *    const {currency} = useContext(CurrencyContext)
 *    return <div>{currency}</div>
 * }
 *
 * Alternatively you can use the hook provided by us:
 *
 * import {useCurrency} from './hooks'
 *
 * const {currency, setCurrency} = useCurrency()
 *
 */
export const CurrencyContext = React.createContext()
export const CurrencyProvider = ({currency: initialCurrency, children}) => {
    const [currency, setCurrency] = useState(initialCurrency)

    return (
        <CurrencyContext.Provider value={{currency, setCurrency}}>
            {children}
        </CurrencyContext.Provider>
    )
}

CurrencyProvider.propTypes = {
    children: PropTypes.node.isRequired,
    currency: PropTypes.string
}
