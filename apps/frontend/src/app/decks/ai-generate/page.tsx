'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Zap, Info } from 'lucide-react';
import { AppLayout, AppContent } from '@/components/ui/app-layout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AIGeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    difficulty: 'beginner',
    conceptCount: '10',
    includeVariations: true,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      alert('AI Generation is not yet implemented!\n\nThis would integrate with OpenAI, Claude, or another LLM to automatically generate educational content based on your topic and preferences.\n\nFor now, you can create decks manually or import JSON files.');
      setLoading(false);
    }, 2000);
  };

  return (
    <AppLayout 
      title="Generate Deck with AI" 
      subtitle="Describe what you want to learn and let AI create a custom deck for you"
      onBack={() => router.push('/decks')}
      headerActions={
        <Zap className="h-5 w-5 text-yellow-500" />
      }
    >
      <AppContent>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Info className="h-5 w-5" />
                Coming Soon!
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                This feature will integrate with AI services to automatically generate learning content. 
                The form below shows what the interface would look like.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Generation Form */}
          <form onSubmit={handleGenerate} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Learning Content</CardTitle>
                <CardDescription>
                  Describe what you want to learn and let AI create a comprehensive deck for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Topic *</label>
                  <Input
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="e.g., Basic Spanish vocabulary, Chemistry fundamentals, World War II facts..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Be specific about what you want to learn
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Context</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Any specific requirements, focus areas, or style preferences..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({...formData, difficulty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Concepts</label>
                    <Select
                      value={formData.conceptCount}
                      onValueChange={(value) => setFormData({...formData, conceptCount: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 concepts</SelectItem>
                        <SelectItem value="10">10 concepts</SelectItem>
                        <SelectItem value="15">15 concepts</SelectItem>
                        <SelectItem value="20">20 concepts</SelectItem>
                        <SelectItem value="25">25 concepts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="variations"
                    checked={formData.includeVariations}
                    onChange={(e) => setFormData({...formData, includeVariations: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="variations" className="text-sm font-medium">
                    Include variations (examples, fun facts, alternative definitions)
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Planned AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Intelligent content generation based on learning objectives</li>
                  <li>• Multiple question variations for each concept</li>
                  <li>• Difficulty-appropriate explanations and examples</li>
                  <li>• Fact-checking and source citations</li>
                  <li>• Multi-language support</li>
                  <li>• Image and diagram suggestions</li>
                  <li>• Spaced repetition scheduling</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/decks">Back to Decks</Link>
              </Button>
              <Button type="submit" disabled={loading || !formData.topic.trim()}>
                <Bot className="mr-2 h-4 w-4" />
                {loading ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
          </form>

          {/* Alternative Actions */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">In the meantime...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/decks/create">Create Manually</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/decks">Import JSON</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppContent>
    </AppLayout>
  );
} 