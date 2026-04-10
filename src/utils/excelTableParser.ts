import * as XLSX from 'xlsx';

export type TableCell = string | number | null;

export interface ParsedExcelTable {
  sheetName: string;
  headers: string[];
  rows: Record<string, TableCell>[];
}

function normalizeHeaders(raw: (string | number | null)[]): string[] {
  const used = new Set<string>();
  return raw.map((cell, idx) => {
    const base =
      cell !== null && cell !== undefined && String(cell).trim() !== ''
        ? String(cell).trim()
        : `列${idx + 1}`;
    let name = base;
    let n = 2;
    while (used.has(name)) {
      name = `${base}_${n++}`;
    }
    used.add(name);
    return name;
  });
}

function cellValue(cell: unknown): TableCell {
  if (cell === null || cell === undefined || cell === '') return null;
  if (typeof cell === 'number' && !Number.isNaN(cell)) return cell;
  return String(cell);
}

/**
 * 将首个工作表解析为「首行表头 + 数据行」结构（跳过全空行）。
 */
export function parseExcelTableFromArrayBuffer(data: ArrayBuffer, fileLabel = '文件'): ParsedExcelTable {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error(`${fileLabel}中未找到工作表`);
  }
  const sheet = workbook.Sheets[sheetName];
  const rows: (string | number | null)[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  }) as (string | number | null)[][];

  const nonEmpty = rows.filter(r => r.some(c => c !== null && c !== undefined && c !== ''));
  if (nonEmpty.length < 1) {
    throw new Error(`${fileLabel}至少需要一行表头`);
  }

  const headers = normalizeHeaders(nonEmpty[0]);
  const dataRows: Record<string, TableCell>[] = [];

  for (let i = 1; i < nonEmpty.length; i++) {
    const line = nonEmpty[i];
    const row: Record<string, TableCell> = {};
    headers.forEach((h, col) => {
      row[h] = cellValue(line[col]);
    });
    dataRows.push(row);
  }

  return { sheetName, headers, rows: dataRows };
}

export function parseExcelTableFile(file: File): Promise<ParsedExcelTable> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const buf = e.target?.result as ArrayBuffer;
        resolve(parseExcelTableFromArrayBuffer(buf, file.name));
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsArrayBuffer(file);
  });
}
