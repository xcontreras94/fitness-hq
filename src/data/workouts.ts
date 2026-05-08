export type SessionType =
  | 'lift' | 'run' | 'soccer' | 'game'
  | 'rest' | 'barry' | 'spin' | 'yoga' | 'pilates';

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  note: string;
}

export interface LiftPlan {
  label: string;
  note: string;
  exercises: Exercise[];
}

export interface Session {
  type: SessionType;
  label: string;
  sub: string;
}

export interface DaySchedule {
  day: string;
  sessions: Session[];
}

export const typeColors: Record<SessionType, { bg: string; accent: string }> = {
  lift:    { bg: '#1a1a2e', accent: '#e94560' },
  run:     { bg: '#0f3460', accent: '#3b82f6' },
  soccer:  { bg: '#1a2f1a', accent: '#2d5a27' },
  game:    { bg: '#2a1a0e', accent: '#c17f24' },
  rest:    { bg: '#1a1a1a', accent: '#444' },
  barry:   { bg: '#2a0a2a', accent: '#c026d3' },
  spin:    { bg: '#0a1a2a', accent: '#0ea5e9' },
  yoga:    { bg: '#1a2a1a', accent: '#10b981' },
  pilates: { bg: '#2a1a2a', accent: '#f472b6' },
};

export const typeEmoji: Record<SessionType, string> = {
  lift: '🏋️', run: '🏃', soccer: '⚽', game: '🏆', rest: '😴',
  barry: '🔥', spin: '🚴', yoga: '🧘', pilates: '🤸',
};

export const liftingPlans: Record<'lower' | 'upper', Record<number, LiftPlan>> = {
  lower: {
    1: { label: 'Lower Body A', note: 'Week 1 — Establish baseline weights. Log everything.', exercises: [
      { name: 'Back Squat',           sets: '4', reps: '5',        note: 'Anchor lift — track weight every week' },
      { name: 'Romanian Deadlift',    sets: '3', reps: '8',        note: 'Control the eccentric, 2 sec down' },
      { name: 'Leg Press',            sets: '3', reps: '10',       note: 'Feet shoulder-width, full range' },
      { name: 'Walking Lunges',       sets: '3', reps: '12 each',  note: 'Hold DBs for added resistance' },
      { name: 'Calf Raises (Machine)',sets: '4', reps: '15',       note: 'Pause at top' },
    ]},
    2: { label: 'Lower Body B', note: 'Week 2 — Add 5–10lbs to squat. Keep RDL weight the same.', exercises: [
      { name: 'Back Squat',              sets: '4', reps: '5',       note: '+5–10lbs from Week 1' },
      { name: 'Leg Press',              sets: '4', reps: '8',       note: 'Heavier than Week 1' },
      { name: 'Bulgarian Split Squat',  sets: '3', reps: '10 each', note: 'Rear foot elevated, DB in each hand' },
      { name: 'Hamstring Curl (Machine)',sets: '3', reps: '12',     note: 'Slow eccentric' },
      { name: 'Seated Calf Raises',     sets: '3', reps: '15',     note: 'Different stimulus from standing' },
    ]},
    3: { label: 'Lower Body C', note: 'Week 3 — Push squat weight again. Introduce hip hinge variation.', exercises: [
      { name: 'Back Squat',          sets: '4', reps: '5',       note: '+5–10lbs from Week 2' },
      { name: 'Trap Bar Deadlift',   sets: '3', reps: '6',       note: 'Sub for RDL — more quad involvement' },
      { name: 'Hack Squat',          sets: '3', reps: '10',      note: 'Deep range of motion' },
      { name: 'Reverse Lunges',      sets: '3', reps: '12 each', note: 'More knee-friendly than forward lunge' },
      { name: 'Calf Raises (Standing)',sets: '4', reps: '12',    note: 'Single leg if possible' },
    ]},
    4: { label: 'Lower Body D', note: 'Week 4 — Deload accessories. Chase a squat PR or match Week 3.', exercises: [
      { name: 'Back Squat',           sets: '4', reps: '5',  note: 'Match or exceed Week 3' },
      { name: 'Romanian Deadlift',    sets: '3', reps: '8',  note: 'Back to RDL — note improvement from Week 1' },
      { name: 'Leg Extension',        sets: '3', reps: '12', note: 'Finish the quads' },
      { name: 'Lying Hamstring Curl', sets: '3', reps: '12', note: '' },
      { name: 'Calf Raises',          sets: '3', reps: '15', note: 'Your choice — seated or standing' },
    ]},
  },
  upper: {
    1: { label: 'Upper Body A', note: 'Week 1 — Establish baseline. Hit solid form on all compounds.', exercises: [
      { name: 'Barbell Bench Press', sets: '4', reps: '5',   note: 'Anchor lift — log weight' },
      { name: 'Barbell Row',         sets: '4', reps: '5',   note: 'Overhand grip, chest to bar' },
      { name: 'Overhead Press',      sets: '3', reps: '8',   note: 'Standing, strict form' },
      { name: 'Pull-ups',            sets: '3', reps: 'Max', note: 'Add weight if 10+ reps feel easy' },
      { name: 'DB Incline Press',    sets: '3', reps: '10',  note: '' },
      { name: 'Face Pulls',          sets: '3', reps: '15',  note: "Rotator cuff health — don't skip" },
    ]},
    2: { label: 'Upper Body B', note: 'Week 2 — Add 5lbs to bench and row. Swap accessory push/pull.', exercises: [
      { name: 'Barbell Bench Press',      sets: '4', reps: '5',  note: '+5lbs from Week 1' },
      { name: 'Barbell Row',              sets: '4', reps: '5',  note: '+5lbs from Week 1' },
      { name: 'Seated DB Shoulder Press', sets: '3', reps: '10', note: 'Swap from standing OHP' },
      { name: 'Lat Pulldown',             sets: '3', reps: '10', note: 'Wide grip, full stretch at top' },
      { name: 'Cable Fly',                sets: '3', reps: '12', note: 'Mid-chest focus' },
      { name: 'Rear Delt Fly (Machine)',  sets: '3', reps: '15', note: '' },
    ]},
    3: { label: 'Upper Body C', note: 'Week 3 — Push bench again. Introduce dips as a compound variation.', exercises: [
      { name: 'Barbell Bench Press', sets: '4', reps: '5',  note: '+5lbs from Week 2' },
      { name: 'Weighted Dips',       sets: '3', reps: '8',  note: 'Add weight via belt if possible' },
      { name: 'Overhead Press',      sets: '3', reps: '8',  note: 'Return to standing OHP' },
      { name: 'Cable Row (Seated)',   sets: '4', reps: '10', note: 'Neutral grip' },
      { name: 'DB Lateral Raises',   sets: '3', reps: '15', note: 'Light weight, strict form' },
      { name: 'Face Pulls',          sets: '3', reps: '15', note: 'Shoulder health' },
    ]},
    4: { label: 'Upper Body D', note: 'Week 4 — Final push. Match or beat Week 3 bench.', exercises: [
      { name: 'Barbell Bench Press',    sets: '4', reps: '5',   note: 'Match or exceed Week 3' },
      { name: 'Barbell Row',            sets: '4', reps: '5',   note: 'Match or exceed Week 3' },
      { name: 'Overhead Press',         sets: '3', reps: '8',   note: '' },
      { name: 'Pull-ups',               sets: '3', reps: 'Max', note: 'Compare to Week 1' },
      { name: 'Tricep Pushdown (Cable)',sets: '3', reps: '12',  note: '' },
      { name: 'EZ-Bar Curl',            sets: '3', reps: '12',  note: '' },
    ]},
  },
};

export const schedules: Record<number, DaySchedule[]> = {
  1: [
    { day: 'Mon', sessions: [{ type: 'game',   label: 'Soccer Game',      sub: 'Evening' }] },
    { day: 'Tue', sessions: [{ type: 'soccer', label: 'Soccer Practice',  sub: '2 hrs' }] },
    { day: 'Wed', sessions: [{ type: 'lift',   label: 'Lower Body Lift',  sub: '45 min' }, { type: 'run', label: 'Run 4mi', sub: 'Tempo' }] },
    { day: 'Thu', sessions: [{ type: 'soccer', label: 'Soccer Practice',  sub: '2 hrs' }] },
    { day: 'Fri', sessions: [{ type: 'lift',   label: 'Lower Body Lift',  sub: '45 min' }] },
    { day: 'Sat', sessions: [{ type: 'barry',  label: "Barry's Bootcamp", sub: '~8am · HIIT' }] },
    { day: 'Sun', sessions: [{ type: 'lift',   label: 'Upper Body Lift',  sub: '~7am · 45 min' }] },
  ],
  2: [
    { day: 'Mon', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min' }, { type: 'run', label: 'Run 4mi', sub: 'Easy' }] },
    { day: 'Tue', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs' }] },
    { day: 'Wed', sessions: [{ type: 'lift',   label: 'Upper Body Lift', sub: '45 min' }, { type: 'run', label: 'Run 4mi', sub: 'Tempo' }] },
    { day: 'Thu', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs' }] },
    { day: 'Fri', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min' }] },
    { day: 'Sat', sessions: [{ type: 'spin',   label: 'Spin Class',      sub: '~8am · ClassPass' }] },
    { day: 'Sun', sessions: [{ type: 'yoga',   label: 'Yoga',            sub: '~8am · ClassPass' }] },
  ],
  3: [
    { day: 'Mon', sessions: [{ type: 'lift',    label: 'Lower Body Lift',  sub: '45 min' }, { type: 'run', label: 'Run 4mi', sub: 'Easy' }] },
    { day: 'Tue', sessions: [{ type: 'soccer',  label: 'Soccer Practice',  sub: '2 hrs' }] },
    { day: 'Wed', sessions: [{ type: 'lift',    label: 'Upper Body Lift',  sub: '45 min' }, { type: 'run', label: 'Run 4mi', sub: 'Tempo' }] },
    { day: 'Thu', sessions: [{ type: 'soccer',  label: 'Soccer Practice',  sub: '2 hrs' }] },
    { day: 'Fri', sessions: [{ type: 'lift',    label: 'Lower Body Lift',  sub: '45 min' }] },
    { day: 'Sat', sessions: [{ type: 'barry',   label: "Barry's Bootcamp", sub: '~8am · HIIT' }] },
    { day: 'Sun', sessions: [{ type: 'pilates', label: 'Pilates',          sub: '~8am · ClassPass' }] },
  ],
  4: [
    { day: 'Mon', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min' }, { type: 'run', label: 'Run 4mi', sub: 'Easy' }] },
    { day: 'Tue', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs' }] },
    { day: 'Wed', sessions: [{ type: 'lift',   label: 'Upper Body Lift', sub: '45 min' }, { type: 'run', label: 'Run 4mi', sub: 'Tempo' }] },
    { day: 'Thu', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs' }] },
    { day: 'Fri', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min' }] },
    { day: 'Sat', sessions: [{ type: 'spin',   label: 'Spin Class',      sub: '~8am · ClassPass' }] },
    { day: 'Sun', sessions: [{ type: 'lift',   label: 'Upper Body Lift', sub: '~7am · 45 min' }] },
  ],
};

export function getLiftPlan(week: number, label: string): LiftPlan | null {
  if (label.includes('Lower')) return liftingPlans.lower[week] ?? null;
  if (label.includes('Upper')) return liftingPlans.upper[week] ?? null;
  return null;
}
