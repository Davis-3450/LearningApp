import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BookOpen, Play, Heart, Share, Share2 } from 'lucide-react';
import Link from 'next/link';
import type { Deck } from '@/shared/schemas/deck';
import { PostDeckDialog } from './post-deck-dialog';

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

// Standard deck card component used across pages
export function DeckCard({ 
  deck, 
  fileName, 
  className,
  showActions = true,
  compact = false,
  showPostAction = false 
}: { 
  deck: Deck; 
  fileName: string;
  className?: string;
  showActions?: boolean;
  compact?: boolean;
  showPostAction?: boolean;
}) {
  const [showPostDialog, setShowPostDialog] = useState(false);
  return (
    <Card className={cn("hover:shadow-lg transition-all border-0 shadow-sm", className)}>
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center",
            compact ? "w-10 h-10" : "w-12 h-12"
          )}>
            <BookOpen className={cn("text-primary", compact ? "h-5 w-5" : "h-6 w-6")} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold leading-tight mb-1 truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              {deck.title}
            </h3>
            <p className={cn(
              "text-muted-foreground mb-2 line-clamp-2",
              compact ? "text-xs" : "text-xs"
            )}>
              {deck.description}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className={cn("h-5", compact ? "text-xs" : "text-xs")}>
                {deck.concepts.length} cards
              </Badge>
              <Badge variant="secondary" className={cn("h-5", compact ? "text-xs" : "text-xs")}>
                {deck.difficulty || 'Medium'}
              </Badge>
            </div>
            {showActions && (
              <div className="flex items-center gap-2">
                <Button size="sm" className={cn("text-xs flex-1", compact ? "h-6" : "h-7")} asChild>
                  <Link href={`/game/flashcard/${fileName}`}>
                    <Play className={cn("mr-1", compact ? "h-2 w-2" : "h-3 w-3")} />
                    Study
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className={cn("px-2", compact ? "h-6" : "h-7")}>
                  <Heart className={cn(compact ? "h-2 w-2" : "h-3 w-3")} />
                </Button>
                {showPostAction ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn("px-2", compact ? "h-6" : "h-7")}
                    onClick={() => setShowPostDialog(true)}
                  >
                    <Share2 className={cn(compact ? "h-2 w-2" : "h-3 w-3")} />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className={cn("px-2", compact ? "h-6" : "h-7")}>
                    <Share className={cn(compact ? "h-2 w-2" : "h-3 w-3")} />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <PostDeckDialog
        fileName={fileName}
        deck={deck}
        isOpen={showPostDialog}
        onClose={() => setShowPostDialog(false)}
        onSuccess={() => {
          // Optionally refresh the page or show success message
          console.log('Deck posted successfully!');
        }}
      />
    </Card>
  );
}

// Stats card component for metrics display
export function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color = "text-primary",
  className 
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center p-3 rounded-lg border", className)}>
      <Icon className={cn("h-5 w-5 mx-auto mb-1", color)} />
      <div className={cn("text-lg font-bold", color)}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

// Quick action card for main actions
export function ActionCard({
  href,
  icon: Icon,
  title,
  subtitle,
  variant = "default",
  className
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <Button 
      asChild 
      variant={variant} 
      className={cn("w-full justify-start h-12", className)}
    >
      <Link href={href}>
        <Icon className="mr-3 h-5 w-5" />
        <div className="text-left">
          <div className="font-medium">{title}</div>
          <div className={cn(
            "text-xs",
            variant === "default" ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {subtitle}
          </div>
        </div>
      </Link>
    </Button>
  );
}

// Empty state card
export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  action,
  className
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <Icon className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {description}
        </p>
        {action}
      </CardContent>
    </Card>
  );
}

// Quick start section component
export function QuickStartCard({
  title = "Quick Start",
  actions,
  className
}: {
  title?: string;
  actions: Array<{
    href: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    variant?: "default" | "outline";
  }>;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            href={action.href}
            icon={action.icon}
            title={action.title}
            subtitle={action.subtitle}
            variant={action.variant}
          />
        ))}
      </CardContent>
    </Card>
  );
}

// Filter tabs component
export function FilterTabs({
  options,
  selected,
  onSelect,
  className
}: {
  options: Array<{ value: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(option.value)}
          className="whitespace-nowrap capitalize"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
} 