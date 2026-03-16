// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Mode = 'csv2json' | 'json2csv';

function csvToJson(csv: string, delimiter = ','): Record<string, string>[] {
  const lines = csv.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) throw new Error('CSV 至少需要一行表头和一行数据');
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

function jsonToCsv(jsonStr: string, delimiter = ','): string {
  const data = JSON.parse(jsonStr);
  if (!Array.isArray(data) || data.length === 0) throw new Error('输入必须是非空的 JSON 数组');
  const headers = Object.keys(data[0]);
  const rows = data.map((row: Record<string, unknown>) =>
    headers.map(h => {
      const val = String(row[h] ?? '');
      return val.includes(delimiter) || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(delimiter)
  );
  return [headers.join(delimiter), ...rows].join('\n');
}

const SAMPLE_CSV = `name,age,city
张三,28,北京
李四,32,上海
王五,25,广州`;

const SAMPLE_JSON = `[
  {"name": "张三", "age": "28", "city": "北京"},
  {"name": "李四", "age": "32", "city": "上海"},
  {"name": "王五", "age": "25", "city": "广州"}
]`;

export default function CsvJsonPage() {
  const [mode, setMode] = useState<Mode>('csv2json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [delimiter, setDelimiter] = useState(',');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'csv2json') {
        const result = csvToJson(input, delimiter);
        setOutput(JSON.stringify(result, null, 2));
      } else {
        setOutput(jsonToCsv(input, delimiter));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  return (
    <ToolPageLayout icon="📊" title="CSV ↔ JSON 互转" description="CSV 与 JSON 数组格式之间的双向转换">
      <div className="flex flex-wrap gap-2 mb-4">
        {(['csv2json', 'json2csv'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(m === 'csv2json' ? '' : ''); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {m === 'csv2json' ? 'CSV → JSON' : 'JSON → CSV'}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-surface-500">分隔符：</span>
          {[',', ';', '\t'].map(d => (
            <button key={d} onClick={() => setDelimiter(d)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono transition-all ${delimiter === d ? 'bg-surface-700 text-surface-100' : 'bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-300'}`}>
              {d === '\t' ? 'Tab' : d}
            </button>
          ))}
        </div>
        <button onClick={() => setInput(mode === 'csv2json' ? SAMPLE_CSV : SAMPLE_JSON)}
          className="px-3 py-2 rounded-lg text-xs bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-200 transition-all">
          载入示例
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-surface-300">{mode === 'csv2json' ? 'CSV 输入' : 'JSON 数组输入'}</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'csv2json' ? 'name,age,city\n张三,28,北京' : '[{"name": "张三", "age": 28}]'}
            rows={14}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">{mode === 'csv2json' ? 'JSON 输出' : 'CSV 输出'}</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={error ? `错误：${error}` : output} readOnly rows={14} placeholder="转换结果将在此显示..."
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
