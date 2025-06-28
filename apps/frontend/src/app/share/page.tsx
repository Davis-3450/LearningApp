'use client';

import { useState, useEffect } from 'react';
import { DecksAPI } from '@/lib/api/decks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PageLayout, 
  PageHeader, 
  PageContent, 
  PageSection, 
  ContentGrid,
  LoadingGrid,
  SearchHeader
} from '@/components/ui/page-layout';
import { 
  EmptyStateCard,
  FilterTabs
} from '@/components/ui/common-cards';
import { logger } from '@/lib/logger';
import { PostDeckDialog } from '@/components/ui/post-deck-dialog';
import { 
  Share2, 
  BookOpen, 
  Users, 
  Globe,
  Heart
} from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

interface PostedDeck {
  postId: string;
  fileName: string;
  deck: Deck;
  author?: string;
  postedAt: string;
  likes?: number;
}

export default function SharePage() {
  const [myDecks, setMyDecks] = useState<DeckWithFileName[]>([]);
  const [publicDecks, setPublicDecks] = useState<PostedDeck[]>([]);
  const [myPosts, setMyPosts] = useState<PostedDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('share');
  const [postDialog, setPostDialog] = useState<{ isOpen: boolean; fileName?: string; deck?: Deck }>({ 
    isOpen: false 
  });

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [decksResponse, publicResponse, postsResponse] = await Promise.all([
        DecksAPI.getAll(),
        DecksAPI.getPublicDecks(),
        DecksAPI.getMyPosts()
      ]);

      if (decksResponse.success && decksResponse.data) {
        setMyDecks(decksResponse.data);
      }
      if (publicResponse.success && publicResponse.data) {
        setPublicDecks(publicResponse.data);
      }
      if (postsResponse.success && postsResponse.data) {
        setMyPosts(postsResponse.data);
      }
    } catch (error) {
      logger.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle deck posting
  const handlePost = (fileName: string, deck: Deck) => {
    setPostDialog({ isOpen: true, fileName, deck });
  };

  // Handle like/unlike
  const handleLike = async (postId: string) => {
    try {
      await DecksAPI.likeDeck(postId);
      await loadData(); // Refresh data
    } catch (error) {
      logger.error('Failed to like deck:', error);
    }
  };

  // Handle unpost
  const handleUnpost = async (postId: string) => {
    if (!confirm('Are you sure you want to remove this post?')) return;
    
    try {
      const response = await DecksAPI.unpostDeck(postId);
      if (response.success) {
        await loadData(); // Refresh data
      } else {
        alert(`Failed to unpost: ${response.error}`);
      }
    } catch (error) {
      logger.error('Failed to unpost deck:', error);
      alert('Failed to unpost deck');
    }
  };

  // Filter decks
  const filteredMyDecks = myDecks.filter(({ deck }) => 
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPublicDecks = publicDecks.filter(({ deck }) => 
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMyPosts = myPosts.filter(({ deck }) => 
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabOptions = [
    { value: 'share', label: 'Share Decks' },
    { value: 'discover', label: 'Discover' },
    { value: 'my-posts', label: 'My Posts' }
  ];

  return (
    <PageLayout>
      <PageHeader 
        title="Share & Discover" 
        subtitle="Share your decks with the community and discover new content"
        icon={Share2}
      />
      
      <PageContent>
        <FilterTabs 
          options={tabOptions}
          selected={activeTab}
          onSelect={setActiveTab}
          className="mb-6"
        />

        {activeTab === 'share' && (
          <>
            <SearchHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search your decks..."
            />
            
            <PageSection 
              title="Your Decks" 
              subtitle="Choose decks to share with the community"
            >
              {loading ? (
                <LoadingGrid />
              ) : filteredMyDecks.length === 0 ? (
                <EmptyStateCard
                  icon={BookOpen}
                  title="No decks found"
                  description={searchQuery ? "No decks match your search." : "Create some decks first to share them."}
                />
              ) : (
                <ContentGrid>
                  {filteredMyDecks.map(({ fileName, deck }) => (
                    <Card key={fileName} className="hover:shadow-lg transition-all border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm leading-tight mb-1 truncate">
                              {deck.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {deck.description}
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs h-5">
                                {deck.concepts.length} concepts
                              </Badge>
                              <Badge variant="secondary" className="text-xs h-5">
                                {deck.concepts.length * 2} cards
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full h-7 text-xs"
                              onClick={() => handlePost(fileName, deck)}
                            >
                              <Share2 className="mr-2 h-3 w-3" />
                              Share Deck
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ContentGrid>
              )}
            </PageSection>
          </>
        )}

        {activeTab === 'discover' && (
          <>
            <SearchHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search public decks..."
            />
            
            <PageSection 
              title="Community Decks" 
              subtitle="Discover decks shared by other learners"
            >
              {loading ? (
                <LoadingGrid />
              ) : filteredPublicDecks.length === 0 ? (
                <EmptyStateCard
                  icon={Globe}
                  title="No public decks found"
                  description={searchQuery ? "No public decks match your search." : "No public decks available yet."}
                />
              ) : (
                <ContentGrid>
                  {filteredPublicDecks.map((postedDeck) => (
                    <Card key={postedDeck.postId} className="hover:shadow-lg transition-all border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm leading-tight mb-1 truncate">
                              {postedDeck.deck.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-1">
                              by {postedDeck.author || 'Anonymous'}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {postedDeck.deck.description}
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs h-5">
                                {postedDeck.deck.concepts.length} concepts
                              </Badge>
                              <Badge variant="secondary" className="text-xs h-5">
                                {postedDeck.likes || 0} likes
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1 h-7 text-xs"
                                onClick={() => {/* TODO: Copy/import deck */}}
                              >
                                <BookOpen className="mr-2 h-3 w-3" />
                                Study
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm" 
                                className="h-7 text-xs px-2"
                                onClick={() => handleLike(postedDeck.postId)}
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ContentGrid>
              )}
            </PageSection>
          </>
        )}

        {activeTab === 'my-posts' && (
          <>
            <SearchHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search your posts..."
            />
            
            <PageSection 
              title="My Shared Decks" 
              subtitle="Decks you've shared with the community"
            >
              {loading ? (
                <LoadingGrid />
              ) : filteredMyPosts.length === 0 ? (
                <EmptyStateCard
                  icon={Users}
                  title="No shared decks"
                  description={searchQuery ? "No shared decks match your search." : "You haven't shared any decks yet."}
                />
              ) : (
                <ContentGrid>
                  {filteredMyPosts.map((postedDeck) => (
                    <Card key={postedDeck.postId} className="hover:shadow-lg transition-all border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm leading-tight mb-1 truncate">
                              {postedDeck.deck.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-1">
                              Shared {new Date(postedDeck.postedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {postedDeck.deck.description}
                            </p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className="text-xs h-5">
                                {postedDeck.deck.concepts.length} concepts
                              </Badge>
                              <Badge variant="secondary" className="text-xs h-5">
                                {postedDeck.likes || 0} likes
                              </Badge>
                            </div>
                            <Button 
                              variant="destructive"
                              size="sm" 
                              className="w-full h-7 text-xs"
                              onClick={() => handleUnpost(postedDeck.postId)}
                            >
                              Remove Post
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ContentGrid>
              )}
            </PageSection>
          </>
        )}
      </PageContent>

      <PostDeckDialog
        fileName={postDialog.fileName || ''}
        deck={postDialog.deck || { id: '', title: '', concepts: [] }}
        isOpen={postDialog.isOpen}
        onClose={() => setPostDialog({ isOpen: false })}
        onSuccess={() => {
          setPostDialog({ isOpen: false });
          loadData(); // Refresh data to show updated posts
        }}
      />
    </PageLayout>
  );
} 