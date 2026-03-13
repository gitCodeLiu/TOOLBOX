import type { Tool, Category } from '../types/tool';

export const TOOLS: Tool[] = [
  {
    id: 'excel-to-chart',
    name: 'Excel 转折线图',
    description: '将 Excel 文件中的数据转换为可交互的折线图，支持多系列数据对比，显示/隐藏折线，导出图表等功能。',
    category: 'data',
    tags: ['excel', 'chart', '折线图', '数据可视化', '图表'],
    path: '/tools/excel-to-chart',
    icon: '📈',
    isNew: true,
    isHot: true,
  },
];

export const CATEGORIES: Category[] = [
  { id: 'all', label: '全部工具', icon: '🧰' },
  { id: 'data', label: '数据处理', icon: '📊' },
  { id: 'image', label: '图像处理', icon: '🖼️' },
  { id: 'text', label: '文本工具', icon: '📝' },
  { id: 'converter', label: '格式转换', icon: '🔄' },
  { id: 'generator', label: '内容生成', icon: '✨' },
  { id: 'utility', label: '实用工具', icon: '🔧' },
];
