import type { ChartDataset } from '../../utils/excelParser';
import type { ProcessingOptions } from '../../utils/dataProcessor';
import { Eye, EyeOff, RefreshCw, Info } from 'lucide-react';

interface ChartControlsProps {
  datasets: ChartDataset[];
  visibleSeries: Set<string>;
  onToggleSeries: (name: string) => void;
  onColorChange: (name: string, color: string) => void;
  chartType: 'line' | 'area';
  onChartTypeChange: (type: 'line' | 'area') => void;
  showDots: boolean;
  onShowDotsChange: (v: boolean) => void;
  smooth: boolean;
  onSmoothChange: (v: boolean) => void;
  showGrid: boolean;
  onShowGridChange: (v: boolean) => void;
  processing: ProcessingOptions;
  onProcessingChange: (key: keyof ProcessingOptions, value: boolean) => void;
  onReset: () => void;
}

interface ToggleRowProps {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  badge?: string;
}

function ToggleRow({ label, hint, value, onChange, badge }: ToggleRowProps) {
  return (
    <label className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-900/60 border border-surface-800 cursor-pointer hover:border-surface-700 transition-all group">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-surface-300 truncate">{label}</span>
        {badge && (
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-400 border border-brand-500/20 shrink-0">
            {badge}
          </span>
        )}
        {hint && (
          <span className="relative shrink-0" title={hint}>
            <Info size={12} className="text-surface-600 group-hover:text-surface-400 transition-colors" />
          </span>
        )}
      </div>
      <div
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ml-2 ${
          value ? 'bg-brand-500' : 'bg-surface-700'
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
            value ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
    </label>
  );
}

export default function ChartControls({
  datasets,
  visibleSeries,
  onToggleSeries,
  onColorChange,
  chartType,
  onChartTypeChange,
  showDots,
  onShowDotsChange,
  smooth,
  onSmoothChange,
  showGrid,
  onShowGridChange,
  processing,
  onProcessingChange,
  onReset,
}: ChartControlsProps) {
  const anyProcessing = processing.aggregate || processing.sort || processing.cumulative;

  return (
    <div className="space-y-5">

      {/* ── 数据处理 ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-surface-500 uppercase tracking-widest">数据处理</p>
          {anyProcessing && (
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-brand-500/15 text-brand-400 border border-brand-500/20">
              处理中
            </span>
          )}
        </div>

        <div className="space-y-2">
          <ToggleRow
            label="X 轴聚合"
            hint="将相同 X 轴标签的行合并，重复项数值求和"
            badge="步骤 1"
            value={processing.aggregate}
            onChange={v => onProcessingChange('aggregate', v)}
          />
          <ToggleRow
            label="X 轴排序"
            hint="按 X 轴标签升序排列（支持数字、月份等格式）"
            badge="步骤 2"
            value={processing.sort}
            onChange={v => onProcessingChange('sort', v)}
          />
          <ToggleRow
            label="累加求和"
            hint="每个数据点 = 自身值 + 前面所有点之和（Running Total）"
            badge="步骤 3"
            value={processing.cumulative}
            onChange={v => onProcessingChange('cumulative', v)}
          />
        </div>

        {/* 执行顺序说明 */}
        {anyProcessing && (
          <div className="mt-3 p-3 rounded-lg bg-surface-950/60 border border-surface-800/80">
            <p className="text-xs text-surface-600 font-mono mb-1.5">执行顺序</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: 'aggregate', label: '聚合' },
                { key: 'sort', label: '排序' },
                { key: 'cumulative', label: '累加' },
              ].map((step, idx, arr) => {
                const active = processing[step.key as keyof ProcessingOptions];
                return (
                  <div key={step.key} className="flex items-center gap-1.5">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      active
                        ? 'bg-brand-500/20 text-brand-400'
                        : 'bg-surface-800 text-surface-600 line-through'
                    }`}>
                      {step.label}
                    </span>
                    {idx < arr.length - 1 && (
                      <span className="text-surface-700 text-xs">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 分隔线 */}
      <div className="border-t border-surface-800" />

      {/* ── Y 轴系列 ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-surface-500 uppercase tracking-widest">Y 轴系列</p>
          <span className="text-xs font-mono text-surface-600">{datasets.length} 条</span>
        </div>
        <div className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: '280px' }}>
          {datasets.map(ds => {
            const visible = visibleSeries.has(ds.name);
            return (
              <div
                key={ds.name}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                  visible ? 'border-surface-700 bg-surface-800/60' : 'border-surface-800 bg-surface-900/40 opacity-50'
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className="w-5 h-5 rounded-full cursor-pointer ring-2 ring-surface-600 hover:ring-surface-400 transition-all"
                    style={{ backgroundColor: ds.color }}
                  />
                  <input
                    type="color"
                    value={ds.color}
                    onChange={e => onColorChange(ds.name, e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    title="更改颜色"
                  />
                </div>
                <span className="flex-1 text-sm text-surface-200 truncate font-medium">{ds.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-surface-600 font-mono">{ds.data.filter(v => v !== null).length}项</span>
                  <button
                    onClick={() => onToggleSeries(ds.name)}
                    className={`p-1 rounded-md transition-colors ${
                      visible
                        ? 'text-surface-300 hover:text-surface-100 hover:bg-surface-700'
                        : 'text-surface-600 hover:text-surface-400 hover:bg-surface-800'
                    }`}
                    title={visible ? '隐藏' : '显示'}
                  >
                    {visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 分隔线 */}
      <div className="border-t border-surface-800" />

      {/* ── 图表类型 ── */}
      <div>
        <p className="text-xs font-mono text-surface-500 uppercase tracking-widest mb-3">图表类型</p>
        <div className="grid grid-cols-2 gap-2">
          {(['line', 'area'] as const).map(type => (
            <button
              key={type}
              onClick={() => onChartTypeChange(type)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                chartType === type
                  ? 'bg-brand-500 text-surface-950'
                  : 'bg-surface-800 text-surface-400 hover:text-surface-200'
              }`}
            >
              {type === 'line' ? '📈 折线图' : '📊 面积图'}
            </button>
          ))}
        </div>
      </div>

      {/* ── 显示选项 ── */}
      <div>
        <p className="text-xs font-mono text-surface-500 uppercase tracking-widest mb-3">显示选项</p>
        <div className="space-y-2">
          <ToggleRow label="显示数据点" value={showDots} onChange={onShowDotsChange} />
          <ToggleRow label="曲线平滑" value={smooth} onChange={onSmoothChange} />
          <ToggleRow label="显示网格" value={showGrid} onChange={onShowGridChange} />
        </div>
      </div>

      {/* ── 重置 ── */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-surface-800 text-surface-500 hover:text-surface-300 hover:border-surface-700 text-sm transition-all"
      >
        <RefreshCw size={14} />
        重新上传文件
      </button>
    </div>
  );
}
