import { useState } from 'react';
import type { LiftPlan } from '../data/workouts';

export default function WorkoutDetail({ plan }: { plan: LiftPlan }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setDone(p => ({ ...p, [i]: !p[i] }));
  const allDone = plan.exercises.length > 0 && plan.exercises.every((_, i) => done[i]);

  return (
    <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="text-[9px] tracking-[2px] text-blue-500 font-semibold mb-0.5">
          {plan.label.toUpperCase()}
        </div>
        <div className="text-[11px] text-gray-400 italic">{plan.note}</div>
      </div>

      <div className="grid grid-cols-[1fr_40px_60px] gap-x-2 px-4 py-2 border-b border-gray-100">
        <div className="text-[9px] tracking-[2px] text-gray-300">EXERCISE</div>
        <div className="text-[9px] tracking-[2px] text-gray-300 text-center">SETS</div>
        <div className="text-[9px] tracking-[2px] text-gray-300 text-center">REPS</div>
      </div>

      {plan.exercises.map((ex, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          className={`grid grid-cols-[1fr_40px_60px] gap-x-2 px-4 py-3 border-b border-gray-50 cursor-pointer transition-opacity last:border-b-0 ${done[i] ? 'opacity-30' : ''}`}
        >
          <div>
            <div className={`text-[13px] text-gray-800 ${done[i] ? 'line-through text-gray-400' : ''}`}>
              {ex.name}
            </div>
            {ex.note && <div className="text-[10px] text-gray-400 mt-0.5">{ex.note}</div>}
          </div>
          <div className="text-[14px] text-center self-center font-semibold text-blue-500">{ex.sets}</div>
          <div className="text-[14px] text-gray-500 text-center self-center">{ex.reps}</div>
        </div>
      ))}

      {allDone ? (
        <div className="mx-4 my-3 text-center text-[11px] tracking-[2px] text-green-600 bg-green-50 border border-green-200 rounded-lg py-2.5">
          ✓ SESSION COMPLETE
        </div>
      ) : (
        <div className="px-4 py-2.5 text-[9px] tracking-[1px] text-gray-300 text-right">
          TAP EXERCISE TO MARK DONE
        </div>
      )}
    </div>
  );
}
