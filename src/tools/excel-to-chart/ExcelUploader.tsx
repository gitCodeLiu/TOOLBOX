import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../../utils/excelParser';
import type { ParsedChartData } from '../../utils/excelParser';

interface Props {
  onDataParsed: (data: ParsedChartData) => void;
}

export default function ExcelUploader({ onDataParsed }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
      setError('请上传 .xlsx、.xls 或 .csv 格式的文件');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const data = await parseExcelFile(file);
      onDataParsed(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-brand-400 bg-brand-500/10'
            : 'border-surface-700 bg-surface-900/40 hover:border-surface-600 hover:bg-surface-900/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />

        {isLoading ? (
          <>
            <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm">正在解析文件...</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center">
              {isDragging
                ? <Upload size={24} className="text-brand-400" />
                : <FileSpreadsheet size={24} className="text-surface-400" />
              }
            </div>
            <div className="text-center">
              <p className="text-surface-200 font-medium mb-1">
                {isDragging ? '松开鼠标上传文件' : '拖拽或点击上传 Excel 文件'}
              </p>
              <p className="text-surface-500 text-sm">支持 .xlsx · .xls · .csv</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Format hint */}
      <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-800">
        <p className="text-xs text-surface-500 font-mono mb-3 uppercase tracking-widest">Excel 格式说明</p>

        {/* 格式示意表格 */}
        <div className="overflow-x-auto rounded-lg border border-surface-700">
          <table className="text-xs font-mono w-full">
            <thead>
              <tr className="bg-surface-800">
                <th className="px-3 py-2 text-left text-surface-500 font-medium border-r border-surface-700 whitespace-nowrap">
                  X 轴列 <span className="text-brand-500">（第 1 列）</span>
                </th>
                <th className="px-3 py-2 text-left text-surface-400 font-medium border-r border-surface-700 whitespace-nowrap">
                  系列一 <span className="text-surface-500">（第 2 列）</span>
                </th>
                <th className="px-3 py-2 text-left text-surface-400 font-medium whitespace-nowrap">
                  系列二 <span className="text-surface-500">（第 3 列）</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1月', '120', '30'],
                ['2月', '150', '45'],
                ['3月', '130', '38'],
              ].map(([x, y1, y2]) => (
                <tr key={x} className="border-t border-surface-700/50">
                  <td className="px-3 py-1.5 text-brand-400 border-r border-surface-700">{x}</td>
                  <td className="px-3 py-1.5 text-surface-300 border-r border-surface-700">{y1}</td>
                  <td className="px-3 py-1.5 text-surface-300">{y2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-xs text-surface-600 flex items-start gap-1.5">
            <span className="text-brand-500 shrink-0">•</span>
            <span><span className="text-brand-400">第 1 行</span>为表头：第一列是 X 轴列名，其余列是各 Y 轴系列名称</span>
          </p>
          <p className="text-xs text-surface-600 flex items-start gap-1.5">
            <span className="text-surface-500 shrink-0">•</span>
            <span><span className="text-surface-400">第 2 行起</span>为数据：第一列是 X 轴标签，其余列填写对应数值</span>
          </p>
        </div>
      </div>
    </div>
  );
}
