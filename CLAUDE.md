# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Exit the Rat Race** is an AI-powered financial education game built with Next.js. Players simulate financial life decisions from age 25-80, learning to achieve financial freedom through investments, career choices, and money management. The game is inspired by Rich Dad Poor Dad's CASHFLOW concept.

## Development Commands

```bash
# Navigate to the application directory first
cd exit-the-rat-race

# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod v4
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API
- **TypeScript**: Strict mode enabled

## Architecture Overview

### Core Game Architecture

The game follows a **functional core, imperative shell** pattern:

1. **GameEngine** (`src/lib/game/GameEngine.ts`):
   - Pure functional class with static methods
   - Handles all financial calculations (payday, asset transactions, victory conditions)
   - Immutable state transformations - always returns new Player objects
   - No side effects - completely testable in isolation

2. **Game Store** (`src/store/gameStore.ts`):
   - Zustand-based state management
   - Orchestrates GameEngine calls
   - Manages game state, player state, and UI state
   - Handles error states and loading indicators

3. **Type System** (`src/types/index.ts`):
   - Central type definitions for the entire game
   - Key types: `Player`, `GameState`, `Asset`, `Liability`, `GameEvent`
   - Financial data structures (income, expenses, net worth)

### Game Mechanics

The game simulates financial life through **rounds** (each round = 1 year of life):

- **Victory Condition**: Passive income exceeds monthly expenses
- **Core Loop**: Pay monthly expenses → Make decisions → Buy/sell assets → Process payday
- **Financial Calculations**:
  - Net worth = Assets - Liabilities + Cash
  - Financial freedom = Passive Income > Total Expenses
  - Monthly cash flow = Total Income - Total Expenses

### AI Integration

AI services (`src/lib/ai/aiService.ts`) generate dynamic life events:
- Uses OpenAI API for event generation (gpt-3.5-turbo)
- Falls back to mock events when API key not configured
- Events are age-appropriate and contextual to player's financial state
- **IMPORTANT**: API calls use `dangerouslyAllowBrowser: true` - this is only for MVP/demo. In production, move AI calls to Next.js Server Actions or API Routes to protect the API key.

### Component Organization

```
src/components/
├── game/              # Game-specific components
│   ├── GameBoard.tsx           # Main game interface
│   ├── PlayerProfile.tsx       # Player stats display
│   ├── FinancialDashboard.tsx  # Income/expenses tracker
│   └── AssetLiabilityList.tsx  # Portfolio view
└── ui/                # Shared UI primitives (Radix-based)
    ├── button.tsx
    ├── card.tsx
    ├── tabs.tsx
    └── progress.tsx
```

## Path Aliases

Import paths use `@/` alias configured in `tsconfig.json`:

```typescript
import { GameEngine } from '@/lib/game/GameEngine';
import { Player, Asset } from '@/types';
import { useGameStore } from '@/store/gameStore';
```

## State Management Patterns

### Zustand Store Usage

The game store follows these patterns:

1. **State Updates**: Always update through store actions, never mutate directly
2. **GameEngine Calls**: Wrap in try-catch to handle game rule violations (e.g., insufficient funds)
3. **Error Handling**: Errors are stored in state and auto-cleared after 3 seconds
4. **Immutability**: GameEngine returns new objects; store replaces state completely

Example:
```typescript
// ✓ Correct
const { buyAsset } = useGameStore();
buyAsset(newAsset); // Handles errors internally

// ✗ Incorrect
currentPlayer.assets.push(newAsset); // Direct mutation
```

## Game Data Flow

1. **Player Actions** (UI interaction) →
2. **Store Action** (validation, orchestration) →
3. **GameEngine Method** (pure calculation) →
4. **New State** (immutable update) →
5. **UI Re-render** (React updates)

## Important Conventions

### Financial Calculations
- All currency values are stored as numbers (assumed USD)
- Monthly calculations are used (not annual)
- Interest rates are expressed as decimals (0.12 = 12%)
- Loan payments: simplified to 1% of loan amount per month in current implementation

### ID Generation
- Uses `Math.random().toString(36).substr(2, 9)` for temporary IDs
- This is sufficient for MVP; replace with UUIDs for production

### Type Safety
- TypeScript strict mode is enabled
- All game state is strongly typed
- Use Zod for runtime validation in forms

## Environment Variables

Required environment variables (create `.env.local` in `exit-the-rat-race/`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# OpenAI (optional for MVP - uses mock events if not set)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

## Project Structure Context

The repository has two main parts:
- **Root directory**: Project planning and documentation
- **exit-the-rat-race/**: The actual Next.js application

Always work within `exit-the-rat-race/` for code changes.

## Development Guidelines

### Adding New Features

1. **Define Types First**: Add types to `src/types/index.ts`
2. **Add Game Logic**: Implement in `GameEngine` as pure functions
3. **Update Store**: Add actions to `gameStore.ts`
4. **Build UI**: Create components in appropriate directory
5. **Test Calculations**: Ensure GameEngine methods handle edge cases

### Asset/Liability System

When working with investments:
- Assets have `monthlyIncome` (passive cash flow)
- Different asset types have different `risk` levels and `liquidityDays`
- Market conditions affect asset values (multipliers in `MarketConditions`)
- Always use `GameEngine.buyAsset()` and `GameEngine.sellAsset()` for transactions

### Game Events

Events follow a choice-consequence pattern:
- Each event offers 2-4 meaningful choices
- Consequences can be immediate (cash, assets) or recurring (passive income, expenses)
- AI-generated events should include `educationalContent` for learning

## Common Pitfalls

1. **Direct State Mutation**: Always use GameEngine methods or store actions
2. **Missing Error Handling**: Wrap GameEngine calls in try-catch
3. **API Key Exposure**: Keep OpenAI calls server-side in production
4. **Type Safety**: Don't use `any` - define proper types in `src/types/`
5. **Path References**: Use `@/` alias, not relative paths like `../../`

## Future Considerations

Based on the structural plan (`exit-rat-race-structural-plan.md`):

- **Multiplayer Mode**: Real-time sync via Supabase Realtime
- **Advanced Events**: Market cycles, life phases (25-35, 36-50, 51-65, 66-80)
- **Achievement System**: Track player progression
- **Mobile Optimization**: Game is designed to be responsive
- **Monetization**: Tiered subscription model planned

## Code Style

- ESLint config extends Next.js recommended settings
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Use Tailwind utility classes (Tailwind v4)
