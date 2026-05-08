// Cursor generated code - start
import { Fragment, useMemo, useState } from 'react';
import ToolPageLayout from '../../components/ToolPageLayout';
import CopyButton from '../../components/CopyButton';
import { CheckCircle, ChevronDown, ChevronRight, XCircle } from 'lucide-react';

type IndentSize = 2 | 4 | 'tab';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [parsedOutput, setParsedOutput] = useState<unknown>(null);
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set());

  const parseWithSort = (obj: unknown): unknown => {
    if (Array.isArray(obj)) return obj.map(parseWithSort);
    if (obj !== null && typeof obj === 'object') {
      const sorted: Record<string, unknown> = {};
      Object.keys(obj as Record<string, unknown>).sort().forEach(k => {
        sorted[k] = parseWithSort((obj as Record<string, unknown>)[k]);
      });
      return sorted;
    }
    return obj;
  };

  const format = () => {
    setError('');
    try {
      let parsed = JSON.parse(input);
      if (sortKeys) parsed = parseWithSort(parsed);
      const indentValue = indent === 'tab' ? '\t' : indent;
      setOutput(JSON.stringify(parsed, null, indentValue));
      setParsedOutput(parsed);
      setCollapsedPaths(new Set());
      setIsValid(true);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      setParsedOutput(null);
      setCollapsedPaths(new Set());
      setIsValid(false);
    }
  };

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setParsedOutput(parsed);
      setCollapsedPaths(new Set());
      setIsValid(true);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
      setParsedOutput(null);
      setCollapsedPaths(new Set());
      setIsValid(false);
    }
  };

  const validate = () => {
    try {
      const parsed = JSON.parse(input);
      setParsedOutput(parsed);
      setCollapsedPaths(new Set());
      setIsValid(true);
      setError('');
    } catch (e) {
      setIsValid(false);
      setError((e as Error).message);
      setParsedOutput(null);
      setCollapsedPaths(new Set());
    }
  };

  const getValueColorClass = (value: unknown): string => {
    if (value === null) return 'text-pink-400';
    if (typeof value === 'string') return 'text-emerald-400';
    if (typeof value === 'number') return 'text-cyan-400';
    if (typeof value === 'boolean') return 'text-violet-400';
    return 'text-surface-200';
  };

  const joinPath = (basePath: string, segment: string | number): string => `${basePath}/${String(segment)}`;

  const collectCollapsiblePaths = (value: unknown, path: string = 'root'): string[] => {
    if (Array.isArray(value)) {
      const self = [path];
      const childPaths = value.flatMap((item, index) => collectCollapsiblePaths(item, joinPath(path, index)));
      return [...self, ...childPaths];
    }

    if (value !== null && typeof value === 'object') {
      const self = [path];
      const childPaths = Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
        collectCollapsiblePaths(child, joinPath(path, key))
      );
      return [...self, ...childPaths];
    }

    return [];
  };

  const allCollapsiblePaths = useMemo(() => collectCollapsiblePaths(parsedOutput), [parsedOutput]);

  const togglePath = (path: string) => {
    setCollapsedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderPrimitive = (value: unknown) => {
    if (value === null) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  const renderJsonTree = (
    value: unknown,
    path: string = 'root',
    depth: number = 0,
    keyName?: string,
    isArrayItem: boolean = false
  ) => {
    const isArray = Array.isArray(value);
    const isObject = value !== null && typeof value === 'object' && !isArray;
    const isContainer = isArray || isObject;
    const entries = isArray
      ? (value as unknown[]).map((item, index) => [String(index), item] as const)
      : isObject
        ? Object.entries(value as Record<string, unknown>)
        : [];
    const isCollapsed = collapsedPaths.has(path);

    if (!isContainer) {
      return (
        <div className="font-mono text-sm leading-6" style={{ paddingLeft: depth * 16 }}>
          {keyName !== undefined && (
            <span className={isArrayItem ? 'text-surface-500' : 'text-brand-300'}>
              {isArrayItem ? `[${keyName}]` : `"${keyName}"`}
            </span>
          )}
          {keyName !== undefined && <span className="text-surface-500">: </span>}
          <span className={getValueColorClass(value)}>{renderPrimitive(value)}</span>
        </div>
      );
    }

    const openBrace = isArray ? '[' : '{';
    const closeBrace = isArray ? ']' : '}';
    const summary = isArray ? `Array(${entries.length})` : `Object(${entries.length})`;

    return (
      <div>
        <div className="flex items-center gap-1 font-mono text-sm leading-6" style={{ paddingLeft: depth * 16 }}>
          <button
            type="button"
            onClick={() => togglePath(path)}
            className="text-surface-500 hover:text-brand-300 transition-colors"
            aria-label={isCollapsed ? '展开节点' : '折叠节点'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>
          {keyName !== undefined && (
            <span className={isArrayItem ? 'text-surface-500' : 'text-brand-300'}>
              {isArrayItem ? `[${keyName}]` : `"${keyName}"`}
            </span>
          )}
          {keyName !== undefined && <span className="text-surface-500">: </span>}
          <span className="text-surface-200">{openBrace}</span>
          {isCollapsed && (
            <>
              <span className="text-surface-500 ml-1">{summary}</span>
              <span className="text-surface-200 ml-1">{closeBrace}</span>
            </>
          )}
        </div>

        {!isCollapsed && (
          <>
            {entries.map(([childKey, childValue]) => {
              const childPath = joinPath(path, childKey);
              return (
                <Fragment key={childPath}>
                  {renderJsonTree(childValue, childPath, depth + 1, childKey, isArray)}
                </Fragment>
              );
            })}
            <div className="font-mono text-sm leading-6 text-surface-200" style={{ paddingLeft: depth * 16 }}>
              {closeBrace}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <ToolPageLayout icon="📋" title="JSON 格式化" description="JSON 格式化、压缩、校验一体化工具">
      <div className="flex flex-col gap-4 lg:min-h-[calc(100vh-220px)] pb-20">
        {/* Options */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-400">缩进：</span>
            {([2, 4, 'tab'] as IndentSize[]).map(i => (
              <button key={i} onClick={() => setIndent(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${indent === i ? 'bg-brand-500 text-surface-950' : 'bg-surface-900 border border-surface-800 text-surface-400 hover:text-surface-100'}`}>
                {i === 'tab' ? 'Tab' : `${i} 空格`}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
            <input type="checkbox" checked={sortKeys} onChange={e => setSortKeys(e.target.checked)} className="accent-brand-500" />
            键名排序
          </label>
          {isValid !== null && (
            <span className={`flex items-center gap-1.5 text-xs font-medium ${isValid ? 'text-green-400' : 'text-red-400'}`}>
              {isValid ? <><CheckCircle size={13} /> 有效 JSON</> : <><XCircle size={13} /> 无效 JSON</>}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-surface-300">输入 JSON</label>
              <span className="text-xs text-surface-600 font-mono">{input.length} 字符</span>
            </div>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setIsValid(null); }}
              placeholder='{"key": "value", "array": [1, 2, 3]}'
              rows={16}
              className="w-full h-full min-h-[320px] lg:min-h-0 px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-surface-100 placeholder-surface-600 text-sm font-mono resize-none focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-surface-300">输出结果</label>
              {output && <CopyButton text={output} />}
            </div>
            {error ? (
              <textarea
                value={`错误：${error}`}
                readOnly
                rows={16}
                className="w-full h-full min-h-[320px] lg:min-h-0 px-4 py-3 rounded-xl border text-sm font-mono resize-none focus:outline-none bg-red-500/5 border-red-500/30 text-red-400"
              />
            ) : output ? (
              <div className="h-full min-h-[320px] lg:min-h-0 rounded-xl border border-surface-800 bg-surface-900 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-3 py-2 border-b border-surface-800">
                  <span className="text-xs text-surface-500">可折叠 JSON 预览</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCollapsedPaths(new Set(allCollapsiblePaths))}
                      className="px-2.5 py-1 rounded-lg text-xs border border-surface-700 text-surface-400 hover:text-surface-100 hover:border-surface-600 transition-colors"
                    >
                      全部折叠
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollapsedPaths(new Set())}
                      className="px-2.5 py-1 rounded-lg text-xs border border-surface-700 text-surface-400 hover:text-surface-100 hover:border-surface-600 transition-colors"
                    >
                      全部展开
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto px-3 py-2">
                  {renderJsonTree(parsedOutput)}
                </div>
              </div>
            ) : (
              <textarea
                value=""
                readOnly
                rows={16}
                placeholder="格式化结果将在此显示..."
                className="w-full h-full min-h-[320px] lg:min-h-0 px-4 py-3 rounded-xl border text-sm font-mono resize-none focus:outline-none bg-surface-900 border-surface-800 text-surface-100"
              />
            )}
          </div>
        </div>

        <div className="sticky bottom-3 z-20">
          <div className="inline-flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-surface-700 bg-surface-950/90 px-3 py-2 backdrop-blur-md shadow-lg">
            <button onClick={format} disabled={!input.trim()}
              className="px-6 py-2.5 rounded-xl bg-brand-500 text-surface-950 text-sm font-semibold hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              格式化
            </button>
            <button onClick={minify} disabled={!input.trim()}
              className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              压缩 (Minify)
            </button>
            <button onClick={validate} disabled={!input.trim()}
              className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              校验
            </button>
            <button onClick={() => { setInput(''); setOutput(''); setError(''); setIsValid(null); setParsedOutput(null); setCollapsedPaths(new Set()); }}
              className="px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 text-sm hover:text-surface-100 hover:border-surface-700 transition-all">
              清空
            </button>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
// Cursor generated code - end
