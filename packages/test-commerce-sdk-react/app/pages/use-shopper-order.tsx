/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {useOrder} from 'commerce-sdk-react'
import {useParams} from 'react-router-dom'
import Json from '../components/Json'

function UseShopperOrder() {
    const {orderNo}: {orderNo: string} = useParams()
    const {data, isLoading, error} = useOrder({orderNo: orderNo})
    if (isLoading) {
        return (
            <div>
                <h1>useOrder page</h1>
                <h2 style={{background: 'aqua'}}>Loading...</h2>
            </div>
        )
    }
    if (error) {
        return <h1 style={{color: 'red'}}>Something is wrong</h1>
    }
    return (
        <>
            <h1>Order Information</h1>
            <h3>Order #: {orderNo}</h3>
            
            <hr />
            <div>
                <div>Returning Data</div>
                <Json data={{isLoading, error, data}}/>
            </div>
        </>
    )
}

UseShopperOrder.getTemplateName = () => 'UseShopperOrder'

export default UseShopperOrder
