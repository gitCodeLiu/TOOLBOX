# ITERATION-002：批量工具扩展（25 个新工具）

**迭代时间**：2026-03-16  
**迭代类型**：新功能  
**影响范围**：`src/tools/`、`src/data/tools.ts`、`src/App.tsx`、`src/types/tool.ts`、`src/components/`、`docs/`、`README.md`

---

## 背景与目标

> 项目初始化后仅有 Excel 转折线图一个工具，工具箱内容过于单薄。本次迭代的目标是一次性补充覆盖开发者日常高频使用场景的工具集，建立完整的工具矩阵，涵盖编码、加密、格式转换、时间日期、单位换算、文本处理、内容生成等主要类别。

---

## 新增 / 修改内容

### 新增共享基础组件（2 个）

- `ToolPageLayout` — 统一的工具页面布局，包含返回导航和标题区域，所有新工具复用
- `CopyButton` — 一键复制按钮组件，带复制成功状态反馈

### 新增工具分类（1 个）

- `crypto`（编码/加密）— 用于 Base64、URL、Unicode、HTML 实体、JWT、哈希、AES 等工具

### 新增工具（25 个）

#### 格式转换（5 个）
| 工具 ID | 工具名称 |
|---------|---------|
| `json-formatter` | JSON 格式化 / 压缩 / 校验 |
| `yaml-json` | YAML ↔ JSON 互转 |
| `csv-json` | CSV ↔ JSON 互转 |
| `markdown-preview` | Markdown 实时预览 |
| `color-converter` | 颜色格式转换（HEX/RGB/HSL/HSV） |

#### 编码 / 加密（7 个）
| 工具 ID | 工具名称 |
|---------|---------|
| `base64-codec` | Base64 编解码 |
| `url-codec` | URL 编解码 |
| `unicode-codec` | Unicode 编解码 |
| `html-entity-codec` | HTML 实体编解码 |
| `jwt-decoder` | JWT 解析（Header / Payload / Signature） |
| `hash-calculator` | 哈希计算（MD5/SHA-1/SHA-256/SHA-512/SHA-3/RIPEMD-160） |
| `aes-crypto` | AES 加解密（CBC/ECB/CTR） |

#### 实用工具（5 个）
| 工具 ID | 工具名称 |
|---------|---------|
| `timestamp-converter` | 时间戳 ↔ 日期时间互转（多时区） |
| `timezone-converter` | 时区换算（全球主要城市） |
| `unit-converter` | 单位换算（7 大类别） |
| `number-base` | 进制转换（2/8/10/16 进制） |
| `chinese-number` | 数字大写 / 小写转换 |

#### 内容生成（2 个）
| 工具 ID | 工具名称 |
|---------|---------|
| `uuid-generator` | UUID v4 批量生成器 |
| `qrcode-generator` | 二维码生成（支持自定义尺寸/颜色/纠错级别） |

#### 文本工具（6 个）
| 工具 ID | 工具名称 |
|---------|---------|
| `word-count` | 字数统计（12 维度） |
| `text-dedup` | 文本去重 |
| `text-sort` | 文本排序（6 种模式） |
| `case-converter` | 大小写 / 命名规范转换（12 种格式） |
| `regex-tester` | 正则表达式测试（高亮匹配 + 替换） |
| `text-diff` | 文本对比（按行/词/字符） |

---

## 涉及文件

| 文件路径 | 操作类型 | 说明 |
|---------|---------|------|
| `src/types/tool.ts` | 修改 | 新增 `crypto` 分类 |
| `src/components/CopyButton.tsx` | 新增 | 通用复制按钮组件 |
| `src/components/ToolPageLayout.tsx` | 新增 | 通用工具页面布局组件 |
| `src/data/tools.ts` | 修改 | 注册 25 个新工具，调整分类顺序 |
| `src/App.tsx` | 修改 | 新增 25 条路由 |
| `src/tools/json-formatter/` | 新增 | JSON 格式化工具 |
| `src/tools/yaml-json/` | 新增 | YAML ↔ JSON 转换工具 |
| `src/tools/csv-json/` | 新增 | CSV ↔ JSON 转换工具 |
| `src/tools/markdown-preview/` | 新增 | Markdown 预览工具 |
| `src/tools/color-converter/` | 新增 | 颜色格式转换工具 |
| `src/tools/base64-codec/` | 新增 | Base64 编解码工具 |
| `src/tools/url-codec/` | 新增 | URL 编解码工具 |
| `src/tools/unicode-codec/` | 新增 | Unicode 编解码工具 |
| `src/tools/html-entity-codec/` | 新增 | HTML 实体编解码工具 |
| `src/tools/jwt-decoder/` | 新增 | JWT 解析工具 |
| `src/tools/hash-calculator/` | 新增 | 哈希计算工具 |
| `src/tools/aes-crypto/` | 新增 | AES 加解密工具 |
| `src/tools/timestamp-converter/` | 新增 | 时间戳转换工具 |
| `src/tools/timezone-converter/` | 新增 | 时区换算工具 |
| `src/tools/unit-converter/` | 新增 | 单位换算工具 |
| `src/tools/number-base/` | 新增 | 进制转换工具 |
| `src/tools/chinese-number/` | 新增 | 数字大写转换工具 |
| `src/tools/uuid-generator/` | 新增 | UUID 生成器工具 |
| `src/tools/qrcode-generator/` | 新增 | 二维码生成工具 |
| `src/tools/word-count/` | 新增 | 字数统计工具 |
| `src/tools/text-dedup/` | 新增 | 文本去重工具 |
| `src/tools/text-sort/` | 新增 | 文本排序工具 |
| `src/tools/case-converter/` | 新增 | 大小写/命名转换工具 |
| `src/tools/regex-tester/` | 新增 | 正则表达式测试工具 |
| `src/tools/text-diff/` | 新增 | 文本对比工具 |
| `docs/tools/*.md`（25 个） | 新增 | 各工具说明文档 |
| `docs/README.md` | 修改 | 更新工具文档列表 |
| `README.md` | 修改 | 更新已有工具表格、技术栈、项目结构 |
| `iterations/README.md` | 修改 | 更新迭代历史表格 |
| `package.json` | 修改 | 新增 5 个依赖（js-yaml、marked、crypto-js、qrcode、diff） |

---

## 新增依赖

| 包名 | 用途 |
|-----|------|
| `js-yaml` | YAML 解析与生成 |
| `marked` | Markdown 转 HTML 渲染 |
| `crypto-js` | MD5、SHA 系列哈希、AES 对称加密 |
| `qrcode` | 客户端二维码图片生成（Canvas/DataURL） |
| `diff` | 文本差异算法（按行/词/字符） |

---

## 注意事项

> - 所有工具均为纯前端实现，无需后端接口
> - crypto-js 的 AES 加密密钥长度固定为 256-bit（32字节），输入不足时自动补 0 填充
> - JWT 解析工具仅解析，不验证签名
> - QR 码生成使用 `qrcode` 库的 `toDataURL` 方法，输出 PNG 格式
> - `marked` 的 `gfm: true` 启用 GitHub Flavored Markdown 语法

---

## 后续优化

- 图片工具类（图片压缩、格式转换、Base64 ↔ 图片互转）待下次迭代实现
- JSON 格式化工具的语法高亮功能（Monaco Editor 或 CodeMirror）
- 工具收藏/常用功能
- 代码分割（dynamic import）优化包体积（当前打包 ~1.26MB，超过 Vite 推荐的 500KB）
