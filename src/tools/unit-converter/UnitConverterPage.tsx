// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';

type Category = 'length' | 'weight' | 'area' | 'volume' | 'temperature' | 'data' | 'speed';

interface Unit {
  label: string;
  factor?: number;
  toBase?: (v: number) => number;
  fromBase?: (v: number) => number;
}

const UNITS: Record<Category, { label: string; units: Record<string, Unit> }> = {
  length: {
    label: '长度',
    units: {
      mm: { label: '毫米 (mm)', factor: 0.001 },
      cm: { label: '厘米 (cm)', factor: 0.01 },
      m: { label: '米 (m)', factor: 1 },
      km: { label: '千米 (km)', factor: 1000 },
      inch: { label: '英寸 (in)', factor: 0.0254 },
      foot: { label: '英尺 (ft)', factor: 0.3048 },
      yard: { label: '码 (yd)', factor: 0.9144 },
      mile: { label: '英里 (mi)', factor: 1609.344 },
      nm: { label: '海里 (nm)', factor: 1852 },
    },
  },
  weight: {
    label: '重量',
    units: {
      mg: { label: '毫克 (mg)', factor: 0.000001 },
      g: { label: '克 (g)', factor: 0.001 },
      kg: { label: '千克 (kg)', factor: 1 },
      t: { label: '吨 (t)', factor: 1000 },
      lb: { label: '磅 (lb)', factor: 0.453592 },
      oz: { label: '盎司 (oz)', factor: 0.0283495 },
      jin: { label: '斤 (市斤)', factor: 0.5 },
    },
  },
  area: {
    label: '面积',
    units: {
      mm2: { label: '平方毫米 (mm²)', factor: 0.000001 },
      cm2: { label: '平方厘米 (cm²)', factor: 0.0001 },
      m2: { label: '平方米 (m²)', factor: 1 },
      km2: { label: '平方千米 (km²)', factor: 1000000 },
      hectare: { label: '公顷 (ha)', factor: 10000 },
      acre: { label: '英亩 (acre)', factor: 4046.86 },
      mu: { label: '亩', factor: 666.667 },
    },
  },
  volume: {
    label: '体积',
    units: {
      ml: { label: '毫升 (mL)', factor: 0.001 },
      l: { label: '升 (L)', factor: 1 },
      m3: { label: '立方米 (m³)', factor: 1000 },
      cup: { label: '杯 (cup)', factor: 0.236588 },
      pint: { label: '品脱 (pt)', factor: 0.473176 },
      gallon: { label: '加仑 (gal)', factor: 3.78541 },
    },
  },
  temperature: {
    label: '温度',
    units: {
      c: { label: '摄氏度 (°C)', toBase: v => v, fromBase: v => v },
      f: { label: '华氏度 (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      k: { label: '开尔文 (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    },
  },
  data: {
    label: '数据存储',
    units: {
      bit: { label: '比特 (bit)', factor: 1 },
      byte: { label: '字节 (B)', factor: 8 },
      kb: { label: '千字节 (KB)', factor: 8192 },
      mb: { label: '兆字节 (MB)', factor: 8388608 },
      gb: { label: '吉字节 (GB)', factor: 8589934592 },
      tb: { label: '太字节 (TB)', factor: 8796093022208 },
    },
  },
  speed: {
    label: '速度',
    units: {
      ms: { label: '米/秒 (m/s)', factor: 1 },
      kmh: { label: '千米/时 (km/h)', factor: 1 / 3.6 },
      mph: { label: '英里/时 (mph)', factor: 0.44704 },
      knot: { label: '节 (kn)', factor: 0.514444 },
    },
  },
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputVal, setInputVal] = useState('1');

  const catUnits = UNITS[category].units;
  const unitKeys = Object.keys(catUnits);

  const convert = (): string => {
    const num = parseFloat(inputVal);
    if (isNaN(num)) return '—';
    const from = catUnits[fromUnit];
    const to = catUnits[toUnit];

    let baseVal: number;
    if (from.toBase) {
      baseVal = from.toBase(num);
    } else {
      baseVal = num * (from.factor ?? 1);
    }

    let result: number;
    if (to.fromBase) {
      result = to.fromBase(baseVal);
    } else {
      result = baseVal / (to.factor ?? 1);
    }

    if (Math.abs(result) >= 1e9 || (Math.abs(result) < 1e-4 && result !== 0)) {
      return result.toExponential(6);
    }
    return parseFloat(result.toPrecision(10)).toString();
  };

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    const keys = Object.keys(UNITS[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
    setInputVal('1');
  };

  const allResults = unitKeys.map(key => {
    const num = parseFloat(inputVal);
    if (isNaN(num)) return { key, value: '—' };
    const from = catUnits[fromUnit];
    const to = catUnits[key];
    let baseVal = from.toBase ? from.toBase(num) : num * (from.factor ?? 1);
    let result = to.fromBase ? to.fromBase(baseVal) : baseVal / (to.factor ?? 1);
    if (Math.abs(result) >= 1e9 || (Math.abs(result) < 1e-6 && result !== 0)) {
      return { key, value: result.toExponential(4) };
    }
    return { key, value: parseFloat(result.toPrecision(8)).toString() };
  });

  return (
    <ToolPageLayout icon="📏" title="单位换算" description="长度、重量、面积、体积、温度、数据存储、速度等多类单位换算">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(UNITS) as Category[]).map(cat => (
          <button key={cat} onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${category === cat ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {UNITS[cat].label}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="flex flex-wrap items-end gap-3 mb-6 p-5 rounded-xl bg-surface-900/60 border border-surface-800">
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">数值</label>
          <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
            className="w-40 px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-surface-100 font-mono text-lg focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">从</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-surface-300 text-sm focus:outline-none focus:border-brand-500">
            {unitKeys.map(k => <option key={k} value={k}>{catUnits[k].label}</option>)}
          </select>
        </div>
        <div className="text-surface-500 text-xl pb-1.5">→</div>
        <div>
          <label className="text-xs text-surface-500 block mb-1.5">到</label>
          <select value={toUnit} onChange={e => setToUnit(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-surface-300 text-sm focus:outline-none focus:border-brand-500">
            {unitKeys.map(k => <option key={k} value={k}>{catUnits[k].label}</option>)}
          </select>
        </div>
        <div className="px-5 py-2.5 rounded-xl bg-brand-500/15 border border-brand-500/30">
          <span className="text-xl font-mono font-bold text-brand-400">{convert()}</span>
          <span className="text-sm text-surface-400 ml-2">{catUnits[toUnit]?.label}</span>
        </div>
      </div>

      {/* All conversions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {allResults.map(({ key, value }) => (
          <div key={key} className={`p-3 rounded-xl border transition-all ${key === fromUnit ? 'bg-brand-500/10 border-brand-500/30' : 'bg-surface-900/40 border-surface-800'}`}>
            <p className="text-xs text-surface-500 mb-1">{catUnits[key].label}</p>
            <p className="text-sm font-mono text-surface-100 font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
