// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Base = 2 | 8 | 10 | 16;

interface Representation {
  base: Base;
  label: string;
  prefix: string;
  placeholder: string;
}

const BASES: Representation[] = [
  { base: 2, label: '二进制 (Binary)', prefix: '0b', placeholder: '01001000 01101001' },
  { base: 8, label: '八进制 (Octal)', prefix: '0o', placeholder: '110 151' },
  { base: 10, label: '十进制 (Decimal)', prefix: '', placeholder: '72 105' },
  { base: 16, label: '十六进制 (Hex)', prefix: '0x', placeholder: '48 69' },
];

export default function NumberBasePage() {
  const [values, setValues] = useState<Record<Base, string>>({ 2: '', 8: '', 10: '', 16: '' });
  const [error, setError] = useState('');

  const handleChange = (base: Base, raw: string) => {
    setError('');
    const val = raw.trim();
    if (!val) {
      setValues({ 2: '', 8: '', 10: '', 16: '' });
      return;
    }
    try {
      const decimal = parseInt(val.replace(/\s/g, ''), base);
      if (isNaN(decimal) || decimal < 0) throw new Error();
      setValues({
        2: decimal.toString(2),
        8: decimal.toString(8),
        10: decimal.toString(10),
        16: decimal.toString(16).toUpperCase(),
      });
    } catch {
      setError(`无效的${BASES.find(b => b.base === base)?.label}数值`);
      setValues({ 2: '', 8: '', 10: '', 16: '' });
    }
  };

  const BASE_COLORS: Record<Base, string> = {
    2: 'text-blue-400',
    8: 'text-purple-400',
    10: 'text-brand-400',
    16: 'text-orange-400',
  };

  return (
    <ToolPageLayout icon="🔢" title="进制转换" description="二进制、八进制、十进制、十六进制之间的快速互转">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {BASES.map(({ base, label, prefix, placeholder }) => (
          <div key={base} className="p-4 rounded-xl bg-surface-900/60 border border-surface-800">
            <div className="flex items-center justify-between mb-2">
              <label className={`text-sm font-semibold font-mono ${BASE_COLORS[base]}`}>{label}</label>
              {values[base] && <CopyButton text={prefix + values[base]} />}
            </div>
            <div className="flex items-center gap-2">
              {prefix && <span className="text-xs font-mono text-surface-500 shrink-0">{prefix}</span>}
              <input
                value={values[base]}
                onChange={e => handleChange(base, e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 font-mono text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick reference table */}
      <div className="p-4 rounded-xl bg-surface-900/40 border border-surface-800">
        <p className="text-xs font-medium text-surface-400 mb-3">常用数值对照表（十进制 0-15）</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-surface-500">
                <th className="text-left py-1 pr-4">十进制</th>
                <th className="text-left py-1 pr-4">二进制</th>
                <th className="text-left py-1 pr-4">八进制</th>
                <th className="text-left py-1">十六进制</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 16 }, (_, i) => (
                <tr key={i} className="border-t border-surface-800/50">
                  <td className={`py-1 pr-4 ${BASE_COLORS[10]}`}>{i}</td>
                  <td className={`py-1 pr-4 ${BASE_COLORS[2]}`}>{i.toString(2).padStart(4, '0')}</td>
                  <td className={`py-1 pr-4 ${BASE_COLORS[8]}`}>{i.toString(8)}</td>
                  <td className={`py-1 ${BASE_COLORS[16]}`}>{i.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
