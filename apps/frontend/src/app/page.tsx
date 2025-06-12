'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../components/pages/HomePage';
import DecksPage from '../components/pages/DecksPage';
import CreateDeckPage from '../components/pages/CreateDeckPage';
import DecksCreatePage from '../components/pages/DecksCreatePage';
import EditDeckPage from '../components/pages/EditDeckPage';
import AIGeneratePage from '../components/pages/AIGeneratePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decks" element={<DecksPage />} />
        <Route path="/create" element={<CreateDeckPage />} />
        <Route path="/decks/create" element={<DecksCreatePage />} />
        <Route path="/decks/edit/:fileName" element={<EditDeckPage />} />
        <Route path="/decks/ai-generate" element={<AIGeneratePage />} />
      </Routes>
    </BrowserRouter>
  );
}
