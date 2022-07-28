/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {ApiClients, Argument, DataType, QueryResponse, ApiClientConfigParams} from '../types'
import {useAsync} from '../useAsync'
import useCommerceApi from '../useCommerceApi'
import { ShopperProductsTypes } from 'commerce-sdk-isomorphic';


type Client = ApiClients['shopperProducts']
type Parameters = Omit<Argument<Client['getProducts']>, 'headers'>
type Header = Omit<Argument<Client['getProducts']>, 'parameters'>

type test = ShopperProductsTypes.CompositeParameters<{
    organizationId: string;
    ids: string;
    inventoryIds?: string;
    currency?: string;
    locale?: string;
    allImages?: boolean;
    perPricebook?: boolean;
    siteId: string;
}, ApiClientConfigParams>
/**
 * A hook for `ShopperProducts#getProducts`.
 * Allows access to multiple products by a single request. Only products that are online and assigned to a site catalog are returned. The maximum number of productIDs that can be requested are 24. Along with product details, the availability, images, price, promotions, and variations for the valid products will be included, as appropriate.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-products?meta=getProducts} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperproducts.shopperproducts-1.html#getproducts} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useProducts = (
    parameters: Omit<Argument<Client['getProducts']>, 'headers'>,
    deps: unknown[] = [],
    opts?: Omit<Argument<Client['getProducts']>, 'parameters'>
): QueryResponse<DataType<Client['getProducts']>> => {
    if (!parameters) {
        throw new Error('Missing ids in parameters to make request')
    }
    const {shopperProducts: client} = useCommerceApi()
    const {ids} = parameters
    // const ids = <string>arg.ids
    // by default the source is the ids string
    let source: unknown[] = [ids]
    if (deps && deps.length) {
        source = deps
    }
    return useAsync(() => client.getProducts({parameters: {ids}, ...opts}), source)
}
/**
 * A hook for `ShopperProducts#getProduct`.
 * Allows access to product details for a single product ID. Only products that are online and assigned to a site catalog are returned. Along with product details, the availability, images, price, bundled_products, set_products, recommedations, product options, variations, and promotions for the products will be included, as appropriate.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-products?meta=getProduct} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperproducts.shopperproducts-1.html#getproduct} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useProduct = (
    arg: Argument<Client['getProduct']>,
    deps: unknown[] = []
): QueryResponse<DataType<Client['getProduct']>> => {
    if (!arg) {
        throw new Error('useProducts requires product id in parameters ')
    }
    const {
        parameters: {id}
    } = arg
    // by default the source is the ids string
    let source: unknown[] = [id]
    if (deps.length) {
        source = deps
    }
    const {shopperProducts: client} = useCommerceApi()
    return useAsync(() => client.getProduct(arg), source)
}
/**
 * A hook for `ShopperProducts#getCategories`.
 * When you use the URL template, the server returns multiple categories (a result object of category documents). You can use this template as a convenient way of obtaining multiple categories in a single request, instead of issuing separate requests for each category. You can specify up to 50 multiple IDs. You must enclose the list of IDs in parentheses. If a category identifier contains parenthesis or the separator sign, you must URL encode the character. The server only returns online categories.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-products?meta=getCategories} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperproducts.shopperproducts-1.html#getcategories} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useCategories = (
    arg: Argument<Client['getCategories']>,
    deps: unknown[] = []
): QueryResponse<DataType<Client['getCategories']>> => {
    if (!arg) {
        throw new Error('useCategories requires categories ids string in parameters ')
    }
    const {
        parameters: {ids, levels = 1}
    } = arg
    let source: unknown[] = [ids, levels]
    if (deps.length) {
        source = deps
    }
    const {shopperProducts: client} = useCommerceApi()
    return useAsync(() => client.getCategories(arg), source)
}
/**
 * A hook for `ShopperProducts#getCategory`.
 * When you use the URL template below, the server returns a category identified by its ID; by default, the server
also returns the first level of subcategories, but you can specify another level by setting the levels
parameter. The server only returns online categories.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-products?meta=getCategory} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperproducts.shopperproducts-1.html#getcategory} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useCategory = (
    arg: Argument<Client['getCategory']>,
    deps: unknown[] = []
): QueryResponse<DataType<Client['getCategory']>> => {
    if (!arg) {
        throw new Error('useCategory requires categories ids string in parameters ')
    }
    const {
        parameters: {id, levels = 1}
    } = arg
    let source: unknown[] = [id, levels]
    if (deps.length) {
        source = deps
    }
    const {shopperProducts: client} = useCommerceApi()
    return useAsync(() => client.getCategory(arg), source)
}
