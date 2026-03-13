import { Link, useLocation } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-800 bg-surface-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center group-hover:bg-brand-400 transition-colors">
              <Wrench size={16} className="text-surface-950" />
            </div>
            <span
              className="font-display font-bold text-lg tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              ToolBox
            </span>
          </Link>

          {!isHome && (
            <Link
              to="/"
              className="text-sm text-surface-400 hover:text-surface-100 transition-colors flex items-center gap-1"
            >
              <span>←</span>
              <span>返回首页</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
