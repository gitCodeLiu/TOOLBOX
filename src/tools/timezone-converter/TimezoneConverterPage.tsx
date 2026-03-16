// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';

const TIMEZONES = [
  { id: 'UTC', label: 'UTC+0', offset: 0, city: ' 伦敦' },
  { id: 'Asia/Shanghai', label: 'UTC+8', offset: 8, city: '北京/上海' },
  { id: 'Asia/Tokyo', label: 'UTC+9', offset: 9, city: '东京/首尔' },
  { id: 'Asia/Kolkata', label: 'UTC+5:30', offset: 5.5, city: '孟买/新德里' },
  { id: 'Europe/Paris', label: 'UTC+1/2', offset: 1, city: '巴黎/柏林' },
  { id: 'America/New_York', label: 'UTC-5', offset: -5, city: '纽约' },
  { id: 'America/Chicago', label: 'UTC-6', offset: -6, city: '芝加哥' },
  { id: 'America/Denver', label: 'UTC-7', offset: -7, city: '丹佛' },
  { id: 'America/Los_Angeles', label: 'UTC-8', offset: -8, city: '洛杉矶' },
  { id: 'America/Anchorage', label: 'UTC-9', offset: -9, city: '安克雷奇' },
  { id: 'Pacific/Auckland', label: 'UTC+12', offset: 12, city: '奥克兰' },
  { id: 'Australia/Sydney', label: 'UTC+11', offset: 11, city: '悉尼' },
  { id: 'Asia/Dubai', label: 'UTC+4', offset: 4, city: '迪拜' },
  { id: 'Asia/Singapore', label: 'UTC+8', offset: 8, city: '新加坡' },
];


export default function TimezoneConverterPage() {
  const [inputTime, setInputTime] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [sourceOffset, setSourceOffset] = useState(8);
  const [selectedTzs, setSelectedTzs] = useState<string[]>(['UTC', 'Asia/Shanghai', 'America/New_York', 'Europe/Paris', 'Asia/Tokyo']);

  const handleToggleTz = (id: string) => {
    setSelectedTzs(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const getConvertedTime = (targetOffset: number): string => {
    try {
      const localDate = new Date(inputTime);
      const utcMs = localDate.getTime() - sourceOffset * 3600000;
      const tzMs = utcMs + targetOffset * 3600000;
      const d = new Date(tzMs);
      const pad = (n: number) => String(n).padStart(2, '0');
      const days = ['日', '一', '二', '三', '四', '五', '六'];
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00 周${days[d.getDay()]}`;
    } catch {
      return '无效时间';
    }
  };

  const displayedTzs = TIMEZONES.filter(t => selectedTzs.includes(t.id));

  return (
    <ToolPageLayout icon="🌍" title="时区换算" description="多时区时间对照，快速查看同一时刻在不同时区的时间">
      {/* Input */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl bg-surface-900/60 border border-surface-800">
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">参考时间</label>
          <input type="datetime-local" value={inputTime} onChange={e => setInputTime(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">来源时区</label>
          <select value={sourceOffset} onChange={e => setSourceOffset(parseFloat(e.target.value))}
            className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-300 text-sm focus:outline-none focus:border-brand-500">
            {TIMEZONES.map(tz => (
              <option key={tz.id} value={tz.offset}>{tz.label} {tz.city}</option>
            ))}
          </select>
        </div>
        <div className="self-end">
          <button onClick={() => {
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, '0');
            setInputTime(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
          }}
            className="px-3 py-2 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-400 text-sm hover:bg-brand-500/25 transition-all">
            使用当前时间
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {displayedTzs.map(tz => (
          <div key={tz.id} className="p-4 rounded-xl bg-surface-900/60 border border-surface-800">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-mono text-brand-400">{tz.label}</p>
                <p className="text-xs text-surface-500">{tz.city}</p>
              </div>
              <button onClick={() => handleToggleTz(tz.id)}
                className="text-xs text-surface-600 hover:text-red-400 transition-colors">✕</button>
            </div>
            <p className="text-sm font-mono text-surface-100">{getConvertedTime(tz.offset)}</p>
          </div>
        ))}
      </div>

      {/* Timezone selector */}
      <div className="p-4 rounded-xl bg-surface-900/40 border border-surface-800">
        <p className="text-xs font-medium text-surface-400 mb-3">添加时区</p>
        <div className="flex flex-wrap gap-2">
          {TIMEZONES.filter(tz => !selectedTzs.includes(tz.id)).map(tz => (
            <button key={tz.id} onClick={() => handleToggleTz(tz.id)}
              className="px-3 py-1.5 rounded-lg text-xs bg-surface-800 border border-surface-700 text-surface-400 hover:text-surface-100 hover:border-surface-600 transition-all">
              + {tz.label} {tz.city}
            </button>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
