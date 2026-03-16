// Cursor generated code - start
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: number;
}

export default function CopyButton({ text, className = '', size = 14 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? '已复制' : '复制'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
        copied
          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
          : 'bg-surface-800 text-surface-400 border border-surface-700 hover:text-surface-100 hover:border-surface-600'
      } ${className}`}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
      {copied ? '已复制' : '复制'}
    </button>
  );
}
// Cursor generated code - end
