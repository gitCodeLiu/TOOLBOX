// Cursor generated code - start
import { useState, useMemo } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

export default function TextDedupPage() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sortResult, setSortResult] = useState(false);

  const result = useMemo(() => {
    let lines = input.split('\n');
    if (trimLines) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);
    const seen = new Set<string>();
    const deduped = lines.filter(line => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (sortResult) deduped.sort((a, b) => a.localeCompare(b, 'zh-CN'));
    return deduped;
  }, [input, caseSensitive, trimLines, removeEmpty, sortResult]);

  const originalLines = input.split('\n').filter(l => trimLines ? l.trim() : l).filter(l => removeEmpty ? (trimLines ? l.trim() : l).length > 0 : true);
  const removedCount = Math.max(0, originalLines.length - result.length);
  const outputText = result.join('\n');

  return (
    <ToolPageLayout icon="🧹" title="文本去重" description="按行去除重复内容，支持大小写敏感、排序、去空行等选项">
      {/* Options */}
      <div className="flex flex-wrap gap-4 mb-4 p-3 rounded-xl bg-surface-900/60 border border-surface-800">
        {[
          { label: '大小写敏感', state: caseSensitive, set: setCaseSensitive },
          { label: '自动去除行首尾空格', state: trimLines, set: setTrimLines },
          { label: '删除空行', state: removeEmpty, set: setRemoveEmpty },
          { label: '结果排序（A-Z）', state: sortResult, set: setSortResult },
        ].map(({ label, state, set }) => (
          <label key={label} className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer hover:text-surface-200 transition-colors">
            <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="accent-brand-500" />
            {label}
          </label>
        ))}
      </div>

      {/* Stats */}
      {input.trim() && (
        <div className="flex gap-4 mb-4">
          <div className="px-4 py-2 rounded-lg bg-surface-900/40 border border-surface-800 text-xs">
            <span className="text-surface-500">原始行数：</span>
            <span className="text-surface-200 font-mono ml-1">{originalLines.length}</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-surface-900/40 border border-surface-800 text-xs">
            <span className="text-surface-500">去重后：</span>
            <span className="text-brand-400 font-mono ml-1">{result.length}</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
            <span className="text-surface-500">移除重复：</span>
            <span className="text-red-400 font-mono ml-1">{removedCount}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-surface-300">输入文本（每行作为一个条目）</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="每行输入一个条目&#10;苹果&#10;香蕉&#10;苹果&#10;橙子&#10;香蕉"
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">去重结果</label>
            {outputText && <CopyButton text={outputText} />}
          </div>
          <textarea value={outputText} readOnly rows={16} placeholder="去重后的内容将在此显示..."
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 text-sm font-mono resize-none focus:outline-none" />
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
