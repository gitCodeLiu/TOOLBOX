// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Mode = 'encode' | 'decode';

function textToUnicode(text: string): string {
  return Array.from(text).map(char => {
    const code = char.codePointAt(0)!;
    if (code > 127) {
      return code > 0xFFFF
        ? `\\u{${code.toString(16).toUpperCase()}}`
        : `\\u${code.toString(16).padStart(4, '0').toUpperCase()}`;
    }
    return char;
  }).join('');
}

function unicodeToText(unicode: string): string {
  return unicode
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export default function UnicodeCodecPage() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [encodeAll, setEncodeAll] = useState(false);

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'encode') {
        if (encodeAll) {
          setOutput(Array.from(input).map(c => `\\u${c.codePointAt(0)!.toString(16).padStart(4, '0').toUpperCase()}`).join(''));
        } else {
          setOutput(textToUnicode(input));
        }
      } else {
        setOutput(unicodeToText(input));
      }
    } catch {
      setError('转换失败，请检查输入内容');
      setOutput('');
    }
  };

  return (
    <ToolPageLayout icon="🔡" title="Unicode 编解码" description="文本与 Unicode 转义序列（\\uXXXX）之间的互转">
      <div className="flex flex-wrap gap-2 mb-4">
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {m === 'encode' ? '编码 (Text → \\uXXXX)' : '解码 (\\uXXXX → Text)'}
          </button>
        ))}
        {mode === 'encode' && (
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-900 border border-surface-800 text-surface-400 text-sm cursor-pointer hover:text-surface-200 transition-colors">
            <input type="checkbox" checked={encodeAll} onChange={e => setEncodeAll(e.target.checked)} className="accent-brand-500" />
            全字符编码（含 ASCII）
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">{mode === 'encode' ? '原始文本' : 'Unicode 转义序列'}</label>
            <span className="text-xs text-surface-600 font-mono">{input.length} 字符</span>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入文本，如：你好世界' : '输入 \\u4F60\\u597D 格式的 Unicode...'}
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">转换结果</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={error || output} readOnly rows={10} placeholder="转换结果将在此显示..."
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono resize-none focus:outline-none ${error ? 'bg-red-500/5 border-red-500/30 text-red-400' : 'bg-surface-900 border-surface-800 text-surface-100'}`} />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={handleConvert} disabled={!input.trim()}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          立即转换
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
