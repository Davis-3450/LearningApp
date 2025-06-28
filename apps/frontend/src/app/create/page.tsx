'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavigationMenu, NavigationItem } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Settings, CreditCard, Eye, Lightbulb, Plus, Trash2, Save } from 'lucide-react';
import { Card as CardType, Deck } from '@/lib/types';
import { generateId, topics } from '@/lib/mock-data';
import { logger } from '@/lib/logger';

export default function CreateDeck() {
  const router = useRouter();
  const [deck, setDeck] = useState<Partial<Deck>>({
    title: '',
    description: '',
    topic: '',
    topicId: '',
    difficulty: 'beginner',
    color: 'bg-blue-500',
    cards: []
  });

  const [cards, setCards] = useState<
    { prompt: string; answer: string; hint?: string }[]
  >([
    { prompt: '', answer: '' }
  ]);

  const handleDeckChange = (field: keyof Deck, value: string) => {
    setDeck(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (index: number, field: 'prompt' | 'answer' | 'hint', value: string) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards(prev => [...prev, { prompt: '', answer: '' }]);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deck.title || !deck.topicId || cards.some(card => !card.prompt || !card.answer)) {
      alert('Please fill in title, topic, and all card prompts and answers');
      return;
    }

    const selectedTopic = topics.find(t => t.id === deck.topicId);
    
    const newDeck: Deck = {
      id: generateId(),
      title: deck.title!,
      description: deck.description || '',
      topic: selectedTopic?.name || 'General',
      topicId: deck.topicId!,
      difficulty: deck.difficulty as 'beginner' | 'intermediate' | 'advanced',
      color: selectedTopic?.color || deck.color!,
      cards: cards.map((card): CardType => ({
        id: generateId(),
        difficulty: 'medium',
        tags: selectedTopic ? [selectedTopic.name.toLowerCase()] : [],
        prompt: { text: card.prompt },
        answer: { text: card.answer },
        variations: {
          quiz: {
            distractors: []
          }
        },
        explanation: card.hint ? { text: card.hint } : undefined,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: Math.ceil(cards.length * 1.5) // Rough estimate
    };

    logger.log('Created deck:', newDeck);
    alert('Deck created successfully! (This is a mock save)');
    router.push('/');
  };

  const colorOptions = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500'
  ];

  const isFormValid = () => {
    return deck.title && deck.topicId && cards.every(card => card.prompt && card.answer);
  };

  // Setup Content - Deck Information
  const SetupContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          <Card>
            <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Deck Information
          </CardTitle>
          <CardDescription>
            Set up the basic details for your learning deck
          </CardDescription>
            </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={deck.title}
                  onChange={(e) => handleDeckChange('title', e.target.value)}
                  placeholder="Enter deck title"
                  required
                />
              </div>
              
            <div className="space-y-2">
              <Label htmlFor="topic">Topic *</Label>
                <Select
                  value={deck.topicId}
                  onValueChange={(value) => handleDeckChange('topicId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                      <div className="flex items-center gap-2">
                        <span>{topic.icon}</span>
                        {topic.name}
                      </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={deck.description}
              onChange={(e) => handleDeckChange('description', e.target.value)}
              placeholder="Describe what this deck is about"
              rows={3}
            />
              </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={deck.difficulty}
                  onValueChange={(value) => handleDeckChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="beginner">Beginner - Easy concepts</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Moderate challenge</SelectItem>
                  <SelectItem value="advanced">Advanced - Complex topics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleDeckChange('color', color)}
                    className={`w-8 h-8 rounded-full ${color} transition-all hover:scale-110 ${
                      deck.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                    />
                  ))}
              </div>
                </div>
              </div>
            </CardContent>
          </Card>
    </div>
  );

  // Cards Content - Card Creation
  const CardsContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Deck Cards</h2>
          <p className="text-muted-foreground">
            {cards.length} card{cards.length !== 1 ? 's' : ''} added
          </p>
        </div>
        <Button onClick={addCard} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Card {index + 1}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {card.prompt && card.answer ? 'Complete' : 'Incomplete'}
                  </Badge>
                    {cards.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCard(index)}
                      className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`prompt-${index}`}>Question/Prompt *</Label>
                      <Textarea
                        id={`prompt-${index}`}
                        value={card.prompt}
                        onChange={(e) => handleCardChange(index, 'prompt', e.target.value)}
                    placeholder="Enter the question or prompt"
                    rows={3}
                      />
                    </div>

                <div className="space-y-2">
                      <Label htmlFor={`answer-${index}`}>Answer *</Label>
                      <Textarea
                        id={`answer-${index}`}
                        value={card.answer}
                        onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                    placeholder="Enter the correct answer"
                    rows={3}
                      />
                    </div>
                  </div>

              <div className="space-y-2">
                <Label htmlFor={`hint-${index}`}>Hint (Optional)</Label>
                    <Input
                      id={`hint-${index}`}
                      value={card.hint || ''}
                      onChange={(e) => handleCardChange(index, 'hint', e.target.value)}
                  placeholder="Provide a helpful hint"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cards.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cards added yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your deck by adding your first card.
            </p>
            <Button onClick={addCard}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Preview Content - Deck Preview
  const PreviewContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Deck Preview
          </CardTitle>
          <CardDescription>
            Review your deck before saving
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deck Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{deck.title || 'Untitled Deck'}</h3>
                <p className="text-muted-foreground">{deck.description || 'No description'}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {topics.find(t => t.id === deck.topicId)?.name || 'No topic'}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {deck.difficulty}
                </Badge>
                <Badge variant="outline">
                  {cards.length} card{cards.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Cards:</span>
                    <span className="ml-2 font-medium">{cards.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Complete:</span>
                    <span className="ml-2 font-medium">
                      {cards.filter(c => c.prompt && c.answer).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">With Hints:</span>
                    <span className="ml-2 font-medium">
                      {cards.filter(c => c.hint).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Time:</span>
                    <span className="ml-2 font-medium">{Math.ceil(cards.length * 1.5)} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Preview */}
          <div>
            <h4 className="font-medium mb-4">Cards Preview</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cards.map((card, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">Card {index + 1}</Badge>
                    {!card.prompt || !card.answer ? (
                      <Badge variant="destructive" className="text-xs">Incomplete</Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">Ready</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Q:</span>
                      <p className="text-muted-foreground mt-1">
                        {card.prompt || 'No question entered'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">A:</span>
                      <p className="text-muted-foreground mt-1">
                        {card.answer || 'No answer entered'}
                      </p>
                    </div>
                  </div>
                  {card.hint && (
                    <div className="mt-2 pt-2 border-t">
                      <span className="font-medium text-xs">Hint:</span>
                      <p className="text-muted-foreground text-xs mt-1">{card.hint}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Section */}
          <div className="pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid()}
                size="lg"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Deck
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                size="lg"
              >
                Cancel
              </Button>
            </div>
            {!isFormValid() && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Please complete all required fields before saving
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Tips Content - Creation Tips
  const TipsContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Creation Tips
          </CardTitle>
          <CardDescription>
            Best practices for creating effective learning decks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">📝 Writing Great Questions</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Keep questions clear and specific</li>
                <li>Use active voice when possible</li>
                <li>Avoid ambiguous wording</li>
                <li>Test one concept per card</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">✅ Answer Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Provide complete, accurate answers</li>
                <li>Keep answers concise but informative</li>
                <li>Include context when needed</li>
                <li>Use consistent formatting</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">💡 Effective Hints</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Give direction without revealing the answer</li>
                <li>Use memory aids and mnemonics</li>
                <li>Reference familiar concepts</li>
                <li>Keep hints brief and helpful</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">🎯 Deck Structure</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Aim for 10-20 cards per deck</li>
                <li>Group related concepts together</li>
                <li>Progress from simple to complex</li>
                <li>Include variety in question types</li>
              </ul>
            </div>
          </div>
            </CardContent>
          </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <CardDescription>
            Common deck patterns to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">📚 Vocabulary Deck</h5>
              <p className="text-sm text-muted-foreground mb-2">
                Question: Definition or usage<br/>
                Answer: Term or word
              </p>
              <p className="text-xs text-muted-foreground">
                Great for language learning
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">🧪 Fact-Based Deck</h5>
              <p className="text-sm text-muted-foreground mb-2">
                Question: &quot;What is...?&quot;<br/>
                Answer: Factual information
              </p>
              <p className="text-xs text-muted-foreground">
                Perfect for science, history
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h5 className="font-medium mb-2">🔧 Process Deck</h5>
              <p className="text-sm text-muted-foreground mb-2">
                Question: &quot;How do you...?&quot;<br/>
                Answer: Step-by-step process
              </p>
              <p className="text-xs text-muted-foreground">
                Ideal for procedures, skills
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
  );

  const navigationItems: NavigationItem[] = [
    {
      id: 'setup',
      label: 'Setup',
      shortLabel: 'Setup',
      icon: Settings,
      content: <SetupContent />
    },
    {
      id: 'cards',
      label: 'Cards',
      shortLabel: 'Cards',
      icon: CreditCard,
      content: <CardsContent />
    },
    {
      id: 'preview',
      label: 'Preview',
      shortLabel: 'Preview',
      icon: Eye,
      content: <PreviewContent />
    },
    {
      id: 'tips',
      label: 'Tips',
      shortLabel: 'Tips',
      icon: Lightbulb,
      content: <TipsContent />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu
        items={navigationItems}
        defaultValue="setup"
        title="Create New Deck"
        description="Build a custom learning deck with questions and answers"
        showBackButton={true}
        onBack={() => router.back()}
        className="container mx-auto px-4 py-6 max-w-7xl"
      />
    </div>
  );
}