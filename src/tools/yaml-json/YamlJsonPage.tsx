// Cursor generated code - start
import { useState } from 'react';
import yaml from 'js-yaml';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Mode = 'yaml2json' | 'json2yaml';

const SAMPLE_YAML = `name: ToolBox
version: "1.0.0"
features:
  - JSON 格式化
  - YAML 转换
  - Base64 编解码
author:
  name: Developer
  email: dev@example.com`;

const SAMPLE_JSON = `{
  "name": "ToolBox",
  "version": "1.0.0",
  "features": ["JSON 格式化", "YAML 转换", "Base64 编解码"],
  "author": {
    "name": "Developer",
    "email": "dev@example.com"
  }
}`;

export default function YamlJsonPage() {
  const [mode, setMode] = useState<Mode>('yaml2json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'yaml2json') {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2, lineWidth: -1 }));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const loadSample = () => {
    setInput(mode === 'yaml2json' ? SAMPLE_YAML : SAMPLE_JSON);
    setOutput('');
    setError('');
  };

  return (
    <ToolPageLayout icon="🔄" title="YAML ↔ JSON 互转" description="YAML 与 JSON 格式之间的双向转换">
      <div className="flex flex-wrap gap-2 mb-4">
        {(['yaml2json', 'json2yaml'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(''); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {m === 'yaml2json' ? 'YAML → JSON' : 'JSON → YAML'}
          </button>
        ))}
        <button onClick={loadSample}
          className="px-3 py-2 rounded-lg text-xs bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-200 transition-all">
          载入示例
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">{mode === 'yaml2json' ? 'YAML 输入' : 'JSON 输入'}</label>
            <span className="text-xs text-surface-600 font-mono">{input.length} 字符</span>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'yaml2json' ? 'key: value\nlist:\n  - item1\n  - item2' : '{"key": "value"}'}
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">{mode === 'yaml2json' ? 'JSON 输出' : 'YAML 输出'}</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea value={error ? `错误：${error}` : output} readOnly rows={16} placeholder="转换结果将在此显示..."
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
