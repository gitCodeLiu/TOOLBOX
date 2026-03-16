// Cursor generated code - start
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';

// 数据处理
import ExcelToChartPage from './tools/excel-to-chart/ExcelToChartPage';

// 格式转换
import JsonFormatterPage from './tools/json-formatter/JsonFormatterPage';
import YamlJsonPage from './tools/yaml-json/YamlJsonPage';
import CsvJsonPage from './tools/csv-json/CsvJsonPage';
import MarkdownPreviewPage from './tools/markdown-preview/MarkdownPreviewPage';
import ColorConverterPage from './tools/color-converter/ColorConverterPage';

// 编码 / 加密
import Base64CodecPage from './tools/base64-codec/Base64CodecPage';
import UrlCodecPage from './tools/url-codec/UrlCodecPage';
import UnicodeCodecPage from './tools/unicode-codec/UnicodeCodecPage';
import HtmlEntityCodecPage from './tools/html-entity-codec/HtmlEntityCodecPage';
import JwtDecoderPage from './tools/jwt-decoder/JwtDecoderPage';
import HashCalculatorPage from './tools/hash-calculator/HashCalculatorPage';
import AesCryptoPage from './tools/aes-crypto/AesCryptoPage';

// 实用工具
import TimestampConverterPage from './tools/timestamp-converter/TimestampConverterPage';
import TimezoneConverterPage from './tools/timezone-converter/TimezoneConverterPage';
import UnitConverterPage from './tools/unit-converter/UnitConverterPage';
import NumberBasePage from './tools/number-base/NumberBasePage';
import ChineseNumberPage from './tools/chinese-number/ChineseNumberPage';

// 内容生成
import UuidGeneratorPage from './tools/uuid-generator/UuidGeneratorPage';
import QrcodeGeneratorPage from './tools/qrcode-generator/QrcodeGeneratorPage';

// 文本工具
import WordCountPage from './tools/word-count/WordCountPage';
import TextDedupPage from './tools/text-dedup/TextDedupPage';
import TextSortPage from './tools/text-sort/TextSortPage';
import CaseConverterPage from './tools/case-converter/CaseConverterPage';
import RegexTesterPage from './tools/regex-tester/RegexTesterPage';
import TextDiffPage from './tools/text-diff/TextDiffPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* 数据处理 */}
            <Route path="/tools/excel-to-chart" element={<ExcelToChartPage />} />

            {/* 格式转换 */}
            <Route path="/tools/json-formatter" element={<JsonFormatterPage />} />
            <Route path="/tools/yaml-json" element={<YamlJsonPage />} />
            <Route path="/tools/csv-json" element={<CsvJsonPage />} />
            <Route path="/tools/markdown-preview" element={<MarkdownPreviewPage />} />
            <Route path="/tools/color-converter" element={<ColorConverterPage />} />

            {/* 编码 / 加密 */}
            <Route path="/tools/base64-codec" element={<Base64CodecPage />} />
            <Route path="/tools/url-codec" element={<UrlCodecPage />} />
            <Route path="/tools/unicode-codec" element={<UnicodeCodecPage />} />
            <Route path="/tools/html-entity-codec" element={<HtmlEntityCodecPage />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoderPage />} />
            <Route path="/tools/hash-calculator" element={<HashCalculatorPage />} />
            <Route path="/tools/aes-crypto" element={<AesCryptoPage />} />

            {/* 实用工具 */}
            <Route path="/tools/timestamp-converter" element={<TimestampConverterPage />} />
            <Route path="/tools/timezone-converter" element={<TimezoneConverterPage />} />
            <Route path="/tools/unit-converter" element={<UnitConverterPage />} />
            <Route path="/tools/number-base" element={<NumberBasePage />} />
            <Route path="/tools/chinese-number" element={<ChineseNumberPage />} />

            {/* 内容生成 */}
            <Route path="/tools/uuid-generator" element={<UuidGeneratorPage />} />
            <Route path="/tools/qrcode-generator" element={<QrcodeGeneratorPage />} />

            {/* 文本工具 */}
            <Route path="/tools/word-count" element={<WordCountPage />} />
            <Route path="/tools/text-dedup" element={<TextDedupPage />} />
            <Route path="/tools/text-sort" element={<TextSortPage />} />
            <Route path="/tools/case-converter" element={<CaseConverterPage />} />
            <Route path="/tools/regex-tester" element={<RegexTesterPage />} />
            <Route path="/tools/text-diff" element={<TextDiffPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
// Cursor generated code - end
