// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';

type Category =
  | 'length'
  | 'weight'
  | 'area'
  | 'volume'
  | 'temperature'
  | 'data'
  | 'speed'
  | 'pressure'
  | 'energy'
  | 'power'
  | 'frequency'
  | 'angle'
  | 'time';

interface Unit {
  label: string;
  factor?: number;
  toBase?: (v: number) => number;
  fromBase?: (v: number) => number;
}

/** 角度类换算以弧度为基准 */
const RAD = Math.PI / 180;

const UNITS: Record<Category, { label: string; units: Record<string, Unit> }> = {
  length: {
    label: '长度',
    units: {
      um: { label: '微米 (µm)', factor: 1e-6 },
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
      stone: { label: '英石 (st)', factor: 6.35029 },
    },
  },
  area: {
    label: '面积',
    units: {
      mm2: { label: '平方毫米 (mm²)', factor: 0.000001 },
      cm2: { label: '平方厘米 (cm²)', factor: 0.0001 },
      m2: { label: '平方米 (m²)', factor: 1 },
      km2: { label: '平方千米 (km²)', factor: 1000000 },
      in2: { label: '平方英寸 (in²)', factor: 0.0254 ** 2 },
      ft2: { label: '平方英尺 (ft²)', factor: 0.3048 ** 2 },
      hectare: { label: '公顷 (ha)', factor: 10000 },
      acre: { label: '英亩 (acre)', factor: 4046.86 },
      mu: { label: '亩', factor: 666.667 },
      ping: { label: '坪', factor: 3.305785 },
    },
  },
  volume: {
    label: '体积',
    units: {
      ml: { label: '毫升 (mL)', factor: 0.001 },
      cm3: { label: '立方厘米 (cm³)', factor: 0.001 },
      l: { label: '升 (L)', factor: 1 },
      m3: { label: '立方米 (m³)', factor: 1000 },
      floz: { label: '液量盎司 US (fl oz)', factor: 0.0295735 },
      tbsp: { label: '汤匙 US (tbsp)', factor: 0.0147868 },
      tsp: { label: '茶匙 US (tsp)', factor: 0.00492892 },
      cup: { label: '杯 (cup)', factor: 0.236588 },
      pint: { label: '品脱 (pt)', factor: 0.473176 },
      gallon: { label: '加仑 US (gal)', factor: 3.78541 },
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
      kb: { label: 'KB (二进制 1024)', factor: 8192 },
      mb: { label: 'MB (二进制)', factor: 8388608 },
      gb: { label: 'GB (二进制)', factor: 8589934592 },
      tb: { label: 'TB (二进制)', factor: 8796093022208 },
      kbsi: { label: 'kB (SI 1000 B)', factor: 8000 },
      mbsi: { label: 'MB (SI)', factor: 8e6 },
      gbsi: { label: 'GB (SI)', factor: 8e9 },
    },
  },
  speed: {
    label: '速度',
    units: {
      ms: { label: '米/秒 (m/s)', factor: 1 },
      kmh: { label: '千米/时 (km/h)', factor: 1 / 3.6 },
      mph: { label: '英里/时 (mph)', factor: 0.44704 },
      fts: { label: '英尺/秒 (ft/s)', factor: 0.3048 },
      knot: { label: '节 (kn)', factor: 0.514444 },
    },
  },
  pressure: {
    label: '压强',
    units: {
      pa: { label: '帕 (Pa)', factor: 1 },
      hpa: { label: '百帕 (hPa)', factor: 100 },
      kpa: { label: '千帕 (kPa)', factor: 1000 },
      mpa: { label: '兆帕 (MPa)', factor: 1e6 },
      bar: { label: '巴 (bar)', factor: 1e5 },
      atm: { label: '标准大气压 (atm)', factor: 101325 },
      mmhg: { label: '毫米汞柱 (mmHg)', factor: 133.322 },
      psi: { label: '磅/平方英寸 (psi)', factor: 6894.76 },
    },
  },
  energy: {
    label: '能量',
    units: {
      j: { label: '焦耳 (J)', factor: 1 },
      kj: { label: '千焦 (kJ)', factor: 1000 },
      mj: { label: '兆焦 (MJ)', factor: 1e6 },
      cal: { label: '卡 (cal)', factor: 4.184 },
      kcal: { label: '千卡 (kcal)', factor: 4184 },
      wh: { label: '瓦时 (Wh)', factor: 3600 },
      kwh: { label: '千瓦时 (kWh)', factor: 3.6e6 },
      ev: { label: '电子伏 (eV)', factor: 1.602176634e-19 },
    },
  },
  power: {
    label: '功率',
    units: {
      mw: { label: '毫瓦 (mW)', factor: 0.001 },
      w: { label: '瓦 (W)', factor: 1 },
      kw: { label: '千瓦 (kW)', factor: 1000 },
      megaw: { label: '兆瓦 (MW)', factor: 1e6 },
      hp: { label: '马力 (hp 美制)', factor: 745.6998715822702 },
      ps: { label: '公制马力 (PS)', factor: 735.49875 },
    },
  },
  frequency: {
    label: '频率',
    units: {
      hz: { label: '赫兹 (Hz)', factor: 1 },
      khz: { label: '千赫 (kHz)', factor: 1000 },
      mhz: { label: '兆赫 (MHz)', factor: 1e6 },
      ghz: { label: '吉赫 (GHz)', factor: 1e9 },
      rpm: { label: '转/分 (rpm)', factor: 1 / 60 },
    },
  },
  angle: {
    label: '角度',
    units: {
      rad: { label: '弧度 (rad)', factor: 1 },
      deg: { label: '度 (°)', factor: RAD },
      turn: { label: '周 (turn)', factor: 2 * Math.PI },
      arcmin: { label: '角分 (′)', factor: RAD / 60 },
      arcsec: { label: '角秒 (″)', factor: RAD / 3600 },
      grad: { label: '梯度 (gon)', factor: Math.PI / 200 },
    },
  },
  time: {
    label: '时间',
    units: {
      ns: { label: '纳秒 (ns)', factor: 1e-9 },
      us: { label: '微秒 (µs)', factor: 1e-6 },
      ms: { label: '毫秒 (ms)', factor: 1e-3 },
      s: { label: '秒 (s)', factor: 1 },
      min: { label: '分 (min)', factor: 60 },
      h: { label: '时 (h)', factor: 3600 },
      d: { label: '日 (d)', factor: 86400 },
      week: { label: '周', factor: 604800 },
      year: { label: '儒略年 (365.25 日)', factor: 31557600 },
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
    <ToolPageLayout
      icon="📏"
      title="单位换算"
      description="长度、重量、面积、体积、温度、数据存储、速度、压强、能量、功率、频率、角度、时间等十余类单位换算"
    >
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
