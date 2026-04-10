import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Download, FileSpreadsheet, Link2, Upload } from 'lucide-react';
import ToolPageLayout from '../../components/ToolPageLayout';
import type { ParsedExcelTable } from '../../utils/excelTableParser';
import { parseExcelTableFile } from '../../utils/excelTableParser';
import {
  buildWorkbookFromRows,
  downloadWorkbook,
  mergeExcelTables,
  type ConflictMode,
} from '../../utils/excelMerge';

type KeyCount = 1 | 2;

const ACCEPT = '.xlsx,.xls,.csv';

function FileDropZone({
  label,
  hint,
  file,
  onFile,
  busy,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFile: (f: File) => void;
  busy: boolean;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={e => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      className={`rounded-xl border-2 border-dashed p-5 transition-all ${
        drag ? 'border-brand-400 bg-brand-500/10' : 'border-surface-700 bg-surface-900/50 hover:border-surface-600'
      }`}
    >
      <label className="flex cursor-pointer flex-col items-center gap-2">
        <input
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={busy}
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = '';
          }}
        />
        {busy ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-800">
            <Upload size={20} className="text-surface-400" />
          </div>
        )}
        <span className="text-sm font-medium text-surface-200">{label}</span>
        <span className="text-center text-xs text-surface-500">{hint}</span>
        {file && (
          <span className="mt-1 flex items-center gap-1.5 text-xs text-brand-400">
            <FileSpreadsheet size={14} />
            {file.name}
          </span>
        )}
      </label>
    </div>
  );
}

export default function ExcelMergePage() {
  const [sourceTable, setSourceTable] = useState<ParsedExcelTable | null>(null);
  const [enhanceTable, setEnhanceTable] = useState<ParsedExcelTable | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [enhanceFile, setEnhanceFile] = useState<File | null>(null);
  const [loadingSource, setLoadingSource] = useState(false);
  const [loadingEnhance, setLoadingEnhance] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const [keyCount, setKeyCount] = useState<KeyCount>(1);
  const [sk1, setSk1] = useState('');
  const [sk2, setSk2] = useState('');
  const [ek1, setEk1] = useState('');
  const [ek2, setEk2] = useState('');
  const [conflict, setConflict] = useState<ConflictMode>('keep-source');

  const [mergeError, setMergeError] = useState<string | null>(null);
  const [lastStats, setLastStats] = useState<{
    matched: number;
    unmatchedSource: number;
    duplicateEnhanceKeys: number;
  } | null>(null);

  useEffect(() => {
    if (sk2 && sk2 === sk1) setSk2('');
  }, [sk1, sk2]);
  useEffect(() => {
    if (ek2 && ek2 === ek1) setEk2('');
  }, [ek1, ek2]);

  const extOk = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls', 'csv'].includes(ext ?? '');
  };

  const loadSource = useCallback(async (file: File) => {
    if (!extOk(file.name)) {
      setParseError('源表请上传 .xlsx、.xls 或 .csv');
      return;
    }
    setParseError(null);
    setLoadingSource(true);
    try {
      const t = await parseExcelTableFile(file);
      setSourceTable(t);
      setSourceFile(file);
      setSk1('');
      setSk2('');
      setMergeError(null);
      setLastStats(null);
    } catch (e) {
      setParseError((e as Error).message);
      setSourceTable(null);
      setSourceFile(null);
    } finally {
      setLoadingSource(false);
    }
  }, []);

  const loadEnhance = useCallback(async (file: File) => {
    if (!extOk(file.name)) {
      setParseError('增强表请上传 .xlsx、.xls 或 .csv');
      return;
    }
    setParseError(null);
    setLoadingEnhance(true);
    try {
      const t = await parseExcelTableFile(file);
      setEnhanceTable(t);
      setEnhanceFile(file);
      setEk1('');
      setEk2('');
      setMergeError(null);
      setLastStats(null);
    } catch (e) {
      setParseError((e as Error).message);
      setEnhanceTable(null);
      setEnhanceFile(null);
    } finally {
      setLoadingEnhance(false);
    }
  }, []);

  const canMerge = sourceTable && enhanceTable;

  const handleMergeDownload = () => {
    setMergeError(null);
    if (!sourceTable || !enhanceTable) return;

    try {
      const sourceKeyCols =
        keyCount === 1 ? ([sk1] as [string]) : ([sk1, sk2] as [string, string]);
      const enhanceKeyCols =
        keyCount === 1 ? ([ek1] as [string]) : ([ek1, ek2] as [string, string]);

      if (keyCount === 1) {
        if (!sk1 || !ek1) {
          setMergeError('请选择源表与增强表各自的关联字段');
          return;
        }
      } else {
        if (!sk1 || !sk2 || !ek1 || !ek2) {
          setMergeError('双字段关联时，请完整选择两端的两个字段');
          return;
        }
        if (sk1 === sk2) {
          setMergeError('源表两个关联字段不能相同');
          return;
        }
        if (ek1 === ek2) {
          setMergeError('增强表两个关联字段不能相同');
          return;
        }
      }

      const { headers, rows, stats } = mergeExcelTables({
        source: sourceTable,
        enhance: enhanceTable,
        sourceKeyCols,
        enhanceKeyCols,
        conflict,
      });

      const wb = buildWorkbookFromRows(headers, rows);
      const base =
        sourceFile?.name.replace(/\.(xlsx|xls|csv)$/i, '') ?? 'merged';
      downloadWorkbook(wb, `${base}-合并.xlsx`);
      setLastStats(stats);
    } catch (e) {
      setMergeError((e as Error).message);
    }
  };

  const selectCls =
    'w-full rounded-lg border border-surface-800 bg-surface-950 px-3 py-2 text-sm text-surface-100 focus:border-brand-500 focus:outline-none';

  const headerOptions = useMemo(
    () => (h: string[]) =>
      h.map(name => (
        <option key={name} value={name}>
          {name}
        </option>
      )),
    []
  );

  return (
    <ToolPageLayout
      icon="🔗"
      title="Excel 关联合并"
      description="以源表为基础，按 1～2 个关联字段匹配增强表，将匹配行的列补充或覆盖后导出为新 Excel"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FileDropZone
            label="① 源表（主表）"
            hint="拖拽或点击上传，合并结果以本表行数与列顺序为基础"
            file={sourceFile}
            onFile={loadSource}
            busy={loadingSource}
          />
          <FileDropZone
            label="② 增强表（补充数据）"
            hint="用于按关联键查找并合并进来的数据"
            file={enhanceFile}
            onFile={loadEnhance}
            busy={loadingEnhance}
          />
        </div>

        {parseError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">{parseError}</p>
          </div>
        )}

        {canMerge && (
          <div className="space-y-5 rounded-2xl border border-surface-800 bg-surface-900/40 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Link2 size={18} className="text-brand-400" />
              <span className="text-sm font-medium text-surface-200">关联方式</span>
              <div className="flex gap-2">
                {([1, 2] as const).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setKeyCount(n);
                      setMergeError(null);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      keyCount === n
                        ? 'bg-brand-500 text-surface-950'
                        : 'border border-surface-800 bg-surface-900 text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    {n === 1 ? '单字段关联' : '双字段关联'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-surface-500">
                  源表字段
                </p>
                <select
                  className={selectCls}
                  value={sk1}
                  onChange={e => setSk1(e.target.value)}
                >
                  <option value="">— 关联字段 1 —</option>
                  {headerOptions(sourceTable.headers)}
                </select>
                {keyCount === 2 && (
                  <select
                    className={`${selectCls} mt-2`}
                    value={sk2}
                    onChange={e => setSk2(e.target.value)}
                  >
                    <option value="">— 关联字段 2 —</option>
                    {sourceTable.headers
                      .filter(h => h !== sk1)
                      .map(h => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-surface-500">
                  增强表字段
                </p>
                <select
                  className={selectCls}
                  value={ek1}
                  onChange={e => setEk1(e.target.value)}
                >
                  <option value="">— 关联字段 1 —</option>
                  {headerOptions(enhanceTable.headers)}
                </select>
                {keyCount === 2 && (
                  <select
                    className={`${selectCls} mt-2`}
                    value={ek2}
                    onChange={e => setEk2(e.target.value)}
                  >
                    <option value="">— 关联字段 2 —</option>
                    {enhanceTable.headers
                      .filter(h => h !== ek1)
                      .map(h => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-surface-400">
                当两表存在<span className="text-surface-200">同名列</span>（且非关联键）时：
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConflict('keep-source')}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    conflict === 'keep-source'
                      ? 'bg-surface-700 text-surface-100'
                      : 'border border-surface-800 text-surface-500 hover:text-surface-300'
                  }`}
                >
                  保留源表值
                </button>
                <button
                  type="button"
                  onClick={() => setConflict('use-enhance')}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    conflict === 'use-enhance'
                      ? 'bg-surface-700 text-surface-100'
                      : 'border border-surface-800 text-surface-500 hover:text-surface-300'
                  }`}
                >
                  用增强表覆盖
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleMergeDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-surface-950 transition-all hover:bg-brand-400"
              >
                <Download size={18} />
                合并并下载 Excel
              </button>
              {mergeError && (
                <span className="text-sm text-red-400">{mergeError}</span>
              )}
            </div>

            {lastStats && (
              <div className="rounded-xl border border-surface-800 bg-surface-950/80 px-4 py-3 text-xs text-surface-400">
                <span className="text-surface-300">上次导出：</span>
                匹配 {lastStats.matched} 行 · 源表未匹配 {lastStats.unmatchedSource} 行
                {lastStats.duplicateEnhanceKeys > 0 && (
                  <span className="text-amber-400/90">
                    {' '}
                    · 增强表重复键 {lastStats.duplicateEnhanceKeys} 条（已保留最后一条）
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-surface-800 bg-surface-900/30 p-4 text-xs leading-relaxed text-surface-500">
          <p className="mb-2 font-medium text-surface-400">说明</p>
          <ul className="list-inside list-disc space-y-1">
            <li>默认使用两个文件的<span className="text-surface-400">第一个工作表</span>，首行为表头。</li>
            <li>输出行数与源表一致；增强表中独有的列会追加在右侧；未匹配到增强行时，新增列为空。</li>
            <li>增强表中用于关联的列不会重复追加；同名列按上方选项处理。</li>
          </ul>
        </div>
      </div>
    </ToolPageLayout>
  );
}
