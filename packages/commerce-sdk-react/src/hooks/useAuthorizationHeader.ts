/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {ApiOptions, ApiMethod} from './types'
import useAuth from './useAuth'

/**
 * Creates a method that waits for authentication to complete and automatically includes an
 * Authorization header when making requests.
 * @param method Bound API method
 */
export const useAuthorizationHeader = <Options extends ApiOptions, Data>(
    method: ApiMethod<Options, Data>
): ApiMethod<Options, Data> => {
    const auth = useAuth()
    return async (options) => {
        const {access_token} = await auth.ready()
        return await method({
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${access_token}`
            }
        })
    }
}
