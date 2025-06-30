import React from 'react';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription, AlertTitle } from './alert';

interface AsyncBoundaryProps {
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: (error: Error, retry?: () => void) => React.ReactNode;
  onRetry?: () => void;
}

const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center gap-2">
      <Loader className="h-4 w-4 animate-spin" />
      <span className="text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  </div>
);

const DefaultErrorFallback = ({ error, retry }: { error: Error; retry?: () => void }) => (
  <div className="flex items-center justify-center py-12">
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2">
        {error.message || 'An unexpected error occurred'}
        {retry && (
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            className="mt-3 w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  </div>
);

export const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({
  loading,
  error,
  children,
  fallback,
  errorFallback,
  onRetry,
}) => {
  if (loading) {
    return <>{fallback || <DefaultLoadingFallback />}</>;
  }

  if (error) {
    return (
      <>
        {errorFallback ? 
          errorFallback(error, onRetry) : 
          <DefaultErrorFallback error={error} retry={onRetry} />
        }
      </>
    );
  }

  return <>{children}</>;
};