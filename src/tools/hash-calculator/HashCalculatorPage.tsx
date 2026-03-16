// Cursor generated code - start
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

interface HashResult {
  algo: string;
  value: string;
}

function computeHashes(text: string): HashResult[] {
  if (!text) return [];
  return [
    { algo: 'MD5', value: CryptoJS.MD5(text).toString() },
    { algo: 'SHA-1', value: CryptoJS.SHA1(text).toString() },
    { algo: 'SHA-256', value: CryptoJS.SHA256(text).toString() },
    { algo: 'SHA-512', value: CryptoJS.SHA512(text).toString() },
    { algo: 'SHA-3 (256)', value: CryptoJS.SHA3(text, { outputLength: 256 }).toString() },
    { algo: 'RIPEMD-160', value: CryptoJS.RIPEMD160(text).toString() },
  ];
}

export default function HashCalculatorPage() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [uppercase, setUppercase] = useState(false);

  useEffect(() => {
    if (input) {
      setHashes(computeHashes(input));
    } else {
      setHashes([]);
    }
  }, [input]);

  const displayHash = (value: string) => uppercase ? value.toUpperCase() : value;

  return (
    <ToolPageLayout icon="🔏" title="哈希计算" description="计算文本的 MD5、SHA-1、SHA-256、SHA-512 等多种哈希值">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-surface-300">输入文本</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-brand-500" />
              大写输出
            </label>
            <span className="text-xs text-surface-600 font-mono">{input.length} 字符</span>
          </div>
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="输入要计算哈希的文本，结果将实时更新..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
      </div>

      {hashes.length > 0 ? (
        <div className="space-y-3">
          {hashes.map(({ algo, value }) => (
            <div key={algo} className="flex items-start gap-3 p-4 rounded-xl bg-surface-900/60 border border-surface-800">
              <div className="w-28 shrink-0">
                <span className="text-xs font-mono font-semibold text-brand-400">{algo}</span>
              </div>
              <p className="text-sm font-mono text-surface-200 break-all flex-1">{displayHash(value)}</p>
              <CopyButton text={displayHash(value)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-surface-600 text-sm">
          在上方输入文本，哈希值将实时显示
        </div>
      )}
    </ToolPageLayout>
  );
}
// Cursor generated code - end
