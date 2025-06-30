'use client';

import { useRouter, useParams } from 'next/navigation';
import { useDeck, useUpdateDeck } from '@/lib/hooks/use-decks';
import { DeckForm, type DeckFormData } from '@/components/forms/deck-form';
import { AsyncBoundary } from '@/components/ui/async-boundary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams();
  const fileName = Array.isArray(params.fileName) ? params.fileName[0] : params.fileName;
  
  const { data: deckData, isLoading, error, refetch } = useDeck(fileName);
  const updateDeckMutation = useUpdateDeck();

  const handleSubmit = async (data: DeckFormData) => {
    if (!deckData?.deck || !fileName) return;

    try {
      const response = await updateDeckMutation.mutateAsync({
        fileName,
        deck: {
          id: deckData.deck.id,
          title: data.title,
          description: data.description,
          concepts: data.concepts.map(concept => ({
            conceptType: 'term' as const,
            ...concept
          }))
        }
      });

      if (response.success) {
        alert('Deck updated successfully!');
        router.push('/decks');
      } else {
        alert(`Update failed: ${response.error}`);
      }
    } catch (error) {
      alert('Update failed: Network error');
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
                Edit Deck
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Modify your learning deck: {fileName}.json
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <AsyncBoundary loading={isLoading} error={error} onRetry={refetch}>
            {deckData?.deck && (
              <DeckForm
                initialData={deckData.deck}
                onSubmit={handleSubmit}
                submitLabel="Save Changes"
                isLoading={updateDeckMutation.isPending}
              />
            )}
          </AsyncBoundary>
        </div>
      </div>
    </div>
  );
}