# 🧰 ToolBox · 在线工具箱

一个基于 React 构建的在线工具集合，涵盖数据处理、格式转换、图表生成等多个类别，持续迭代扩展中。

---

## 功能特性

- **工具导航首页**：支持按类别筛选、关键词实时搜索，快速定位目标工具
- **黑色工业风 UI**：精心设计的暗色主题，现代感强，体验流畅
- **响应式布局**：适配桌面、平板、移动端等多种屏幕尺寸
- **持续扩展**：架构设计支持便捷地新增工具模块

---

## 已有工具

| 工具 | 类别 | 路径 | 详细文档 |
|------|------|------|----------|
| 📈 Excel 转折线图 | 数据处理 | `/tools/excel-to-chart` | [查看文档](./docs/tools/excel-to-chart.md) |

---

## 快速开始

> 首次使用或需要了解 Node.js 安装、进程管理等详细说明，请查阅 [Node.js 环境配置指南](./docs/node-setup.md)。

### 常用命令

```bash
npm install        # 安装依赖（首次或更新依赖时执行）
npm run dev        # 启动开发服务器 → http://localhost:5173
npm run build      # 构建生产版本，输出到 dist/
npm run preview    # 本地预览生产构建
```

停止服务：在运行 `npm run dev` 的终端按 `Ctrl + C`。

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18 | 前端框架 |
| Vite | 6 | 构建工具 |
| TypeScript | 5 | 类型安全 |
| Tailwind CSS | 3 | 样式框架 |
| React Router | 6 | 客户端路由 |
| Recharts | - | 图表库 |
| xlsx | - | Excel 解析 |
| lucide-react | - | 图标库 |

### 选型说明

**Vite + React + TypeScript**
- Vite 基于 ESM，开发服务器启动极快，热更新（HMR）效率高，生产构建体积小
- TypeScript 提供类型安全，减少运行时错误，工具注册数据和类型定义可强约束，IDE 补全更好

**Tailwind CSS v3**
- 原子化 CSS，与 React 组件化配合良好
- 暗色主题通过 CSS 变量 + Tailwind 颜色系统实现，支持自定义字体、动画、颜色扩展

**Recharts**
- 基于 React 的声明式图表库，天然契合组件化开发方式
- 支持折线图、面积图，自定义 Tooltip / Legend 灵活，与 TypeScript 兼容良好

**xlsx（SheetJS）**
- 支持 `.xlsx`、`.xls`、`.csv` 多种格式，纯前端解析，无需后端支持

**React Router v6**
- SPA 客户端路由，支持嵌套路由，便于未来工具模块扩展

**lucide-react**
- 轻量、风格统一，Tree-shakeable，按需引入不增加冗余体积

---

## 项目结构

```
ToolBox/
├── src/
│   ├── components/       # 公共组件（Navbar、ToolCard 等）
│   ├── pages/            # 页面组件（首页等）
│   ├── tools/            # 工具模块目录
│   │   └── excel-to-chart/   # Excel 转折线图工具
│   ├── data/             # 工具注册数据
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数（Excel 解析、数据处理等）
│   ├── App.tsx           # 根组件与路由配置
│   └── main.tsx          # 应用入口
├── docs/                 # 详细文档目录
│   ├── tools/            # 各工具说明文档
│   └── node-setup.md     # Node.js 环境配置指南
├── iterations/           # 迭代记录（含构建过程、技术选型等）
└── README.md             # 项目说明（本文件）
```

---

## 开发规范

> ⚠️ **强制要求**：每次开发（功能新增、Bug 修复、重构、架构变更）必须同步维护以下三类文档，未记录的变更视为不完整交付。

### 规则一：迭代记录（每次必做）

在 `iterations/` 目录下新建迭代文档，完成后更新 `iterations/README.md` 中的迭代历史表格。

**文件命名**：`ITERATION-<序号>-<简短描述>.md`（序号三位，从 001 起严格递增）

详细模板与规则见 → [iterations/README.md](./iterations/README.md)

### 规则二：工具文档（新增工具时必做）

新增工具时，需同步完成以下三处更新：

1. 在 `docs/tools/` 下创建工具说明文档（文件名与工具 ID 一致，如 `image-compress.md`）
2. 在 `docs/README.md` 的工具文档表格中补充一行
3. 在本文件（README.md）的"已有工具"表格中补充一行

详细要求见 → [docs/README.md](./docs/README.md)

### 规则三：架构说明（架构变更时必做）

涉及以下内容的变更，需更新本文件（README.md）中的"技术栈"或"项目结构"章节：

- 新增或替换依赖库
- 调整 `src/` 目录结构
- 变更构建配置或框架版本

### 新增工具完整步骤

1. 在 `src/tools/` 下创建工具目录（如 `src/tools/image-compress/`）
2. 实现工具页面及子组件
3. 在 `src/data/tools.ts` 中注册工具元数据（名称、类别、标签、路径等）
4. 在 `src/App.tsx` 中添加路由
5. 在 `docs/tools/` 下创建工具说明文档 **（规则二）**
6. 更新 `docs/README.md` 工具列表 **（规则二）**
7. 在 `iterations/` 下新建迭代文档，更新 `iterations/README.md` **（规则一）**
8. 更新本文件"已有工具"表格 **（规则二）**

### 迭代历史

| 序号 | 标题 | 时间 | 类型 |
|------|------|------|------|
| [001](./iterations/ITERATION-001-项目初始化与首页.md) | 项目初始化与首页 | 2026-03-11 | 新功能 |

---

## License

MIT
