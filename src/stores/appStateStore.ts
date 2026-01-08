import { create } from "zustand";

export interface AppItem {
  id: string;
  label: string;
  icon: string;
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

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  isDisabled?: boolean;
  hasTerminals?: boolean;
}

interface Terminal {
  id: string;
  name: string;
  pageType: string;
}

export interface SidebarState {
  items: AppItem[];
  setActiveApp: (id: string) => void;
  getLabelById: (id: string) => string | undefined;
}

// Sample data for the sidebar
const sidebarData: AppItem[] = [
  // Home category
  {
    id: "home",
    label: "Home123",
    icon: "🏠",
    isActive: true,
    content: {
      title: "🚀 Welcome to TendUI",
      description: "Your development toolkit with reusable components!",
      className: "text-center",
    },
    terminals: [],
    activeTerminalId: null,
  },

  // Development category
  {
    id: "terminals",
    label: "Terminals",
    icon: "💻",
    hasTerminals: true,
    content: {
      title: "💻 Terminals",
      description: "Terminal management coming soon...",
    },
    terminals: [],
    activeTerminalId: null,
  },
  {
    id: "files",
    label: "File Explorer",
    icon: "📁",
    hasTerminals: true,
    content: {
      title: "📁 File Explorer",
      description: "File explorer coming soon...",
    },
    terminals: [],
    activeTerminalId: null,
  },
  {
    id: "git",
    label: "Git",
    icon: "🔧",
    hasTerminals: true,
    content: {
      title: "🔧 Git Tools",
      description: "Git integration coming soon...",
    },
    terminals: [],
    activeTerminalId: null,
  },

  // Tools category
  {
    id: "calculator",
    label: "Calculator",
    icon: "🧮",
    hasTerminals: true,
    content: {
      title: "🧮 Calculator",
      description: "Calculator tool coming soon...",
    },
    terminals: [],
    activeTerminalId: null,
  },
  {
    id: "converter",
    label: "Converter",
    icon: "🔄",
    hasTerminals: true,
    content: {
      title: "🔄 Converter",
      description: "Conversion tools coming soon...",
    },
    terminals: [],
    activeTerminalId: null,
  },
  {
    id: "generator",
    label: "Generator",
    icon: "⚡",
    hasTerminals: true,
    content: {
      title: "⚡ Generator",
      description: "Data generators coming soon...",
    },
    terminals: [],
    activeTerminalId: null,
  },

  // Settings category
  {
    id: "preferences",
    label: "Preferences",
    icon: "⚙️",
    content: {
      title: "⚙️ Preferences",
      description: "Settings and preferences coming soon...",
    },
    terminals: [],
    activeTerminalId: null,
  },
  {
    id: "about",
    label: "About",
    icon: "ℹ️",
    content: {
      title: "ℹ️ About TendUI",
      description: "Version 1.0.0 - Development Toolkit",
    },
    terminals: [],
    activeTerminalId: null,
  },
];

export const useAppStateStore = create<SidebarState>((set, get) => ({
  items: sidebarData,

  setActiveApp: (id: string) => {
    // Update the active state of all items
    const updatedItems = get().items.map((item) => ({
      ...item,
      isActive: item.id === id,
    }));

    set({ items: updatedItems });
  },

  getLabelById: (id: string) => {
    const item = get().items.find((item) => item.id === id);
    return item?.label;
  },
}));
