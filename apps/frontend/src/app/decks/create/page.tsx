'use client';

import { useRouter } from 'next/navigation';
import { useCreateDeck } from '@/lib/hooks/use-decks';
import { DeckForm, type DeckFormData } from '@/components/forms/deck-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateDeckPage() {
  const router = useRouter();
  const createDeckMutation = useCreateDeck();

  const handleSubmit = async (data: DeckFormData) => {
    try {
      const response = await createDeckMutation.mutateAsync({
        title: data.title,
        description: data.description,
        concepts: data.concepts.map(concept => ({
          conceptType: 'term' as const,
          ...concept
        }))
      });

      if (response.success) {
        alert('Deck created successfully!');
        router.push('/decks');
      } else {
        alert(`Creation failed: ${response.error}`);
      }
    } catch (error) {
      alert('Creation failed: Network error');
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

        <div className="max-w-4xl mx-auto">
          <DeckForm
            onSubmit={handleSubmit}
            submitLabel="Create Deck"
            isLoading={createDeckMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}