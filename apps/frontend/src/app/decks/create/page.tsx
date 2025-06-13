'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DecksAPI } from '@/lib/api/decks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Deck } from '@/shared/schemas/deck';
import type { TermConcept } from '@/shared/schemas/concepts';

export default function CreateDeckPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [deckData, setDeckData] = useState({
    title: '',
    description: '',
  });

  const [concepts, setConcepts] = useState<Omit<TermConcept, 'conceptType'>[]>([
    {
      term: '',
      definition: '',
      variations: []
    }
  ]);

  const addConcept = () => {
    setConcepts([...concepts, {
      term: '',
      definition: '',
      variations: []
    }]);
  };

  const removeConcept = (index: number) => {
    setConcepts(concepts.filter((_, i) => i !== index));
  };

  const updateConcept = (
    index: number,
    field: keyof Omit<TermConcept, 'conceptType'>,
    value: string
  ) => {
    const updated = [...concepts];
    updated[index] = { ...updated[index], [field]: value };
    setConcepts(updated);
  };

  const addVariation = (conceptIndex: number) => {
    const updated = [...concepts];
    if (!updated[conceptIndex].variations) {
      updated[conceptIndex].variations = [];
    }
    updated[conceptIndex].variations!.push({
      type: 'example',
      text: ''
    });
    setConcepts(updated);
  };

  const removeVariation = (conceptIndex: number, variationIndex: number) => {
    const updated = [...concepts];
    updated[conceptIndex].variations = updated[conceptIndex].variations?.filter((_, i) => i !== variationIndex);
    setConcepts(updated);
  };

  const updateVariation = (conceptIndex: number, variationIndex: number, field: 'type' | 'text', value: string) => {
    const updated = [...concepts];
    if (updated[conceptIndex].variations) {
      updated[conceptIndex].variations[variationIndex] = {
        ...updated[conceptIndex].variations[variationIndex],
        [field]: value
      };
    }
    setConcepts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deckData.title.trim()) {
      alert('Please enter a deck title');
      return;
    }

    if (concepts.length === 0 || !concepts[0].term.trim()) {
      alert('Please add at least one concept');
      return;
    }

    setLoading(true);
    try {
      const deck: Omit<Deck, 'id'> = {
        title: deckData.title,
        description: deckData.description,
        concepts: concepts.map(concept => ({
          conceptType: 'term' as const,
          ...concept
        }))
      };

      const response = await DecksAPI.create(deck);
      if (response.success) {
        alert('Deck created successfully!');
        router.push('/decks');
      } else {
        alert(`Creation failed: ${response.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Creation failed: Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/decks">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Deck
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Build a new learning deck with concepts and variations
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Deck Information</CardTitle>
              <CardDescription>
                Basic details about your learning deck
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={deckData.title}
                  onChange={(e) => setDeckData({...deckData, title: e.target.value})}
                  placeholder="e.g., Spanish Basics, Science Concepts..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={deckData.description}
                  onChange={(e) => setDeckData({...deckData, description: e.target.value})}
                  placeholder="Brief description of what this deck covers..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Concepts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Concepts</CardTitle>
                  <CardDescription>
                    Add the terms and concepts you want to learn
                  </CardDescription>
                </div>
                <Button type="button" onClick={addConcept} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Concept
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {concepts.map((concept, conceptIndex) => (
                <div key={conceptIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Concept {conceptIndex + 1}</Badge>
                    {concepts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConcept(conceptIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Term/Word *</label>
                      <Input
                        value={concept.term}
                        onChange={(e) => updateConcept(conceptIndex, 'term', e.target.value)}
                        placeholder="e.g., Mitochondria, Hola..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Definition *</label>
                      <Textarea
                        value={concept.definition}
                        onChange={(e) => updateConcept(conceptIndex, 'definition', e.target.value)}
                        placeholder="Clear explanation of the term..."
                        required
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Variations */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium">Variations (Optional)</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariation(conceptIndex)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Variation
                      </Button>
                    </div>
                    
                    {concept.variations?.map((variation, variationIndex) => (
                      <div key={variationIndex} className="flex gap-2 mb-2">
                        <Select
                          value={variation.type}
                          onValueChange={(value) => updateVariation(conceptIndex, variationIndex, 'type', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="example">Example</SelectItem>
                            <SelectItem value="alternative-definition">Alt. Definition</SelectItem>
                            <SelectItem value="fun-fact">Fun Fact</SelectItem>
                            <SelectItem value="misconception">Misconception</SelectItem>
                            <SelectItem value="tip">Tip</SelectItem>
                            <SelectItem value="explanation">Explanation</SelectItem>
                            <SelectItem value="historical-note">Historical Note</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={variation.text}
                          onChange={(e) => updateVariation(conceptIndex, variationIndex, 'text', e.target.value)}
                          placeholder="Variation text..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariation(conceptIndex, variationIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/decks">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Creating...' : 'Create Deck'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 