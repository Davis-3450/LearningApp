'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('../components/pages/HomePage'));
const DecksPage = lazy(() => import('../components/pages/DecksPage'));
const CreateDeckPage = lazy(() => import('../components/pages/CreateDeckPage'));
const DecksCreatePage = lazy(() => import('../components/pages/DecksCreatePage'));
const EditDeckPage = lazy(() => import('../components/pages/EditDeckPage'));
const AIGeneratePage = lazy(() => import('../components/pages/AIGeneratePage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/create" element={<CreateDeckPage />} />
          <Route path="/decks/create" element={<DecksCreatePage />} />
          <Route path="/decks/edit/:fileName" element={<EditDeckPage />} />
          <Route path="/decks/ai-generate" element={<AIGeneratePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
