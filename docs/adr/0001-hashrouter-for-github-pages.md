# ADR 0001: Use HashRouter for client-side routing

## Status
Accepted

## Context
Training HQ is deployed as a static site on GitHub Pages. GitHub Pages has no server-side URL rewriting — requests for paths like `/meals` return a 404 because the server has no `index.html` at that path.

React Router's default `BrowserRouter` produces clean URLs (e.g., `/#/meals` becomes `/meals`) but depends on the server serving `index.html` for all routes.

## Decision
Use React Router's `HashRouter`. All routes are prefixed with `#` (e.g., `/#/workout`, `/#/meals`), which are handled entirely by the browser without a server round-trip.

## Consequences
- Routes work correctly on GitHub Pages with no additional server configuration.
- URLs contain a `#` fragment, which is less clean but acceptable for a personal mobile app.
- If the app ever moves to a host that supports URL rewriting (e.g., Netlify, Vercel), migrating to `BrowserRouter` is straightforward — swap the router component and update `vite.config.ts`.
