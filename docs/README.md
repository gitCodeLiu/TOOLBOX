# 文档目录

本目录存放项目各模块的详细文档。根目录 `README.md` 中仅保留摘要和链接，完整说明见此处。

---

## 工具文档（docs/tools/）

每新增一个工具，必须在 `docs/tools/` 下创建对应的说明文档，并在下方表格补充记录。

| 工具名称 | 文档文件 | 对应路径 |
|---------|---------|---------|
| 📈 Excel 转折线图 | [excel-to-chart.md](./tools/excel-to-chart.md) | `/tools/excel-to-chart` |
| 📋 JSON 格式化 | [json-formatter.md](./tools/json-formatter.md) | `/tools/json-formatter` |
| 🔄 YAML ↔ JSON | [yaml-json.md](./tools/yaml-json.md) | `/tools/yaml-json` |
| 📊 CSV ↔ JSON | [csv-json.md](./tools/csv-json.md) | `/tools/csv-json` |
| 📝 Markdown 预览 | [markdown-preview.md](./tools/markdown-preview.md) | `/tools/markdown-preview` |
| 🎨 颜色格式转换 | [color-converter.md](./tools/color-converter.md) | `/tools/color-converter` |
| 🔐 Base64 编解码 | [base64-codec.md](./tools/base64-codec.md) | `/tools/base64-codec` |
| 🔗 URL 编解码 | [url-codec.md](./tools/url-codec.md) | `/tools/url-codec` |
| 🔡 Unicode 编解码 | [unicode-codec.md](./tools/unicode-codec.md) | `/tools/unicode-codec` |
| 🏷️ HTML 实体编解码 | [html-entity-codec.md](./tools/html-entity-codec.md) | `/tools/html-entity-codec` |
| 🎫 JWT 解析 | [jwt-decoder.md](./tools/jwt-decoder.md) | `/tools/jwt-decoder` |
| 🔏 哈希计算 | [hash-calculator.md](./tools/hash-calculator.md) | `/tools/hash-calculator` |
| 🔒 AES 加解密 | [aes-crypto.md](./tools/aes-crypto.md) | `/tools/aes-crypto` |
| ⏱️ 时间戳转换 | [timestamp-converter.md](./tools/timestamp-converter.md) | `/tools/timestamp-converter` |
| 🌍 时区换算 | [timezone-converter.md](./tools/timezone-converter.md) | `/tools/timezone-converter` |
| 📏 单位换算 | [unit-converter.md](./tools/unit-converter.md) | `/tools/unit-converter` |
| 🔢 进制转换 | [number-base.md](./tools/number-base.md) | `/tools/number-base` |
| 🀄 数字大写转换 | [chinese-number.md](./tools/chinese-number.md) | `/tools/chinese-number` |
| 🆔 UUID 生成器 | [uuid-generator.md](./tools/uuid-generator.md) | `/tools/uuid-generator` |
| 📱 二维码生成 | [qrcode-generator.md](./tools/qrcode-generator.md) | `/tools/qrcode-generator` |
| 📊 字数统计 | [word-count.md](./tools/word-count.md) | `/tools/word-count` |
| 🧹 文本去重 | [text-dedup.md](./tools/text-dedup.md) | `/tools/text-dedup` |
| 🔀 文本排序 | [text-sort.md](./tools/text-sort.md) | `/tools/text-sort` |
| 🔤 大小写/命名转换 | [case-converter.md](./tools/case-converter.md) | `/tools/case-converter` |
| 🔍 正则表达式测试 | [regex-tester.md](./tools/regex-tester.md) | `/tools/regex-tester` |
| 📄 文本对比 | [text-diff.md](./tools/text-diff.md) | `/tools/text-diff` |

---

## 环境与配置文档

| 文档 | 说明 |
|------|------|
| [node-setup.md](./node-setup.md) | Node.js 安装、项目启动、进程查看与关闭的完整指南 |

---

## 维护规则

- **新增工具**：在 `docs/tools/` 下创建 `<tool-id>.md`，并在上方工具文档表格补充一行
- **文档命名**：与工具 ID 保持一致（即 `src/tools/<tool-id>/` 中的目录名）
- **内容要求**：工具文档需包含功能列表、数据格式说明、已知限制、后续优化方向
