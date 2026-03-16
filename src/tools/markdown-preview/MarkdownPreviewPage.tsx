// Cursor generated code - start
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

const SAMPLE_MD = `# Markdown 预览示例

这是一段**粗体**文字和 *斜体* 文字。

## 功能列表

- ✅ 实时预览
- ✅ 支持 GFM 语法
- ✅ 导出 HTML

## 代码示例

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet('World'));
\`\`\`

## 表格

| 工具 | 类别 | 状态 |
|------|------|------|
| JSON 格式化 | 转换 | ✅ 已上线 |
| Markdown 预览 | 转换 | ✅ 已上线 |

> 引用文本：工欲善其事，必先利其器。

---

[访问工具箱](/)`;

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState(SAMPLE_MD);
  const [htmlOutput, setHtmlOutput] = useState('');
  const [view, setView] = useState<'split' | 'preview' | 'html'>('split');

  useEffect(() => {
    const result = marked(input, { breaks: true, gfm: true });
    setHtmlOutput(typeof result === 'string' ? result : '');
  }, [input]);

  return (
    <ToolPageLayout icon="📝" title="Markdown 预览" description="实时渲染 Markdown 为 HTML，并可导出 HTML 代码">
      {/* View Mode */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(['split', 'preview', 'html'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === v ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
              {v === 'split' ? '分屏' : v === 'preview' ? '预览' : 'HTML 代码'}
            </button>
          ))}
        </div>
        {view === 'html' && <CopyButton text={htmlOutput} />}
      </div>

      <div className={`grid gap-4 ${view === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {(view === 'split' || view !== 'preview') && view !== 'html' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-surface-300">Markdown 输入</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              rows={24}
              className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
          </div>
        )}

        {view === 'split' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-surface-300">预览</label>
            <div
              className="w-full px-6 py-4 rounded-xl bg-surface-900/60 border border-surface-800 overflow-auto prose-custom"
              style={{ minHeight: '500px' }}
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        )}

        {view === 'preview' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-surface-300">渲染预览</label>
            <div
              className="w-full px-6 py-4 rounded-xl bg-surface-900/60 border border-surface-800 overflow-auto prose-custom"
              style={{ minHeight: '500px' }}
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        )}

        {view === 'html' && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-surface-300">HTML 代码输出</label>
            <textarea value={htmlOutput} readOnly rows={24}
              className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 text-sm font-mono resize-none focus:outline-none" />
          </div>
        )}
      </div>

      <style>{`
        .prose-custom h1,.prose-custom h2,.prose-custom h3,.prose-custom h4 { color: #fafaf9; font-family: 'Syne', sans-serif; margin: 1.2em 0 0.5em; }
        .prose-custom h1 { font-size: 1.8em; border-bottom: 1px solid #44403c; padding-bottom: 0.3em; }
        .prose-custom h2 { font-size: 1.4em; border-bottom: 1px solid #292524; padding-bottom: 0.2em; }
        .prose-custom h3 { font-size: 1.2em; }
        .prose-custom p { color: #d6d3d1; line-height: 1.75; margin: 0.75em 0; }
        .prose-custom strong { color: #fafaf9; }
        .prose-custom em { color: #a8a29e; }
        .prose-custom code { background: #292524; color: #86efac; padding: 0.15em 0.4em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; }
        .prose-custom pre { background: #1c1917; border: 1px solid #44403c; border-radius: 8px; padding: 1em; overflow-x: auto; margin: 1em 0; }
        .prose-custom pre code { background: none; padding: 0; color: #d6d3d1; }
        .prose-custom ul,.prose-custom ol { color: #d6d3d1; padding-left: 1.5em; margin: 0.5em 0; }
        .prose-custom li { margin: 0.3em 0; }
        .prose-custom table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .prose-custom th { background: #1c1917; color: #fafaf9; padding: 0.5em 1em; text-align: left; border: 1px solid #44403c; }
        .prose-custom td { color: #d6d3d1; padding: 0.5em 1em; border: 1px solid #292524; }
        .prose-custom tr:nth-child(even) td { background: #1c1917/50; }
        .prose-custom blockquote { border-left: 3px solid #22c55e; padding-left: 1em; color: #78716c; margin: 1em 0; }
        .prose-custom hr { border: none; border-top: 1px solid #44403c; margin: 1.5em 0; }
        .prose-custom a { color: #22c55e; text-decoration: underline; }
      `}</style>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
