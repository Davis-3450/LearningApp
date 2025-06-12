"use client"

import { forwardRef } from "react"
import { Button as ChakraButton, type ButtonProps } from "@chakra-ui/react"

export interface CustomButtonProps extends ButtonProps {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (props, ref) => {
    return <ChakraButton ref={ref} {...props} />
  }
)
Button.displayName = "Button"

// Chakra manages variants internally; this is a placeholder to maintain the
// previous export used across the codebase.
export const buttonVariants = {}

export default Button
