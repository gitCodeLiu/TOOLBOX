// Cursor generated code - start
import { useState, useMemo } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type SortMode = 'asc' | 'desc' | 'len-asc' | 'len-desc' | 'reverse' | 'shuffle';

const SORT_MODES: { value: SortMode; label: string }[] = [
  { value: 'asc', label: 'A → Z 升序' },
  { value: 'desc', label: 'Z → A 降序' },
  { value: 'len-asc', label: '长度 短→长' },
  { value: 'len-desc', label: '长度 长→短' },
  { value: 'reverse', label: '逆序翻转' },
  { value: 'shuffle', label: '随机打乱' },
];

export default function TextSortPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SortMode>('asc');
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const result = useMemo(() => {
    let lines = input.split('\n');
    if (trimLines) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);

    const sorted = [...lines];
    switch (mode) {
      case 'asc': sorted.sort((a, b) => a.localeCompare(b, 'zh-CN')); break;
      case 'desc': sorted.sort((a, b) => b.localeCompare(a, 'zh-CN')); break;
      case 'len-asc': sorted.sort((a, b) => a.length - b.length || a.localeCompare(b, 'zh-CN')); break;
      case 'len-desc': sorted.sort((a, b) => b.length - a.length || a.localeCompare(b, 'zh-CN')); break;
      case 'reverse': sorted.reverse(); break;
      case 'shuffle':
        // seeded shuffle using Fisher-Yates
        for (let i = sorted.length - 1; i > 0; i--) {
          const seed = (shuffleSeed * 1103515245 + 12345 + i) & 0x7fffffff;
          const j = seed % (i + 1);
          [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
        }
        break;
    }
    return sorted;
  }, [input, mode, trimLines, removeEmpty, shuffleSeed]);

  const outputText = result.join('\n');

  return (
    <ToolPageLayout icon="🔀" title="文本排序" description="按行对文本进行多种方式的排序，支持升序、降序、长度、随机等">
      <div className="flex flex-wrap gap-2 mb-4">
        {SORT_MODES.map(({ value, label }) => (
          <button key={value} onClick={() => { setMode(value); if (value === 'shuffle') setShuffleSeed(s => s + 1); }}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${mode === value ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        {[
          { label: '去除行首尾空格', state: trimLines, set: setTrimLines },
          { label: '删除空行', state: removeEmpty, set: setRemoveEmpty },
        ].map(({ label, state, set }) => (
          <label key={label} className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
            <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="accent-brand-500" />
            {label}
          </label>
        ))}
        {mode === 'shuffle' && (
          <button onClick={() => setShuffleSeed(s => s + 1)}
            className="px-3 py-1.5 rounded-lg text-xs bg-surface-800 border border-surface-700 text-surface-400 hover:text-surface-100 transition-all">
            🎲 重新打乱
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">输入文本</label>
            <span className="text-xs text-surface-600 font-mono">{input.split('\n').length} 行</span>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="每行输入一个条目..."
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">排序结果</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-600 font-mono">{result.length} 行</span>
              {outputText && <CopyButton text={outputText} />}
            </div>
          </div>
          <textarea value={outputText} readOnly rows={16} placeholder="排序结果将在此显示..."
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 text-sm font-mono resize-none focus:outline-none" />
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
