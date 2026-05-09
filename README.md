# Xavier's Training HQ

A personal mobile-first fitness hub for tracking a 4-week cut program. Built as a static React app deployed on GitHub Pages.

## What it does

Three sections, navigated via a fixed bottom tab bar:

- **Workout** — weekly schedule showing each day's sessions (lift, run, soccer, cardio classes). Lift sessions expand inline to show exercises, sets, reps, and coaching notes. The active week persists across sessions via `localStorage`.
- **Meals** — fixed weekly meal plan with daily protein targets.
- **Grocery** — categorized shopping list with checkable items.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | React Router 7 (`HashRouter` — required for GitHub Pages, see ADR 0001) |
| Styling | Tailwind CSS v4 |
| Bundler | Vite 6 |

## Project structure

```
src/
  App.tsx              # Shell: header, router, bottom nav
  main.tsx             # React root mount
  components/
    BottomNav.tsx      # Fixed tab bar (Workout / Meals / Grocery)
    WorkoutDetail.tsx  # Expandable exercise list for a lift session
  pages/
    WorkoutPage.tsx    # Week selector + daily schedule
    MealsPage.tsx      # Weekly meal table
    GroceryPage.tsx    # Checkable grocery list
  data/
    workouts.ts        # Schedules, lift plans, type colors/emoji
    meals.ts           # Meal plan data
    grocery.ts         # Grocery list data
docs/
  adr/
    0001-hashrouter-for-github-pages.md
```

## Domain model

See [`CONTEXT.md`](CONTEXT.md) for the full glossary (Program, Week, Schedule, Session, Lift, Exercise, Meal Plan, Grocery List).

## Local development

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build   # tsc + vite build → dist/
```

Deploy the `dist/` folder to GitHub Pages. `HashRouter` handles all client-side routes without server configuration.
