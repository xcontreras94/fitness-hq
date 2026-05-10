import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import WorkoutPage from './pages/WorkoutPage';
import MealsPage from './pages/MealsPage';
import GroceryPage from './pages/GroceryPage';
import ProgressPage from './pages/ProgressPage';
import SetupPage from './pages/SetupPage';
import { loadGoal, loadCheckIns } from './data/progress';

export default function App() {
  const [ready, setReady] = useState(() => {
    const goal = loadGoal();
    const checkIns = loadCheckIns();
    return !!goal && checkIns.length > 0;
  });

  if (!ready) {
    return <SetupPage onComplete={() => setReady(true)} />;
  }

  const goal = loadGoal()!;
  const subheader = `4-WEEK CUT · TARGET: ${goal.targetWeight} LBS`;
  const nameLabel = goal.name ? `${goal.name.toUpperCase()}'S` : 'YOUR';

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden" style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}>

        {/* Header */}
        <header
          className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5"
          style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}
        >
          <div className="pt-2 mb-1">
            <span className="font-display text-[28px] tracking-[4px] text-gray-900">{nameLabel}</span>
            <span className="font-display text-[28px] tracking-[4px] text-blue-500"> TRAINING HQ</span>
          </div>
          <div className="text-[10px] tracking-[2px] text-gray-400 mb-3">
            {subheader}
          </div>
        </header>

        {/* Page content */}
        <main className="px-5 pt-5">
          <Routes>
            <Route path="/" element={<Navigate to="/workout" replace />} />
            <Route path="/workout"  element={<WorkoutPage />} />
            <Route path="/meals"    element={<MealsPage />} />
            <Route path="/grocery"  element={<GroceryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </HashRouter>
  );
}
