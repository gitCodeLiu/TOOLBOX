# ITERATION-001：项目初始化与首页 + Excel 转折线图工具

**迭代时间**：2026-03-11
**迭代类型**：新功能
**影响范围**：全量（项目从零搭建）

---

## 背景与目标

从零搭建 ToolBox 工具箱项目，目标：
1. 建立可扩展的工具导航架构（首页分类 + 搜索）
2. 实现第一个工具：Excel 转折线图

---

## 技术选型

### 构建工具：Vite + React + TypeScript

选择 Vite 的理由：
- 极快的开发服务器启动速度（基于 ESM）
- 热更新（HMR）效率高
- 生产构建使用 Rollup，体积小
- 官方提供 `react-ts` 模板，开箱即用

选择 TypeScript 的理由：
- 类型安全，减少运行时错误
- 工具注册数据（`tools.ts`）和工具类型（`types/tool.ts`）可强约束
- IDE 补全更好

### 样式方案：Tailwind CSS v3

- 原子化 CSS，与 React 组件化配合良好
- 暗色主题通过 CSS 变量 + Tailwind 颜色系统实现
- 自定义扩展了字体、动画、颜色

### 图表库：Recharts

- 基于 React 的声明式图表库
- 支持折线图（`LineChart`）和面积图（`AreaChart`）
- 自定义 Tooltip、Legend 较为方便
- 与 TypeScript 兼容良好

### Excel 解析：xlsx（SheetJS）

- 支持 `.xlsx`、`.xls`、`.csv` 多种格式
- 纯前端解析，无需后端支持
- `sheet_to_json` 方法可直接输出二维数组

### 路由：React Router v6

- SPA 客户端路由
- 支持嵌套路由，便于未来扩展

### 图标：lucide-react

- 轻量、风格统一
- Tree-shakeable，按需引入

---

## 项目结构设计

```
src/
├── components/       # 全局通用组件
│   ├── Navbar.tsx    # 顶部导航栏（含 Logo、返回按钮）
│   └── ToolCard.tsx  # 工具卡片（首页使用）
├── pages/
│   └── HomePage.tsx  # 首页（搜索 + 分类 + 工具网格）
├── tools/            # 工具模块目录（每个工具一个子目录）
│   └── excel-to-chart/
│       ├── ExcelToChartPage.tsx  # 工具主页面（状态管理）
│       ├── ExcelUploader.tsx     # 文件上传组件
│       ├── ChartView.tsx         # 图表展示（含导出功能）
│       └── ChartControls.tsx     # 控制面板（系列切换、颜色、选项）
├── data/
│   └── tools.ts      # 工具注册表（工具元数据）
├── types/
│   └── tool.ts       # TypeScript 类型定义
└── utils/
    ├── excelParser.ts   # Excel 解析工具函数
    └── dataProcessor.ts # 数据处理工具函数（聚合/排序/累加）
```

**设计原则**：
- 每个工具是一个独立目录，内聚性强
- 工具通过 `src/data/tools.ts` 注册，首页自动感知
- 公共组件放 `components/`，不放工具目录中

---

## 实现步骤

### Step 1：脚手架初始化

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Step 2：安装依赖

```bash
npm install react-router-dom xlsx recharts lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### Step 3：配置 Tailwind CSS

- 修改 `tailwind.config.js`，配置内容路径、扩展字体（Syne、DM Sans、JetBrains Mono）、颜色（brand、surface）、动画
- 替换 `src/index.css`，引入 Google Fonts、Tailwind 指令、CSS 变量、滚动条样式、纹理背景

### Step 4：类型定义

在 `src/types/tool.ts` 中定义：
- `Tool` 接口（id、name、description、category、tags、path、icon 等）
- `ToolCategory` 联合类型
- `Category` 接口

### Step 5：工具注册数据

在 `src/data/tools.ts` 中维护：
- `TOOLS` 数组：所有工具的元数据
- `CATEGORIES` 数组：所有类别的元数据

### Step 6：公共组件

- **Navbar**：顶部固定导航，包含 Logo（ToolBox）和返回首页按钮
- **ToolCard**：工具卡片，展示图标、名称、描述、标签、NEW/HOT 徽章，点击跳转工具页

### Step 7：首页实现

`HomePage.tsx` 实现：
- 使用 `useMemo` 进行搜索和分类过滤（无需 debounce，实时响应）
- 类别按钮动态统计各类工具数量
- 工具网格响应式布局：1/2/3/4 列自适应
- 空状态提示（无搜索结果时显示）

### Step 8：Excel 解析 & 数据处理

`src/utils/excelParser.ts`：
- 使用 `FileReader` 读取 ArrayBuffer
- 调用 `XLSX.read` 解析工作簿，取第一个 Sheet
- **格式约定**：第一列为 X 轴标签，其余列为 Y 轴系列（第一行为表头）
- 自动分配预置颜色

`src/utils/dataProcessor.ts`：
- **聚合**：相同 X 轴标签的行合并，数值求和
- **排序**：按 X 轴标签升序排列（支持数字前缀、月份等格式）
- **累加**：每个点 = 自身值 + 前面所有点之和（Running Total）
- 三步顺序固定：聚合 → 排序 → 累加，每步独立开关

### Step 9：Excel 转折线图工具

**ExcelUploader.tsx**：
- 拖拽上传（`onDrop`）和点击上传（`<input type="file">`）
- 文件格式校验（xlsx/xls/csv）
- 解析中显示 loading 状态
- 错误信息展示
- 可视化 Excel 格式说明示例表格

**ChartControls.tsx**：
- 数据处理开关（聚合、排序、累加），含执行顺序指示
- Y 轴系列列表：可见性切换（眼睛图标）、颜色选择器，超出时可滚动
- 图表类型切换（折线图/面积图）
- 显示选项开关（数据点、曲线平滑、网格）
- 重新上传按钮

**ChartView.tsx**：
- 使用 Recharts `LineChart`/`AreaChart` 渲染图表
- X 轴大数据量时自动稀疏刻度 + 标签倾斜，防堆叠
- 自定义 Tooltip 样式
- 导出 PNG（Canvas 2x 高清）
- 导出 SVG（XMLSerializer 序列化）
- 复制原始数据（Tab 分隔，可直接粘贴到 Excel）
- 数据预览表格（支持横向 + 纵向滚动）

**ExcelToChartPage.tsx**：
- 顶级状态管理（图表数据、可见系列、图表选项、数据处理选项）
- 使用 `useMemo` 计算处理后数据，原始数据不受影响
- 未上传状态 → 显示 Uploader
- 上传后 → 左侧控制面板（sticky + 滚动）+ 右侧图表（lg 屏响应式两栏）

### Step 10：路由配置

`App.tsx` 配置路由：
- `/` → `HomePage`
- `/tools/excel-to-chart` → `ExcelToChartPage`

---

## 新增 / 修改内容汇总

### 项目基础架构

- 使用 Vite + React + TypeScript 初始化项目
- 集成 Tailwind CSS v3，自定义暗色主题（工业风）
- 集成 React Router v6，配置 SPA 路由
- 引入 Google Fonts（Syne + DM Sans + JetBrains Mono）

### 首页工具导航

- 工具卡片网格布局（响应式：1/2/3/4 列）
- 按类别筛选（全部、数据处理、图像处理、文本工具、格式转换、内容生成、实用工具）
- 关键词实时搜索（名称、描述、标签三维度匹配）
- 工具 NEW / HOT 徽章
- 空状态提示（无搜索结果）
- 入场动画（错落 fadeIn/slideUp）

### Excel 转折线图工具功能清单

- 文件上传（拖拽 + 点击，支持 xlsx/xls/csv）
- 多系列折线图渲染（Recharts）
- 系列显示/隐藏（最少保留一条）
- 系列自定义颜色
- 图表类型切换（折线图/面积图）
- 曲线平滑开关
- 数据点显示开关
- 背景网格开关
- 数据处理：X 轴聚合、排序、累加（三步独立开关）
- 导出 PNG（2x 高清）
- 导出 SVG（矢量）
- 复制数据（Tab 分隔，可粘贴至 Excel）
- 数据预览表格
- Excel 格式说明提示

---

## 涉及文件

| 文件路径 | 操作类型 | 说明 |
|---------|---------|------|
| `package.json` | 修改 | 添加依赖 |
| `tailwind.config.js` | 修改 | 自定义主题 |
| `src/index.css` | 重写 | 全局样式、CSS 变量、字体 |
| `src/main.tsx` | 修改 | 入口文件 |
| `src/App.tsx` | 新增 | 路由配置 |
| `src/types/tool.ts` | 新增 | Tool、Category 类型定义 |
| `src/data/tools.ts` | 新增 | 工具注册表 |
| `src/components/Navbar.tsx` | 新增 | 顶部导航栏 |
| `src/components/ToolCard.tsx` | 新增 | 工具卡片 |
| `src/pages/HomePage.tsx` | 新增 | 首页 |
| `src/utils/excelParser.ts` | 新增 | Excel 解析工具函数 |
| `src/utils/dataProcessor.ts` | 新增 | 数据处理工具函数 |
| `src/tools/excel-to-chart/ExcelToChartPage.tsx` | 新增 | 工具主页面 |
| `src/tools/excel-to-chart/ExcelUploader.tsx` | 新增 | 文件上传组件 |
| `src/tools/excel-to-chart/ChartView.tsx` | 新增 | 图表展示组件 |
| `src/tools/excel-to-chart/ChartControls.tsx` | 新增 | 控制面板组件 |
| `index.html` | 修改 | 标题、icon、lang 属性 |
| `README.md` | 新增 | 项目说明文档 |
| `iterations/README.md` | 新增 | 迭代目录说明 |

---

## 设计风格

**主题定位**：工业/暗黑极简风

- **背景色**：`#0c0a09`（极深棕黑）+ 噪声纹理贴图（`body::before` grain overlay）
- **强调色**：`#22c55e`（翠绿，呼应"工具/数据"科技感）
- **字体**：Syne（标题，几何感强的无衬线）+ DM Sans（正文，易读）+ JetBrains Mono（代码/数据标签）
- **卡片**：`bg-surface-900/60` 半透明磨砂玻璃风格，悬停时左上角绿色渐变光晕
- **动画**：入场动画（fadeIn + slideUp + scaleIn），使用 `animation-delay` 错落显示

---

## 如何新增工具（后续迭代参考）

1. 在 `src/tools/` 下新建工具目录（如 `src/tools/image-compress/`）
2. 实现工具主页面（`ImageCompressPage.tsx`）及子组件
3. 在 `src/data/tools.ts` 的 `TOOLS` 数组中新增工具元数据：

```typescript
{
  id: 'image-compress',
  name: '图片压缩',
  description: '...',
  category: 'image',
  tags: ['图片', '压缩', 'jpeg', 'png'],
  path: '/tools/image-compress',
  icon: '🖼️',
}
```

4. 在 `src/App.tsx` 中新增路由：

```tsx
<Route path="/tools/image-compress" element={<ImageCompressPage />} />
```

5. 在 `iterations/` 下新建迭代文档并更新迭代历史表格

---

## 注意事项

- 导出 PNG 功能依赖 Canvas API 和 SVG 序列化，在某些浏览器下可能存在跨域图片问题（当前工具不涉及外部图片，暂无影响）
- Recharts `connectNulls={false}` 配置使空值断线，不填充，保持数据真实性
- 左侧控制面板使用 `sticky` 定位，需配合 `max-height + overflow-y-auto` 防止超出视口

---

## 已知限制与后续优化方向

| 问题 | 说明 |
|------|------|
| PNG 导出质量 | 目前使用 Canvas 2x 缩放，复杂图表可能有锯齿 |
| 大文件性能 | Excel 行数过多时（>10000 行）前端解析可能较慢 |
| 工具数量扩展 | 随着工具增多，首页需要考虑分页或虚拟化 |
| 国际化 | 目前仅支持中文界面 |
| 本地存储 | 用户上传的文件/图表配置未持久化 |

- [ ] 首页支持工具收藏/置顶（基于 localStorage）
- [ ] Excel 工具支持多 Sheet 切换
- [ ] Excel 工具支持柱状图、散点图等更多图表类型
- [ ] Excel 工具支持 X 轴/Y 轴标题自定义
- [ ] Excel 工具支持图表标题自定义
- [ ] 首页工具数量多时支持分页或虚拟滚动
- [ ] 添加全局快捷键搜索（如 `Cmd+K`）
