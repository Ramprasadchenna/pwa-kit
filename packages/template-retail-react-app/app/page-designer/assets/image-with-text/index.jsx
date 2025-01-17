/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Box, Image, Link, Text} from '@chakra-ui/react'

/**
 * Image with text component
 *
 * @param {object} props
 * @param {string} - props.ITCLink - Image Link.
 * @param {string} - props.ITCText - Text Below Image.
 * @param {image} - props.image - Image.
 * @param {string} - props.heading - Text Overlay.
 * @param {string} - props.alt - The image alt text shown by the component.
 * @returns {React.ReactElement} - ImageWithText component.
 */
export const ImageWithText = ({ITCLink, ITCText, image, heading, alt}) => {
    const hasCaption = ITCText || heading

    return (
        <Box className={'image-with-text'}>
            <Box
                as="figure"
                className={'image-with-text-figure'}
                position={'relative'}
                margin={0}
                width={'100%'}
            >
                <picture>
                    <source srcSet={image?.src?.tablet} media="(min-width: 48em)" />
                    <source srcSet={image?.src?.desktop} media="(min-width: 64em)" />
                    <Link to={ITCLink}>
                        <Image
                            className={'image-with-text-image'}
                            data-testid={'image-with-text-image'}
                            src={image?.src?.mobile ? image?.src?.mobile : image?.url}
                            ignoreFallback={true}
                            alt={alt}
                            title={alt}
                            filter={'brightness(40%)'}
                        />
                    </Link>
                </picture>
                {hasCaption && (
                    <Text as="figcaption">
                        {heading && (
                            <Box
                                className={'image-with-text-heading-container'}
                                position={'absolute'}
                                top={'50%'}
                                width={'100%'}
                            >
                                <Text
                                    as="span"
                                    className={'image-with-text-heading-text'}
                                    color={'white'}
                                >
                                    {/* The `dangerouslySetInnerHTML` is safe to use in this context. */}
                                    {/* The HTML in the response from Page Designer API is already sanitized. */}
                                    <Box
                                        dangerouslySetInnerHTML={{
                                            __html: heading
                                        }}
                                        sx={{
                                            p: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }
                                        }}
                                    />
                                </Text>
                            </Box>
                        )}
                        {ITCText && (
                            <Box>
                                <Text as="span" className={'image-with-text-text-underneath'}>
                                    {/* The `dangerouslySetInnerHTML` is safe to use in this context. */}
                                    {/* The HTML in the response from Page Designer API is already sanitized. */}
                                    <Box
                                        dangerouslySetInnerHTML={{
                                            __html: ITCText
                                        }}
                                        sx={{
                                            p: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }
                                        }}
                                    />
                                </Text>
                            </Box>
                        )}
                    </Text>
                )}
            </Box>
        </Box>
    )
}

ImageWithText.propTypes = {
    ITCLink: PropTypes.string,
    ITCText: PropTypes.string,
    image: PropTypes.shape({
        _type: PropTypes.string,
        focalPoint: PropTypes.shape({
            _type: PropTypes.string,
            x: PropTypes.number,
            y: PropTypes.number
        }),
        metaData: PropTypes.shape({
            _type: PropTypes.string,
            height: PropTypes.number,
            width: PropTypes.number
        }),
        url: PropTypes.string,
        src: PropTypes.string || PropTypes.object
    }).isRequired,
    heading: PropTypes.string,
    alt: PropTypes.string
}

export default ImageWithText
