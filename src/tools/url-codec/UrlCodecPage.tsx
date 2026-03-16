// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Mode = 'encode' | 'decode';
type EncodeLevel = 'component' | 'full';

export default function UrlCodecPage() {
  const [mode, setMode] = useState<Mode>('encode');
  const [level, setLevel] = useState<EncodeLevel>('component');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(level === 'component' ? encodeURIComponent(input) : encodeURI(input));
      } else {
        setOutput(level === 'component' ? decodeURIComponent(input.trim()) : decodeURI(input.trim()));
      }
    } catch {
      setError('转换失败，请检查输入内容是否为有效的 URL 编码字符串');
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
    <ToolPageLayout icon="🔗" title="URL 编解码" description="URL 特殊字符的编码与解码转换">
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2">
          {(['encode', 'decode'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
              {m === 'encode' ? '编码' : '解码'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['component', 'full'] as EncodeLevel[]).map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${level === l ? 'bg-surface-700 text-surface-100' : 'bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-300'}`}>
              {l === 'component' ? 'encodeURIComponent（推荐）' : 'encodeURI（保留完整URL结构）'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">{mode === 'encode' ? '原始内容' : 'URL 编码字符串'}</label>
            <span className="text-xs text-surface-600 font-mono">{input.length} 字符</span>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入要编码的文本或 URL...' : '输入要解码的 URL 编码字符串...'}
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">{mode === 'encode' ? '编码结果' : '解码结果'}</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={error || output} readOnly rows={10}
            placeholder="转换结果将在此显示..."
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono resize-none focus:outline-none ${error ? 'bg-red-500/5 border-red-500/30 text-red-400' : 'bg-surface-900 border-surface-800 text-surface-100'}`} />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={handleConvert} disabled={!input.trim()}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {mode === 'encode' ? '立即编码' : '立即解码'}
        </button>
        <button onClick={handleSwap} disabled={!output}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          ⇄ 互换
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 transition-all">
          清空
        </button>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
