# ADR 0002: Use localStorage for Goal and Check-in persistence

## Status
Accepted

## Context
The Progress feature introduces two new data types that grow over time: a Goal (start/end dates, targets) and a list of Check-ins (daily weight and body fat % entries). This data needs to survive page refreshes.

The app is a personal static site deployed on GitHub Pages with no server. Multi-user support and cross-device sync are explicitly out of scope for the current version.

## Decision
Persist Goal and Check-in data in `localStorage` under dedicated keys (`fitness-hq:goal`, `fitness-hq:checkins`).

## Consequences
- No backend dependency. The app remains fully static and deployable without any server configuration.
- Data lives on one device only. Clearing browser storage loses all check-in history.
- If cross-device sync or multi-user support is added later, the data shape stays the same — only the read/write layer changes (swap `localStorage` calls for API calls).
