import type { ParsedChartData } from './excelParser';

export interface ProcessingOptions {
  aggregate: boolean;   // 按 X 轴聚合（合并重复标签，数值求和）
  sort: boolean;        // 按 X 轴排序
  cumulative: boolean;  // 累加（每个点 = 自身 + 前面所有点之和）
}

/**
 * 对解析后的图表数据依次执行：聚合 → 排序 → 累加
 * 每步可独立开关，顺序固定（聚合和排序先于累加）
 */
export function processChartData(
  data: ParsedChartData,
  options: ProcessingOptions,
): ParsedChartData {
  // 保持 datasets 颜色等信息不变，只处理 xLabels 和各系列 data
  let xLabels = [...data.xLabels];
  let seriesData = data.datasets.map(ds => [...ds.data]);

  // ── Step 1：按 X 轴聚合（合并相同标签，数值求和）──────────────────
  if (options.aggregate) {
    const ordered: string[] = [];                          // 保留首次出现顺序
    const indexMap = new Map<string, number>();            // label → 聚合行下标

    xLabels.forEach((label, rowIdx) => {
      if (!indexMap.has(label)) {
        indexMap.set(label, ordered.length);
        ordered.push(label);
      }
      const aggIdx = indexMap.get(label)!;
      seriesData.forEach((sd, sIdx) => {
        const val = data.datasets[sIdx].data[rowIdx];
        if (val !== null) {
          if (sd[aggIdx] === null || sd[aggIdx] === undefined) {
            sd[aggIdx] = val;
          } else {
            (sd[aggIdx] as number) += val;
          }
        }
      });
    });

    // 将聚合后的结果收缩到 ordered.length 行
    xLabels = ordered;
    seriesData = seriesData.map(sd => sd.slice(0, ordered.length));
  }

  // ── Step 2：按 X 轴排序 ────────────────────────────────────────────
  if (options.sort) {
    const indices = xLabels.map((_, i) => i);
    indices.sort((a, b) => smartCompare(xLabels[a], xLabels[b]));

    xLabels = indices.map(i => xLabels[i]);
    seriesData = seriesData.map(sd => indices.map(i => sd[i]));
  }

  // ── Step 3：累加（Running Total）──────────────────────────────────
  if (options.cumulative) {
    seriesData = seriesData.map(sd => {
      let acc = 0;
      return sd.map(val => {
        if (val !== null) {
          acc += val;
          return acc;
        }
        return null;
      });
    });
  }

  return {
    ...data,
    xLabels,
    datasets: data.datasets.map((ds, i) => ({
      ...ds,
      data: seriesData[i],
    })),
  };
}

/**
 * 智能比较：优先按前缀数字排序（支持 "1月"、"第2季度" 等格式），
 * 再按纯数字，最后按中文/字符串排序。
 */
function smartCompare(a: string, b: string): number {
  const numA = leadingNumber(a);
  const numB = leadingNumber(b);
  if (numA !== null && numB !== null) return numA - numB;

  const pureA = Number(a);
  const pureB = Number(b);
  if (!isNaN(pureA) && !isNaN(pureB)) return pureA - pureB;

  return a.localeCompare(b, 'zh-CN');
}

function leadingNumber(s: string): number | null {
  const m = s.match(/^(\d+)/);
  return m ? Number(m[1]) : null;
}
