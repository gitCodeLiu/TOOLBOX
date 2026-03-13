import * as XLSX from 'xlsx';

export interface ChartDataset {
  name: string;
  data: (number | null)[];
  color?: string;
}

export interface ParsedChartData {
  xLabels: string[];
  datasets: ChartDataset[];
  rawHeaders: string[];
}

const DEFAULT_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
  '#14b8a6', '#a3e635', '#fb923c', '#a78bfa',
];

/**
 * Excel 格式约定：
 *   第 1 行（表头）：第一列为 X 轴列名（可任意填写），其余列为 Y 轴系列名称
 *   第 2 行起（数据行）：第一列为 X 轴标签值，其余列为对应系列的数值
 *
 * 示例：
 *   | 日期 | 销售额 | 利润 |
 *   | 1月  |  120  |  30  |
 *   | 2月  |  150  |  45  |
 */
export function parseExcelFile(file: File): Promise<ParsedChartData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows: (string | number | null)[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: null,
        }) as (string | number | null)[][];

        // 过滤掉完全为空的行
        const nonEmptyRows = rows.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));

        if (nonEmptyRows.length < 2) {
          reject(new Error('Excel 文件至少需要一行表头 + 一行数据（第一列为 X 轴，其余列为 Y 轴系列）'));
          return;
        }

        const headerRow = nonEmptyRows[0];

        // 第一列是 X 轴列名（忽略），其余列是 Y 轴系列名
        const seriesNames: string[] = [];
        for (let col = 1; col < headerRow.length; col++) {
          const cell = headerRow[col];
          seriesNames.push(cell !== null && cell !== undefined && cell !== '' ? String(cell) : `系列 ${col}`);
        }

        if (seriesNames.length === 0) {
          reject(new Error('未找到 Y 轴系列（表头第二列起应填写系列名称）'));
          return;
        }

        // 第 2 行起是数据行：第一列为 X 轴标签，其余列为数值
        const xLabels: string[] = [];
        const seriesData: (number | null)[][] = seriesNames.map(() => []);

        for (let row = 1; row < nonEmptyRows.length; row++) {
          const dataRow = nonEmptyRows[row];
          // X 轴标签
          const xCell = dataRow[0];
          xLabels.push(xCell !== null && xCell !== undefined && xCell !== '' ? String(xCell) : `${row}`);

          // 各 Y 轴系列的值
          for (let col = 0; col < seriesNames.length; col++) {
            const val = dataRow[col + 1];
            if (val === null || val === undefined || val === '') {
              seriesData[col].push(null);
            } else {
              const num = Number(val);
              seriesData[col].push(isNaN(num) ? null : num);
            }
          }
        }

        if (xLabels.length === 0) {
          reject(new Error('未找到有效的数据行（第二行起应包含 X 轴标签和数值）'));
          return;
        }

        const datasets: ChartDataset[] = seriesNames.map((name, idx) => ({
          name,
          data: seriesData[idx],
          color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
        }));

        resolve({ xLabels, datasets, rawHeaders: seriesNames });
      } catch (err) {
        reject(new Error('解析 Excel 文件失败：' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsArrayBuffer(file);
  });
}
