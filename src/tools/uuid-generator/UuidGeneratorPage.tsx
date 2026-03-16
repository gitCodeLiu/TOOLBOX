// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';
import { RefreshCw } from 'lucide-react';

function generateUUID(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUUID()]);
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [noDash, setNoDash] = useState(false);
  const [copied, setCopied] = useState(false);

  const format = (uuid: string) => {
    let v = uuid;
    if (noDash) v = v.replace(/-/g, '');
    if (uppercase) v = v.toUpperCase();
    return v;
  };

  const generateBulk = () => {
    setUuids(Array.from({ length: count }, generateUUID));
  };

  const regenerate = () => {
    setUuids(prev => prev.map(() => generateUUID()));
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.map(format).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout icon="🆔" title="UUID 生成器" description="生成符合 RFC 4122 的 UUID v4，支持批量生成和格式自定义">
      {/* Options */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl bg-surface-900/60 border border-surface-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-500">批量数量：</span>
          <input type="number" value={count} min={1} max={100} onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-20 px-2 py-1.5 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 text-sm font-mono focus:outline-none focus:border-brand-500" />
        </div>
        <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-brand-500" />
          大写
        </label>
        <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
          <input type="checkbox" checked={noDash} onChange={e => setNoDash(e.target.checked)} className="accent-brand-500" />
          去除连字符
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={generateBulk}
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 transition-all">
          生成 {count} 个
        </button>
        <button onClick={regenerate}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 transition-all">
          <RefreshCw size={14} /> 重新生成
        </button>
        <button onClick={copyAll}
          className={`px-4 py-2.5 rounded-xl text-sm transition-all ${copied ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100 hover:border-surface-700'}`}>
          {copied ? '✓ 已全部复制' : '复制全部'}
        </button>
      </div>

      {/* UUID list */}
      <div className="space-y-2">
        {uuids.map((uuid, idx) => (
          <div key={idx} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-900/60 border border-surface-800 group hover:border-surface-700 transition-all">
            <span className="text-xs font-mono text-surface-600 w-5 shrink-0">{idx + 1}</span>
            <span className="flex-1 text-sm font-mono text-surface-200 select-all">{format(uuid)}</span>
            <CopyButton text={format(uuid)} size={13} />
          </div>
        ))}
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
