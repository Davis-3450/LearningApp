'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Card as CardType, Deck } from '@/lib/types';
import { generateId } from '@/lib/mock-data';

export default function CreateDeck() {
  const router = useRouter();
  const [deck, setDeck] = useState<Partial<Deck>>({
    title: '',
    description: '',
    topic: '',
    color: 'bg-blue-500',
    cards: []
  });

  const [cards, setCards] = useState<Partial<CardType>[]>([
    { question: '', answer: '', difficulty: 'medium' }
  ]);

  const handleDeckChange = (field: keyof Deck, value: string) => {
    setDeck(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (index: number, field: keyof CardType, value: string) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards(prev => [...prev, { question: '', answer: '', difficulty: 'medium' }]);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!deck.title || !deck.description || cards.some(card => !card.question || !card.answer)) {
      alert('Please fill in all required fields');
      return;
    }

    // Create deck with proper structure
    const newDeck: Deck = {
      id: generateId(),
      title: deck.title!,
      description: deck.description!,
      topic: deck.topic || 'General',
      color: deck.color!,
      cards: cards.map(card => ({
        id: generateId(),
        question: card.question!,
        answer: card.answer!,
        difficulty: card.difficulty as 'easy' | 'medium' | 'hard',
        hint: card.hint,
        tags: []
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real app, you would save this to a database
    console.log('Created deck:', newDeck);
    alert('Deck created successfully! (In development mode)');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Deck
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Build a custom learning deck with questions and answers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Deck Details */}
          <Card>
            <CardHeader>
              <CardTitle>Deck Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={deck.title}
                  onChange={(e) => handleDeckChange('title', e.target.value)}
                  placeholder="Enter deck title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={deck.description}
                  onChange={(e) => handleDeckChange('description', e.target.value)}
                  placeholder="Describe what this deck is about"
                  required
                />
              </div>

              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={deck.topic}
                  onChange={(e) => handleDeckChange('topic', e.target.value)}
                  placeholder="e.g., Mathematics, History, Languages"
                />
              </div>

              <div>
                <Label>Color Theme</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleDeckChange('color', color)}
                      className={`w-8 h-8 rounded-full ${color} ${
                        deck.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cards</CardTitle>
                <Button type="button" onClick={addCard} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {cards.map((card, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Card {index + 1}</h4>
                    {cards.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCard(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`question-${index}`}>Question *</Label>
                      <Textarea
                        id={`question-${index}`}
                        value={card.question}
                        onChange={(e) => handleCardChange(index, 'question', e.target.value)}
                        placeholder="Enter the question"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`answer-${index}`}>Answer *</Label>
                      <Textarea
                        id={`answer-${index}`}
                        value={card.answer}
                        onChange={(e) => handleCardChange(index, 'answer', e.target.value)}
                        placeholder="Enter the answer"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`hint-${index}`}>Hint (optional)</Label>
                    <Input
                      id={`hint-${index}`}
                      value={card.hint || ''}
                      onChange={(e) => handleCardChange(index, 'hint', e.target.value)}
                      placeholder="Optional hint for the question"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4 justify-center">
            <Button type="button" variant="outline" onClick={() => router.push('/')}>
              Cancel
            </Button>
            <Button type="submit">
              Create Deck
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 