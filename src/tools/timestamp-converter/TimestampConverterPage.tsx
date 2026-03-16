// Cursor generated code - start
import { useState, useEffect } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';
import { RefreshCw } from 'lucide-react';

const TIMEZONES = [
  { label: 'UTC+0 (UTC)', value: 0 },
  { label: 'UTC+8 (北京/上海)', value: 8 },
  { label: 'UTC+9 (东京/首尔)', value: 9 },
  { label: 'UTC+5:30 (印度)', value: 5.5 },
  { label: 'UTC-5 (纽约 EST)', value: -5 },
  { label: 'UTC-8 (洛杉矶 PST)', value: -8 },
  { label: 'UTC+1 (伦敦 BST)', value: 1 },
  { label: 'UTC+2 (巴黎 CEST)', value: 2 },
];

function tsToDate(ts: number, tzOffset: number): string {
  const d = new Date((ts + tzOffset * 3600) * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

function dateToTs(dateStr: string, tzOffset: number): number {
  const d = new Date(dateStr + 'Z');
  return Math.floor(d.getTime() / 1000) - tzOffset * 3600;
}

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState(() => tsToDate(Math.floor(Date.now() / 1000), 8));
  const [tzOffset, setTzOffset] = useState(8);
  const [unit, setUnit] = useState<'s' | 'ms'>('s');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleTsChange = (val: string) => {
    setTimestamp(val);
    const ts = parseFloat(val);
    if (!isNaN(ts)) {
      const secs = unit === 'ms' ? ts / 1000 : ts;
      setDateStr(tsToDate(secs, tzOffset));
    }
  };

  const handleDateChange = (val: string) => {
    setDateStr(val);
    try {
      const ts = dateToTs(val, tzOffset);
      setTimestamp(unit === 'ms' ? String(ts * 1000) : String(ts));
    } catch { /* ignore */ }
  };

  const handleNow = () => {
    const ts = Math.floor(Date.now() / 1000);
    setTimestamp(unit === 'ms' ? String(ts * 1000) : String(ts));
    setDateStr(tsToDate(ts, tzOffset));
  };

  const handleTzChange = (tz: number) => {
    setTzOffset(tz);
    const ts = parseFloat(timestamp);
    if (!isNaN(ts)) {
      const secs = unit === 'ms' ? ts / 1000 : ts;
      setDateStr(tsToDate(secs, tz));
    }
  };

  const currentTs = Math.floor(now / 1000);

  return (
    <ToolPageLayout icon="⏱️" title="时间戳转换" description="Unix 时间戳与日期时间之间的快速互转，支持多时区">
      {/* Current Time Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900/60 border border-surface-800 mb-6">
        <div>
          <p className="text-xs text-surface-500 mb-0.5">当前时间戳（秒）</p>
          <p className="text-xl font-mono font-bold text-brand-400">{currentTs}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-surface-500 mb-0.5">北京时间（UTC+8）</p>
          <p className="text-sm font-mono text-surface-200">{tsToDate(currentTs, 8)}</p>
        </div>
        <button onClick={handleNow}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-400 text-xs hover:text-surface-100 transition-all">
          <RefreshCw size={12} /> 使用当前时间
        </button>
      </div>

      {/* Settings */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-500">单位：</span>
          {(['s', 'ms'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${unit === u ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
              {u === 's' ? '秒 (s)' : '毫秒 (ms)'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-500">时区：</span>
          <select value={tzOffset} onChange={e => handleTzChange(parseFloat(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs bg-surface-900 border border-surface-800 text-surface-300 focus:outline-none focus:border-brand-500">
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp */}
        <div className="p-5 rounded-xl bg-surface-900/60 border border-surface-800">
          <label className="text-sm font-medium text-surface-300 block mb-3">
            Unix 时间戳 ({unit === 's' ? '秒' : '毫秒'})
          </label>
          <div className="flex gap-2">
            <input type="number" value={timestamp} onChange={e => handleTsChange(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-surface-800 border border-surface-700 text-surface-100 text-lg font-mono focus:outline-none focus:border-brand-500 transition-colors" />
            <CopyButton text={timestamp} />
          </div>
        </div>

        {/* DateTime */}
        <div className="p-5 rounded-xl bg-surface-900/60 border border-surface-800">
          <label className="text-sm font-medium text-surface-300 block mb-3">
            日期时间（格式：YYYY-MM-DD HH:mm:ss）
          </label>
          <div className="flex gap-2">
            <input type="text" value={dateStr} onChange={e => handleDateChange(e.target.value)}
              placeholder="2024-01-01 00:00:00"
              className="flex-1 px-4 py-3 rounded-xl bg-surface-800 border border-surface-700 text-surface-100 font-mono text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            <CopyButton text={dateStr} />
          </div>
        </div>
      </div>

      {/* Multi-timezone display */}
      <div className="mt-6">
        <p className="text-sm font-medium text-surface-400 mb-3">各时区对应时间</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TIMEZONES.map(tz => {
            const ts = parseFloat(timestamp);
            const secs = isNaN(ts) ? 0 : (unit === 'ms' ? ts / 1000 : ts);
            return (
              <div key={tz.value} className="p-3 rounded-xl bg-surface-900/40 border border-surface-800">
                <p className="text-xs text-surface-500 mb-1">{tz.label}</p>
                <p className="text-xs font-mono text-surface-300">{isNaN(ts) ? '-' : tsToDate(secs, tz.value)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
