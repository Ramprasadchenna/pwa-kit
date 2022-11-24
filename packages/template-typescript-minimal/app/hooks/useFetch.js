/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useAuth} from './useAuth'
import {getAppOrigin} from 'pwa-kit-react-sdk/utils/url'
import {getConfig} from 'pwa-kit-runtime/utils/ssr-config'
import {HTTPError} from 'pwa-kit-react-sdk/ssr/universal/errors'

const useFetch = (url, params, config, fetchOptions) => {
    const {token} = useAuth()
    const key = url.split('webstores')[1]

    const context = useQuery({
        queryKey: [key, params].filter(Boolean),
        queryFn: async ({queryKey}) => {
            console.time(`Request time for ${key}`)
            const method = fetchOptions?.method || 'GET'
            const _url = new URL(url)
            if (params && method === 'GET') {
                _url.search = new URLSearchParams(params).toString()
            }
            const res = await fetch(_url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method,
                ...fetchOptions
            })
            const data = res.status >= 200 && (await res.json())
            console.timeEnd(`Request time for ${key}`)

            return data
        },
        ...config,
        enabled: !!url && !!token && config?.enabled,
        retry: false,
        retryOnMount: false,
        refetchOnWindowFocus: false
    })
    return context
}

export const getApiUrl = (path) => {
    const {
        app: {webstoreId}
    } = getConfig()
    return `${getAppOrigin()}/mobify/proxy/scom/services/data/v56.0/commerce/webstores/${webstoreId}${path}`
}

export const useCategories = (categoryId, params) => {
    const queryParams = new URLSearchParams(params)
    if (categoryId) {
        queryParams.set('parentProductCategoryId', categoryId)
    }
    const queryString = `${queryParams.toString() && '?'}${queryParams.toString()}`
    const data = useFetch(`${getApiUrl(`/product-categories/children${queryString}`)}`)
    return data
}
export const useProduct = (id) => {
    const url = getApiUrl(`/products/${id}`)
    const data = useFetch(url)
    return data
}

export const addItemToCart = (cartStateOrId = 'current') => {
    const {
        app: {webstoreId}
    } = getConfig()
    const {token} = useAuth()
    const queryClient = useQueryClient()
    const url = getApiUrl(`/carts/${cartStateOrId}/cart-items`)
    const context = useMutation(
        async (item) => {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(item)
            })
            const t = await res.json()
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([`/${webstoreId}/carts/current`])
            }
        }
    )
    return context
}

export const useCartAction = () => {
    const {
        app: {webstoreId}
    } = getConfig()
    const {token} = useAuth()
    const queryClient = useQueryClient()

    const context = useMutation(
        async (variables) => {
            const {payload, fetchOptions = {}, url} = variables
            console.time(`Request time for ${url.split('webstores')[1]}`)
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                ...fetchOptions,
                body: JSON.stringify(payload)
            })
            const t = fetchOptions.method !== 'DELETE' && (await res.json())
            console.timeEnd(`Request time for ${url.split('webstores')[1]}`)

            return t
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries([`/${webstoreId}/carts/current`])
                queryClient.invalidateQueries([`/${webstoreId}/carts/current/cart-items`])
            }
        }
    )
    return context
}
export const useProductPrice = (id) => {
    const url = getApiUrl(`/pricing/products/${id}`)
    const data = useFetch(url)
    return data
}
export const useCart = (cartStateOrId = 'current') => {
    const url = getApiUrl(`/carts/${cartStateOrId}`)
    const data = useFetch(url)
    return data
}

export const useCartItems = (cartStateOrId = 'current') => {
    const url = getApiUrl(`/carts/${cartStateOrId}/cart-items`)
    const data = useFetch(url)
    return data
}

export const useCheckoutAction = () => {
    const {
        app: {webstoreId}
    } = getConfig()
    const {token} = useAuth()
    const queryClient = useQueryClient()

    const context = useMutation(
        async (variables) => {
            const {payload, fetchOptions, url} = variables
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                ...fetchOptions,
                body: JSON.stringify(payload)
            })
            const t = await res.json()
            return t
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([`/${webstoreId}/checkouts/active`])
            }
        }
    )
    return context
}

export const useCheckout = (activeOrCheckoutId = 'active', accountId) => {
    const url = getApiUrl(`/checkouts/${activeOrCheckoutId}`)
    const data = useFetch(url)
    return data
}

export const useUserAddresses = (accountId, params) => {
    const url = getApiUrl(`/accounts/${accountId}/addresses`)
    const data = useFetch(url, params, {enabled: !!accountId})
    return data
}

export const useAddressAction = (accountId, action) => {
    const {token} = useAuth()
    const queryClient = useQueryClient()
    const {
        app: {webstoreId}
    } = getConfig()

    const context = useMutation(
        async (variables) => {
            const {payload, fetchOptions = {}} = variables
            let _url
            if (action === 'DELETE') {
                _url = getApiUrl(`/accounts/${accountId}/addresses/${payload.addressId}`)
            } else {
                _url = getApiUrl(`/accounts/${accountId}/addresses`)
            }
            const bodyObj = {
                body: JSON.stringify(payload)
            }
            const res = await fetch(_url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                ...fetchOptions,
                ...bodyObj
            })
            const t = fetchOptions.method !== 'DELETE' && (await res.json())
            return t
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([`/${webstoreId}/accounts/${accountId}/addresses`])
            }
        }
    )
    return context
}

export const useProductCategoryPath = (categoryId) => {
    const data = useFetch(
        `${getApiUrl(`/product-category-path/product-categories/${categoryId}`)}`,
        {},
        {enabled: !!categoryId}
    )
    return data
}

export const useProductSearch = ({categoryId, searchTerm}, params) => {
    const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({
            searchTerm,
            categoryId,
            ...params
        })
    }
    const url = getApiUrl(`/search/product-search`)
    const data = useFetch(
        url,
        {categoryId, searchTerm, ...params},
        {enabled: !!categoryId || !!searchTerm},
        fetchOptions
    )
    return data
}
export const useProductsPrice = (productIds) => {
    const url = getApiUrl(`/pricing/products`)
    const fetchOptions = {
        method: 'POST',
        body: JSON.stringify({
            pricingLineItems: productIds
        })
    }
    const data = useFetch(url, {productIds}, {enabled: !!productIds?.length}, fetchOptions)
    return data
}

export const useOrders = (orderId) => {
    let url
    if (orderId) {
        url = getApiUrl(`/order-summaries/${orderId}`)
    } else {
        url = getApiUrl(`/order-summaries`)
    }
    const data = useFetch(url)
    return data
}

export const useSearchSuggestion = (searchTerm) => {
    const url = getApiUrl(`/search/suggestions`)
    const data = useFetch(url, {searchTerm}, {enabled: Boolean(searchTerm)})
    return data
}

export const useSortRules = () => {
    const url = getApiUrl(`/search/sort-rules`)
    const data = useFetch(url)
    return data
}

export const usePromotions = () => {
    const url = getApiUrl(`/carts/current/promotions`)
    const data = useFetch(url)
    return data
}
export const useCartCoupon = () => {
    const url = getApiUrl(`/carts/current/cart-coupons`)
    const data = useFetch(url)
    return data
}

const useMutationFetch = (params, config) => {
    const {token} = useAuth()

    const context = useMutation(
        async (variables) => {
            const {url, payload, fetchOptions = {}} = variables
            const bodyObj = {
                body: JSON.stringify(payload)
            }
            try {
                const res = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    ...fetchOptions,
                    ...bodyObj
                })
                if (
                    res.ok &&
                    res.status >= 200 &&
                    res.status < 400 &&
                    fetchOptions.method !== 'DELETE'
                ) {
                    const json = await res.json()
                    return json
                }
                if (res.status >= 400) {
                    const error = await res.json()
                    throw new HTTPError(res.status, error[0].message)
                }
            } catch (e) {
                console.log('e', e)
                throw e
            }
        },
        {
            ...config
        }
    )
    return context
}

export const useCartCouponAction = (params = {}) => {
    const queryClient = useQueryClient()
    const {
        app: {webstoreId}
    } = getConfig()
    const action = useMutationFetch(params, {
        onSuccess: () => {
            console.log('onSuccess useCartCouponAction')
            queryClient.invalidateQueries([`/${webstoreId}/carts/current`])
            queryClient.invalidateQueries([`/${webstoreId}/carts/current/cart-items`])
            queryClient.invalidateQueries([`/${webstoreId}/carts/current/cart-coupons`])
        }
    })
    return action
}

export default useFetch
