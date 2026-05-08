import { useState } from 'react';
import { mealPlan } from '../data/meals';

export default function MealsPage() {
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

  return (
    <div>
      <div className="bg-[#0e0e14] border border-[#1a1a1a] rounded-md overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[48px_1fr_1fr_1fr_72px] bg-[#111] px-3.5 py-2.5 text-[9px] tracking-[2px] text-[#555]">
          <div>DAY</div>
          <div>BREAKFAST</div>
          <div>LUNCH</div>
          <div>DINNER</div>
          <div className="text-right">PROTEIN</div>
        </div>

        {mealPlan.map((row, i) => (
          <div key={row.day}>
            {/* Collapsed row */}
            <div
              onClick={() => setExpandedMeal(expandedMeal === i ? null : i)}
              className={`grid grid-cols-[48px_1fr_1fr_1fr_72px] px-3.5 py-3 items-center cursor-pointer border-b border-[#111] transition-colors ${
                expandedMeal === i ? 'bg-[rgba(233,69,96,0.04)]' : 'hover:bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              <div className={`font-display text-[20px] tracking-[2px] ${expandedMeal === i ? 'text-[#e94560]' : 'text-white'}`}>
                {row.day}
              </div>
              <div className="text-[10px] text-[#aaa] pr-2 leading-snug">{row.breakfast}</div>
              <div className="text-[10px] text-[#aaa] pr-2 leading-snug">{row.lunch}</div>
              <div className="text-[10px] text-[#aaa] pr-2 leading-snug">{row.dinner}</div>
              <div className="text-right">
                <div className="text-[14px] font-medium text-[#e94560]">{row.protein}g</div>
                <div className="h-1 bg-[#111] rounded mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#e94560] to-[#ff6b6b] rounded transition-[width] duration-500"
                    style={{ width: `${(row.protein / 200) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            {expandedMeal === i && (
              <div className="px-3.5 pb-3.5 grid grid-cols-3 gap-2">
                {([
                  ['🌅 B/FAST', row.breakfast],
                  ['☀️ LUNCH',  row.lunch],
                  ['🌙 DINNER', row.dinner],
                ] as [string, string][]).map(([lbl, meal]) => (
                  <div key={lbl} className="bg-[#111] rounded p-2.5">
                    <div className="text-[9px] tracking-[2px] text-[#555] mb-1.5">{lbl}</div>
                    <div className="text-[11px] text-[#ddd] leading-relaxed">{meal}</div>
                  </div>
                ))}
                <div className="col-span-3 bg-[rgba(233,69,96,0.06)] border border-[rgba(233,69,96,0.15)] rounded px-2.5 py-2 text-[10px] text-[#e94560] tracking-[1px]">
                  + Orgain shake (2 scoops) + Clif bar · ~60g protein daily
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2.5 text-[10px] tracking-[1px] text-[#555] text-center">
        TAP ROW TO EXPAND · 180–200G PROTEIN · ~2,500 CAL
      </div>
    </div>
  );
}
