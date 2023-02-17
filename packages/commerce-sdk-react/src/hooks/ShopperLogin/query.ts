/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {UseQueryResult} from '@tanstack/react-query'
import {ApiClients, ApiQueryKey, ApiQueryOptions, Argument, DataType} from '../types'
import useCommerceApi from '../useCommerceApi'
import {useQuery} from '../useQuery'
import {mergeOptions} from '../utils'

type Client = ApiClients['shopperLogin']

/**
 * A hook for `ShopperLogin#retrieveCredQualityUserInfo`.
 * Get credential quality statistics for a user.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-login?meta=retrieveCredQualityUserInfo} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperlogin.shopperlogin-1.html#retrievecredqualityuserinfo} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useCredQualityUserInfo = (
    apiOptions: Argument<Client['retrieveCredQualityUserInfo']>,
    queryOptions: ApiQueryOptions<Client['retrieveCredQualityUserInfo']> = {}
): UseQueryResult<DataType<Client['retrieveCredQualityUserInfo']>> => {
    const {shopperLogin: client} = useCommerceApi()
    const method = async (options: Argument<Client['retrieveCredQualityUserInfo']>) =>
        await client.retrieveCredQualityUserInfo(options)
    const requiredParameters = ['organizationId', 'username'] as const
    // Parameters can be set in `apiOptions` or `client.clientConfig`, we must merge them in order
    // to generate the correct query key.
    const netOptions = mergeOptions(client, apiOptions)
    const {parameters} = netOptions
    const queryKey: ApiQueryKey<typeof parameters> = [
        '/organizations/',
        parameters.organizationId,
        '/cred-qual/user',
        parameters
    ]

    // For some reason, if we don't explicitly set these generic parameters, the inferred type for
    // `Data` sometimes, but not always, includes `Response`, which is incorrect. I don't know why.
    return useQuery<typeof netOptions, DataType<Client['retrieveCredQualityUserInfo']>>(
        netOptions,
        queryOptions,
        {
            method,
            queryKey,
            requiredParameters
        }
    )
}
/**
 * A hook for `ShopperLogin#authorizeCustomer`.
 * Get an authorization code after authenticating a user against an identity provider (IDP). This is the first step of the OAuth 2.1 authorization code flow, where a user can log in via federation to the IDP configured for the client. After successfully logging in, the user gets an authorization code via a redirect URI.

This endpoint can be called from the front channel (the browser).
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-login?meta=authorizeCustomer} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperlogin.shopperlogin-1.html#authorizecustomer} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useAuthorizeCustomer = (
    apiOptions: Argument<Client['authorizeCustomer']>,
    queryOptions: ApiQueryOptions<Client['authorizeCustomer']> = {}
): UseQueryResult<DataType<Client['authorizeCustomer']>> => {
    const {shopperLogin: client} = useCommerceApi()
    const method = async (options: Argument<Client['authorizeCustomer']>) =>
        await client.authorizeCustomer(options)
    const requiredParameters = [
        'organizationId',
        'redirect_uri',
        'response_type',
        'client_id',

        'code_challenge'
    ] as const
    // Parameters can be set in `apiOptions` or `client.clientConfig`, we must merge them in order
    // to generate the correct query key.
    const netOptions = mergeOptions(client, apiOptions)
    const {parameters} = netOptions
    const queryKey: ApiQueryKey<typeof parameters> = [
        '/organizations/',
        parameters.organizationId,
        '/oauth2/authorize',
        parameters
    ]

    // For some reason, if we don't explicitly set these generic parameters, the inferred type for
    // `Data` sometimes, but not always, includes `Response`, which is incorrect. I don't know why.
    return useQuery<typeof netOptions, DataType<Client['authorizeCustomer']>>(
        netOptions,
        queryOptions,
        {
            method,
            queryKey,
            requiredParameters
        }
    )
}
/**
 * A hook for `ShopperLogin#getTrustedAgentAuthorizationToken`.
 * Obtains a new agent on behalf authorization token for a registered customer.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-login?meta=getTrustedAgentAuthorizationToken} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperlogin.shopperlogin-1.html#gettrustedagentauthorizationtoken} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useTrustedAgentAuthorizationToken = (
    apiOptions: Argument<Client['getTrustedAgentAuthorizationToken']>,
    queryOptions: ApiQueryOptions<Client['getTrustedAgentAuthorizationToken']> = {}
): UseQueryResult<DataType<Client['getTrustedAgentAuthorizationToken']>> => {
    const {shopperLogin: client} = useCommerceApi()
    const method = async (options: Argument<Client['getTrustedAgentAuthorizationToken']>) =>
        await client.getTrustedAgentAuthorizationToken(options)
    const requiredParameters = [
        'organizationId',
        'client_id',
        'channel_id',
        'code_challenge',
        'login_id',
        'idp_origin',
        'redirect_uri',
        'response_type'
    ] as const
    // Parameters can be set in `apiOptions` or `client.clientConfig`, we must merge them in order
    // to generate the correct query key.
    const netOptions = mergeOptions(client, apiOptions)
    const {parameters} = netOptions
    const queryKey: ApiQueryKey<typeof parameters> = [
        '/organizations/',
        parameters.organizationId,
        '/oauth2/trusted-agent/authorize',
        parameters
    ]

    // For some reason, if we don't explicitly set these generic parameters, the inferred type for
    // `Data` sometimes, but not always, includes `Response`, which is incorrect. I don't know why.
    return useQuery<typeof netOptions, DataType<Client['getTrustedAgentAuthorizationToken']>>(
        netOptions,
        queryOptions,
        {
            method,
            queryKey,
            requiredParameters
        }
    )
}
/**
 * A hook for `ShopperLogin#getUserInfo`.
 * Returns a JSON listing of claims about the currently authenticated user.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-login?meta=getUserInfo} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperlogin.shopperlogin-1.html#getuserinfo} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useUserInfo = (
    apiOptions: Argument<Client['getUserInfo']>,
    queryOptions: ApiQueryOptions<Client['getUserInfo']> = {}
): UseQueryResult<DataType<Client['getUserInfo']>> => {
    const {shopperLogin: client} = useCommerceApi()
    const method = async (options: Argument<Client['getUserInfo']>) =>
        await client.getUserInfo(options)
    const requiredParameters = ['organizationId'] as const
    // Parameters can be set in `apiOptions` or `client.clientConfig`, we must merge them in order
    // to generate the correct query key.
    const netOptions = mergeOptions(client, apiOptions)
    const {parameters} = netOptions
    const queryKey: ApiQueryKey<typeof parameters> = [
        '/organizations/',
        parameters.organizationId,
        '/oauth2/userinfo',
        parameters
    ]

    // For some reason, if we don't explicitly set these generic parameters, the inferred type for
    // `Data` sometimes, but not always, includes `Response`, which is incorrect. I don't know why.
    return useQuery<typeof netOptions, DataType<Client['getUserInfo']>>(netOptions, queryOptions, {
        method,
        queryKey,
        requiredParameters
    })
}
/**
 * A hook for `ShopperLogin#getWellknownOpenidConfiguration`.
 * Returns a JSON listing of the OpenID/OAuth endpoints, supported scopes and claims, public keys used to sign the tokens, and other details.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-login?meta=getWellknownOpenidConfiguration} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperlogin.shopperlogin-1.html#getwellknownopenidconfiguration} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useWellknownOpenidConfiguration = (
    apiOptions: Argument<Client['getWellknownOpenidConfiguration']>,
    queryOptions: ApiQueryOptions<Client['getWellknownOpenidConfiguration']> = {}
): UseQueryResult<DataType<Client['getWellknownOpenidConfiguration']>> => {
    const {shopperLogin: client} = useCommerceApi()
    const method = async (options: Argument<Client['getWellknownOpenidConfiguration']>) =>
        await client.getWellknownOpenidConfiguration(options)
    const requiredParameters = ['organizationId'] as const
    // Parameters can be set in `apiOptions` or `client.clientConfig`, we must merge them in order
    // to generate the correct query key.
    const netOptions = mergeOptions(client, apiOptions)
    const {parameters} = netOptions
    const queryKey: ApiQueryKey<typeof parameters> = [
        '/organizations/',
        parameters.organizationId,
        '/oauth2/.well-known/openid-configuration',
        parameters
    ]

    // For some reason, if we don't explicitly set these generic parameters, the inferred type for
    // `Data` sometimes, but not always, includes `Response`, which is incorrect. I don't know why.
    return useQuery<typeof netOptions, DataType<Client['getWellknownOpenidConfiguration']>>(
        netOptions,
        queryOptions,
        {
            method,
            queryKey,
            requiredParameters
        }
    )
}
/**
 * A hook for `ShopperLogin#getJwksUri`.
 * Returns a JSON Web Key Set (JWKS) containing the current, past, and future public keys. The key set enables clients to validate the Shopper JSON Web Token (JWT) issued by SLAS.
 * @see {@link https://developer.salesforce.com/docs/commerce/commerce-api/references/shopper-login?meta=getJwksUri} for more information about the API endpoint.
 * @see {@link https://salesforcecommercecloud.github.io/commerce-sdk-isomorphic/classes/shopperlogin.shopperlogin-1.html#getjwksuri} for more information on the parameters and returned data type.
 * @returns An object describing the state of the request.
 */
export const useJwksUri = (
    apiOptions: Argument<Client['getJwksUri']>,
    queryOptions: ApiQueryOptions<Client['getJwksUri']> = {}
): UseQueryResult<DataType<Client['getJwksUri']>> => {
    const {shopperLogin: client} = useCommerceApi()
    const method = async (options: Argument<Client['getJwksUri']>) =>
        await client.getJwksUri(options)
    const requiredParameters = ['organizationId'] as const
    // Parameters can be set in `apiOptions` or `client.clientConfig`, we must merge them in order
    // to generate the correct query key.
    const netOptions = mergeOptions(client, apiOptions)
    const {parameters} = netOptions
    const queryKey: ApiQueryKey<typeof parameters> = [
        '/organizations/',
        parameters.organizationId,
        '/oauth2/jwks',
        parameters
    ]

    // For some reason, if we don't explicitly set these generic parameters, the inferred type for
    // `Data` sometimes, but not always, includes `Response`, which is incorrect. I don't know why.
    return useQuery<typeof netOptions, DataType<Client['getJwksUri']>>(netOptions, queryOptions, {
        method,
        queryKey,
        requiredParameters
    })
}
