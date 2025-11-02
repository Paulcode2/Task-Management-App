# Task Management App

A modern task management application built with SvelteKit that helps users organize tasks using the Eisenhower Matrix method. The app provides an intuitive interface for managing tasks across different categories with real-time updates and persistent storage.

## Features

- **Eisenhower Matrix Organization**: Tasks are automatically organized into four quadrants based on importance and urgency
- **Category Management**: Group tasks into customizable categories (Work, Personal Projects, Freelance Jobs)
- **Real-time Updates**: Changes reflect immediately with optimistic updates
- **Persistent Storage**: All data is automatically saved to localStorage with debounced writes
- **Accessible UI**: Full keyboard navigation support and ARIA attributes
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technologies Used

- **Frontend Framework**: [SvelteKit](https://kit.svelte.dev/) for robust client-side and server-side rendering
- **Type Safety**: TypeScript for better developer experience and code reliability
- **State Management**: Svelte stores with derived stores for complex state calculations
- **Storage**: Browser localStorage with debounced writes for persistence
- **Testing**: Vitest for unit testing
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Pure CSS with scoped styles for components

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Paulcode2/Task-Management-App.git
cd Task-Management-App
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run check` - Type-check the codebase

## Project Structure

```
src/
├── lib/
│   ├── components/         # Reusable Svelte components
│   │   ├── TaskCard.svelte
│   │   ├── MatrixQuadrant.svelte
│   │   └── CompletionBar.svelte
│   ├── stores/            # State management
│   │   ├── taskStore.ts
│   │   └── categoryStore.ts
│   └── utils/             # Helper functions
│       ├── date.ts
│       └── storage.ts
├── routes/                # SvelteKit routes
│   └── (app)/            # App layout group
│       ├── +layout.svelte
│       ├── +page.svelte
│       ├── settings/
│       └── tasks/[id]/
└── app.html              # HTML template
```

## Core Features Explained

### Task Organization (Eisenhower Matrix)

Tasks are automatically organized into four quadrants:

- Important & Urgent
- Important & Not Urgent
- Not Important & Urgent
- Not Important & Not Urgent

The matrix helps users prioritize tasks based on:

- **Importance**: Determined by task priority (High/Medium/Low)
- **Urgency**: Based on due date (within 48 hours = urgent)

### Category Management

- Tasks can be organized into customizable categories
- Default categories: Work, Personal Projects, Freelance Jobs
- Categories can be added/removed in settings
- Task filtering by category with real-time updates

### State Management

The app uses Svelte stores with:

- Optimistic updates for immediate UI feedback
- Derived stores for complex calculations (quadrants, completion percentage)
- Debounced localStorage persistence
- Type-safe store implementations

## Problem Solved

1. **Task Prioritization**

   - Helps users focus on what matters most using the Eisenhower Matrix
   - Clear visual organization of tasks by importance and urgency
   - Prevents important tasks from being overlooked

2. **Work-Life Balance**

   - Separate categories for Work, Personal Projects, and Freelance Jobs
   - Easy filtering to focus on specific areas of life
   - Progress tracking per category

3. **Time Management**

   - Due dates and urgency tracking
   - Visual indicators for approaching deadlines
   - Automatic quadrant assignment based on priority and time

4. **Data Persistence**

   - No data loss with automatic saving
   - Works offline with localStorage
   - Efficient updates with debounced writes

5. **Accessibility**
   - Keyboard navigation for power users
   - Screen reader friendly with ARIA labels
   - High contrast visual design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## Testing

The app includes unit tests for core functionality:

```bash
# Run the test suite
npm run test
```

Tests cover:

- Task store operations
- Category management
- Matrix quadrant calculations
- Completion percentage

## License

MIT License - feel free to use this project as a template for your own task management solutions.
