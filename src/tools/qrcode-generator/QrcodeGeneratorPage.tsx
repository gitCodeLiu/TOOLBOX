// Cursor generated code - start
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import ToolPageLayout from '../../components/ToolPageLayout';
import { Download } from 'lucide-react';

export default function QrcodeGeneratorPage() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!text.trim()) { setDataUrl(''); return; }
      try {
        const url = await QRCode.toDataURL(text, {
          width: size,
          errorCorrectionLevel: errorLevel,
          color: { dark: fgColor, light: bgColor },
          margin: 2,
        });
        setDataUrl(url);
        setError('');
      } catch (e) {
        setError((e as Error).message);
        setDataUrl('');
      }
    }, 300);
  }, [text, size, errorLevel, fgColor, bgColor]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-${Date.now().toString()}.png`;
    a.click();
  };

  return (
    <ToolPageLayout icon="📱" title="二维码生成" description="将文本或 URL 生成可下载的二维码图片">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left: Settings */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-surface-300 block mb-2">内容（文本 / URL）</label>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="输入要生成二维码的文本或网址..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm resize-none focus:outline-none focus:border-brand-500 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-surface-500 block mb-2">尺寸（像素）</label>
              <input type="range" min={128} max={512} step={32} value={size} onChange={e => setSize(parseInt(e.target.value))}
                className="w-full accent-brand-500" />
              <p className="text-xs font-mono text-surface-400 mt-1 text-center">{size} × {size}</p>
            </div>
            <div>
              <label className="text-xs text-surface-500 block mb-2">纠错级别</label>
              <div className="grid grid-cols-4 gap-1">
                {(['L', 'M', 'Q', 'H'] as const).map(l => (
                  <button key={l} onClick={() => setErrorLevel(l)}
                    className={`py-1.5 rounded-lg text-xs font-mono transition-all ${errorLevel === l ? 'bg-brand-500 text-surface-950 font-bold' : 'bg-surface-800 border border-surface-700 text-surface-400 hover:text-surface-100'}`}>
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-xs text-surface-600 mt-1">L:7% M:15% Q:25% H:30%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-surface-500 block mb-2">前景色（深色）</label>
              <div className="flex gap-2">
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                  className="w-10 h-9 rounded-lg border border-surface-700 bg-surface-800 p-0.5 cursor-pointer" />
                <input type="text" value={fgColor} onChange={e => setFgColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-300 text-xs font-mono focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-surface-500 block mb-2">背景色（浅色）</label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="w-10 h-9 rounded-lg border border-surface-700 bg-surface-800 p-0.5 cursor-pointer" />
                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-300 text-xs font-mono focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full aspect-square rounded-2xl border border-surface-800 bg-surface-900/60 flex items-center justify-center overflow-hidden">
            {error ? (
              <p className="text-red-400 text-xs text-center px-4">{error}</p>
            ) : dataUrl ? (
              <img src={dataUrl} alt="QR Code" className="w-full h-full object-contain p-3" />
            ) : (
              <p className="text-surface-600 text-sm">输入内容以生成二维码</p>
            )}
          </div>
          {dataUrl && (
            <button onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 transition-all">
              <Download size={15} /> 下载 PNG
            </button>
          )}
          <p className="text-xs text-surface-600 text-center">输入内容即时更新，支持下载 PNG 格式</p>
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
