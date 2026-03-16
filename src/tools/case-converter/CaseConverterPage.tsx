// Cursor generated code - start
import { useState, useMemo } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_./\s]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean);
}

interface Conversion {
  id: string;
  label: string;
  fn: (words: string[]) => string;
  hint: string;
}

const CONVERSIONS: Conversion[] = [
  { id: 'camel', label: 'camelCase', hint: 'myVariableName', fn: ws => ws.map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('') },
  { id: 'pascal', label: 'PascalCase', hint: 'MyVariableName', fn: ws => ws.map(w => w[0].toUpperCase() + w.slice(1)).join('') },
  { id: 'snake', label: 'snake_case', hint: 'my_variable_name', fn: ws => ws.join('_') },
  { id: 'screaming', label: 'SCREAMING_SNAKE', hint: 'MY_VARIABLE_NAME', fn: ws => ws.join('_').toUpperCase() },
  { id: 'kebab', label: 'kebab-case', hint: 'my-variable-name', fn: ws => ws.join('-') },
  { id: 'train', label: 'Train-Case', hint: 'My-Variable-Name', fn: ws => ws.map(w => w[0].toUpperCase() + w.slice(1)).join('-') },
  { id: 'dot', label: 'dot.case', hint: 'my.variable.name', fn: ws => ws.join('.') },
  { id: 'path', label: 'path/case', hint: 'my/variable/name', fn: ws => ws.join('/') },
  { id: 'title', label: 'Title Case', hint: 'My Variable Name', fn: ws => ws.map(w => w[0].toUpperCase() + w.slice(1)).join(' ') },
  { id: 'upper', label: 'UPPER CASE', hint: 'MY VARIABLE NAME', fn: ws => ws.join(' ').toUpperCase() },
  { id: 'lower', label: 'lower case', hint: 'my variable name', fn: ws => ws.join(' ') },
  { id: 'sentence', label: 'Sentence case', hint: 'My variable name', fn: ws => { const s = ws.join(' '); return s[0].toUpperCase() + s.slice(1); } },
];

export default function CaseConverterPage() {
  const [input, setInput] = useState('');

  const words = useMemo(() => toWords(input), [input]);
  const hasWords = words.length > 0;

  return (
    <ToolPageLayout icon="🔤" title="大小写 / 命名规范转换" description="在 camelCase、snake_case、kebab-case 等多种命名规范之间快速转换">
      <div className="mb-6">
        <label className="text-sm font-medium text-surface-300 block mb-2">输入文本</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="输入任意格式的文本，如：myVariableName / my_variable / MY-VAR-NAME"
          className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors" />
        {hasWords && (
          <p className="text-xs text-surface-600 mt-2 font-mono">
            识别到的词元：{words.map(w => `"${w}"`).join(', ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONVERSIONS.map(({ id, label, hint, fn }) => {
          const converted = hasWords ? fn(words) : '';
          return (
            <div key={id} className={`p-4 rounded-xl border transition-all ${hasWords ? 'bg-surface-900/60 border-surface-800 hover:border-surface-700' : 'bg-surface-900/30 border-surface-800/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold text-brand-400">{label}</span>
                {converted && <CopyButton text={converted} size={12} />}
              </div>
              <p className="text-sm font-mono text-surface-100 break-all">
                {converted || <span className="text-surface-700">{hint}</span>}
              </p>
            </div>
          );
        })}
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
