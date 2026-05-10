import { useState } from 'react';
import { schedules, typeEmoji, getLiftPlan, DaySchedule, Session, SessionType } from '../data/workouts';
import { loadGoal, derivePaceTargets, PaceTargets } from '../data/progress';
import WorkoutDetail from '../components/WorkoutDetail';

const JS_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function getDaySchedule(dateStr: string, startDate: string): DaySchedule | null {
  const diff = Math.round(
    (new Date(dateStr + 'T00:00:00').getTime() - new Date(startDate + 'T00:00:00').getTime()) / 86400000
  );
  if (diff < 0 || diff >= 28) return null;
  const week = Math.floor(diff / 7) + 1;
  const dayName = DAY_NAMES[new Date(dateStr + 'T00:00:00').getDay()];
  return schedules[week]?.find(d => d.day === dayName) ?? null;
}

function getWeekNum(dateStr: string, startDate: string): number {
  const diff = Math.round(
    (new Date(dateStr + 'T00:00:00').getTime() - new Date(startDate + 'T00:00:00').getTime()) / 86400000
  );
  return Math.floor(diff / 7) + 1;
}

function getDayNum(dateStr: string, startDate: string): number {
  return Math.round(
    (new Date(dateStr + 'T00:00:00').getTime() - new Date(startDate + 'T00:00:00').getTime()) / 86400000
  ) + 1;
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function fmtRange(startDate: string): string {
  const end = addDays(startDate, 27);
  const s = new Date(startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const e = new Date(end + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${s} – ${e}`;
}

// ── Calendar cell ─────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<SessionType, string> = {
  lift:    'LIFT',
  run:     'RUN',
  soccer:  'SOCCER',
  game:    'GAME',
  rest:    'REST',
  barry:   'HIIT',
  spin:    'SPIN',
  yoga:    'YOGA',
  pilates: 'PILATES',
};

function sessionShortLabel(s: Session): string {
  if (s.type === 'lift') return s.label.includes('Lower') ? 'LOWER' : 'UPPER';
  if (s.type === 'run') return s.paceType === 'tempo' ? 'TEMPO' : 'EASY RUN';
  return TYPE_LABEL[s.type];
}

function CalendarCell({
  dateStr, startDate, today, selected, onTap,
}: {
  dateStr: string;
  startDate: string;
  today: string;
  selected: boolean;
  onTap: () => void;
}) {
  const daySchedule = getDaySchedule(dateStr, startDate);
  const sessions = daySchedule?.sessions ?? [];
  const dayNum = new Date(dateStr + 'T00:00:00').getDate();
  const isToday = dateStr === today;
  const isPast = dateStr < today;

  const dateColor = selected ? 'text-white'
    : isToday ? 'text-blue-500'
    : isPast   ? 'text-gray-300'
    :            'text-gray-600';

  const labelColor = selected ? 'text-blue-100' : isPast ? 'text-gray-300' : 'text-gray-400';

  return (
    <button
      onClick={onTap}
      className={`relative flex flex-col h-full w-full transition-all active:scale-95 overflow-hidden ${
        selected
          ? 'bg-blue-500'
          : isToday
          ? 'bg-blue-50'
          : 'bg-white'
      }`}
    >
      {/* Date — top right */}
      <span className={`absolute top-1.5 right-1.5 text-[11px] font-semibold leading-none ${dateColor}`}>
        {dayNum}
      </span>

      {/* Session content — centered, always stacked vertically */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1.5">
          {sessions.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className={`leading-none ${sessions.length === 1 ? 'text-[20px]' : 'text-[15px]'}`}>
                {typeEmoji[s.type]}
              </span>
              <span className={`tracking-[0.3px] font-semibold leading-none ${labelColor} ${sessions.length === 1 ? 'text-[8px]' : 'text-[6.5px]'}`}>
                {sessionShortLabel(s)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

// ── Session card ──────────────────────────────────────────────────────────────

function SessionCard({
  session, week, paceTargets,
}: {
  session: Session;
  week: number;
  paceTargets: PaceTargets;
}) {
  const [liftOpen, setLiftOpen] = useState(false);
  const plan = session.type === 'lift' ? getLiftPlan(week, session.label) : null;

  return (
    <div className="bg-gray-50 rounded-2xl p-4 mb-3 last:mb-0">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[28px] leading-none">{typeEmoji[session.type]}</span>
          <div>
            <div className="text-[15px] font-semibold text-gray-900 leading-snug">{session.label}</div>
            <div className="text-[12px] text-gray-500">{session.sub}</div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg px-2.5 py-1.5 text-right shrink-0 ml-2">
          <div className="text-[13px] font-semibold text-blue-500 leading-none">~{session.calories}</div>
          <div className="text-[9px] tracking-[1px] text-blue-400 mt-0.5">CAL</div>
        </div>
      </div>

      {/* Rationale */}
      <p className="text-[13px] text-gray-600 leading-relaxed mb-3">{session.rationale}</p>

      {/* Pace guidance */}
      {session.paceType && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-3">
          <p className="text-[9px] tracking-[1.5px] text-gray-400 font-medium mb-1.5">
            {session.paceType === 'tempo' ? 'TEMPO PACE TARGET' : 'EASY PACE TARGET'}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[20px] font-semibold text-gray-900 leading-none">
              {session.paceType === 'tempo'
                ? `${paceTargets.tempo.low}–${paceTargets.tempo.high}`
                : `${paceTargets.easy.low}–${paceTargets.easy.high}`}
            </span>
            <span className="text-[12px] text-gray-400">/mile</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
            {session.paceType === 'tempo'
              ? 'Comfortably hard — you can speak a few words but not hold a conversation.'
              : 'Conversational — you should be able to speak in full sentences throughout.'}
          </p>
        </div>
      )}

      {/* Lift exercise list toggle */}
      {plan && (
        <>
          <button
            onClick={() => setLiftOpen(v => !v)}
            className="w-full flex items-center justify-between text-[11px] tracking-[1.5px] font-semibold text-blue-500 py-1"
          >
            <span>EXERCISE LIST</span>
            <span className="text-[10px]">{liftOpen ? '▲' : '▼'}</span>
          </button>
          {liftOpen && <WorkoutDetail plan={plan} />}
        </>
      )}
    </div>
  );
}

// ── Bottom sheet ──────────────────────────────────────────────────────────────

function BottomSheet({
  dateStr, startDate, paceTargets, onClose,
}: {
  dateStr: string;
  startDate: string;
  paceTargets: PaceTargets;
  onClose: () => void;
}) {
  const daySchedule = getDaySchedule(dateStr, startDate);
  const week = getWeekNum(dateStr, startDate);
  const dayNum = getDayNum(dateStr, startDate);

  return (
    <>
      <div className="fixed inset-0 bg-black/25 z-40" onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-y-auto"
        style={{ maxHeight: '80vh', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-2">
          {/* Date + week label */}
          <div className="mb-5">
            <h2 className="text-[20px] font-semibold text-gray-900 leading-tight">{fmtDate(dateStr)}</h2>
            <p className="text-[10px] tracking-[2px] text-gray-400 mt-1">
              WEEK {week} · DAY {dayNum}
            </p>
          </div>

          {/* Session cards */}
          {daySchedule?.sessions.map((session, i) => (
            <SessionCard
              key={i}
              session={session}
              week={week}
              paceTargets={paceTargets}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WorkoutPage() {
  const goal = loadGoal()!;
  const today = new Date().toISOString().slice(0, 10);
  const paceTargets = derivePaceTargets(goal.easyPaceMinPerMile);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 4×7 grid of date strings
  const grid = Array.from({ length: 4 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(goal.startDate, w * 7 + d))
  );

  // Column headers derived from startDate's day-of-week
  const colHeaders = grid[0].map(dateStr => JS_DOW[new Date(dateStr + 'T00:00:00').getDay()]);

  const handleTap = (dateStr: string) => {
    setSelectedDate(prev => (prev === dateStr ? null : dateStr));
  };

  return (
    <div>
      {/* Range header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] tracking-[2px] text-gray-400 font-medium">4-WEEK PROGRAM</p>
        <p className="text-[11px] text-gray-500">{fmtRange(goal.startDate)}</p>
      </div>

      {/* Calendar grid — fills remaining viewport */}
      <div
        className="bg-gray-200 rounded-2xl border border-gray-200 flex flex-col overflow-hidden"
        style={{ height: 'calc(100dvh - 210px)' }}
      >
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 bg-white px-2 pt-2.5 pb-2 shrink-0">
          {colHeaders.map((h, i) => (
            <div key={i} className="text-center text-[11px] tracking-[0.5px] text-gray-500 font-semibold">
              {h}
            </div>
          ))}
        </div>

        {/* Weeks — gap acts as visible grid lines */}
        <div className="flex flex-col gap-[2px] flex-1 bg-gray-200">
          {grid.map((row, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-[2px] flex-1">
              {row.map(dateStr => (
                <CalendarCell
                  key={dateStr}
                  dateStr={dateStr}
                  startDate={goal.startDate}
                  today={today}
                  selected={selectedDate === dateStr}
                  onTap={() => handleTap(dateStr)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom sheet */}
      {selectedDate && (
        <BottomSheet
          dateStr={selectedDate}
          startDate={goal.startDate}
          paceTargets={paceTargets}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
