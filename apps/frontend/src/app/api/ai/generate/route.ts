import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { DeckSchema } from '@/shared/schemas/deck';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GenerationRequestSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  description: z.string().optional(),
  conceptCount: z.number().min(3).max(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = GenerationRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.errors }, { status: 400 });
    }

    const { topic, description, conceptCount } = validation.data;

    const prompt = `
      Create a learning deck about "${topic}".
      ${description ? `Description: "${description}"` : ''}
      Generate exactly ${conceptCount} concepts.
      Each concept must have a "term" and a "definition".
      Optionally, add up to 2 "variations" per concept (e.g., type: "example" or "fun-fact").
      Return the response as a single, minified JSON object that strictly follows this Zod schema:
      const DeckSchema = ${JSON.stringify(DeckSchema.shape)};
      Do not include any extra text, explanations, or markdown.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const jsonContent = response.choices[0].message.content;
    if (!jsonContent) {
      throw new Error('No content received from AI.');
    }

    const generatedData = JSON.parse(jsonContent);

    const deckData = {
      ...generatedData,
      id: uuidv4(), // Assign a new UUID
    };

    const validatedDeck = DeckSchema.parse(deckData);

    const fileName = validatedDeck.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    const deckDirectory = path.join(process.cwd(), '../../shared/data/decks');
    const filePath = path.join(deckDirectory, `${fileName}.json`);

    await fs.mkdir(deckDirectory, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(validatedDeck, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      data: { fileName, deck: validatedDeck },
      message: 'Deck generated and saved successfully',
    });

  } catch (error) {
    console.error('AI generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: `Failed to generate deck: ${errorMessage}` },
      { status: 500 }
    );
  }
}
