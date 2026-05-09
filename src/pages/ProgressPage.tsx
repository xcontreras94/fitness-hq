import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import {
  Goal, CheckIn, ChartDataPoint,
  loadGoal, saveGoal, loadCheckIns, clearProgress,
  upsertCheckIn, deleteCheckIn, buildWeightData, buildBodyFatData,
} from '../data/progress';

const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtFull = (d: string) => {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const inputCls =
  'bg-[#111] border border-[#222] rounded px-2 py-1.5 text-white text-[12px] w-full focus:outline-none focus:border-[#333]';
const labelCls = 'text-[9px] tracking-[1px] text-[#555] block mb-1';

// ── Setup form ────────────────────────────────────────────────────────────────

function SetupForm({
  existingGoal,
  onComplete,
}: {
  existingGoal: Goal | null;
  onComplete: (goal: Goal, ci: CheckIn) => void;
}) {
  const [form, setForm] = useState({
    endDate: existingGoal?.endDate ?? '',
    targetWeight: existingGoal ? String(existingGoal.targetWeight) : '',
    targetBodyFat: existingGoal ? String(existingGoal.targetBodyFat) : '',
    date: todayStr(),
    weight: '',
    bodyFat: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const canSubmit =
    form.endDate &&
    parseFloat(form.targetWeight) > 0 &&
    parseFloat(form.targetBodyFat) > 0 &&
    form.date &&
    parseFloat(form.weight) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      startDate: form.date,
      endDate: form.endDate,
      targetWeight: parseFloat(form.targetWeight),
      targetBodyFat: parseFloat(form.targetBodyFat),
    };
    const ci: CheckIn = {
      date: form.date,
      weight: parseFloat(form.weight),
      bodyFat: form.bodyFat ? parseFloat(form.bodyFat) : undefined,
    };
    onComplete(goal, ci);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-[10px] tracking-[2px] text-[#555] mb-4">SETUP TRACKING</p>

      <div className="bg-[#0e0e14] border border-[#1a1a1a] rounded-md p-4 mb-3">
        <p className="text-[9px] tracking-[2px] text-[#444] mb-3">GOAL</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>END DATE</label>
            <input type="date" className={inputCls} value={form.endDate} onChange={set('endDate')} required />
          </div>
          <div>
            <label className={labelCls}>TARGET WEIGHT</label>
            <input type="number" step="0.1" className={inputCls} value={form.targetWeight}
              onChange={set('targetWeight')} placeholder="180" required />
          </div>
          <div>
            <label className={labelCls}>TARGET BF%</label>
            <input type="number" step="0.1" className={inputCls} value={form.targetBodyFat}
              onChange={set('targetBodyFat')} placeholder="12" required />
          </div>
        </div>
      </div>

      <div className="bg-[#0e0e14] border border-[#1a1a1a] rounded-md p-4 mb-4">
        <p className="text-[9px] tracking-[2px] text-[#444] mb-3">FIRST CHECK-IN</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>DATE</label>
            <input type="date" className={inputCls} value={form.date} onChange={set('date')} required />
          </div>
          <div>
            <label className={labelCls}>WEIGHT (LBS)</label>
            <input type="number" step="0.1" className={inputCls} value={form.weight}
              onChange={set('weight')} placeholder="192" required />
          </div>
          <div>
            <label className={labelCls}>
              BF% <span className="text-[#2a2a2a]">OPT</span>
            </label>
            <input type="number" step="0.1" className={inputCls} value={form.bodyFat}
              onChange={set('bodyFat')} placeholder="18" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-3 rounded text-[11px] tracking-[2px] font-medium transition-opacity disabled:opacity-25 bg-[#e94560] text-white"
      >
        START TRACKING
      </button>
    </form>
  );
}

// ── Chart ─────────────────────────────────────────────────────────────────────

const PACES = [
  { key: 'conservative' as const, dataKey: 'paceConservative' as const, label: 'CONSERVATIVE', color: '#2d9b6a' },
  { key: 'regular'      as const, dataKey: 'paceRegular'      as const, label: 'REGULAR',      color: '#555'    },
  { key: 'aggressive'   as const, dataKey: 'paceAggressive'   as const, label: 'AGGRESSIVE',   color: '#c17f24' },
];

function ProgressChart({
  data, label, unit, color, target,
}: {
  data: ChartDataPoint[];
  label: string;
  unit: string;
  color: string;
  target: number;
}) {
  const [visible, setVisible] = useState({
    conservative: true,
    regular: true,
    aggressive: true,
  });

  const hasActual = data.some(d => d.actual != null);
  if (!hasActual) return null;

  const toggle = (key: keyof typeof visible) =>
    setVisible(v => ({ ...v, [key]: !v[key] }));

  const latest = [...data].reverse().find(d => d.actual != null);
  const remaining =
    latest?.actual != null ? +(latest.actual - target).toFixed(1) : null;

  // Week tick dates: day 0, 7, 14, 21, ... that fall within the data range
  const startDate = data[0]?.date ?? '';
  const weekTicks: string[] = [];
  if (startDate) {
    const start = new Date(startDate + 'T00:00:00');
    const lastDate = data[data.length - 1]?.date ?? startDate;
    const end = new Date(lastDate + 'T00:00:00');
    for (let d = 0; ; d += 7) {
      const tick = new Date(start);
      tick.setDate(tick.getDate() + d);
      if (tick > end) break;
      weekTicks.push(tick.toISOString().slice(0, 10));
    }
  }
  const fmtWeek = (dateStr: string) => {
    const start = new Date(startDate + 'T00:00:00');
    const current = new Date(dateStr + 'T00:00:00');
    const days = Math.round((current.getTime() - start.getTime()) / 86400000);
    return `W${Math.floor(days / 7) + 1}`;
  };

  return (
    <div className="bg-[#0e0e14] border border-[#1a1a1a] rounded-md p-4 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-[9px] tracking-[2px] text-[#555]">
          {label} · {unit.toUpperCase()}
        </p>
        {latest?.actual != null && (
          <div className="text-right">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-[18px] font-medium leading-none" style={{ color }}>
                {latest.actual}
              </span>
              <span className="text-[9px] text-[#555]">{unit}</span>
            </div>
            {remaining != null && (
              <p className="text-[9px] tracking-[1px] text-[#444] mt-0.5">
                {Math.abs(remaining)} {unit} to go
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pace toggles */}
      <div className="flex gap-1.5 mb-3">
        {PACES.map(p => (
          <button
            key={p.key}
            onClick={() => toggle(p.key)}
            className="text-[8px] tracking-[1px] px-2 py-0.5 rounded border transition-all"
            style={{
              color: visible[p.key] ? p.color : '#333',
              borderColor: visible[p.key] ? p.color : '#1a1a1a',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="#111" vertical={false} />
          <XAxis
            dataKey="date"
            ticks={weekTicks}
            tickFormatter={fmtWeek}
            tick={{ fill: '#444', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          {weekTicks.slice(1).map(date => (
            <ReferenceLine key={date} x={date} stroke="#1a1a1a" strokeWidth={1} />
          ))}
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#444', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0e0e14',
              border: '1px solid #222',
              borderRadius: 4,
              fontSize: 11,
            }}
            labelStyle={{ color: '#555', fontSize: 9 }}
            itemStyle={{ color: '#ddd' }}
            labelFormatter={(d) => fmtFull(d as string)}
            formatter={(value, name) => {
              const pace = PACES.find(p => p.dataKey === name);
              return [`${value ?? ''} ${unit}`, pace ? pace.label : label];
            }}
            itemSorter={(item) => {
              const order: Record<string, number> = {
                paceConservative: 0,
                paceRegular: 1,
                paceAggressive: 2,
                actual: 3,
              };
              return order[item.dataKey as string] ?? 99;
            }}
          />
          {PACES.map(p =>
            visible[p.key] ? (
              <Line
                key={p.key}
                dataKey={p.dataKey}
                stroke={p.color}
                strokeDasharray="4 3"
                strokeWidth={1.5}
                dot={false}
                name={p.dataKey}
                connectNulls
                isAnimationActive={false}
              />
            ) : null
          )}
          <Line
            dataKey="actual"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 4 }}
            name="actual"
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Check-in history ──────────────────────────────────────────────────────────

function CheckInHistory({
  checkIns,
  onUpdate,
  onDelete,
}: {
  checkIns: CheckIn[];
  onUpdate: (ci: CheckIn) => void;
  onDelete: (date: string) => void;
}) {
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editBf, setEditBf] = useState('');

  const startEdit = (ci: CheckIn) => {
    setEditingDate(ci.date);
    setEditWeight(String(ci.weight));
    setEditBf(ci.bodyFat != null ? String(ci.bodyFat) : '');
  };

  const saveEdit = () => {
    if (!editingDate || !editWeight) return;
    onUpdate({
      date: editingDate,
      weight: parseFloat(editWeight),
      bodyFat: editBf ? parseFloat(editBf) : undefined,
    });
    setEditingDate(null);
  };

  const sorted = [...checkIns].reverse();

  return (
    <div className="bg-[#0e0e14] border border-[#1a1a1a] rounded-md mb-4">
      <p className="text-[9px] tracking-[2px] text-[#444] px-4 pt-4 pb-3">LOG HISTORY</p>
      {sorted.map((ci, i) => (
        <div key={ci.date} className={`px-4 ${i < sorted.length - 1 ? 'border-b border-[#111]' : ''}`}>
          {editingDate === ci.date ? (
            <div className="py-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className={labelCls}>WEIGHT (LBS)</label>
                  <input type="number" step="0.1" className={inputCls}
                    value={editWeight} onChange={e => setEditWeight(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>BF% <span className="text-[#2a2a2a]">OPT</span></label>
                  <input type="number" step="0.1" className={inputCls}
                    value={editBf} onChange={e => setEditBf(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={saveEdit} disabled={!editWeight}
                  className="text-[9px] tracking-[1px] text-[#e94560] disabled:opacity-30">
                  SAVE
                </button>
                <button onClick={() => setEditingDate(null)}
                  className="text-[9px] tracking-[1px] text-[#444] hover:text-[#888]">
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 py-2.5">
              <span className="text-[11px] text-[#555] w-14 shrink-0">{fmtFull(ci.date)}</span>
              <span className="text-[13px] text-white flex-1">
                {ci.weight} <span className="text-[10px] text-[#555]">lbs</span>
              </span>
              <span className="text-[12px] text-[#666] w-12 text-right">
                {ci.bodyFat != null ? `${ci.bodyFat}%` : <span className="text-[#2a2a2a]">—</span>}
              </span>
              <button onClick={() => startEdit(ci)}
                className="text-[9px] tracking-[1px] text-[#444] hover:text-[#888] transition-colors ml-2">
                EDIT
              </button>
              <button onClick={() => onDelete(ci.date)}
                className="text-[9px] tracking-[1px] text-[#444] hover:text-[#e94560] transition-colors">
                DEL
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({
  goal,
  checkIns,
  onCheckIn,
  onDelete,
  onReset,
}: {
  goal: Goal;
  checkIns: CheckIn[];
  onCheckIn: (ci: CheckIn) => void;
  onDelete: (date: string) => void;
  onReset: () => void;
}) {
  const [date, setDate] = useState(todayStr());
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const weightData = buildWeightData(checkIns, goal);
  const bfData = buildBodyFatData(checkIns, goal);
  const hasBfChart = bfData.some(d => d.actual != null);

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckIn({
      date,
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
    });
    setWeight('');
    setBodyFat('');
  };

  return (
    <div>
      <p className="text-[10px] tracking-[2px] text-[#555] mb-4">
        TARGET {goal.targetWeight} LBS · {goal.targetBodyFat}% BF · BY{' '}
        {fmtFull(goal.endDate).toUpperCase()}
      </p>

      {/* Log form */}
      <form onSubmit={handleLog} className="bg-[#0e0e14] border border-[#1a1a1a] rounded-md p-4 mb-4">
        <p className="text-[9px] tracking-[2px] text-[#444] mb-3">LOG CHECK-IN</p>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label className={labelCls}>DATE</label>
            <input
              type="date"
              className={inputCls}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>WEIGHT (LBS)</label>
            <input
              type="number"
              step="0.1"
              className={inputCls}
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="190.5"
              required
            />
          </div>
          <div>
            <label className={labelCls}>
              BF% <span className="text-[#2a2a2a]">OPT</span>
            </label>
            <input
              type="number"
              step="0.1"
              className={inputCls}
              value={bodyFat}
              onChange={e => setBodyFat(e.target.value)}
              placeholder="17"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!weight}
          className="w-full py-2.5 rounded text-[11px] tracking-[2px] transition-all disabled:opacity-25 bg-[rgba(233,69,96,0.1)] border border-[rgba(233,69,96,0.25)] text-[#e94560]"
        >
          LOG
        </button>
      </form>

      <ProgressChart
        data={weightData}
        label="WEIGHT"
        unit="lbs"
        color="#e94560"
        target={goal.targetWeight}
      />

      {hasBfChart && (
        <ProgressChart
          data={bfData}
          label="BODY FAT"
          unit="%"
          color="#3b82f6"
          target={goal.targetBodyFat}
        />
      )}

      <CheckInHistory
        checkIns={checkIns}
        onUpdate={onCheckIn}
        onDelete={onDelete}
      />

      <div className="mt-2 pt-4 border-t border-[#111] text-center">
        <button
          onClick={onReset}
          className="text-[9px] tracking-[2px] text-[#333] hover:text-[#555] transition-colors"
        >
          RESET GOAL
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const [goal, setGoal] = useState<Goal | null>(() => loadGoal());
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => loadCheckIns());

  const handleSetupComplete = (g: Goal, ci: CheckIn) => {
    saveGoal(g);
    const updated = upsertCheckIn(ci);
    setGoal(g);
    setCheckIns(updated);
  };

  const handleCheckIn = (ci: CheckIn) => {
    setCheckIns(upsertCheckIn(ci));
  };

  const handleDelete = (date: string) => {
    setCheckIns(deleteCheckIn(date));
  };

  const handleReset = () => {
    clearProgress();
    setGoal(null);
    setCheckIns([]);
  };

  if (checkIns.length === 0) {
    return <SetupForm existingGoal={goal} onComplete={handleSetupComplete} />;
  }

  return (
    <Dashboard
      goal={goal!}
      checkIns={checkIns}
      onCheckIn={handleCheckIn}
      onDelete={handleDelete}
      onReset={handleReset}
    />
  );
}
