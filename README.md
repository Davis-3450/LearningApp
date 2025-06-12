# LearningApp

This is a leaning app for the bolt.new hackaton

backend : nextjs
frontend : react/nextjs
database : None for now

we will make a deck system where the user can create a deck of cards and then learn them based on any topic they want.

We will have a generic deck system where each deck can be preseted on different interfaces like in duolingo.

We will have: 

- Anki like cards
- Flashcards like for vocabulary
- Quiz like for multiple choice
- Matching game
- Word search
- Word scramble
- Word unscrambler
- Word jumbles
- Word unscrambler

The deck model will be contained on a json schema with multiple fields so each question can be represented in different ways, variations or interfaces.s

We will have a separate mode for soroban like math challenges with a graphical interface (this wont use AI for bovious)
## Adding More Decks

1. Install dependencies and run the development server:
   ```bash
   cd apps/frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000/decks/create` and use the form to build a new deck.
   The deck will be saved as a JSON file under `shared/data/decks`.
3. You can also create deck JSON files manually. Use `shared/data/decks/spanish-basics.json`
   as a template and place additional files in the same directory.
