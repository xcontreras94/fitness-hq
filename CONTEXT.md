# Training HQ — Domain Context

## Glossary

**Program**
The top-level entity. A single 4-week cut anchored to a start date; end date is always start + 28 days. All scheduling, progress tracking, and meal planning derive from it. Created once during Setup.
_Avoid_: Plan, course, cycle

**Setup**
The onboarding gate a user must complete before the app is usable. Captures start date, weight goals, running pace, and the first Check-in. Creates the Program. Cannot be skipped.
_Avoid_: Onboarding, configuration, profile

**Week**
One of the four 7-day blocks within the Program, numbered 1–4 from the start date. The active Week determines which lifting variations are shown. Week 1 is a special case (Game Week) with a shifted lifting schedule.

**Schedule**
The per-Week list of days, each containing one or more Sessions. Determined by the active Week.

**Session**
A single training event on a specific Program day. Has a type (Lift, Run, Soccer, Game, Barry's Bootcamp, Spin, Yoga, Pilates), a calorie estimate, and a rationale explaining why it appears in the program that week.

**Lift**
A Session of type "lift." Contains an ordered list of Exercises. Each Lift has a label (e.g., "Lower Body A") and a coaching note for the week.

**Exercise**
A single movement within a Lift. Defined by name, sets, reps, and an optional coaching note.

**Goal**
A body composition target: target weight (lbs) and optional target body fat %. Captured during Setup as part of the Program. Only one Goal is active at a time.

**Check-in**
A weight and optional body fat % measurement recorded on a specific Program date. The first Check-in is always the starting measurement entered during Setup.

**Easy Pace**
The user's comfortable long-run pace in min/mile, entered during Setup. The baseline from which all training paces are derived.
_Avoid_: Base pace, comfortable pace

**Tempo Pace**
A running pace derived from Easy Pace (approximately 30–45 sec/mile faster). Shown as a target range in Tempo Run sessions. Never entered directly by the user.
_Avoid_: Threshold pace

**Pace Line**
A projected line on a Progress chart drawn from the first Check-in's value to the Goal's target value on the end date. Shows where the user should be each day to stay on track. Only rendered after the first Check-in is logged.

**Meal**
A single eating event (Breakfast, Lunch, Dinner, or Snack) within a day. Defined by a display name, a structured ingredient list with measurements, and a full macro breakdown (calories, protein, carbs, fat).
_Avoid_: Food, item, entry

**Snack**
A Meal that appears as an always-visible sub-row beneath each day's main row in the Meal Plan table. Per-day in the data model (to allow future variation), currently uniform across all days.
_Avoid_: Supplement, extra

**Meal Plan**
A fixed weekly table of Meals: one Breakfast, Lunch, Dinner, and Snack per day. Does not vary by Week. The collapsed view shows meal names plus a daily calorie and protein summary; the expanded view shows per-Meal macro breakdown and ingredient list.

**Grocery List**
A categorized list of shopping items for the weekly Meal Plan. Static — does not vary by Week.
