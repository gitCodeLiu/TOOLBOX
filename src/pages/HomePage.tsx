import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { TOOLS, CATEGORIES } from '../data/tools';
import type { ToolCategory } from '../types/tool';
import ToolCard from '../components/ToolCard';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return TOOLS.filter(tool => {
      const matchCategory = activeCategory === 'all' || tool.category === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  const categoriesWithCount = CATEGORIES.map(cat => ({
    ...cat,
    count: cat.id === 'all'
      ? TOOLS.length
      : TOOLS.filter(t => t.category === cat.id).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-14 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          持续构建中
        </div>
        <h1
          className="text-5xl sm:text-6xl font-bold text-surface-50 mb-4 tracking-tight"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          工具箱
        </h1>
        <p className="text-surface-400 text-lg max-w-2xl mx-auto leading-relaxed">
          一个不断成长的在线工具集合，涵盖数据处理、格式转换、内容生成等多个类别，助力日常工作效率提升。
        </p>
      </div>

      {/* Search */}
      <div
        className="relative max-w-2xl mx-auto mb-10 opacity-0 animate-slide-up delay-200"
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-surface-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索工具名称、标签..."
          className="search-input w-full pl-11 pr-10 py-3.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-4 flex items-center text-surface-500 hover:text-surface-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div
        className="flex flex-wrap gap-2 justify-center mb-10 opacity-0 animate-slide-up delay-300"
        style={{ animationFillMode: 'forwards' }}
      >
        {categoriesWithCount
          .filter(cat => cat.count! > 0 || cat.id === 'all')
          .map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ToolCategory | 'all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-surface-950'
                  : 'bg-surface-900 border border-surface-800 text-surface-400 hover:border-surface-700 hover:text-surface-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-xs font-mono ${
                  activeCategory === cat.id ? 'text-surface-950/70' : 'text-surface-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-surface-400 text-lg mb-2">未找到相关工具</p>
          <p className="text-surface-600 text-sm">
            试试其他关键词，或{' '}
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
            >
              清除筛选条件
            </button>
          </p>
        </div>
      )}

      {/* Footer hint */}
      <div className="text-center mt-20 pb-8">
        <p className="text-surface-700 text-xs font-mono">
          更多工具持续迭代中 · Built with React + Vite
        </p>
      </div>
    </div>
  );
}
