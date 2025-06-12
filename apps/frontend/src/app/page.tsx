'use client';

import { useState } from 'react';
import HomeView from '@/components/views/HomeView';
import DeckManagerView from '@/components/views/DeckManagerView';
import DeckDetailsView from '@/components/views/DeckDetailsView';

export default function AppPage() {
  const [view, setView] = useState<'home' | 'decks' | 'deck'>('home');
  const [currentDeck, setCurrentDeck] = useState<string | null>(null);

  const showHome = () => setView('home');
  const showDecks = () => setView('decks');
  const showDeck = (fileName: string) => {
    setCurrentDeck(fileName);
    setView('deck');
  };

  return (
    <>
      {view === 'home' && <HomeView onManageDecks={showDecks} />}
      {view === 'decks' && <DeckManagerView onBack={showHome} onViewDeck={showDeck} />}
      {view === 'deck' && currentDeck && (
        <DeckDetailsView fileName={currentDeck} onBack={showDecks} />
      )}
    </>
  );
}

