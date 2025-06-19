import * as React from 'react';
import { cn } from '@/lib/utils';

// Main page wrapper with bottom navigation spacing
export function PageLayout({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn("pb-20", className)}>
      {children}
    </div>
  );
}

// Sticky header component
export function PageHeader({ 
  title, 
  subtitle, 
  actions, 
  className 
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}

// Search header variant for FYP-like pages
export function SearchHeader({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  actions,
  children,
  className
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4 space-y-3",
      className
    )}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

// Content container with consistent padding
export function PageContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn("p-4 space-y-6", className)}>
      {children}
    </div>
  );
}

// Section component for organizing content
export function PageSection({ 
  title, 
  subtitle,
  actions,
  children, 
  className 
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-3">
          <div>
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// Grid layouts for consistent spacing
export function StatsGrid({ 
  children, 
  columns = 3,
  className 
}: { 
  children: React.ReactNode; 
  columns?: number;
  className?: string;
}) {
  return (
    <div 
      className={cn("grid gap-3", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
}

// Content grid for cards/items
export function ContentGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {children}
    </div>
  );
}

// Loading skeleton grid
export function LoadingGrid({ 
  count = 3, 
  className 
}: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

// Section header with icon
export function SectionHeader({ 
  icon: Icon, 
  title, 
  iconColor = "text-primary",
  className 
}: {
  icon: React.ElementType;
  title: string;
  iconColor?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 mb-3", className)}>
      <Icon className={cn("h-5 w-5", iconColor)} />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
} 