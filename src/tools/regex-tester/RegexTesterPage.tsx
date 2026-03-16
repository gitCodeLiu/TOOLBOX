// Cursor generated code - start
import { useState, useMemo } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

interface Match {
  value: string;
  index: number;
  groups: Record<string, string> | null;
  subgroups: (string | undefined)[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testStr, setTestStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: '' };
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
      return { regex: new RegExp(pattern, flagStr), error: '' };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flags]);

  const matches = useMemo((): Match[] => {
    if (!regex || !testStr) return [];
    const results: Match[] = [];
    if (flags.g) {
      let m: RegExpExecArray | null;
      const r = new RegExp(regex.source, regex.flags);
      while ((m = r.exec(testStr)) !== null) {
        results.push({ value: m[0], index: m.index, groups: m.groups || null, subgroups: m.slice(1) });
        if (m[0].length === 0) r.lastIndex++;
        if (results.length > 1000) break;
      }
    } else {
      const m = regex.exec(testStr);
      if (m) results.push({ value: m[0], index: m.index, groups: m.groups || null, subgroups: m.slice(1) });
    }
    return results;
  }, [regex, testStr, flags]);

  const highlightedText = useMemo(() => {
    if (!regex || !testStr || matches.length === 0) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    for (const m of matches) {
      if (m.index > lastIndex) parts.push({ text: testStr.slice(lastIndex, m.index), highlight: false });
      parts.push({ text: m.value, highlight: true });
      lastIndex = m.index + m.value.length;
    }
    if (lastIndex < testStr.length) parts.push({ text: testStr.slice(lastIndex), highlight: false });
    return parts;
  }, [regex, testStr, matches]);

  const replaceResult = useMemo(() => {
    if (!regex || !testStr || replaceStr === '') return '';
    try {
      return testStr.replace(regex, replaceStr);
    } catch { return ''; }
  }, [regex, testStr, replaceStr]);

  const FLAG_LIST = [
    { key: 'g' as const, label: 'g', title: '全局匹配' },
    { key: 'i' as const, label: 'i', title: '忽略大小写' },
    { key: 'm' as const, label: 'm', title: '多行模式（^ $ 匹配每行）' },
    { key: 's' as const, label: 's', title: 'dotAll（. 匹配换行）' },
  ];

  return (
    <ToolPageLayout icon="🔍" title="正则表达式测试" description="实时测试正则表达式，高亮显示匹配结果，支持捕获组和替换">
      {/* Pattern input */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs text-surface-500 block mb-1.5">正则表达式</label>
          <div className="flex items-center gap-0">
            <span className="px-3 py-2.5 bg-surface-800 border border-r-0 border-surface-700 rounded-l-xl text-surface-400 text-sm font-mono">/</span>
            <input value={pattern} onChange={e => setPattern(e.target.value)}
              placeholder="[a-z]+ | \d{3}-\d{4}"
              className={`flex-1 px-3 py-2.5 bg-surface-900 border border-surface-800 text-surface-100 text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors ${error ? 'border-red-500/50' : ''}`} />
            <span className="px-3 py-2.5 bg-surface-800 border border-l-0 border-surface-700 rounded-r-xl text-surface-400 text-sm font-mono">
              /{Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('')}
            </span>
          </div>
          {error && <p className="text-red-400 text-xs mt-1">⚠ {error}</p>}
        </div>
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">标志位</label>
          <div className="flex gap-1">
            {FLAG_LIST.map(({ key, label, title }) => (
              <button key={key} title={title} onClick={() => setFlags(f => ({ ...f, [key]: !f[key] }))}
                className={`w-9 h-10 rounded-lg text-sm font-mono font-bold transition-all ${flags[key] ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-100'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Test string */}
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">测试字符串</label>
          <textarea value={testStr} onChange={e => setTestStr(e.target.value)}
            placeholder="输入要测试的字符串..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>

        {/* Highlighted preview */}
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">
            匹配高亮 {matches.length > 0 && <span className="text-brand-400">（{matches.length} 处匹配）</span>}
          </label>
          <div className="w-full h-[176px] px-4 py-3 rounded-xl bg-surface-900/60 border border-surface-800 text-sm font-mono overflow-auto whitespace-pre-wrap break-words">
            {highlightedText ? (
              highlightedText.map((part, i) => (
                <span key={i} className={part.highlight ? 'bg-brand-500/30 text-brand-300 rounded px-0.5 outline outline-1 outline-brand-500/40' : 'text-surface-300'}>
                  {part.text}
                </span>
              ))
            ) : (
              <span className="text-surface-600">{testStr || '匹配高亮预览'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Replace */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs text-surface-500 block mb-1.5">替换为（支持 $1 $2 等捕获组引用）</label>
          <input value={replaceStr} onChange={e => setReplaceStr(e.target.value)}
            placeholder="输入替换字符串..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        {replaceResult && (
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-surface-500">替换结果</label>
              <CopyButton text={replaceResult} size={12} />
            </div>
            <div className="w-full px-4 py-2.5 rounded-xl bg-surface-900/60 border border-surface-800 text-surface-200 text-sm font-mono overflow-auto max-h-24 whitespace-pre-wrap">
              {replaceResult}
            </div>
          </div>
        )}
      </div>

      {/* Match details */}
      {matches.length > 0 && (
        <div>
          <p className="text-sm font-medium text-surface-400 mb-3">匹配详情</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {matches.slice(0, 50).map((m, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 rounded-xl bg-surface-900/40 border border-surface-800 text-xs font-mono">
                <span className="text-surface-600 w-6">[{i}]</span>
                <span className="text-brand-400 font-semibold">&quot;{m.value}&quot;</span>
                <span className="text-surface-600">@ {m.index}</span>
                {m.subgroups.length > 0 && (
                  <span className="text-purple-400">组: [{m.subgroups.map(g => `"${g ?? 'undefined'}"`).join(', ')}]</span>
                )}
              </div>
            ))}
            {matches.length > 50 && <p className="text-xs text-surface-600 text-center py-2">还有 {matches.length - 50} 条匹配...</p>}
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
// Cursor generated code - end
