export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  path: string;
  icon: string;
  isNew?: boolean;
  isHot?: boolean;
}

export type ToolCategory =
  | 'data'
  | 'image'
  | 'text'
  | 'converter'
  | 'generator'
  | 'utility';

export interface Category {
  id: ToolCategory | 'all';
  label: string;
  icon: string;
  count?: number;
}
