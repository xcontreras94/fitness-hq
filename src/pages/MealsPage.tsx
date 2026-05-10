import { useState } from 'react';
import { mealPlan, Meal } from '../data/meals';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function todayIndex(): number {
  const day = new Date().getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Mon=0 … Sun=6
}

let lastSelectedDay = todayIndex();

const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;
type MealKey = typeof MEAL_KEYS[number];

const MEAL_LABELS: Record<MealKey, string> = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH',
  dinner: 'DINNER',
  snacks: 'SNACKS',
};

function MealCard({
  mealKey, meal, expanded, onToggle,
}: {
  mealKey: MealKey;
  meal: Meal;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`rounded-2xl border cursor-pointer transition-colors ${
        expanded ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] tracking-[2px] text-gray-400 mb-0.5">{MEAL_LABELS[mealKey]}</p>
          <p className="text-[12px] text-gray-700 leading-snug">{meal.name}</p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0.5">
          <ul className="mb-3 space-y-1">
            {meal.ingredients.map((ing, i) => (
              <li key={i} className="text-[10px] text-gray-500 flex gap-1.5">
                <span className="text-gray-300 shrink-0">·</span>
                <span>{ing}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-4 pt-3 border-t border-blue-100">
            {[
              { val: meal.calories, label: 'CALS', cls: 'text-blue-500' },
              { val: `${meal.protein}g`, label: 'PROTEIN', cls: 'text-gray-600' },
              { val: `${meal.carbs}g`, label: 'CARBS', cls: 'text-gray-600' },
              { val: `${meal.fat}g`, label: 'FAT', cls: 'text-gray-600' },
            ].map(({ val, label, cls }) => (
              <div key={label} className="text-center">
                <p className={`text-[13px] font-semibold ${cls}`}>{val}</p>
                <p className="text-[8px] tracking-[1px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MealsPage() {
  const [selectedDay, setSelectedDay] = useState(lastSelectedDay);
  const [collapsedMeals, setCollapsedMeals] = useState<Set<MealKey>>(new Set());

  const row = mealPlan[selectedDay];
  const totalCal = MEAL_KEYS.reduce((sum, k) => sum + row[k].calories, 0);
  const totalProtein = MEAL_KEYS.reduce((sum, k) => sum + row[k].protein, 0);

  const handleDaySelect = (i: number) => {
    lastSelectedDay = i;
    setSelectedDay(i);
    setCollapsedMeals(new Set());
  };

  const handleToggle = (key: MealKey) => {
    setCollapsedMeals(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div>
      {/* Day selector */}
      <div className="bg-white border border-gray-200 rounded-2xl p-2 mb-4">
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => handleDaySelect(i)}
              className={`rounded-xl py-5 text-center transition-all ${
                selectedDay === i ? 'bg-blue-500' : 'hover:bg-gray-50'
              }`}
            >
              <p className={`text-[18px] tracking-[1px] font-semibold ${
                selectedDay === i ? 'text-white' : 'text-gray-600'
              }`}>
                {day}
              </p>
              {selectedDay === i && (
                <div className="mt-1.5">
                  <p className="text-[10px] text-white leading-none">{totalCal} Cals</p>
                  <p className="text-[10px] tracking-[0.5px] text-blue-200 mt-0.5">{totalProtein}g Protein</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Meal cards */}
      <div className="space-y-2">
        {MEAL_KEYS.map(key => (
          <MealCard
            key={key}
            mealKey={key}
            meal={row[key]}
            expanded={!collapsedMeals.has(key)}
            onToggle={() => handleToggle(key)}
          />
        ))}
      </div>
    </div>
  );
}
