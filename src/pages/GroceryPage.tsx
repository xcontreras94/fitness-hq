import { useState } from 'react';
import { groceryList, prepInstructions } from '../data/grocery';

export default function GroceryPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('thq_checked') || '{}'); } catch { return {}; }
  });

  const totalItems = Object.values(groceryList).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const toggleItem = (cat: string, item: string) => {
    setChecked(prev => {
      const next = { ...prev, [`${cat}::${item}`]: !prev[`${cat}::${item}`] };
      try { localStorage.setItem('thq_checked', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const resetGrocery = () => {
    if (window.confirm('Reset grocery checklist?')) {
      setChecked({});
      try { localStorage.removeItem('thq_checked'); } catch {}
    }
  };

  const allDone = checkedCount === totalItems;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <div className="font-display text-[22px] tracking-[3px] text-gray-900">SHOPPING LIST</div>
          <div className="text-[10px] tracking-[2px] text-gray-400 mt-0.5">WEEK 1 MEAL PREP</div>
        </div>
        <div className="text-right">
          <div className={`text-[26px] font-semibold ${allDone ? 'text-green-500' : 'text-blue-500'}`}>
            {checkedCount}<span className="text-[14px] text-gray-400">/{totalItems}</span>
          </div>
          <div className="text-[9px] tracking-[2px] text-gray-400">CHECKED</div>
          <button
            onClick={resetGrocery}
            className="text-[9px] tracking-[1px] text-gray-400 mt-1 underline cursor-pointer bg-transparent border-none hover:text-gray-600 transition-colors"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-gray-100 rounded mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-[width] duration-300"
          style={{ width: `${(checkedCount / totalItems) * 100}%` }}
        />
      </div>

      {/* Categories */}
      {Object.entries(groceryList).map(([cat, items]) => {
        const catDone = items.filter(it => checked[`${cat}::${it}`]).length;
        return (
          <div key={cat} className="mb-5">
            <div className="flex justify-between mb-2">
              <div className="text-[11px] tracking-[3px] text-blue-500 font-semibold">{cat.toUpperCase()}</div>
              <div className="text-[10px] text-gray-400">{catDone}/{items.length}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-3.5">
              {items.map((item, i) => {
                const k = `${cat}::${item}`;
                const on = !!checked[k];
                return (
                  <div
                    key={i}
                    onClick={() => toggleItem(cat, item)}
                    className={`flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer select-none transition-opacity active:opacity-60 ${on ? 'opacity-40' : ''}`}
                  >
                    <div className={`w-[18px] h-[18px] border rounded flex items-center justify-center shrink-0 transition-colors ${on ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                      {on && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className={`text-[13px] ${on ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* All done banner */}
      {allDone && (
        <div className="text-center p-5 bg-green-50 border border-green-200 rounded-2xl text-[12px] tracking-[2px] text-green-600 mb-4">
          ✓ ALL ITEMS CHECKED · YOU'RE READY TO PREP
        </div>
      )}

      {/* Meal prep instructions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
        <div className="text-[9px] tracking-[2px] text-gray-400 mb-3">SUNDAY MEAL PREP</div>
        {prepInstructions.map((note, i) => (
          <div key={i} className={`flex gap-3 py-2.5 ${i < prepInstructions.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="text-blue-500 text-[11px] font-semibold shrink-0">{i + 1}.</div>
            <div className="text-[12px] text-gray-600 leading-snug">{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
