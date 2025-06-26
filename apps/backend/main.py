'''
Main FastAPI application for the Learning App backend.
'''
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
import json
import os

# --- Configuration ---
API_KEY = "your-secret-api-key"  # Replace with a secure key
DECKS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "shared", "data", "decks")

app = FastAPI(
    title="Learning App API",
    description="API for managing learning decks and generating content with AI.",
    version="0.1.0",
)

api_key_header = APIKeyHeader(name="X-API-Key")

# --- Schemas (mirroring Zod schemas in TypeScript) ---

class Variation(BaseModel):
    type: str
    text: str

class TermConcept(BaseModel):
    conceptType: str = "term"
    term: str
    definition: str
    variations: Optional[List[Variation]] = []

class Deck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    concepts: List[TermConcept]
    version: int = 1

# --- Security ---

def get_api_key(api_key: str = Depends(api_key_header)):
    '''Dependency to validate the API key.'''
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Could not validate credentials")
    return api_key

# --- API Endpoints ---

@app.post("/api/decks", dependencies=[Depends(get_api_key)])
def create_deck(deck: Deck):
    '''
    Receives a deck from a trusted source (like a GPT Action),
    validates it, and saves it as a JSON file.
    '''
    try:
        # Ensure the directory exists
        os.makedirs(DECKS_DIR, exist_ok=True)

        # Generate a filename (e.g., from the title)
        filename = f"{deck.title.lower().replace(' ', '-')}.json"
        filepath = os.path.join(DECKS_DIR, filename)

        # Check for filename conflicts
        if os.path.exists(filepath):
            return {"message": "Deck with this title already exists.", "filename": filename}

        # Save the deck to a file
        with open(filepath, "w") as f:
            json.dump(deck.dict(), f, indent=2)

        return {"message": "Deck created successfully!", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to the Learning App API"}
