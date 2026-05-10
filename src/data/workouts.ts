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
  calories: number;
  rationale: string;
  paceType?: 'easy' | 'tempo';
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
    { day: 'Mon', sessions: [{ type: 'game',   label: 'Soccer Game',     sub: 'Evening',        calories: 600, rationale: 'Game week opener. Full-speed match play primes the nervous system and sets the athletic baseline for the cut.' }] },
    { day: 'Tue', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Technical session — focus on positioning and touch. Lower intensity than game day, keeps legs fresh for Wednesday.' }] },
    { day: 'Wed', sessions: [
      { type: 'lift',  label: 'Lower Body Lift', sub: '45 min',   calories: 280, rationale: 'Establish squat baseline. Week 1 is about form and finding working weights — not max effort. Log everything.' },
      { type: 'run',   label: 'Run 4mi',         sub: 'Tempo',    calories: 400, rationale: 'Tempo effort after lifting tests your ability to push when fatigued. Builds lactate threshold critical for fat loss during the cut.', paceType: 'tempo' },
    ]},
    { day: 'Thu', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Second practice of the week. Maintain intensity but listen to your legs — recovery starts tonight.' }] },
    { day: 'Fri', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min',          calories: 280, rationale: 'Second lower session this week. Legs will feel the accumulated load — that fatigue is the adaptation signal.' }] },
    { day: 'Sat', sessions: [{ type: 'barry',  label: "Barry's Bootcamp", sub: '~8am · HIIT',   calories: 650, rationale: "HIIT accelerates fat loss by maximizing EPOC (calories burned post-workout). Barry's combines strength and cardio in a format that's hard to replicate solo." }] },
    { day: 'Sun', sessions: [{ type: 'lift',   label: 'Upper Body Lift', sub: '~7am · 45 min',  calories: 260, rationale: 'Upper body to close the week. Fresh from rest — push the compounds hard and set your Week 1 benchmarks.' }] },
  ],
  2: [
    { day: 'Mon', sessions: [
      { type: 'lift', label: 'Lower Body Lift', sub: '45 min', calories: 280, rationale: 'Add 5–10lbs to squat from Week 1. Lower body drives the most total muscle mass — prioritize it.' },
      { type: 'run',  label: 'Run 4mi',         sub: 'Easy Run',  calories: 350, rationale: 'Easy pace after lifting — this is active recovery and aerobic base building. Do not push it; save output for Wednesday.', paceType: 'easy' },
    ]},
    { day: 'Tue', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Mid-week practice. Use it as active recovery — focus on ball movement and positioning, not max sprints.' }] },
    { day: 'Wed', sessions: [
      { type: 'lift', label: 'Upper Body Lift', sub: '45 min', calories: 260, rationale: 'Bench and row both go up 5lbs. Upper body mid-week while lower body recovers from Monday.' },
      { type: 'run',  label: 'Run 4mi',         sub: 'Tempo',  calories: 400, rationale: 'Tempo run with fresh legs. This is where your aerobic ceiling rises — push the pace and hold form through mile 4.', paceType: 'tempo' },
    ]},
    { day: 'Thu', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Stay sharp — game shape matters even during a cut. Focus on recovery between high-intensity moments.' }] },
    { day: 'Fri', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min',          calories: 280, rationale: 'Final lower session of the week. Squat should feel stronger than Monday — the Week 2 loading is working.' }] },
    { day: 'Sat', sessions: [{ type: 'spin',   label: 'Spin Class',      sub: '~8am · ClassPass', calories: 550, rationale: 'Low-impact, high-calorie cardio. Spin is joint-friendly and lets you push cardiovascular output without stressing the legs structurally.' }] },
    { day: 'Sun', sessions: [{ type: 'yoga',   label: 'Yoga',            sub: '~8am · ClassPass', calories: 150, rationale: 'Active recovery. Mobility work prevents injury and keeps movement quality high as training volume increases.' }] },
  ],
  3: [
    { day: 'Mon', sessions: [
      { type: 'lift', label: 'Lower Body Lift', sub: '45 min', calories: 280, rationale: 'Trap bar deadlift replaces RDL — more quad involvement and a fresh stimulus. Add weight to squat again; you should be stronger.' },
      { type: 'run',  label: 'Run 4mi',         sub: 'Easy Run',  calories: 350, rationale: 'Easy pace post-lift. Aerobic base at Week 3 is noticeably stronger than Week 1 — the easy pace should feel genuinely easy.', paceType: 'easy' },
    ]},
    { day: 'Tue', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Intensity picks up at this stage of the cut. Notice whether you are recovering faster between sprints compared to Week 1.' }] },
    { day: 'Wed', sessions: [
      { type: 'lift', label: 'Upper Body Lift', sub: '45 min', calories: 260, rationale: 'Weighted dips replace accessory push work. Bench continues to climb — match or beat last week on every compound.' },
      { type: 'run',  label: 'Run 4mi',         sub: 'Tempo',  calories: 400, rationale: 'Week 3 tempo should feel hard but controlled. If it does not feel hard, you have been holding back the previous two weeks.', paceType: 'tempo' },
    ]},
    { day: 'Thu', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Keep it technical. Soreness at similar intensities should be less than Week 1 — your body has adapted.' }] },
    { day: 'Fri', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min',          calories: 280, rationale: 'Hack squat replaces leg press for deeper range of motion. Go lighter than you think — the stimulus is different.' }] },
    { day: 'Sat', sessions: [{ type: 'barry',  label: "Barry's Bootcamp", sub: '~8am · HIIT',   calories: 650, rationale: 'Second Barry\'s of the program. Benchmark against Week 1 — output should be higher and recovery faster.' }] },
    { day: 'Sun', sessions: [{ type: 'pilates', label: 'Pilates',         sub: '~8am · ClassPass', calories: 180, rationale: 'Core stability and posterior chain work. Complements the heavy lifting and keeps movement quality sharp heading into the final week.' }] },
  ],
  4: [
    { day: 'Mon', sessions: [
      { type: 'lift', label: 'Lower Body Lift', sub: '45 min', calories: 280, rationale: 'Final lower body week. Match or exceed Week 3 squat. Accessories deload — save energy for the compound PR.' },
      { type: 'run',  label: 'Run 4mi',         sub: 'Easy Run',  calories: 350, rationale: 'Easy pace. Your body is near peak adaptation — enjoy the aerobic fitness you have built over 4 weeks.', paceType: 'easy' },
    ]},
    { day: 'Tue', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Penultimate practice. Notice how your endurance and sprint recovery compare to where you started in Week 1.' }] },
    { day: 'Wed', sessions: [
      { type: 'lift', label: 'Upper Body Lift', sub: '45 min', calories: 260, rationale: 'Final upper body session. Match or beat Week 3 bench and row. Log your numbers — this is your 4-week result.' },
      { type: 'run',  label: 'Run 4mi',         sub: 'Tempo',  calories: 400, rationale: 'Last tempo run of the program. This pace should feel more controlled than Week 1 — that difference is your fitness gain.', paceType: 'tempo' },
    ]},
    { day: 'Thu', sessions: [{ type: 'soccer', label: 'Soccer Practice', sub: '2 hrs',           calories: 450, rationale: 'Last regular practice of the program. Full effort — no saving yourself for anything after this.' }] },
    { day: 'Fri', sessions: [{ type: 'lift',   label: 'Lower Body Lift', sub: '45 min',          calories: 280, rationale: 'Final lower body session. Chase the squat PR or match Week 3. Either way, you are stronger than 4 weeks ago.' }] },
    { day: 'Sat', sessions: [{ type: 'spin',   label: 'Spin Class',      sub: '~8am · ClassPass', calories: 550, rationale: 'Final cardio session of the program. Push output — you have earned it and recovery is no longer a concern.' }] },
    { day: 'Sun', sessions: [{ type: 'lift',   label: 'Upper Body Lift', sub: '~7am · 45 min',  calories: 260, rationale: 'Program closer. Match or beat every Week 4 lift. These numbers are the benchmark for your next program.' }] },
  ],
};

export function getLiftPlan(week: number, label: string): LiftPlan | null {
  if (label.includes('Lower')) return liftingPlans.lower[week] ?? null;
  if (label.includes('Upper')) return liftingPlans.upper[week] ?? null;
  return null;
}
