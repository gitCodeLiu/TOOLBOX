// Cursor generated code - start
import { useState } from 'react';
import CryptoJS from 'crypto-js';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';

type Mode = 'encrypt' | 'decrypt';
type AesMode = 'CBC' | 'ECB' | 'CTR';

export default function AesCryptoPage() {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [aesMode, setAesMode] = useState<AesMode>('CBC');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleProcess = () => {
    setError('');
    if (!key.trim()) { setError('请输入密钥'); return; }
    try {
      const keyWA = CryptoJS.enc.Utf8.parse(key.padEnd(32, '0').slice(0, 32));
      const ivWA = CryptoJS.enc.Utf8.parse((iv || '0000000000000000').padEnd(16, '0').slice(0, 16));
      const cfg = aesMode === 'ECB'
        ? { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
        : aesMode === 'CTR'
        ? { mode: CryptoJS.mode.CTR, iv: ivWA, padding: CryptoJS.pad.NoPadding }
        : { mode: CryptoJS.mode.CBC, iv: ivWA, padding: CryptoJS.pad.Pkcs7 };

      if (mode === 'encrypt') {
        const encrypted = CryptoJS.AES.encrypt(input, keyWA, cfg);
        setOutput(encrypted.toString());
      } else {
        const decrypted = CryptoJS.AES.decrypt(input.trim(), keyWA, cfg);
        setOutput(decrypted.toString(CryptoJS.enc.Utf8));
      }
    } catch {
      setError('处理失败，请检查输入内容、密钥和 IV 是否正确');
      setOutput('');
    }
  };

  return (
    <ToolPageLayout icon="🔒" title="AES 加解密" description="使用 AES-256 对文本进行加密与解密，支持 CBC、ECB、CTR 模式">
      {/* Mode & AES Mode */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['encrypt', 'decrypt'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
            {m === 'encrypt' ? '🔐 加密' : '🔓 解密'}
          </button>
        ))}
        <div className="flex gap-1 ml-2">
          {(['CBC', 'ECB', 'CTR'] as AesMode[]).map(m => (
            <button key={m} onClick={() => setAesMode(m)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all ${aesMode === m ? 'bg-surface-700 text-surface-100' : 'bg-surface-900 border border-surface-800 text-surface-500 hover:text-surface-300'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Key & IV */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-surface-300 block mb-1.5">密钥（Key）</label>
            <input value={key} onChange={e => setKey(e.target.value)}
              placeholder="输入密钥（将自动补齐/截断至 32 位）"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors" />
          </div>
          {aesMode !== 'ECB' && (
            <div>
              <label className="text-sm font-medium text-surface-300 block mb-1.5">初始向量（IV）</label>
              <input value={iv} onChange={e => setIv(e.target.value)}
                placeholder="输入 IV（将自动补齐/截断至 16 位，默认全 0）"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono focus:outline-none focus:border-brand-500 transition-colors" />
            </div>
          )}
        </div>

        {/* Input */}
        <div>
          <label className="text-sm font-medium text-surface-300 block mb-1.5">
            {mode === 'encrypt' ? '明文' : '密文（Base64）'}
          </label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === 'encrypt' ? '输入要加密的明文...' : '输入要解密的 Base64 密文...'}
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
      </div>

      <button onClick={handleProcess} disabled={!input.trim() || !key.trim()}
        className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all mb-4">
        {mode === 'encrypt' ? '立即加密' : '立即解密'}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
          ⚠ {error}
        </div>
      )}

      {output && (
        <div className="p-4 rounded-xl bg-surface-900/60 border border-surface-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-surface-300">{mode === 'encrypt' ? '加密结果（Base64）' : '解密结果'}</span>
            <CopyButton text={output} />
          </div>
          <p className="text-sm font-mono text-surface-200 break-all">{output}</p>
        </div>
      )}
    </ToolPageLayout>
  );
}
// Cursor generated code - end
