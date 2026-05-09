import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import WorkoutPage from './pages/WorkoutPage';
import MealsPage from './pages/MealsPage';
import GroceryPage from './pages/GroceryPage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0a0a0f] pb-20">

        {/* Header */}
        <header
          className="border-b border-[#1a1a1a] px-5"
          style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}
        >
          <div className="pt-2 mb-1">
            <span className="font-display text-[28px] tracking-[4px] text-white">XAVIER'S</span>
            <span className="font-display text-[28px] tracking-[4px] text-[#e94560]"> TRAINING HQ</span>
          </div>
          <div className="text-[10px] tracking-[2px] text-[#555] mb-3">
            4-WEEK CUT · TARGET: 180 LBS
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
