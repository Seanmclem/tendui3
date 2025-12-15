import { create } from "zustand";

export interface AppItem {
  id: string;
  label: string;
  icon: string;
  category: string;
  isActive?: boolean;
  isDisabled?: boolean;
  hasTerminals?: boolean;
  content: {
    title: string;
    description: string;
    className?: string;
  };
  terminals?: Terminal[];
  activeTerminalId?: string;
}

interface Terminal {
  id: string;
  name: string;
  pageType: string;
}

export interface SidebarAppsCategory {
  id: string;
  label: string;
  items: AppItem[];
}

export interface SidebarState {
  items: AppItem[];
  categories: SidebarAppsCategory[];
  setActiveApp: (id: string) => void;
  getActiveApp: () => AppItem | undefined;
}

// Sample data for the sidebar
const sidebarData: AppItem[] = [
  // Home category
  {
    id: "home",
    label: "Home",
    icon: "🏠",
    category: "home",
    isActive: true,
    content: {
      title: "🚀 Welcome to TendUI",
      description: "Your development toolkit with reusable components!",
      className: "text-center",
    },
  },

  // Development category
  {
    id: "terminals",
    label: "Terminals",
    icon: "💻",
    category: "development",
    hasTerminals: true,
    content: {
      title: "💻 Terminals",
      description: "Terminal management coming soon...",
    },
    terminals: [],
  },
  {
    id: "files",
    label: "File Explorer",
    icon: "📁",
    category: "development",
    hasTerminals: true,
    content: {
      title: "📁 File Explorer",
      description: "File explorer coming soon...",
    },
    terminals: [],
  },
  {
    id: "git",
    label: "Git",
    icon: "🔧",
    category: "development",
    hasTerminals: true,
    content: {
      title: "🔧 Git Tools",
      description: "Git integration coming soon...",
    },
    terminals: [],
  },

  // Tools category
  {
    id: "calculator",
    label: "Calculator",
    icon: "🧮",
    category: "tools",
    hasTerminals: true,
    content: {
      title: "🧮 Calculator",
      description: "Calculator tool coming soon...",
    },
    terminals: [],
  },
  {
    id: "converter",
    label: "Converter",
    icon: "🔄",
    category: "tools",
    hasTerminals: true,
    content: {
      title: "🔄 Converter",
      description: "Conversion tools coming soon...",
    },
    terminals: [],
  },
  {
    id: "generator",
    label: "Generator",
    icon: "⚡",
    category: "tools",
    hasTerminals: true,
    content: {
      title: "⚡ Generator",
      description: "Data generators coming soon...",
    },
    terminals: [],
  },

  // Settings category
  {
    id: "preferences",
    label: "Preferences",
    icon: "⚙️",
    category: "settings",
    content: {
      title: "⚙️ Preferences",
      description: "Settings and preferences coming soon...",
    },
  },
  {
    id: "about",
    label: "About",
    icon: "ℹ️",
    category: "settings",
    content: {
      title: "ℹ️ About TendUI",
      description: "Version 1.0.0 - Development Toolkit",
    },
  },
];

const categories: SidebarAppsCategory[] = [
  {
    id: "home",
    label: "",
    items: sidebarData.filter((item) => item.category === "home"),
  },
  {
    id: "development",
    label: "Development",
    items: sidebarData.filter((item) => item.category === "development"),
  },
  {
    id: "tools",
    label: "Tools",
    items: sidebarData.filter((item) => item.category === "tools"),
  },
  {
    id: "settings",
    label: "Settings",
    items: sidebarData.filter((item) => item.category === "settings"),
  },
];

export const useSidebarStore = create<SidebarState>((set, get) => ({
  items: sidebarData,
  categories,

  setActiveApp: (id: string) => {
    // Update the active state of all items
    const updatedItems = get().items.map((item) => ({
      ...item,
      isActive: item.id === id,
    }));

    set({ items: updatedItems });
  },

  getActiveApp: () => {
    const { items } = get();
    return items.find((item) => item.isActive === true) || undefined;
  },
}));
