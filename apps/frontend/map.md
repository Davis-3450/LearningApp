
# Frontend Codebase Map

This document provides a map of the frontend codebase, outlining its structure, quality, missing pieces, and potential improvements.

## 1. Project Overview

The frontend is a Next.js application built with TypeScript. It uses Tailwind CSS for styling and a variety of libraries for state management, forms, and UI components. The application allows users to create, manage, and study learning decks through various game modes.

### Key Technologies:

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Radix UI, custom components
*   **State Management:** React Hooks (`useState`, `useEffect`)
*   **Forms:** `react-hook-form`
*   **Data Fetching:** `axios`, Next.js API routes
*   **Drag and Drop:** `@dnd-kit`

## 2. Code Quality Assessment

The code is generally well-structured and follows modern React best practices. However, there are areas for improvement:

### Good:

*   **Component-Based Architecture:** The code is organized into reusable components.
*   **TypeScript Usage:** TypeScript is used throughout the project, providing type safety.
*   **Consistent Styling:** Tailwind CSS is used consistently for styling.
*   **Clear File Structure:** The file structure is logical and easy to follow.

### Bad:

*   **Lack of a Global State Management Solution:** The application relies heavily on `useState` and `useEffect` for state management, which can lead to prop drilling and complex state logic in larger components. A global state management solution like Redux, Zustand, or React Context with reducers would be beneficial.
*   **Inconsistent API Layer:** The API layer is a mix of `axios` and direct `fetch` calls in Next.js API routes. A more consistent approach would be to use a dedicated API client (like a configured `axios` instance) for all data fetching.
*   **Mock Data Usage:** The application uses a mix of mock data and API calls. This should be consolidated to use a single source of truth for data.
*   **Missing Error Handling:** Error handling is inconsistent. Some API calls have `try...catch` blocks, while others do not. A global error handling strategy would be beneficial.
*   **No Unit Tests:** There are no unit tests in the project. This makes it difficult to refactor code and ensure that new features do not break existing functionality.

## 3. Missing Features and MVP Completion

The following features are missing to complete the MVP:

*   **User Authentication:** There is no user authentication system. Users cannot sign up, log in, or have their own private decks.
*   **Database Integration:** The application uses the file system to store decks. This is not a scalable solution and should be replaced with a database.
*   **AI-Powered Deck Generation:** The UI for AI-powered deck generation exists, but the implementation is missing.
*   **Full Game Mode Implementation:** The "Matching" and "Sequence" game modes are incomplete and rely on mock data.
*   **Deck Sharing and Discovery:** The "Share" and "Discover" features are incomplete and rely on mock data.
*   **User Profile and Settings:** The user settings page is incomplete and does not persist user preferences.

## 4. Useless Code and Refactoring Opportunities

*   **Mock Data:** The `mock-data.ts` file can be removed once a database is integrated.
*   **Redundant Components:** There are some redundant components that can be consolidated. For example, there are multiple "DeckCard" components with slight variations. These can be combined into a single, more flexible component.
*   **Inconsistent Naming:** Some components and variables have inconsistent naming conventions. A consistent naming convention should be applied throughout the project.
*   **Large Components:** Some components are very large and could be broken down into smaller, more manageable components.

## 5. Recommended Next Steps

1.  **Implement User Authentication:** Add a user authentication system using a service like NextAuth.js or Firebase Authentication.
2.  **Integrate a Database:** Replace the file system-based deck storage with a database like PostgreSQL, MongoDB, or Firebase Firestore.
3.  **Complete Game Modes:** Finish the implementation of the "Matching" and "Sequence" game modes.
4.  **Implement AI Deck Generation:** Integrate with a large language model (LLM) to provide AI-powered deck generation.
5.  **Add Unit Tests:** Add unit tests using a framework like Jest and React Testing Library.
6.  **Refactor and Clean Up Code:** Refactor the code to address the issues identified in the "Useless Code and Refactoring Opportunities" section.
7.  **Implement Global State Management:** Introduce a global state management solution to simplify state logic.
8.  **Create a Consistent API Layer:** Create a consistent API layer for all data fetching.
9.  **Add Global Error Handling:** Implement a global error handling strategy.
