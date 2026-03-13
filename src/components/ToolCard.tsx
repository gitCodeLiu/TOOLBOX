import { Link } from 'react-router-dom';
import type { Tool } from '../types/tool';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export default function ToolCard({ tool, index = 0 }: ToolCardProps) {
  return (
    <Link
      to={tool.path}
      className="tool-card group block rounded-2xl border border-surface-800 bg-surface-900/60 p-5 hover:border-brand-600 hover:bg-surface-800/60 transition-all duration-300 opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl select-none">{tool.icon}</div>
        <div className="flex items-center gap-2">
          {tool.isNew && (
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30">
              NEW
            </span>
          )}
          {tool.isHot && (
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
              HOT
            </span>
          )}
        </div>
      </div>

      <h3
        className="font-semibold text-base text-surface-100 mb-1.5 group-hover:text-brand-300 transition-colors"
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        {tool.name}
      </h3>
      <p className="text-sm text-surface-400 leading-relaxed line-clamp-2 mb-4">
        {tool.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-surface-800 text-surface-500 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
        <ArrowRight
          size={16}
          className="text-surface-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0"
        />
      </div>
    </Link>
  );
}
