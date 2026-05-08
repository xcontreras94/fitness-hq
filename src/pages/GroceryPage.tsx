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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <div className="font-display text-[22px] tracking-[3px] text-white">SHOPPING LIST</div>
          <div className="text-[10px] tracking-[2px] text-[#555] mt-0.5">WEEK 1 MEAL PREP</div>
        </div>
        <div className="text-right">
          <div className={`text-[26px] font-medium ${checkedCount === totalItems ? 'text-[#4caf50]' : 'text-[#e94560]'}`}>
            {checkedCount}<span className="text-[14px] text-[#555]">/{totalItems}</span>
          </div>
          <div className="text-[9px] tracking-[2px] text-[#555]">CHECKED</div>
          <button
            onClick={resetGrocery}
            className="text-[9px] tracking-[1px] text-[#333] mt-1 underline cursor-pointer bg-transparent border-none"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-[#111] rounded mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#e94560] to-[#ff6b6b] transition-[width] duration-300"
          style={{ width: `${(checkedCount / totalItems) * 100}%` }}
        />
      </div>

      {/* Categories */}
      {Object.entries(groceryList).map(([cat, items]) => {
        const catDone = items.filter(it => checked[`${cat}::${it}`]).length;
        return (
          <div key={cat} className="mb-5">
            <div className="flex justify-between mb-2">
              <div className="text-[11px] tracking-[3px] text-[#e94560] font-medium">{cat.toUpperCase()}</div>
              <div className="text-[10px] text-[#444]">{catDone}/{items.length}</div>
            </div>
            <div className="bg-[#0e0e14] border border-[#1a1a1a] rounded-md px-3.5">
              {items.map((item, i) => {
                const k = `${cat}::${item}`;
                const on = !!checked[k];
                return (
                  <div
                    key={i}
                    onClick={() => toggleItem(cat, item)}
                    className={`flex items-center gap-3 py-2.5 border-b border-[#111] cursor-pointer select-none transition-opacity active:opacity-60 ${on ? 'opacity-30' : ''}`}
                  >
                    <div className={`w-[18px] h-[18px] border border-[#e94560] rounded-sm flex items-center justify-center shrink-0 transition-colors ${on ? 'bg-[#e94560]' : ''}`}>
                      {on && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className={`text-[13px] ${on ? 'text-[#333] line-through' : 'text-[#ccc]'}`}>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* All done banner */}
      {checkedCount === totalItems && (
        <div className="text-center p-5 bg-[rgba(45,90,39,0.15)] border border-[rgba(45,90,39,0.3)] rounded-md text-[12px] tracking-[2px] text-[#4caf50]">
          ✓ ALL ITEMS CHECKED · YOU'RE READY TO PREP
        </div>
      )}

      {/* Meal prep instructions */}
      <div className="mt-3.5 bg-[#0e0e14] border border-[#1a1a1a] rounded-md p-3.5">
        <div className="text-[9px] tracking-[2px] text-[#555] mb-2">SUNDAY MEAL PREP</div>
        {prepInstructions.map((note, i) => (
          <div key={i} className={`flex gap-2 py-1.5 ${i < prepInstructions.length - 1 ? 'border-b border-[#111]' : ''}`}>
            <div className="text-[#e94560] text-[10px] shrink-0">{i + 1}.</div>
            <div className="text-[11px] text-[#888] leading-snug">{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
