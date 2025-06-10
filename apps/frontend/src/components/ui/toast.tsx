import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 5000)

      return () => clearTimeout(timer)
    }, [onClose])

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg transition-all",
          {
            "border-gray-200 dark:border-gray-800": variant === "default",
            "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20": variant === "destructive",
            "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20": variant === "success",
          },
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">{children}</div>
          <button
            onClick={() => {
              setIsVisible(false)
              onClose?.()
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast } 