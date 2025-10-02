export interface MenuItem {
  id: number;
  title: string;
  url?: string;
  icon?: string;
  parentId?: number | null;
  children?: MenuItem[];
}



