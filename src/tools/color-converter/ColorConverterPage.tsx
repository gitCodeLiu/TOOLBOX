// Cursor generated code - start
import { useState, useCallback } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }
interface HSV { h: number; s: number; v: number }

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max, d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

const PRESET_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#22c55e', '#3B82F6', '#8B5CF6', '#F97316'];

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#22C55E');
  const [rgb, setRgb] = useState<RGB>({ r: 34, g: 197, b: 94 });
  const [hsl, setHsl] = useState<HSL>({ h: 142, s: 71, l: 45 });
  const [hsv, setHsv] = useState<HSV>({ h: 142, s: 83, v: 77 });
  const [error, setError] = useState('');

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
    setHsv(rgbToHsv(r, g, b));
    setError('');
  }, []);

  const handleHexChange = (val: string) => {
    setHex(val);
    const parsed = hexToRgb(val);
    if (parsed) {
      updateFromRgb(parsed.r, parsed.g, parsed.b);
    } else if (val.length >= 4) {
      setError('无效的 HEX 颜色值');
    }
  };

  const handlePickerChange = (val: string) => {
    setHex(val.toUpperCase());
    const parsed = hexToRgb(val);
    if (parsed) updateFromRgb(parsed.r, parsed.g, parsed.b);
  };

  const hexDisplay = hex.startsWith('#') ? hex : `#${hex}`;
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hsvStr = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  const cssVarStr = `--color: ${hexDisplay};`;

  return (
    <ToolPageLayout icon="🎨" title="颜色格式转换" description="HEX、RGB、HSL、HSV 颜色格式之间的互相转换">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Left: Color picker + preview */}
        <div className="space-y-4">
          {/* Preview swatch */}
          <div className="rounded-xl overflow-hidden border border-surface-700" style={{ height: '160px', backgroundColor: hexDisplay }} />

          {/* Color picker */}
          <div>
            <label className="text-xs text-surface-500 block mb-2">取色器</label>
            <input type="color" value={hexDisplay.length === 7 ? hexDisplay : '#000000'} onChange={e => handlePickerChange(e.target.value)}
              className="w-full h-12 rounded-xl cursor-pointer border border-surface-700 bg-surface-900 p-1" />
          </div>

          {/* Presets */}
          <div>
            <label className="text-xs text-surface-500 block mb-2">预设颜色</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => handlePickerChange(c)}
                  style={{ backgroundColor: c }}
                  className="w-full aspect-square rounded-lg border-2 border-transparent hover:border-white/50 transition-all" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Format outputs */}
        <div className="space-y-3">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

          {[
            { label: 'HEX', value: hexDisplay, hint: '十六进制颜色', extra: (
              <input value={hex} onChange={e => handleHexChange(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-surface-700 border border-surface-600 text-surface-100 font-mono text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            )},
            { label: 'RGB', value: rgbStr, hint: 'Red Green Blue' },
            { label: 'HSL', value: hslStr, hint: 'Hue Saturation Lightness' },
            { label: 'HSV', value: hsvStr, hint: 'Hue Saturation Value' },
            { label: 'CSS 变量', value: cssVarStr, hint: 'CSS Custom Property' },
          ].map(({ label, value, hint, extra }) => (
            <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-surface-900/60 border border-surface-800">
              <div className="w-14 shrink-0">
                <p className="text-xs font-mono font-semibold text-brand-400">{label}</p>
                <p className="text-xs text-surface-600 mt-0.5">{hint}</p>
              </div>
              <div className="flex-1 min-w-0">
                {extra || <p className="text-sm font-mono text-surface-200 truncate">{value}</p>}
              </div>
              <CopyButton text={value} />
            </div>
          ))}

          {/* RGB sliders */}
          <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-800">
            <p className="text-xs font-medium text-surface-400 mb-3">RGB 滑块调整</p>
            {(['r', 'g', 'b'] as const).map((channel, idx) => {
              const colors = ['#ef4444', '#22c55e', '#3b82f6'];
              return (
                <div key={channel} className="flex items-center gap-3 mb-2 last:mb-0">
                  <span className="text-xs font-mono w-4" style={{ color: colors[idx] }}>{channel.toUpperCase()}</span>
                  <input type="range" min={0} max={255} value={rgb[channel]}
                    onChange={e => {
                      const newRgb = { ...rgb, [channel]: parseInt(e.target.value) };
                      updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
                    }}
                    className="flex-1 accent-brand-500" />
                  <span className="text-xs font-mono text-surface-400 w-8 text-right">{rgb[channel]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
