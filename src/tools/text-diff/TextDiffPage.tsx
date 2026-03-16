// Cursor generated code - start
import { useState, useMemo } from 'react';
import * as Diff from 'diff';
import ToolPageLayout from '../../components/ToolPageLayout';

type DiffMode = 'chars' | 'words' | 'lines';

export default function TextDiffPage() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [mode, setMode] = useState<DiffMode>('lines');

  const diffResult = useMemo(() => {
    if (!text1 && !text2) return null;
    switch (mode) {
      case 'chars': return Diff.diffChars(text1, text2);
      case 'words': return Diff.diffWords(text1, text2);
      case 'lines': return Diff.diffLines(text1, text2);
    }
  }, [text1, text2, mode]);

  const stats = useMemo(() => {
    if (!diffResult) return { added: 0, removed: 0, unchanged: 0 };
    return diffResult.reduce((acc, part) => {
      if (part.added) acc.added += part.count ?? 1;
      else if (part.removed) acc.removed += part.count ?? 1;
      else acc.unchanged += part.count ?? 1;
      return acc;
    }, { added: 0, removed: 0, unchanged: 0 });
  }, [diffResult]);

  const SAMPLES = {
    text1: `Hello World
This is the original text.
It has three lines.`,
    text2: `Hello World!
This is the modified text.
It now has four lines.
Added a new line.`,
  };

  return (
    <ToolPageLayout icon="📄" title="文本对比 (Diff)" description="对比两段文本的差异，高亮显示新增、删除、修改的部分">
      <div className="flex flex-wrap gap-2 mb-4">
        {(['lines', 'words', 'chars'] as DiffMode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {m === 'lines' ? '按行对比' : m === 'words' ? '按词对比' : '按字符对比'}
          </button>
        ))}
        <button onClick={() => { setText1(SAMPLES.text1); setText2(SAMPLES.text2); }}
          className="px-3 py-2 rounded-lg text-xs bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-200 transition-all">
          载入示例
        </button>
      </div>

      {/* Input area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-surface-300 block mb-2">原文本（旧版本）</label>
          <textarea value={text1} onChange={e => setText1(e.target.value)}
            placeholder="粘贴或输入原始文本..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-red-500/50 transition-colors" />
        </div>
        <div>
          <label className="text-sm font-medium text-surface-300 block mb-2">新文本（新版本）</label>
          <textarea value={text2} onChange={e => setText2(e.target.value)}
            placeholder="粘贴或输入修改后的文本..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-green-500/50 transition-colors" />
        </div>
      </div>

      {/* Stats */}
      {diffResult && (
        <div className="flex gap-3 mb-4">
          <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-xs">
            <span className="text-surface-500">新增：</span>
            <span className="text-green-400 font-mono ml-1">+{stats.added}</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
            <span className="text-surface-500">删除：</span>
            <span className="text-red-400 font-mono ml-1">-{stats.removed}</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-surface-900/40 border border-surface-800 text-xs">
            <span className="text-surface-500">未变：</span>
            <span className="text-surface-400 font-mono ml-1">{stats.unchanged}</span>
          </div>
        </div>
      )}

      {/* Diff result */}
      {diffResult && (
        <div className="rounded-xl border border-surface-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-surface-900/80 border-b border-surface-800 flex items-center gap-4">
            <span className="text-xs font-medium text-surface-400">差异结果</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400"><span className="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500/40 inline-block" /> 新增</span>
            <span className="flex items-center gap-1.5 text-xs text-red-400"><span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/40 inline-block" /> 删除</span>
          </div>
          <div className="px-4 py-4 bg-surface-950 font-mono text-sm max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {diffResult.map((part, i) => (
              <span
                key={i}
                className={
                  part.added
                    ? 'bg-green-500/20 text-green-300 rounded'
                    : part.removed
                    ? 'bg-red-500/20 text-red-300 rounded line-through opacity-70'
                    : 'text-surface-300'
                }
              >
                {part.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {!diffResult && (
        <div className="text-center py-12 text-surface-600 text-sm">
          在上方输入两段文本，差异结果将实时显示
        </div>
      )}
    </ToolPageLayout>
  );
}
// Cursor generated code - end
