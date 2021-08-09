/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2021 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {useEffect} from 'react'
import {FormattedMessage, FormattedNumber, useIntl} from 'react-intl'
import {useHistory, useRouteMatch} from 'react-router'
import {
    Box,
    Heading,
    Text,
    Stack,
    Badge,
    Flex,
    Button,
    Divider,
    Grid,
    AspectRatio,
    Image,
    SimpleGrid,
    Skeleton
} from '@chakra-ui/react'
import {getCreditCardIcon} from '../../utils/cc-utils'
import {useAccountOrders} from './util/order-context'
import Link from '../../components/link'
import {ChevronLeftIcon} from '../../components/icons'

const AccountOrderDetail = () => {
    const {url, params} = useRouteMatch()
    const history = useHistory()
    const {formatMessage, formatDate} = useIntl()
    const {ordersById, productsById, isLoading, fetchOrder} = useAccountOrders()
    const order = ordersById[params.orderNo]

    useEffect(() => {
        fetchOrder(params.orderNo)
    }, [])

    const shipment = order?.shipments[0]
    const {shippingAddress, shippingMethod, shippingStatus, trackingNumber} = shipment || {}
    const paymentCard = order?.paymentInstruments[0]?.paymentCard
    const CardIcon = getCreditCardIcon(paymentCard?.cardType)
    const itemCount = order?.productItems.reduce((count, item) => item.quantity + count, 0)

    return (
        <Stack spacing={6} data-testid="account-order-details-page">
            <Stack>
                <Box>
                    <Button
                        as={Link}
                        to={`${url.replace(`/${params.orderNo}`, '')}`}
                        variant="link"
                        leftIcon={<ChevronLeftIcon />}
                        size="sm"
                        onClick={(e) => {
                            if (history.action === 'PUSH') {
                                e.preventDefault()
                                history.goBack()
                            }
                        }}
                    >
                        <FormattedMessage defaultMessage="Back to Order History" />
                    </Button>
                </Box>

                <Stack spacing={[1, 2]}>
                    <Heading as="h1" fontSize={['lg', '2xl']}>
                        <FormattedMessage defaultMessage="Order Details" />
                    </Heading>

                    {!isLoading ? (
                        <Stack
                            direction={['column', 'row']}
                            alignItems={['flex-start', 'center']}
                            spacing={[0, 3]}
                            divider={
                                <Divider
                                    visibility={{base: 'hidden', lg: 'visible'}}
                                    orientation={{lg: 'vertical'}}
                                    h={[0, 4]}
                                />
                            }
                        >
                            <Text fontSize={['sm', 'md']}>
                                <FormattedMessage
                                    defaultMessage="Ordered: {date}"
                                    values={{
                                        date: formatDate(new Date(order.creationDate), {
                                            year: 'numeric',
                                            day: 'numeric',
                                            month: 'short'
                                        })
                                    }}
                                />
                            </Text>
                            <Stack direction="row" alignItems="center">
                                <Text fontSize={['sm', 'md']}>
                                    <FormattedMessage
                                        defaultMessage="Order Number: {orderNumber}"
                                        values={{orderNumber: order.orderNo}}
                                    />
                                </Text>
                                <Badge colorScheme="green">{order.status}</Badge>
                            </Stack>
                        </Stack>
                    ) : (
                        <Skeleton h="20px" w="192px" />
                    )}
                </Stack>
            </Stack>

            <Box layerStyle="cardBordered">
                <Grid templateColumns={{base: '1fr', xl: '60% 1fr'}} gap={{base: 6, xl: 2}}>
                    <SimpleGrid columns={{base: 1, sm: 2}} columnGap={4} rowGap={5} py={{xl: 6}}>
                        {isLoading && (
                            <>
                                <Stack>
                                    <Skeleton h="20px" w="84px" />
                                    <Skeleton h="20px" w="112px" />
                                    <Skeleton h="20px" w="56px" />
                                </Stack>
                                <Stack>
                                    <Skeleton h="20px" w="84px" />
                                    <Skeleton h="20px" w="56px" />
                                </Stack>
                                <Stack>
                                    <Skeleton h="20px" w="112px" />
                                    <Skeleton h="20px" w="84px" />
                                    <Skeleton h="20px" w="56px" />
                                </Stack>
                                <Stack>
                                    <Skeleton h="20px" w="60px" />
                                    <Skeleton h="20px" w="84px" />
                                    <Skeleton h="20px" w="56px" />
                                </Stack>
                            </>
                        )}

                        {!isLoading && (
                            <>
                                <Stack spacing={1}>
                                    <Text fontWeight="bold" fontSize="sm">
                                        <FormattedMessage defaultMessage="Shipping Method" />
                                    </Text>
                                    <Box>
                                        <Text fontSize="sm" textTransform="titlecase">
                                            {shippingStatus.replace(/_/g, ' ')}
                                        </Text>
                                        <Text fontSize="sm">{shippingMethod.name}</Text>
                                        <Text fontSize="sm">
                                            <FormattedMessage defaultMessage="Tracking Number" />:{' '}
                                            {trackingNumber ||
                                                formatMessage({defaultMessage: 'Pending'})}
                                        </Text>
                                    </Box>
                                </Stack>
                                <Stack spacing={1}>
                                    <Text fontWeight="bold" fontSize="sm">
                                        <FormattedMessage defaultMessage="Payment Method" />
                                    </Text>
                                    <Stack direction="row">
                                        {CardIcon && <CardIcon layerStyle="ccIcon" />}
                                        <Box>
                                            <Text fontSize="sm">{paymentCard?.cardType}</Text>
                                            <Stack direction="row">
                                                <Text fontSize="sm">
                                                    &bull;&bull;&bull;&bull;{' '}
                                                    {paymentCard?.numberLastDigits}
                                                </Text>
                                                <Text fontSize="sm">
                                                    {paymentCard?.expirationMonth}/
                                                    {paymentCard?.expirationYear}
                                                </Text>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Stack>
                                <Stack spacing={1}>
                                    <Text fontWeight="bold" fontSize="sm">
                                        <FormattedMessage defaultMessage="Shipping Address" />
                                    </Text>
                                    <Box>
                                        <Text fontSize="sm">
                                            {shippingAddress.firstName} {shippingAddress.lastName}
                                        </Text>
                                        <Text fontSize="sm">{shippingAddress.address1}</Text>
                                        <Text fontSize="sm">
                                            {shippingAddress.city}, {shippingAddress.stateCode}{' '}
                                            {shippingAddress.postalCode}
                                        </Text>
                                    </Box>
                                </Stack>
                                <Stack spacing={1}>
                                    <Text fontWeight="bold" fontSize="sm">
                                        <FormattedMessage defaultMessage="Billing Address" />
                                    </Text>
                                    <Box>
                                        <Text fontSize="sm">
                                            {order.billingAddress.firstName}{' '}
                                            {order.billingAddress.lastName}
                                        </Text>
                                        <Text fontSize="sm">{order.billingAddress.address1}</Text>
                                        <Text fontSize="sm">
                                            {order.billingAddress.city},{' '}
                                            {order.billingAddress.stateCode}{' '}
                                            {order.billingAddress.postalCode}
                                        </Text>
                                    </Box>
                                </Stack>
                            </>
                        )}
                    </SimpleGrid>

                    {!isLoading ? (
                        <Stack
                            py={{base: 6}}
                            px={{base: 6, xl: 8}}
                            background="gray.50"
                            borderRadius="base"
                        >
                            <Text fontWeight="bold" fontSize="sm">
                                <FormattedMessage defaultMessage="Order Summary" />
                            </Text>

                            <Stack spacing={1}>
                                <Flex justify="space-between">
                                    <Text fontSize="sm">
                                        <FormattedMessage defaultMessage="Subtotal" />
                                    </Text>
                                    <Text fontSize="sm">
                                        <FormattedNumber
                                            value={order.productSubTotal}
                                            style="currency"
                                            currency={order.currency}
                                        />
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text fontSize="sm">
                                        <FormattedMessage defaultMessage="Shipping" />
                                    </Text>
                                    <Text fontSize="sm">
                                        {order.shippingTotal != null ? (
                                            <FormattedNumber
                                                value={order.shippingTotal}
                                                style="currency"
                                                currency={order.currency}
                                            />
                                        ) : (
                                            'TBD'
                                        )}
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text fontSize="sm">
                                        <FormattedMessage defaultMessage="Tax" />
                                    </Text>
                                    <Text fontSize="sm">
                                        <FormattedNumber
                                            value={order.taxTotal || order.merchandizeTotalTax}
                                            style="currency"
                                            currency={order.currency}
                                        />
                                    </Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text fontSize="sm" fontWeight="bold">
                                        <FormattedMessage defaultMessage="Estimated Total" />
                                    </Text>
                                    <Text fontSize="sm" fontWeight="bold">
                                        <FormattedNumber
                                            value={order.orderTotal || order.productTotal}
                                            style="currency"
                                            currency={order.currency}
                                        />
                                    </Text>
                                </Flex>
                            </Stack>
                        </Stack>
                    ) : (
                        <Skeleton h="full" />
                    )}
                </Grid>
            </Box>

            <Stack spacing={4}>
                {!isLoading && (
                    <Text>
                        <FormattedMessage
                            defaultMessage="{count} items"
                            values={{count: itemCount}}
                        />
                    </Text>
                )}

                <Stack spacing={4}>
                    {isLoading &&
                        [1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                p={[4, 6]}
                                border="1px solid"
                                borderColor="gray.100"
                                borderRadius="base"
                            >
                                <Flex width="full" align="flex-start">
                                    <Skeleton boxSize={['88px', 36]} mr={4} />

                                    <Stack spacing={2}>
                                        <Skeleton h="20px" w="112px" />
                                        <Skeleton h="20px" w="84px" />
                                        <Skeleton h="20px" w="140px" />
                                    </Stack>
                                </Flex>
                            </Box>
                        ))}

                    {!isLoading &&
                        order?.productItems.map((item) => {
                            const variant = productsById[item.productId]

                            const image = variant?.imageGroups?.find(
                                (group) => group.viewType === 'small'
                            ).images[0]

                            const variationValues = Object.keys(variant?.variationValues || []).map(
                                (key) => {
                                    const value = variant.variationValues[key]
                                    const attr = variant.variationAttributes?.find(
                                        (attr) => attr.id === key
                                    )
                                    return {
                                        id: key,
                                        name: attr?.name || key,
                                        value:
                                            attr.values.find((val) => val.value === value)?.name ||
                                            value
                                    }
                                }
                            )

                            return (
                                <Box
                                    key={item.itemId}
                                    p={[4, 6]}
                                    border="1px solid"
                                    borderColor="gray.100"
                                    borderRadius="base"
                                >
                                    <Flex width="full" align="flex-start">
                                        <AspectRatio ratio={1} width={['88px', 36]} mr={4}>
                                            <Image
                                                alt={image?.alt}
                                                src={image?.disBaseLink}
                                                ignoreFallback={true}
                                            />
                                        </AspectRatio>
                                        <Stack spacing={0} flex={1}>
                                            <Text fontWeight="bold">{item.productName}</Text>
                                            <Flex alignItems="flex-end">
                                                <Box flex={1}>
                                                    {variationValues.map((variationValue) => (
                                                        <Text fontSize="sm" key={variationValue.id}>
                                                            {variationValue.name}:{' '}
                                                            {variationValue.value}
                                                        </Text>
                                                    ))}
                                                    <Text fontSize="sm">
                                                        <FormattedMessage defaultMessage="Qty" />:{' '}
                                                        {item.quantity}
                                                    </Text>
                                                </Box>
                                                <Text fontWeight="bold">
                                                    <FormattedNumber
                                                        value={item.price * item.quantity}
                                                        style="currency"
                                                        currency={order.currency}
                                                    />
                                                </Text>
                                            </Flex>
                                        </Stack>
                                    </Flex>
                                </Box>
                            )
                        })}
                </Stack>
            </Stack>
        </Stack>
    )
}

AccountOrderDetail.getTemplateName = () => 'account-order-history'

export default AccountOrderDetail
