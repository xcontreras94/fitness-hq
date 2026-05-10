import { useState } from 'react';
import { mealPlan } from '../data/meals';

export default function MealsPage() {
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[48px_1fr_1fr_1fr_72px] bg-gray-50 px-3.5 py-2.5 text-[9px] tracking-[2px] text-gray-400 border-b border-gray-100">
          <div>DAY</div>
          <div>BREAKFAST</div>
          <div>LUNCH</div>
          <div>DINNER</div>
          <div className="text-right">PROTEIN</div>
        </div>

        {mealPlan.map((row, i) => (
          <div key={row.day}>
            <div
              onClick={() => setExpandedMeal(expandedMeal === i ? null : i)}
              className={`grid grid-cols-[48px_1fr_1fr_1fr_72px] px-3.5 py-3 items-center cursor-pointer border-b border-gray-100 transition-colors ${
                expandedMeal === i ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className={`font-display text-[20px] tracking-[2px] ${expandedMeal === i ? 'text-blue-500' : 'text-gray-800'}`}>
                {row.day}
              </div>
              <div className="text-[10px] text-gray-500 pr-2 leading-snug">{row.breakfast}</div>
              <div className="text-[10px] text-gray-500 pr-2 leading-snug">{row.lunch}</div>
              <div className="text-[10px] text-gray-500 pr-2 leading-snug">{row.dinner}</div>
              <div className="text-right">
                <div className="text-[14px] font-semibold text-blue-500">{row.protein}g</div>
                <div className="h-1 bg-gray-100 rounded mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded transition-[width] duration-500"
                    style={{ width: `${(row.protein / 200) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {expandedMeal === i && (
              <div className="px-3.5 pb-3.5 pt-1 grid grid-cols-3 gap-2">
                {([
                  ['🌅 B/FAST', row.breakfast],
                  ['☀️ LUNCH',  row.lunch],
                  ['🌙 DINNER', row.dinner],
                ] as [string, string][]).map(([lbl, meal]) => (
                  <div key={lbl} className="bg-gray-50 rounded-xl p-2.5">
                    <div className="text-[9px] tracking-[2px] text-gray-400 mb-1.5">{lbl}</div>
                    <div className="text-[11px] text-gray-700 leading-relaxed">{meal}</div>
                  </div>
                ))}
                <div className="col-span-3 bg-blue-50 border border-blue-100 rounded-xl px-2.5 py-2 text-[10px] text-blue-500 tracking-[1px]">
                  + Orgain shake (2 scoops) + Clif bar · ~60g protein daily
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 text-[10px] tracking-[1px] text-gray-400 text-center">
        TAP ROW TO EXPAND · 180–200G PROTEIN · ~2,500 CAL
      </div>
    </div>
  );
}
