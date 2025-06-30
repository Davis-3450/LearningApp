import { RefreshCw, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Generic loading spinner
export function LoadingSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return <RefreshCw className={`animate-spin ${className}`} />;
}

// Full page loading state
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <LoadingSpinner />
        {message}
      </div>
    </div>
  );
}

// Card-based loading state
export function CardLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center flex items-center justify-center gap-2">
            <LoadingSpinner />
            {message}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Error state component
export function ErrorState({ 
  title = "Something went wrong",
  message,
  onRetry,
  showBackButton = false,
  backHref = "/",
  backLabel = "Go Back"
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {message && (
          <p className="text-muted-foreground mb-4">{message}</p>
        )}
        <div className="flex gap-2 justify-center">
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {showBackButton && (
            <Button variant="outline" asChild>
              <a href={backHref}>{backLabel}</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty state component
export function EmptyState({ 
  icon: Icon = FileText,
  title,
  description,
  action
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {action}
    </div>
  );
} 