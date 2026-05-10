# ADR 0002: Hard-gate the app behind Setup

## Status
Accepted

The entire app derives meaning from the Program start date — the calendar is undated, progress charts are unanchored, and pace guidance is generic without it. Rather than letting users browse an incomplete experience, Setup is required before any tab is accessible. The alternative (soft gate, browsable without setup) adds UI complexity and state branching for no real benefit given this is a personal single-user app with no discovery or onboarding funnel.
