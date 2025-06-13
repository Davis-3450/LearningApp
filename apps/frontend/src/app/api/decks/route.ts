import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Construct the path to the JSON file
    // The 'shared' directory is expected to be at the root of the project,
    // and process.cwd() in Next.js app routes usually refers to the root of the frontend app.
    // Thus, we might need to adjust the path to go up to the monorepo root.
    // Assuming 'apps/frontend' is the current working directory structure.
    const filePath = path.join(process.cwd(), '..', '..', 'shared', 'data', 'decks', 'spanish-basics.json');

    // Read the file content
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse the JSON data
    const data = JSON.parse(fileContent);

    // Return the data as a JSON response
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading deck data:', error);
    // Handle errors, such as file not found or invalid JSON
    // It's good practice to check the type of error to provide more specific feedback
    // For instance, if (error.code === 'ENOENT') { /* file not found */ }
    return NextResponse.json(
      { error: 'Failed to load deck data', details: error.message },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}