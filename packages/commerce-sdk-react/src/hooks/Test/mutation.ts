/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {ApiClients, ApiMethod, Argument, CacheUpdateGetter, DataType} from '../types'
import {useMutation} from '../useMutation'
import {UseMutationResult} from '@tanstack/react-query'
import {NotImplementedError} from '../utils'
import useCommerceApi from '../useCommerceApi'
import {cacheUpdateMatrix} from './config'

type Client = ApiClients['shopperBaskets']

export const ShopperBasketsMutations = {
    CreateBasket: 'createBasket',
    TransferBasket: 'transferBasket',
    MergeBasket: 'mergeBasket',
    DeleteBasket: 'deleteBasket',
    UpdateBasket: 'updateBasket',
    UpdateBillingAddressForBasket: 'updateBillingAddressForBasket',
    AddCouponToBasket: 'addCouponToBasket',
    RemoveCouponFromBasket: 'removeCouponFromBasket',
    UpdateCustomerForBasket: 'updateCustomerForBasket',
    AddGiftCertificateItemToBasket: 'addGiftCertificateItemToBasket',
    RemoveGiftCertificateItemFromBasket: 'removeGiftCertificateItemFromBasket',
    UpdateGiftCertificateItemInBasket: 'updateGiftCertificateItemInBasket',
    AddItemToBasket: 'addItemToBasket',
    RemoveItemFromBasket: 'removeItemFromBasket',
    UpdateItemInBasket: 'updateItemInBasket',
    AddTaxesForBasketItem: 'addTaxesForBasketItem',
    AddPaymentInstrumentToBasket: 'addPaymentInstrumentToBasket',
    RemovePaymentInstrumentFromBasket: 'removePaymentInstrumentFromBasket',
    UpdatePaymentInstrumentInBasket: 'updatePaymentInstrumentInBasket',
    AddPriceBooksToBasket: 'addPriceBooksToBasket',
    CreateShipmentForBasket: 'createShipmentForBasket',
    RemoveShipmentFromBasket: 'removeShipmentFromBasket',
    UpdateShipmentForBasket: 'updateShipmentForBasket',
    UpdateShippingAddressForShipment: 'updateShippingAddressForShipment',
    UpdateShippingMethodForShipment: 'updateShippingMethodForShipment',
    AddTaxesForBasket: 'addTaxesForBasket'
} as const

export type ShopperBasketsMutation =
    (typeof ShopperBasketsMutations)[keyof typeof ShopperBasketsMutations]

export function useShopperBasketsMutation<Mutation extends ShopperBasketsMutation>(
    mutation: Mutation
): UseMutationResult<DataType<Client[Mutation]>, unknown, Argument<Client[Mutation]>> {
    const getCacheUpdates = cacheUpdateMatrix[mutation]
    // TODO: Remove this check when all mutations are implemented.
    if (!getCacheUpdates) throw new NotImplementedError(`The '${mutation}' mutation`)

    // The `Options` and `Data` types for each mutation are similar, but distinct, and the union
    // type generated from `Client[Mutation]` seems to be too complex for TypeScript to handle.
    // I'm not sure if there's a way to avoid the type assertions in here for the methods that
    // use them. However, I'm fairly confident that they are safe to do, as they seem to be simply
    // re-asserting what we already have.
    const {shopperBaskets: client} = useCommerceApi()
    type Options = Argument<Client[Mutation]>
    type Data = DataType<Client[Mutation]>
    return useMutation({
        method: (opts: Options) => (client[mutation] as ApiMethod<Options, Data>)(opts),
        getCacheUpdates: getCacheUpdates as CacheUpdateGetter<Options, Data>
    })
}