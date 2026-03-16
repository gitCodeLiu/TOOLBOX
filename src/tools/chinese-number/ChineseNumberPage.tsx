// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

const UPPER_DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const LOWER_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const UPPER_UNITS = ['', '拾', '佰', '仟'];
const LOWER_UNITS = ['', '十', '百', '千'];
const SECTION_UNITS = ['', '万', '亿', '万亿'];

function toChineseSection(num: number, digits: string[], units: string[]): string {
  if (num === 0) return '';
  let result = '';
  const s = String(num).padStart(4, '0');
  let hasZero = false;
  for (let i = 0; i < 4; i++) {
    const d = parseInt(s[i]);
    if (d === 0) {
      hasZero = true;
    } else {
      if (hasZero && result) result += digits[0];
      result += digits[d] + units[3 - i];
      hasZero = false;
    }
  }
  return result;
}

function toChinese(numStr: string, upper: boolean): string {
  const digits = upper ? UPPER_DIGITS : LOWER_DIGITS;
  const units = upper ? UPPER_UNITS : LOWER_UNITS;

  const num = parseFloat(numStr);
  if (isNaN(num)) throw new Error('无效数字');
  if (num < 0) throw new Error('暂不支持负数');
  if (num > 999999999999) throw new Error('数字过大（最大支持万亿级别）');

  const intPart = Math.floor(num);
  const decStr = numStr.includes('.') ? numStr.split('.')[1] : '';

  if (intPart === 0 && !decStr) return digits[0];

  const sections: number[] = [];
  let n = intPart;
  while (n > 0) {
    sections.unshift(n % 10000);
    n = Math.floor(n / 10000);
  }

  let result = '';
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const sectionStr = toChineseSection(sec, digits, units);
    if (sectionStr) {
      if (result && sec < 1000) result += digits[0];
      result += sectionStr + SECTION_UNITS[sections.length - 1 - i];
    } else if (result) {
      result += digits[0];
    }
  }

  if (decStr) {
    result += (upper ? '点' : '点');
    for (const c of decStr) result += digits[parseInt(c)];
  }

  // Financial suffix
  if (upper) result += '元整';
  return result;
}

export default function ChineseNumberPage() {
  const [input, setInput] = useState('');
  const [upper, setUpper] = useState(true);
  const [error, setError] = useState('');

  const result = (() => {
    if (!input.trim()) return '';
    try {
      setError('');
      return toChinese(input.trim(), upper);
    } catch (e) {
      setError((e as Error).message);
      return '';
    }
  })();

  const EXAMPLES = ['1234567.89', '100000000', '12345', '0', '99'];

  return (
    <ToolPageLayout icon="🀄" title="数字大写转换" description="阿拉伯数字转中文大写/小写，适用于财务、合同等场景">
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setUpper(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${upper ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
          大写（财务专用：壹贰叁...）
        </button>
        <button onClick={() => setUpper(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!upper ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
          小写（一二三...）
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <label className="text-sm font-medium text-surface-300 block mb-2">阿拉伯数字</label>
          <input type="text" value={input} onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder="输入数字，如：1234567.89"
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 font-mono text-lg focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
      </div>

      {/* Quick examples */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs text-surface-500 self-center">快速示例：</span>
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => setInput(ex)}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100 hover:border-surface-700 transition-all">
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
          ⚠ {error}
        </div>
      )}

      {result && (
        <div className="p-5 rounded-xl bg-surface-900/60 border border-brand-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-brand-400 uppercase">转换结果</span>
            <CopyButton text={result} />
          </div>
          <p className="text-xl font-bold text-surface-100 tracking-wide">{result}</p>
        </div>
      )}
    </ToolPageLayout>
  );
}
// Cursor generated code - end
