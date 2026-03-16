// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';
import { CheckCircle, XCircle } from 'lucide-react';

type IndentSize = 2 | 4 | 'tab';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const parseWithSort = (obj: unknown): unknown => {
    if (Array.isArray(obj)) return obj.map(parseWithSort);
    if (obj !== null && typeof obj === 'object') {
      const sorted: Record<string, unknown> = {};
      Object.keys(obj as Record<string, unknown>).sort().forEach(k => {
        sorted[k] = parseWithSort((obj as Record<string, unknown>)[k]);
      });
      return sorted;
    }
    return obj;
  };

  const format = () => {
    setError('');
    try {
      let parsed = JSON.parse(input);
      if (sortKeys) parsed = parseWithSort(parsed);
      const indentValue = indent === 'tab' ? '\t' : indent;
      setOutput(JSON.stringify(parsed, null, indentValue));
      setIsValid(true);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      setIsValid(false);
    }
  };

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setIsValid(true);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      setIsValid(false);
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
      setError('');
    } catch (e) {
      setIsValid(false);
      setError((e as Error).message);
    }
  };

  return (
    <ToolPageLayout icon="📋" title="JSON 格式化" description="JSON 格式化、压缩、校验一体化工具">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-400">缩进：</span>
          {([2, 4, 'tab'] as IndentSize[]).map(i => (
            <button key={i} onClick={() => setIndent(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${indent === i ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
              {i === 'tab' ? 'Tab' : `${i} 空格`}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
          <input type="checkbox" checked={sortKeys} onChange={e => setSortKeys(e.target.checked)} className="accent-brand-500" />
          键名排序
        </label>
        {isValid !== null && (
          <span className={`flex items-center gap-1.5 text-xs font-medium ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {isValid ? <><CheckCircle size={13} /> 有效 JSON</> : <><XCircle size={13} /> 无效 JSON</>}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">输入 JSON</label>
            <span className="text-xs text-surface-600 font-mono">{input.length} 字符</span>
          </div>
          <textarea value={input} onChange={e => { setInput(e.target.value); setIsValid(null); }}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">输出结果</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={error ? `错误：${error}` : output} readOnly rows={16}
            placeholder="格式化结果将在此显示..."
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono resize-none focus:outline-none ${error ? 'bg-red-500/5 border-red-500/30 text-red-400' : 'bg-surface-900 border-surface-800 text-surface-100'}`} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={format} disabled={!input.trim()}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          格式化
        </button>
        <button onClick={minify} disabled={!input.trim()}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          压缩 (Minify)
        </button>
        <button onClick={validate} disabled={!input.trim()}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          校验
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); setIsValid(null); }}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 transition-all">
          清空
        </button>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
