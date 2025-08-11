export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  category: string;
  isActive?: boolean;
  isDisabled?: boolean;
  content: {
    title: string;
    description: string;
    className?: string;
  };
}

export interface SidebarCategory {
  id: string;
  label: string;
  items: SidebarItem[];
}

export interface SidebarState {
  items: SidebarItem[];
  categories: SidebarCategory[];
  activeItemId: string | null;
  setActiveItem: (id: string) => void;
  getActiveItem: () => SidebarItem | null;
}
