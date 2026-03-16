# Base64 编解码

**工具路径**：`/tools/base64-codec`  
**工具分类**：编码/加密  
**文件位置**：`src/tools/base64-codec/Base64CodecPage.tsx`

---

## 功能列表

- **编码（Text → Base64）**：将任意文本（含中文、Unicode）编码为 Base64 字符串
- **解码（Base64 → Text）**：将 Base64 字符串还原为原始文本
- **互换**：一键将输出结果填入输入框，并切换模式
- **错误提示**：输入非法 Base64 时给出明确提示

## 技术实现

- 使用浏览器原生 `btoa()` / `atob()` 函数
- 中文字符通过 `encodeURIComponent` + `escape` 的方式处理 Unicode 问题

## 已知限制

- 不支持二进制文件的 Base64 编码（仅支持文本）

## 后续优化方向

- 支持文件上传，进行 Base64 编码
- 支持 Base64 URL-safe 变体（`+` → `-`，`/` → `_`）
