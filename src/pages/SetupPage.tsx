import { useState } from 'react';
import { Goal, saveGoal, upsertCheckIn } from '../data/progress';

function parsePaceInput(value: string): number | null {
  const parts = value.trim().split(':');
  if (parts.length !== 2) return null;
  const mins = parseInt(parts[0], 10);
  const secs = parseInt(parts[1], 10);
  if (isNaN(mins) || isNaN(secs) || secs >= 60 || mins < 1) return null;
  return mins + secs / 60;
}

function deriveEndDate(startDate: string): string {
  const d = new Date(startDate + 'T00:00:00');
  d.setDate(d.getDate() + 27);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';
const labelCls = 'block text-[10px] tracking-[1.5px] font-medium text-gray-500 mb-1.5';
const sectionCls = 'bg-white rounded-2xl border border-gray-200 p-5 mb-4';
const sectionTitle = 'text-[10px] tracking-[2px] font-semibold text-blue-500 mb-4';

const RACE_DISTANCES = ['5K', '10K', 'Half Marathon', 'Marathon'];
const RACE_PLACEHOLDERS: Record<string, string> = {
  '5K': '22:30',
  '10K': '46:00',
  'Half Marathon': '1:45:00',
  'Marathon': '3:45:00',
};

export default function SetupPage({ onComplete }: { onComplete: () => void }) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: '',
    startDate: today,
    startingWeight: '',
    targetWeight: '',
    startingBodyFat: '',
    targetBodyFat: '',
    easyPace: '',
    raceDist: '5K',
    raceTime: '',
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const endDateLabel = form.startDate ? deriveEndDate(form.startDate) : '—';
  const paceValid = parsePaceInput(form.easyPace) !== null;
  const hasBf = form.startingBodyFat.length > 0;

  const canSubmit =
    form.name.trim().length > 0 &&
    !!form.startDate &&
    parseFloat(form.startingWeight) > 0 &&
    parseFloat(form.targetWeight) > 0 &&
    paceValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const endD = new Date(form.startDate + 'T00:00:00');
    endD.setDate(endD.getDate() + 27);

    const goal: Goal = {
      name: form.name.trim(),
      startDate: form.startDate,
      endDate: endD.toISOString().slice(0, 10),
      startingWeight: parseFloat(form.startingWeight),
      targetWeight: parseFloat(form.targetWeight),
      startingBodyFat: hasBf ? parseFloat(form.startingBodyFat) : undefined,
      targetBodyFat: hasBf && form.targetBodyFat ? parseFloat(form.targetBodyFat) : undefined,
      easyPaceMinPerMile: parsePaceInput(form.easyPace)!,
      raceTime: form.raceTime ? `${form.raceDist} ${form.raceTime}` : undefined,
    };

    saveGoal(goal);
    upsertCheckIn({
      date: form.startDate,
      weight: parseFloat(form.startingWeight),
      bodyFat: hasBf ? parseFloat(form.startingBodyFat) : undefined,
    });

    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="bg-white border-b border-gray-200 px-5"
        style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}
      >
        <div className="pt-2 mb-1">
          <span className="font-display text-[28px] tracking-[4px] text-gray-900">
            {form.name.trim() ? `${form.name.trim().toUpperCase()}'S` : 'YOUR'}
          </span>
          <span className="font-display text-[28px] tracking-[4px] text-blue-500"> TRAINING HQ</span>
        </div>
        <div className="text-[10px] tracking-[2px] text-gray-400 mb-3">
          4-WEEK CUT · LET'S GET STARTED
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-5 pt-6 pb-32">
        <p className="text-[22px] font-semibold text-gray-900 mb-1">Set up your program</p>
        <p className="text-[13px] text-gray-500 mb-6">
          This information personalizes your workout schedule, progress tracking, and run targets.
        </p>

        {/* Name */}
        <div className={sectionCls}>
          <p className={sectionTitle}>YOUR NAME</p>
          <div>
            <label className={labelCls}>FIRST NAME</label>
            <input
              type="text"
              className={inputCls}
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Alex"
              required
            />
          </div>
        </div>

        {/* Program dates */}
        <div className={sectionCls}>
          <p className={sectionTitle}>PROGRAM DATES</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>START DATE</label>
              <input type="date" className={inputCls} value={form.startDate} onChange={set('startDate')} required />
            </div>
            <div>
              <label className={labelCls}>END DATE</label>
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-[13px] text-gray-400">
                {endDateLabel}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Auto: start + 28 days</p>
            </div>
          </div>
        </div>

        {/* Body goals */}
        <div className={sectionCls}>
          <p className={sectionTitle}>BODY GOALS</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>STARTING WEIGHT (LBS)</label>
              <input type="number" step="0.1" className={inputCls} value={form.startingWeight}
                onChange={set('startingWeight')} placeholder="192" required />
            </div>
            <div>
              <label className={labelCls}>TARGET WEIGHT (LBS)</label>
              <input type="number" step="0.1" className={inputCls} value={form.targetWeight}
                onChange={set('targetWeight')} placeholder="180" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                STARTING BF% <span className="text-gray-300 normal-case tracking-normal font-normal">optional</span>
              </label>
              <input type="number" step="0.1" className={inputCls} value={form.startingBodyFat}
                onChange={set('startingBodyFat')} placeholder="18" />
            </div>
            <div>
              <label className={labelCls}>
                TARGET BF% <span className="text-gray-300 normal-case tracking-normal font-normal">optional</span>
              </label>
              <input type="number" step="0.1" className={inputCls} value={form.targetBodyFat}
                onChange={set('targetBodyFat')} placeholder="12" disabled={!hasBf}
                style={{ opacity: hasBf ? 1 : 0.4 }} />
            </div>
          </div>
          {!hasBf && (
            <p className="text-[10px] text-gray-400 mt-2">Enter starting BF% to unlock target BF% tracking.</p>
          )}
        </div>

        {/* Running pace */}
        <div className={sectionCls}>
          <p className={sectionTitle}>RUNNING PACE</p>
          <p className="text-[12px] text-gray-500 mb-4">
            Your easy pace is used to calculate tempo and race targets shown in each run session.
          </p>
          <div className="mb-4">
            <label className={labelCls}>EASY PACE (MIN:SEC PER MILE)</label>
            <div className="relative">
              <input
                type="text"
                className={`${inputCls} pr-16 ${form.easyPace && !paceValid ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                value={form.easyPace}
                onChange={set('easyPace')}
                placeholder="9:30"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">/mile</span>
            </div>
            {form.easyPace && !paceValid && (
              <p className="text-[11px] text-red-400 mt-1">Use MM:SS format, e.g. 9:30</p>
            )}
            {paceValid && (
              <p className="text-[11px] text-blue-400 mt-1">
                Tempo target: {(() => {
                  const base = parsePaceInput(form.easyPace)!;
                  const tempoLow = base - 0.75;
                  const tempoHigh = base - 0.5;
                  const fmt = (v: number) => {
                    const m = Math.floor(v); const s = Math.round((v - m) * 60);
                    return `${m}:${String(s).padStart(2, '0')}`;
                  };
                  return `${fmt(tempoLow)}–${fmt(tempoHigh)} /mile`;
                })()}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              RECENT RACE TIME <span className="text-gray-300 normal-case tracking-normal font-normal">optional</span>
            </label>
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shrink-0"
                value={form.raceDist}
                onChange={set('raceDist')}
              >
                {RACE_DISTANCES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input
                type="text"
                className={inputCls}
                value={form.raceTime}
                onChange={set('raceTime')}
                placeholder={RACE_PLACEHOLDERS[form.raceDist]}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-4 rounded-2xl text-[13px] tracking-[2px] font-semibold transition-all disabled:opacity-30 bg-blue-500 text-white shadow-sm shadow-blue-200"
        >
          START 4-WEEK PROGRAM
        </button>
      </form>
    </div>
  );
}
