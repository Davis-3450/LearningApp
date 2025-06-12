"use client"

import { Card as ChakraCard, CardHeader as ChakraCardHeader, CardBody, CardFooter as ChakraCardFooter, type BoxProps, Heading, Text } from "@chakra-ui/react"

export const Card = (props: BoxProps) => <ChakraCard {...props} />
export const CardHeader = (props: BoxProps) => <ChakraCardHeader {...props} />
export const CardContent = (props: BoxProps) => <CardBody {...props} />
export const CardFooter = (props: BoxProps) => <ChakraCardFooter {...props} />
export const CardTitle = (props: BoxProps) => <Heading size="md" {...props} />
export const CardDescription = (props: BoxProps) => <Text fontSize="sm" color="gray.500" {...props} />
export const CardAction = (props: BoxProps) => <div {...props} />
