// Cursor generated code - start
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ToolPageLayoutProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolPageLayout({ icon, title, description, children }: ToolPageLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back + Header */}
      <div className="mb-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-200 transition-colors mb-5"
        >
          <ArrowLeft size={14} />
          返回工具箱
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-3xl select-none">{icon}</div>
          <div>
            <h1
              className="text-2xl font-bold text-surface-50"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              {title}
            </h1>
            <p className="text-surface-500 text-sm mt-0.5">{description}</p>
          </div>
        </div>
      </div>

      <div className="opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards', animationDelay: '80ms' }}>
        {children}
      </div>
    </div>
  );
}
// Cursor generated code - end
