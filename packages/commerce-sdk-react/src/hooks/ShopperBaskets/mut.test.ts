/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {act} from '@testing-library/react'
import {ShopperBasketsTypes, ShopperCustomersTypes} from 'commerce-sdk-isomorphic'
import nock from 'nock'
import {
    assertUpdateQuery,
    DEFAULT_TEST_CONFIG,
    mockMutationEndpoints,
    mockQueryEndpoint,
    renderHookWithProviders
} from '../../test-utils'
import {useCustomerBaskets} from '../ShopperCustomers'
import {ApiClients, Argument} from '../types'
import {ShopperBasketsMutation, useShopperBasketsMutation} from './mutation'
import * as queries from './query'

jest.mock('../../auth/index.ts', () => {
    return jest.fn().mockImplementation(() => ({
        ready: jest.fn().mockResolvedValue({access_token: 'access_token'})
    }))
})

type Client = ApiClients['shopperBaskets']
type Basket = ShopperBasketsTypes.Basket
type BasketsResult = ShopperCustomersTypes.BasketsResult

/** Create an options object for Shopper Baskets endpoints, with `basketId` pre-filled. */
const makeOptions = <Method extends Exclude<keyof Client, 'clientConfig'>>(
    body: Argument<Client[Method]> extends {body: infer B} ? B : undefined,
    parameters?: Omit<Argument<Client[Method]>['parameters'], 'basketId'>
): Argument<Client[Method]> => ({
    body,
    parameters: {basketId: BASKET_ID, ...parameters}
})

// --- getBasket constants --- //
const basketsEndpoint = '/checkout/shopper-baskets/'
const BASKET_ID = 'basket_id'
const getBasketOptions = makeOptions<'getBasket'>(undefined)
const oldBasket: Basket = {basketId: BASKET_ID, mockData: 'old basket'}
const newBasket: Basket = {basketId: BASKET_ID, mockData: 'new basket'}
// --- getCustomerBaskets constants --- //
const customersEndpoint = '/customer/shopper-customers/'
const CUSTOMER_ID = 'customer_id'
// Can't use `makeOptions()` here because it's Shopper Customers, not Shopper Baskets
const getCustomerBasketsOptions: Argument<ApiClients['shopperCustomers']['getCustomerBaskets']> = {
    parameters: {
        customerId: CUSTOMER_ID
    }
}
const oldCustomerBaskets: BasketsResult = {
    // We aren't implementing the full basket, so we assert to pretend we are
    baskets: [{basketId: 'other_basket'}, oldBasket] as BasketsResult['baskets'],
    total: 2
}
const newCustomerBaskets: BasketsResult = {
    // We aren't implementing the full basket, so we assert to pretend we are
    baskets: [{basketId: 'other_basket'}, newBasket] as BasketsResult['baskets'],
    total: 2
}

// --- TEST CASES --- //
type NonDeleteMutation = Exclude<ShopperBasketsMutation, 'deleteBasket'>
// TODO: Remove optional flag when all mutations are implemented
type TestMap = {[Mut in NonDeleteMutation]?: Argument<Client[Mut]>}
// This is an object rather than an array to more easily ensure we cover all mutations
const testMap: TestMap = {
    // TODO: Figure out why commented-out mutations are failing
    addCouponToBasket: makeOptions<'addCouponToBasket'>({code: 'coupon'}),
    addItemToBasket: makeOptions<'addItemToBasket'>([]),
    addPaymentInstrumentToBasket: makeOptions<'addPaymentInstrumentToBasket'>({}),
    createBasket: makeOptions<'createBasket'>({}),
    mergeBasket: makeOptions<'mergeBasket'>(undefined),
    // removeCouponFromBasket: makeOptions<'removeCouponFromBasket'>(undefined),
    // removeItemFromBasket: makeOptions<'removeItemFromBasket'>(undefined),
    // removePaymentInstrumentFromBasket: makeOptions<'removePaymentInstrumentFromBasket'>(undefined),
    updateBasket: makeOptions<'updateBasket'>({}),
    updateBillingAddressForBasket: makeOptions<'updateBillingAddressForBasket'>({}),
    updateCustomerForBasket: makeOptions<'updateCustomerForBasket'>({email: 'customer@email'})
    // updateItemInBasket: makeOptions<'updateItemInBasket'>({}),
    // updatePaymentInstrumentInBasket: makeOptions<'updatePaymentInstrumentInBasket'>({}),
    // updateShippingAddressForShipment: makeOptions<'updateShippingAddressForShipment'>({}),
    // updateShippingMethodForShipment: makeOptions<'updateShippingMethodForShipment'>({id: 'ship'})
}
// This is what we actually use for `test.each`
// Type assertion because the built-in type definition for `Object.entries` is limited :\
const testCases = Object.entries(testMap) as Array<
    [NonDeleteMutation, NonNullable<TestMap[NonDeleteMutation]>]
>

describe('ShopperBaskets mutations', () => {
    const storedCustomerIdKey = `${DEFAULT_TEST_CONFIG.siteId}_customer_id`
    beforeAll(() => {
        // Make sure we don't accidentally overwrite something before setting up our test state
        if (window.localStorage.length > 0) throw new Error('Unexpected data in local storage.')
        window.localStorage.setItem(storedCustomerIdKey, CUSTOMER_ID)
    })
    afterAll(() => {
        window.localStorage.removeItem(storedCustomerIdKey)
    })

    beforeEach(() => nock.cleanAll())
    afterEach(() => {
        // To avoid needing to know which HTTP verb a mutation uses (DELETE/PATCH/POST/PUT),
        // we mock them all, and then validate that exactly one was used.
        expect(nock.pendingMocks().length).toBe(3)
    })

    test.each(testCases)('%s returns data on success', async (mutationName, options) => {
        mockMutationEndpoints(basketsEndpoint, oldBasket)
        const {result, waitForValueToChange} = renderHookWithProviders(() => {
            return useShopperBasketsMutation(mutationName)
        })
        expect(result.current.data).toBeUndefined()
        act(() => result.current.mutate(options))
        await waitForValueToChange(() => result.current.data)
        expect(result.current.data).toEqual(oldBasket)
    })
    test.each(testCases)('%s returns error on error', async (mutationName, options) => {
        mockMutationEndpoints(basketsEndpoint, {}, 400)
        const {result, waitForValueToChange} = renderHookWithProviders(() => {
            return useShopperBasketsMutation(mutationName)
        })
        expect(result.current.error).toBeNull()
        act(() => result.current.mutate(options))
        await waitForValueToChange(() => result.current.error)
        expect(result.current.error).toBeInstanceOf(Error)
    })
    test.each(testCases)('%s changes the cache on success', async (mutationName, options) => {
        mockQueryEndpoint(basketsEndpoint, oldBasket) // getBasket
        mockQueryEndpoint(customersEndpoint, oldCustomerBaskets) // getCustomerBaskets
        mockMutationEndpoints(basketsEndpoint, newBasket) // this mutation
        const {result, waitForValueToChange} = renderHookWithProviders(() => ({
            basket: queries.useBasket(getBasketOptions),
            customerBaskets: useCustomerBaskets(getCustomerBasketsOptions),
            mutation: useShopperBasketsMutation(mutationName)
        }))
        await waitForValueToChange(() => result.current.basket.data)
        expect(result.current.basket.data).toEqual(oldBasket)
        expect(result.current.customerBaskets.data).toEqual(oldCustomerBaskets)
        act(() => result.current.mutation.mutate(options))
        await waitForValueToChange(() => result.current.mutation.isSuccess)
        assertUpdateQuery(result.current.basket, newBasket)
        assertUpdateQuery(result.current.customerBaskets, newCustomerBaskets)
    })
    test.each(testCases)('%s does not change cache on error', async (mutationName, options) => {
        mockQueryEndpoint(basketsEndpoint, oldBasket) // getBasket
        mockQueryEndpoint(customersEndpoint, oldCustomerBaskets) // getCustomerBaskets
        mockMutationEndpoints(basketsEndpoint, {}, 400) // this mutation
        const {result, waitForValueToChange} = renderHookWithProviders(() => ({
            basket: queries.useBasket(getBasketOptions),
            customerBaskets: useCustomerBaskets(getCustomerBasketsOptions),
            mutation: useShopperBasketsMutation(mutationName)
        }))
        await waitForValueToChange(() => result.current.basket.data)
        expect(result.current.basket.data).toEqual(oldBasket)
        expect(result.current.customerBaskets.data).toEqual(oldCustomerBaskets)
        act(() => result.current.mutation.mutate(options))
        await waitForValueToChange(() => result.current.mutation.isError)
        assertUpdateQuery(result.current.basket, oldBasket)
        assertUpdateQuery(result.current.customerBaskets, oldCustomerBaskets)
    })
    // TODO: Special case `deleteBasket`
})