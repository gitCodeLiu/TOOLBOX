// Cursor generated code - start
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('无效的 JWT 格式，应包含三个由 "." 分隔的部分');

  const decodeBase64 = (str: string) => {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=');
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  };

  return {
    header: decodeBase64(parts[0]),
    payload: decodeBase64(parts[1]),
    signature: parts[2],
  };
}

function formatExpiry(exp: number): { expired: boolean; text: string } {
  const now = Math.floor(Date.now() / 1000);
  const expired = exp < now;
  const date = new Date(exp * 1000);
  return { expired, text: date.toLocaleString('zh-CN') };
}

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export default function JwtDecoderPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<JwtParts | null>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    try {
      setResult(decodeJwt(token));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const payload = result?.payload;
  const exp = payload?.exp as number | undefined;
  const iat = payload?.iat as number | undefined;
  const nbf = payload?.nbf as number | undefined;
  const expInfo = exp ? formatExpiry(exp) : null;

  return (
    <ToolPageLayout icon="🎫" title="JWT 解析" description="解析 JWT Token 的 Header、Payload、Signature（仅解析，不验证签名）">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-surface-300">JWT Token</label>
          <button onClick={() => setToken(SAMPLE_JWT)}
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors">载入示例</button>
        </div>
        <textarea value={token} onChange={e => setToken(e.target.value)}
          placeholder="粘贴 JWT Token，格式：xxxxx.yyyyy.zzzzz"
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors" />
      </div>

      <button onClick={handleDecode} disabled={!token.trim()}
        className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all mb-6">
        解析 JWT
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4 flex items-center gap-2">
          <XCircle size={16} /> {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Header */}
          <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold text-brand-400 uppercase tracking-wider">Header</span>
              <CopyButton text={JSON.stringify(result.header, null, 2)} />
            </div>
            <pre className="text-xs font-mono text-surface-300 whitespace-pre-wrap break-all">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold text-orange-400 uppercase tracking-wider">Payload</span>
              <CopyButton text={JSON.stringify(result.payload, null, 2)} />
            </div>
            <pre className="text-xs font-mono text-surface-300 whitespace-pre-wrap break-all">
              {JSON.stringify(result.payload, null, 2)}
            </pre>

            {/* Time fields */}
            {(exp || iat || nbf) && (
              <div className="mt-3 pt-3 border-t border-surface-800 space-y-1.5">
                {expInfo && (
                  <div className={`flex items-center gap-1.5 text-xs ${expInfo.expired ? 'text-red-400' : 'text-green-400'}`}>
                    {expInfo.expired ? <XCircle size={12} /> : <CheckCircle size={12} />}
                    exp: {expInfo.text} {expInfo.expired ? '（已过期）' : '（有效）'}
                  </div>
                )}
                {iat && (
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <Clock size={12} /> iat: {new Date(iat * 1000).toLocaleString('zh-CN')}
                  </div>
                )}
                {nbf && (
                  <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <Clock size={12} /> nbf: {new Date(nbf * 1000).toLocaleString('zh-CN')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="rounded-xl border border-surface-800 bg-surface-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold text-purple-400 uppercase tracking-wider">Signature</span>
              <CopyButton text={result.signature} />
            </div>
            <p className="text-xs font-mono text-surface-300 break-all">{result.signature}</p>
            <p className="text-xs text-surface-600 mt-3">⚠ 此工具仅解析，不验证签名有效性</p>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
// Cursor generated code - end
