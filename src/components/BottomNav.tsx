import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/workout',  emoji: '🏋️', label: 'WORKOUT' },
  { to: '/meals',    emoji: '🍽️', label: 'MEALS' },
  { to: '/grocery',  emoji: '🛒', label: 'GROCERY' },
  { to: '/progress', emoji: '📈', label: 'PROGRESS' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex">
        {navItems.map(({ to, emoji, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-[9px] tracking-[2px] transition-colors ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`
            }
          >
            <span className="text-xl">{emoji}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
