import { useState } from 'react';
import type { LiftPlan } from '../data/workouts';

interface Props {
  plan: LiftPlan;
  accentColor: string;
}

export default function WorkoutDetail({ plan, accentColor }: Props) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setDone(p => ({ ...p, [i]: !p[i] }));
  const allDone = plan.exercises.length > 0 && plan.exercises.every((_, i) => done[i]);

  return (
    <div
      className="bg-[#0a0a12] border border-t-0 rounded-b-lg px-4 py-3.5 mb-1"
      style={{ borderColor: `${accentColor}44` }}
    >
      <div className="text-[9px] tracking-[2px] mb-1" style={{ color: accentColor }}>
        {plan.label.toUpperCase()}
      </div>
      <div className="text-[10px] text-[#555] italic mb-3.5">{plan.note}</div>

      <div className="grid grid-cols-[1fr_40px_60px] gap-x-2 pb-1.5">
        <div className="text-[9px] tracking-[2px] text-[#333]">EXERCISE</div>
        <div className="text-[9px] tracking-[2px] text-[#333] text-center">SETS</div>
        <div className="text-[9px] tracking-[2px] text-[#333] text-center">REPS</div>
      </div>

      {plan.exercises.map((ex, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          className={`grid grid-cols-[1fr_40px_60px] gap-x-2 py-2.5 border-t border-[#111] cursor-pointer transition-opacity ${done[i] ? 'opacity-30' : ''}`}
        >
          <div>
            <div className={`text-[13px] text-[#ddd] ${done[i] ? 'line-through' : ''}`}>{ex.name}</div>
            {ex.note && <div className="text-[10px] text-[#444] mt-0.5">{ex.note}</div>}
          </div>
          <div className="text-[14px] text-center self-center font-medium" style={{ color: accentColor }}>
            {ex.sets}
          </div>
          <div className="text-[14px] text-[#999] text-center self-center">{ex.reps}</div>
        </div>
      ))}

      {allDone ? (
        <div className="mt-3 text-center text-[11px] tracking-[2px] text-[#4caf50] bg-[rgba(45,90,39,0.12)] border border-[rgba(76,175,80,0.2)] rounded py-2.5">
          ✓ SESSION COMPLETE
        </div>
      ) : (
        <div className="mt-2 text-[9px] tracking-[1px] text-[#333] text-right">TAP EXERCISE TO MARK DONE</div>
      )}
    </div>
  );
}
