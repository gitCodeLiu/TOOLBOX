import { useState, useCallback, useMemo } from 'react';
import type { ParsedChartData } from '../../utils/excelParser';
import { processChartData, type ProcessingOptions } from '../../utils/dataProcessor';
import ExcelUploader from './ExcelUploader';
import ChartView from './ChartView';
import ChartControls from './ChartControls';

export default function ExcelToChartPage() {
  const [chartData, setChartData] = useState<ParsedChartData | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(new Set());
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [showDots, setShowDots] = useState(true);
  const [smooth, setSmooth] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [processing, setProcessing] = useState<ProcessingOptions>({
    aggregate: false,
    sort: false,
    cumulative: false,
  });

  const handleDataParsed = useCallback((data: ParsedChartData) => {
    setChartData(data);
    setVisibleSeries(new Set(data.datasets.map(d => d.name)));
  }, []);

  const handleToggleSeries = useCallback((name: string) => {
    setVisibleSeries(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size <= 1) return prev;
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const handleColorChange = useCallback((name: string, color: string) => {
    setChartData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        datasets: prev.datasets.map(ds =>
          ds.name === name ? { ...ds, color } : ds
        ),
      };
    });
  }, []);

  const handleProcessingChange = useCallback((key: keyof ProcessingOptions, value: boolean) => {
    setProcessing(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = () => {
    setChartData(null);
    setVisibleSeries(new Set());
    setProcessing({ aggregate: false, sort: false, cumulative: false });
  };

  // 对原始数据应用处理选项，得到最终用于渲染的数据
  const displayData = useMemo(() => {
    if (!chartData) return null;
    const anyEnabled = processing.aggregate || processing.sort || processing.cumulative;
    if (!anyEnabled) return chartData;
    return processChartData(chartData, processing);
  }, [chartData, processing]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">📈</div>
          <div>
            <h1
              className="text-2xl font-bold text-surface-50"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Excel 转折线图
            </h1>
            <p className="text-surface-500 text-sm mt-0.5">
              上传 Excel 文件，即刻生成可交互折线图
            </p>
          </div>
        </div>
      </div>

      {!chartData ? (
        <div className="max-w-2xl opacity-0 animate-slide-up" style={{ animationFillMode: 'forwards' }}>
          <ExcelUploader onDataParsed={handleDataParsed} />
        </div>
      ) : (
        <div
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 opacity-0 animate-scale-in min-w-0"
          style={{ animationFillMode: 'forwards' }}
        >
          {/* Controls sidebar */}
          <div
            className="rounded-2xl border border-surface-800 bg-surface-900/60 p-5 lg:sticky lg:top-24 min-w-0 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 7rem)' }}
          >
            <ChartControls
              datasets={chartData.datasets}
              visibleSeries={visibleSeries}
              onToggleSeries={handleToggleSeries}
              onColorChange={handleColorChange}
              chartType={chartType}
              onChartTypeChange={setChartType}
              showDots={showDots}
              onShowDotsChange={setShowDots}
              smooth={smooth}
              onSmoothChange={setSmooth}
              showGrid={showGrid}
              onShowGridChange={setShowGrid}
              processing={processing}
              onProcessingChange={handleProcessingChange}
              onReset={handleReset}
            />
          </div>

          {/* Chart */}
          <div className="min-w-0 overflow-hidden">
            <ChartView
              data={displayData!}
              visibleSeries={visibleSeries}
              chartType={chartType}
              showDots={showDots}
              smooth={smooth}
              showGrid={showGrid}
            />
          </div>
        </div>
      )}
    </div>
  );
}
