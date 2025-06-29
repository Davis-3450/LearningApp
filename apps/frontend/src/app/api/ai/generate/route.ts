import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { DeckSchema } from '@/shared/schemas/deck';
import { deckStore } from '@/lib/deck-store';
import { v4 as uuidv4 } from 'uuid';

const GenerationRequestSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  description: z.string().optional(),
  conceptCount: z.number().min(3).max(20),
});

export async function POST(request: NextRequest) {
  try {
    // Verificar que existe la API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Inicializar OpenAI solo cuando se necesite (en runtime)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const validation = GenerationRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request data',
        details: validation.error.errors 
      }, { status: 400 });
    }

    const { topic, description, conceptCount } = validation.data;

    // Prompt mejorado con esquema JSON explícito y conceptType
    const prompt = `Create a learning deck about "${topic}".
${description ? `Description: "${description}"` : ''}

Generate exactly ${conceptCount} concepts for learning. Each concept must be a term with definition.

Return ONLY a valid JSON object with this exact structure:
{
  "title": "string (deck title)",
  "description": "string (optional description)",
  "concepts": [
    {
      "conceptType": "term",
      "term": "string (the term to learn)",
      "definition": "string (clear definition)",
      "variations": [
        {
          "type": "example",
          "text": "string (example usage)"
        },
        {
          "type": "fun-fact", 
          "text": "string (interesting fact)"
        }
      ]
    }
  ]
}

Important requirements:
- Each concept MUST have "conceptType": "term"
- Include 1-2 variations per concept when helpful
- Use clear, educational language
- No extra text or markdown, just valid JSON`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const jsonContent = response.choices[0].message.content;
    if (!jsonContent) {
      throw new Error('No content received from AI');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (parseError) {
      throw new Error('Invalid JSON response from AI');
    }

    // Preparar datos del deck
    const deckData = {
      ...parsedData,
      id: uuidv4(),
      version: 1
    };

    // Validar contra el esquema
    let validatedDeck;
    try {
      validatedDeck = DeckSchema.parse(deckData);
    } catch (validationError) {
      console.error('Schema validation failed:', validationError);
      throw new Error('Generated content does not match expected format');
    }

    // Generar nombre de archivo seguro
    const fileName = validatedDeck.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    if (!fileName) {
      throw new Error('Unable to generate valid filename from title');
    }

    // Guardar usando deck store (maneja errores internamente)
    let savedDeck;
    try {
      savedDeck = deckStore.create(fileName, validatedDeck);
    } catch (storeError) {
      console.error('Failed to save deck:', storeError);
      // En caso de error del store, retornamos el deck generado sin guardar
      return NextResponse.json({
        success: true,
        data: { fileName, deck: validatedDeck },
        message: 'Deck generated successfully (not persisted to disk)',
        warning: 'Unable to save to permanent storage'
      });
    }

    return NextResponse.json({
      success: true,
      data: savedDeck,
      message: 'Deck generated and saved successfully',
    });

  } catch (error) {
    console.error('AI generation error:', error);
    
    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: 'OpenAI API configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      if (error.message.includes('Invalid JSON') || error.message.includes('format')) {
        return NextResponse.json(
          { success: false, error: 'AI generated invalid content. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: `Failed to generate deck: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}