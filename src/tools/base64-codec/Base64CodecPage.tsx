// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Mode = 'encode' | 'decode';

export default function Base64CodecPage() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setOutput(decoded);
      }
    } catch {
      setError(mode === 'encode' ? '编码失败，请检查输入内容' : '解码失败，请确认输入为有效的 Base64 字符串');
      setOutput('');
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setError('');
    setMode(m => m === 'encode' ? 'decode' : 'encode');
  };

  return (
    <ToolPageLayout icon="🔐" title="Base64 编解码" description="文本与 Base64 编码之间的快速互转">
      {/* Mode Switch */}
      <div className="flex gap-2 mb-6">
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? 'bg-brand-500 text-surface-950'
                : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'
            }`}
          >
            {m === 'encode' ? '编码 (Text → Base64)' : '解码 (Base64 → Text)'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">
              {mode === 'encode' ? '原始文本' : 'Base64 字符串'}
            </label>
            <span className="text-xs text-surface-600 font-mono">{input.length} 字符</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的 Base64 字符串...'}
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">
              {mode === 'encode' ? 'Base64 编码结果' : '解码文本'}
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={error || output}
            readOnly
            rows={10}
            placeholder="转换结果将在此显示..."
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono resize-none focus:outline-none ${
              error
                ? 'bg-red-500/5 border-red-500/30 text-red-400'
                : 'bg-surface-900 border-surface-800 text-surface-100'
            }`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {mode === 'encode' ? '立即编码' : '立即解码'}
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ⇄ 互换输入/输出
        </button>
        <button
          onClick={() => { setInput(''); setOutput(''); setError(''); }}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 transition-all"
        >
          清空
        </button>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
