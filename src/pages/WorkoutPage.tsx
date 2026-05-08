import { useState } from 'react';
import { schedules, typeColors, typeEmoji, getLiftPlan } from '../data/workouts';
import WorkoutDetail from '../components/WorkoutDetail';

export default function WorkoutPage() {
  const [activeWeek, setActiveWeek] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('thq_week') || '1', 10); } catch { return 1; }
  });
  const [expandedLift, setExpandedLift] = useState<string | null>(null);

  const handleWeekChange = (w: number) => {
    setActiveWeek(w);
    setExpandedLift(null);
    try { localStorage.setItem('thq_week', String(w)); } catch {}
  };

  const schedule = schedules[activeWeek];

  return (
    <div>
      {/* Week selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] tracking-[2px] text-[#555]">WEEK</div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(w => (
            <button
              key={w}
              onClick={() => handleWeekChange(w)}
              className={`border rounded-sm px-3.5 py-1.5 text-[11px] tracking-[1px] transition-all cursor-pointer ${
                activeWeek === w
                  ? 'border-[#e94560] text-[#e94560] bg-[rgba(233,69,96,0.08)]'
                  : 'border-[#222] text-[#555] hover:border-[#333] hover:text-[#888]'
              }`}
            >
              {w}{w === 1 ? '★' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Week 1 banner */}
      {activeWeek === 1 && (
        <div className="bg-[rgba(193,127,36,0.08)] border border-[rgba(193,127,36,0.2)] rounded px-3 py-2 mb-3 text-[11px] text-[#c17f24] tracking-[1px]">
          ★ WEEK 1 — GAME WEEK. Lifting shifted to Wed–Sun.
        </div>
      )}

      {/* Daily schedule */}
      <div>
        {schedule.map(({ day, sessions }) => (
          <div key={day} className="flex items-start gap-3 py-3 border-b border-[#111]">
            <div className="font-display text-[24px] tracking-[2px] text-white w-[46px] shrink-0 pt-1.5">
              {day}
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {sessions.map((s, si) => {
                const c = typeColors[s.type];
                const plan = s.type === 'lift' ? getLiftPlan(activeWeek, s.label) : null;
                const key = `${activeWeek}-${day}-${si}`;
                const open = expandedLift === key;
                return (
                  <div key={si}>
                    <div
                      className={`rounded-md p-2.5 flex items-center gap-2.5 border-l-[3px] ${plan ? 'cursor-pointer active:opacity-80' : ''}`}
                      style={{ background: c.bg, borderLeftColor: c.accent }}
                      onClick={() => plan && setExpandedLift(open ? null : key)}
                    >
                      <span className="text-[18px] shrink-0">{typeEmoji[s.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#ddd]">{s.label}</div>
                        <div className="text-[10px] text-[#555] mt-0.5 tracking-[1px]">{s.sub}</div>
                      </div>
                      {plan && (
                        <div className="text-[10px] shrink-0" style={{ color: c.accent }}>
                          {open ? '▲' : '▼ VIEW'}
                        </div>
                      )}
                    </div>
                    {plan && open && <WorkoutDetail plan={plan} accentColor={c.accent} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-2.5 mt-5 flex-wrap pb-2">
        {Object.entries(typeColors).map(([type, c]) => (
          <div key={type} className="flex items-center gap-1 text-[9px] tracking-[1px] text-[#444]">
            <div className="w-[7px] h-[7px] rounded-sm shrink-0" style={{ background: c.accent }} />
            {type.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
