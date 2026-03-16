// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Mode = 'encode' | 'decode';

const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;',
};
const REVERSE_MAP = Object.fromEntries(Object.entries(ENTITY_MAP).map(([k, v]) => [v, k]));

function encodeHtml(text: string): string {
  return text.replace(/[&<>"'`=/]/g, c => ENTITY_MAP[c] || c);
}

function decodeHtml(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

// Also handle numeric entities for display in decode
function decodeHtmlFull(html: string): string {
  return html.replace(/&[^;]+;/g, entity => REVERSE_MAP[entity] ?? decodeHtml(entity));
}

export default function HtmlEntityCodecPage() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    if (mode === 'encode') {
      setOutput(encodeHtml(input));
    } else {
      setOutput(decodeHtmlFull(input));
    }
  };

  const EXAMPLES = {
    encode: '<div class="hello">\'World\' & <b>bold</b></div>',
    decode: '&lt;div class=&quot;hello&quot;&gt;&#39;World&#39; &amp; &lt;b&gt;bold&lt;/b&gt;&lt;/div&gt;',
  };

  return (
    <ToolPageLayout icon="🏷️" title="HTML 实体编解码" description="HTML 特殊字符与实体编码（&amp; &lt; &gt; 等）之间的互转">
      <div className="flex gap-2 mb-4">
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {m === 'encode' ? '编码 (特殊字符 → 实体)' : '解码 (实体 → 特殊字符)'}
          </button>
        ))}
        <button onClick={() => setInput(EXAMPLES[mode])}
          className="px-3 py-2 rounded-lg text-xs bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-200 transition-all">
          载入示例
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-surface-300">{mode === 'encode' ? '原始 HTML' : 'HTML 实体字符串'}</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '输入含特殊字符的 HTML...' : '输入含 &amp; &lt; 等实体的字符串...'}
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">转换结果</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={output} readOnly rows={10} placeholder="转换结果将在此显示..."
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 text-sm font-mono resize-none focus:outline-none" />
        </div>
      </div>

      {/* Quick reference */}
      <div className="mt-6 p-4 rounded-xl bg-surface-900/60 border border-surface-800">
        <p className="text-xs font-medium text-surface-400 mb-3">常见实体对照</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ENTITY_MAP).map(([char, entity]) => (
            <span key={char} className="px-2 py-1 rounded bg-surface-800 text-xs font-mono text-surface-400">
              <span className="text-surface-200">{char}</span> → {entity}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={handleConvert} disabled={!input.trim()}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          立即转换
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }}
          className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 transition-all">
          清空
        </button>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
