import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Share2, X, Plus, Globe, Users } from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';
import { DecksAPI } from '@/lib/api/decks';

interface PostDeckDialogProps {
  fileName: string;
  deck: Deck;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PostDeckDialog({ 
  fileName, 
  deck, 
  isOpen, 
  onClose, 
  onSuccess 
}: PostDeckDialogProps) {
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePost = async () => {
    setIsPosting(true);
    try {
      const response = await DecksAPI.postDeck(fileName, deck, {
        author: author.trim() || 'Anonymous',
        tags,
        isPublic
      });

      if (response.success) {
        onSuccess?.();
        onClose();
        // Reset form
        setAuthor('');
        setTags([]);
        setNewTag('');
        setIsPublic(true);
      } else {
        alert(`Failed to post deck: ${response.error}`);
      }
    } catch (error) {
      console.error('Error posting deck:', error);
      alert('Failed to post deck. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Post Deck
              </CardTitle>
              <CardDescription>
                Share "{deck.title}" with the community
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Author field */}
          <div className="space-y-2">
            <Label htmlFor="author">Author Name</Label>
            <Input
              id="author"
              placeholder="Your name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (up to 5)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {tags.length < 5 && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={20}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label>Visibility</Label>
            <div className="flex gap-2">
              <Button
                variant={isPublic ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPublic(true)}
                className="flex-1"
              >
                <Globe className="mr-2 h-4 w-4" />
                Public
              </Button>
              <Button
                variant={!isPublic ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPublic(false)}
                className="flex-1"
              >
                <Users className="mr-2 h-4 w-4" />
                Community
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isPublic 
                ? "Everyone can discover and use this deck"
                : "Only community members can see this deck"
              }
            </p>
          </div>

          {/* Deck preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">
                  {deck.title.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-sm">{deck.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {deck.concepts.length} concepts • {deck.concepts.length * 2} cards
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePost} 
              disabled={isPosting}
              className="flex-1"
            >
              {isPosting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Post Deck
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 