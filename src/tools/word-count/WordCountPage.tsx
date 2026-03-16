// Cursor generated code - start
import { useMemo } from 'react';
import { useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';

interface Stats {
  chars: number;
  charsNoSpace: number;
  words: number;
  lines: number;
  nonEmptyLines: number;
  sentences: number;
  paragraphs: number;
  chineseChars: number;
  englishWords: number;
  digits: number;
  spaces: number;
  readingMinutes: number;
}

function analyzeText(text: string): Stats {
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  const nonEmptyLines = text.split('\n').filter(l => l.trim()).length;
  const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(s => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/\b[a-zA-Z]+\b/g) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const spaces = (text.match(/\s/g) || []).length;
  const readingMinutes = Math.ceil((chineseChars + englishWords * 5) / 500);
  return { chars, charsNoSpace, words, lines, nonEmptyLines, sentences, paragraphs, chineseChars, englishWords, digits, spaces, readingMinutes };
}

export default function WordCountPage() {
  const [text, setText] = useState('');
  const stats = useMemo(() => analyzeText(text), [text]);

  const STAT_ITEMS = [
    { label: '总字符数', value: stats.chars, desc: '含空格和换行' },
    { label: '有效字符数', value: stats.charsNoSpace, desc: '不含空白字符' },
    { label: '中文字数', value: stats.chineseChars, desc: '汉字数量' },
    { label: '英文单词数', value: stats.englishWords, desc: '英文词汇数量' },
    { label: '数字数量', value: stats.digits, desc: '0-9 数字个数' },
    { label: '空白字符数', value: stats.spaces, desc: '空格、换行等' },
    { label: '总词数', value: stats.words, desc: '按空格分隔' },
    { label: '句子数', value: stats.sentences, desc: '按标点分隔' },
    { label: '段落数', value: stats.paragraphs, desc: '按空行分隔' },
    { label: '总行数', value: stats.lines, desc: '含空行' },
    { label: '非空行数', value: stats.nonEmptyLines, desc: '有内容的行' },
    { label: '预计阅读时长', value: `${stats.readingMinutes} 分钟`, desc: '按 500字/分钟估算' },
  ];

  return (
    <ToolPageLayout icon="📊" title="字数统计" description="实时统计文本的字符数、词数、行数、段落数等多维度信息">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-surface-300">输入文本</label>
            <button onClick={() => setText('')} className="text-xs text-surface-600 hover:text-surface-400 transition-colors">清空</button>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="在此粘贴或输入文本，统计结果实时更新..."
            rows={20}
            className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm resize-none focus:outline-none focus:border-brand-500 transition-colors" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 content-start">
          {STAT_ITEMS.map(({ label, value, desc }) => (
            <div key={label} className="p-3 rounded-xl bg-surface-900/60 border border-surface-800">
              <p className="text-2xl font-bold font-mono text-brand-400">{value}</p>
              <p className="text-xs font-medium text-surface-300 mt-0.5">{label}</p>
              <p className="text-xs text-surface-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
