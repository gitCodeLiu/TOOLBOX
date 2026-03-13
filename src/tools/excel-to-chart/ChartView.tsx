import { useRef, useCallback } from 'react';
import {
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Copy, Check } from 'lucide-react';
import type { ParsedChartData } from '../../utils/excelParser';
import { useState } from 'react';

interface ChartViewProps {
  data: ParsedChartData;
  visibleSeries: Set<string>;
  chartType: 'line' | 'area';
  showDots: boolean;
  smooth: boolean;
  showGrid: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-800 border border-surface-700 rounded-xl p-3 shadow-xl min-w-[140px]">
      <p className="text-xs text-surface-400 font-mono mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-surface-300">{entry.name}</span>
          <span className="text-xs font-mono text-surface-100 ml-auto font-medium">
            {entry.value !== null && entry.value !== undefined
              ? Number(entry.value).toLocaleString()
              : '-'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ChartView({
  data,
  visibleSeries,
  chartType,
  showDots,
  smooth,
  showGrid,
}: ChartViewProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const chartData = data.xLabels.map((label, idx) => {
    const point: Record<string, string | number | null> = { x: label };
    data.datasets.forEach(ds => {
      if (visibleSeries.has(ds.name)) {
        point[ds.name] = ds.data[idx] ?? null;
      }
    });
    return point;
  });

  const visibleDatasets = data.datasets.filter(ds => visibleSeries.has(ds.name));

  const handleExportSVG = useCallback(() => {
    const svgEl = chartRef.current?.querySelector('svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExportPNG = useCallback(() => {
    const svgEl = chartRef.current?.querySelector('svg');
    if (!svgEl) return;
    const canvas = document.createElement('canvas');
    const rect = svgEl.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(2, 2);
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, rect.width, rect.height);
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'chart.png';
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  }, []);

  const handleCopyData = useCallback(async () => {
    const headers = ['X轴', ...data.datasets.map(d => d.name)];
    const rows = data.xLabels.map((label, idx) =>
      [label, ...data.datasets.map(d => d.data[idx] ?? '')].join('\t')
    );
    const text = [headers.join('\t'), ...rows].join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  // X 轴数据点多时自动减少刻度标签，避免堆叠
  const xCount = data.xLabels.length;
  const xInterval = xCount <= 20 ? 0 : xCount <= 50 ? Math.ceil(xCount / 20) - 1 : Math.ceil(xCount / 15) - 1;
  // 数据点超多时图表适当增高，保证可读性
  const chartHeight = Math.max(360, Math.min(xCount * 4, 600));

  return (
    <div className="space-y-4">
      {/* Chart area */}
      <div
        ref={chartRef}
        className="rounded-2xl bg-surface-900/60 border border-surface-800 p-4 w-full overflow-hidden"
      >
        <ResponsiveContainer width="100%" height={chartHeight} minWidth={0}>
          <ChartComponent data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: xInterval > 0 ? 20 : 0 }}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#44403c" strokeOpacity={0.5} />
            )}
            <XAxis
              dataKey="x"
              interval={xInterval}
              tick={{ fill: '#78716c', fontSize: xCount > 30 ? 10 : 12, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: '#44403c' }}
              tickLine={false}
              angle={xCount > 20 ? -35 : 0}
              textAnchor={xCount > 20 ? 'end' : 'middle'}
              height={xCount > 20 ? 48 : 30}
            />
            <YAxis
              tick={{ fill: '#78716c', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '12px',
                fontFamily: 'DM Sans',
                fontSize: '13px',
                color: '#a8a29e',
              }}
            />
            {visibleDatasets.map(ds =>
              chartType === 'area' ? (
                <Area
                  key={ds.name}
                  type={smooth ? 'monotone' : 'linear'}
                  dataKey={ds.name}
                  stroke={ds.color}
                  strokeWidth={2}
                  fill={ds.color}
                  fillOpacity={0.1}
                  dot={showDots ? { r: 4, fill: ds.color, strokeWidth: 0 } : false}
                  activeDot={{ r: 6, fill: ds.color, strokeWidth: 2, stroke: '#1c1917' }}
                  connectNulls={false}
                />
              ) : (
                <Line
                  key={ds.name}
                  type={smooth ? 'monotone' : 'linear'}
                  dataKey={ds.name}
                  stroke={ds.color}
                  strokeWidth={2}
                  dot={showDots ? { r: 4, fill: ds.color, strokeWidth: 0 } : false}
                  activeDot={{ r: 6, fill: ds.color, strokeWidth: 2, stroke: '#1c1917' }}
                  connectNulls={false}
                />
              )
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-surface-600 mr-1 font-mono">导出：</span>
        <button
          onClick={handleExportPNG}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 text-xs font-medium transition-all border border-surface-700"
        >
          <Download size={12} />
          PNG
        </button>
        <button
          onClick={handleExportSVG}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 text-xs font-medium transition-all border border-surface-700"
        >
          <Download size={12} />
          SVG
        </button>
        <button
          onClick={handleCopyData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 hover:text-surface-100 text-xs font-medium transition-all border border-surface-700"
        >
          {copied ? <Check size={12} className="text-brand-400" /> : <Copy size={12} />}
          {copied ? '已复制' : '复制数据'}
        </button>
      </div>

      {/* Data preview */}
      <div className="rounded-xl border border-surface-800 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-surface-800 bg-surface-900/60 flex items-center justify-between">
          <p className="text-xs font-mono text-surface-500 uppercase tracking-widest">
            数据预览
          </p>
          <div className="flex items-center gap-3 text-xs font-mono text-surface-600">
            <span><span className="text-brand-500">{data.xLabels.length}</span> 个 X 轴点</span>
            <span><span className="text-surface-400">{data.datasets.length}</span> 条 Y 轴系列</span>
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-56">
          <table className="w-full text-xs font-mono">
            <thead className="sticky top-0 bg-surface-900">
              <tr>
                <th className="text-left px-4 py-2 text-brand-500 font-medium border-b border-surface-800">X轴</th>
                {data.datasets.map(ds => (
                  <th
                    key={ds.name}
                    className="text-left px-4 py-2 font-medium border-b border-surface-800"
                    style={{ color: ds.color }}
                  >
                    {ds.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.xLabels.map((label, i) => (
                <tr key={i} className="hover:bg-surface-800/40 transition-colors">
                  <td className="px-4 py-1.5 text-surface-300 border-b border-surface-800/50">{label}</td>
                  {data.datasets.map(ds => (
                    <td key={ds.name} className="px-4 py-1.5 text-surface-400 border-b border-surface-800/50">
                      {ds.data[i] !== null ? ds.data[i]?.toLocaleString() : <span className="text-surface-700">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
