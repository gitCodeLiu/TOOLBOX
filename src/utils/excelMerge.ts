import * as XLSX from 'xlsx';
import type { ParsedExcelTable, TableCell } from './excelTableParser';

export type ConflictMode = 'keep-source' | 'use-enhance';

export interface MergeOptions {
  source: ParsedExcelTable;
  enhance: ParsedExcelTable;
  /** 源表用于关联的列名（1 或 2 列） */
  sourceKeyCols: [string] | [string, string];
  /** 增强表用于关联的列名（与源表列数一致） */
  enhanceKeyCols: [string] | [string, string];
  conflict: ConflictMode;
}

function keyPart(v: TableCell): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function compositeKey(parts: TableCell[]): string {
  return parts.map(keyPart).join('\u001f');
}

export interface MergeStats {
  matched: number;
  unmatchedSource: number;
  duplicateEnhanceKeys: number;
}

/**
 * 以源表为基准，按关联键合并增强表中的非键列，返回输出表头与行数据。
 */
export function mergeExcelTables(options: MergeOptions): {
  headers: string[];
  rows: Record<string, TableCell>[];
  stats: MergeStats;
} {
  const { source, enhance, sourceKeyCols, enhanceKeyCols, conflict } = options;

  const sk = sourceKeyCols;
  const ek = enhanceKeyCols;
  if (sk.length !== ek.length) {
    throw new Error('源表与增强表的关联字段数量必须一致');
  }

  for (const c of sk) {
    if (!source.headers.includes(c)) throw new Error(`源表中不存在列：${c}`);
  }
  for (const c of ek) {
    if (!enhance.headers.includes(c)) throw new Error(`增强表中不存在列：${c}`);
  }

  const enhanceKeySet = new Set(ek);

  // 增强表：同键多行时保留最后一行，并统计重复键
  const enhanceMap = new Map<string, Record<string, TableCell>>();
  let duplicateEnhanceKeys = 0;
  for (const row of enhance.rows) {
    const parts = ek.map(k => row[k] as TableCell);
    const key = compositeKey(parts);
    if (enhanceMap.has(key)) duplicateEnhanceKeys += 1;
    enhanceMap.set(key, row);
  }

  const extraHeaders: string[] = [];
  const seenExtra = new Set<string>();
  for (const h of enhance.headers) {
    if (enhanceKeySet.has(h)) continue;
    if (!source.headers.includes(h) && !seenExtra.has(h)) {
      seenExtra.add(h);
      extraHeaders.push(h);
    }
  }

  const outputHeaders = [...source.headers, ...extraHeaders];

  let matched = 0;
  let unmatchedSource = 0;
  const outRows: Record<string, TableCell>[] = [];

  for (const srcRow of source.rows) {
    const parts = sk.map(k => srcRow[k] as TableCell);
    const key = compositeKey(parts);
    const enhRow = enhanceMap.get(key);

    if (enhRow) matched++;
    else unmatchedSource++;

    const merged: Record<string, TableCell> = { ...srcRow };

    for (const h of extraHeaders) {
      merged[h] = enhRow ? (enhRow[h] ?? null) : null;
    }

    if (enhRow && conflict === 'use-enhance') {
      const ekList = ek as string[];
      for (const h of source.headers) {
        if (!enhance.headers.includes(h)) continue;
        if (ekList.includes(h)) continue;
        merged[h] = enhRow[h] ?? null;
      }
    }

    outRows.push(merged);
  }

  return {
    headers: outputHeaders,
    rows: outRows,
    stats: { matched, unmatchedSource, duplicateEnhanceKeys },
  };
}

export function buildWorkbookFromRows(
  headers: string[],
  rows: Record<string, TableCell>[],
  sheetName = '合并结果'
): XLSX.WorkBook {
  const aoa: TableCell[][] = [headers as TableCell[]];
  for (const row of rows) {
    aoa.push(headers.map(h => row[h] ?? null));
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31) || 'Sheet1');
  return wb;
}

export function downloadWorkbook(wb: XLSX.WorkBook, filename: string): void {
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}
