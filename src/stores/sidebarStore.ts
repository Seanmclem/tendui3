import { create } from "zustand";
import { SidebarItem, SidebarCategory, SidebarState } from "../types/sidebar";

// Sample data for the sidebar
const sidebarData: SidebarItem[] = [
  // Home category
  {
    id: "home",
    label: "Home",
    icon: "🏠",
    category: "home",
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
    content: {
      title: "💻 Terminals",
      description: "Terminal management coming soon...",
    },
  },
  {
    id: "files",
    label: "File Explorer",
    icon: "📁",
    category: "development",
    content: {
      title: "📁 File Explorer",
      description: "File explorer coming soon...",
    },
  },
  {
    id: "git",
    label: "Git",
    icon: "🔧",
    category: "development",
    content: {
      title: "🔧 Git Tools",
      description: "Git integration coming soon...",
    },
  },

  // Tools category
  {
    id: "calculator",
    label: "Calculator",
    icon: "🧮",
    category: "tools",
    content: {
      title: "🧮 Calculator",
      description: "Calculator tool coming soon...",
    },
  },
  {
    id: "converter",
    label: "Converter",
    icon: "🔄",
    category: "tools",
    content: {
      title: "🔄 Converter",
      description: "Conversion tools coming soon...",
    },
  },
  {
    id: "generator",
    label: "Generator",
    icon: "⚡",
    category: "tools",
    content: {
      title: "⚡ Generator",
      description: "Data generators coming soon...",
    },
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

const categories: SidebarCategory[] = [
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
  activeItemId: "home",

  setActiveItem: (id: string) => {
    set({ activeItemId: id });

    // Update the active state of all items
    const updatedItems = get().items.map((item) => ({
      ...item,
      isActive: item.id === id,
    }));

    set({ items: updatedItems });
  },

  getActiveItem: () => {
    const { items, activeItemId } = get();
    return items.find((item) => item.id === activeItemId) || null;
  },
}));
