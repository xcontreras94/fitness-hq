const GOAL_KEY = 'fitness-hq:goal';
const CHECKINS_KEY = 'fitness-hq:checkins';

export interface Goal {
  startDate: string;
  endDate: string;
  targetWeight: number;
  targetBodyFat: number;
}

export interface CheckIn {
  date: string;
  weight: number;
  bodyFat?: number;
}

export interface ChartDataPoint {
  date: string;
  actual: number | null;
  paceConservative: number;
  paceRegular: number;
  paceAggressive: number;
}

export function loadGoal(): Goal | null {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    return raw ? (JSON.parse(raw) as Goal) : null;
  } catch { return null; }
}

export function saveGoal(goal: Goal): void {
  try { localStorage.setItem(GOAL_KEY, JSON.stringify(goal)); } catch {}
}

export function loadCheckIns(): CheckIn[] {
  try {
    const raw = localStorage.getItem(CHECKINS_KEY);
    return raw ? (JSON.parse(raw) as CheckIn[]) : [];
  } catch { return []; }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(GOAL_KEY);
    localStorage.removeItem(CHECKINS_KEY);
  } catch {}
}

export function deleteCheckIn(date: string): CheckIn[] {
  const existing = loadCheckIns();
  const updated = existing.filter(c => c.date !== date);
  try { localStorage.setItem(CHECKINS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

export function upsertCheckIn(newCheckIn: CheckIn): CheckIn[] {
  const existing = loadCheckIns();
  const filtered = existing.filter(c => c.date !== newCheckIn.date);
  const updated = [...filtered, newCheckIn].sort((a, b) => a.date.localeCompare(b.date));
  try { localStorage.setItem(CHECKINS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

function buildSeries(
  checkIns: CheckIn[],
  goal: Goal,
  getValue: (ci: CheckIn) => number | undefined,
  getTarget: (g: Goal) => number,
): ChartDataPoint[] {
  if (checkIns.length === 0) return [];

  const firstWithValue = checkIns.find(c => getValue(c) != null);
  if (!firstWithValue) return [];

  const startValue = getValue(firstWithValue)!;
  const diff = getTarget(goal) - startValue;

  const start = new Date(checkIns[0].date + 'T00:00:00');
  const end = new Date(goal.endDate + 'T00:00:00');
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));

  const byDate = new Map(checkIns.map(c => [c.date, c]));

  const points: ChartDataPoint[] = [];
  for (let d = 0; d <= totalDays; d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().slice(0, 10);
    const t = d / totalDays;
    const ci = byDate.get(dateStr);

    points.push({
      date: dateStr,
      actual: ci ? (getValue(ci) ?? null) : null,
      paceConservative: +(startValue + diff * 0.75 * t).toFixed(1),
      paceRegular:      +(startValue + diff * 1.00 * t).toFixed(1),
      paceAggressive:   +(startValue + diff * 1.25 * t).toFixed(1),
    });
  }

  return points;
}

export function buildWeightData(checkIns: CheckIn[], goal: Goal): ChartDataPoint[] {
  return buildSeries(checkIns, goal, c => c.weight, g => g.targetWeight);
}

export function buildBodyFatData(checkIns: CheckIn[], goal: Goal): ChartDataPoint[] {
  return buildSeries(checkIns, goal, c => c.bodyFat, g => g.targetBodyFat);
}
