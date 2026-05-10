import { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import {
  Goal, CheckIn, ChartDataPoint,
  loadGoal, loadCheckIns, clearProgress,
  upsertCheckIn, deleteCheckIn, buildWeightData, buildBodyFatData,
} from '../data/progress';

const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtFull = (d: string) => {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const inputCls =
  'bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-gray-900 text-[12px] w-full focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all';
const labelCls = 'text-[9px] tracking-[1px] text-gray-500 block mb-1';

// ── Chart ─────────────────────────────────────────────────────────────────────

const PACES = [
  { key: 'conservative' as const, dataKey: 'paceConservative' as const, label: 'CONSERVATIVE', color: '#3b82f6' },
  { key: 'regular'      as const, dataKey: 'paceRegular'      as const, label: 'REGULAR',      color: '#9ca3af' },
  { key: 'aggressive'   as const, dataKey: 'paceAggressive'   as const, label: 'AGGRESSIVE',   color: '#d97706' },
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
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-[9px] tracking-[2px] text-gray-400">
          {label} · {unit.toUpperCase()}
        </p>
        {latest?.actual != null && (
          <div className="text-right">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-[18px] font-semibold leading-none" style={{ color }}>
                {latest.actual}
              </span>
              <span className="text-[9px] text-gray-400">{unit}</span>
            </div>
            {remaining != null && (
              <p className="text-[9px] tracking-[1px] text-gray-400 mt-0.5">
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
              color: visible[p.key] ? p.color : '#d1d5db',
              borderColor: visible[p.key] ? p.color : '#e5e7eb',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            ticks={weekTicks}
            tickFormatter={fmtWeek}
            tick={{ fill: '#9ca3af', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          {weekTicks.slice(1).map(date => (
            <ReferenceLine key={date} x={date} stroke="#f3f4f6" strokeWidth={1} />
          ))}
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#9ca3af', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: 11,
            }}
            labelStyle={{ color: '#9ca3af', fontSize: 9 }}
            itemStyle={{ color: '#374151' }}
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
    <div className="bg-white border border-gray-200 rounded-2xl mb-4 overflow-hidden">
      <p className="text-[9px] tracking-[2px] text-gray-400 px-4 pt-4 pb-3">LOG HISTORY</p>
      {sorted.map((ci, i) => (
        <div key={ci.date} className={`px-4 ${i < sorted.length - 1 ? 'border-b border-gray-100' : ''}`}>
          {editingDate === ci.date ? (
            <div className="py-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className={labelCls}>WEIGHT (LBS)</label>
                  <input type="number" step="0.1" className={inputCls}
                    value={editWeight} onChange={e => setEditWeight(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>BF% <span className="text-gray-300">OPT</span></label>
                  <input type="number" step="0.1" className={inputCls}
                    value={editBf} onChange={e => setEditBf(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={saveEdit} disabled={!editWeight}
                  className="text-[9px] tracking-[1px] text-blue-500 disabled:opacity-30">
                  SAVE
                </button>
                <button onClick={() => setEditingDate(null)}
                  className="text-[9px] tracking-[1px] text-gray-400 hover:text-gray-600">
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 py-2.5">
              <span className="text-[11px] text-gray-400 w-14 shrink-0">{fmtFull(ci.date)}</span>
              <div className="flex items-baseline gap-2 flex-1">
                <span className="text-[13px] text-gray-900">
                  {ci.weight} <span className="text-[10px] text-gray-400">lbs</span>
                </span>
                {ci.bodyFat != null
                  ? <span className="text-[13px] text-gray-900">
                    {ci.bodyFat}% <span className="text-[10px] text-gray-400">Body Fat</span>
                  </span>
                  : <span className="text-[12px] text-gray-200">—</span>
                }
              </div>
              <button onClick={() => startEdit(ci)}
                className="text-base leading-none hover:opacity-60 transition-opacity">
                ✏️
              </button>
              <button onClick={() => onDelete(ci.date)}
                className="text-base leading-none hover:opacity-60 transition-opacity">
                🗑️
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
  const [date, setDate] = useState(() => {
    if (checkIns.length === 0) return todayStr();
    const last = checkIns[checkIns.length - 1].date;
    const [y, m, d] = last.split('-').map(Number);
    const next = new Date(y, m - 1, d + 1);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
  });
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
      <p className="text-[10px] tracking-[2px] text-gray-400 mb-4">
        TARGET {goal.targetWeight} LBS{goal.targetBodyFat ? ` · ${goal.targetBodyFat}% BF` : ''} · BY{' '}
        {fmtFull(goal.endDate).toUpperCase()}
      </p>

      {/* Log form */}
      <form onSubmit={handleLog} className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
        <p className="text-[9px] tracking-[2px] text-gray-400 mb-3">LOG CHECK-IN</p>
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
              BF% <span className="text-gray-300">OPT</span>
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
          className="w-full py-2.5 rounded-xl text-[11px] tracking-[2px] transition-all disabled:opacity-25 bg-blue-50 border border-blue-200 text-blue-500 font-medium"
        >
          LOG
        </button>
      </form>

      <ProgressChart
        data={weightData}
        label="WEIGHT"
        unit="lbs"
        color="#3b82f6"
        target={goal.targetWeight}
      />

      {hasBfChart && goal.targetBodyFat && (
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

      <div className="mt-2 pt-4 border-t border-gray-100 text-center">
        <button
          onClick={onReset}
          className="text-[9px] tracking-[2px] text-gray-300 hover:text-gray-500 transition-colors"
        >
          RESET GOAL
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const [goal] = useState<Goal>(() => loadGoal()!);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => loadCheckIns());

  const handleCheckIn = (ci: CheckIn) => {
    setCheckIns(upsertCheckIn(ci));
  };

  const handleDelete = (date: string) => {
    setCheckIns(deleteCheckIn(date));
  };

  const handleReset = () => {
    clearProgress();
    window.location.reload();
  };

  return (
    <Dashboard
      goal={goal}
      checkIns={checkIns}
      onCheckIn={handleCheckIn}
      onDelete={handleDelete}
      onReset={handleReset}
    />
  );
}
