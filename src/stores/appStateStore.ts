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
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  isDisabled?: boolean;
  hasTerminals?: boolean;
}

export interface SidebarState {
  items: AppItem[];
  isLoading: boolean;
  setActiveApp: (id: string) => void;
  getLabelById: (id: string) => string | undefined;
  createItem: (item: Omit<AppItem, "isActive">) => Promise<void>;
  updateItem: (id: string, updates: Partial<AppItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  loadItems: () => Promise<void>;
}

// Helper function to save items to file via IPC
const saveItemsToFile = async (items: AppItem[]): Promise<boolean> => {
  return new Promise((resolve) => {
    const handleSaved = (response: { success: boolean; error?: string }) => {
      window.Main.removeListener("sidebarConfig.saved", handleSaved);
      if (response.success) {
        resolve(true);
      } else {
        console.error("Error saving sidebar config:", response.error);
        resolve(false);
      }
    };

    window.Main.on("sidebarConfig.saved", handleSaved);
    window.Main.saveSidebarConfig(items);
  });
};

export const useAppStateStore = create<SidebarState>((set, get) => ({
  items: [],
  isLoading: true,

  loadItems: async () => {
    return new Promise<void>((resolve) => {
      set({ isLoading: true });

      const handleLoaded = (items: AppItem[]) => {
        window.Main.removeListener("sidebarConfig.loaded", handleLoaded);
        set({ items, isLoading: false });
        resolve();
      };

      window.Main.on("sidebarConfig.loaded", handleLoaded);
      window.Main.loadSidebarConfig();
    });
  },

  setActiveApp: (id: string) => {
    // Update the active state of all items
    const updatedItems = get().items.map((item) => ({
      ...item,
      isActive: item.id === id,
    }));

    set({ items: updatedItems });
    // Note: We don't save on active state change as it's temporary UI state
  },

  getLabelById: (id: string) => {
    const item = get().items.find((item) => item.id === id);
    return item?.label;
  },

  createItem: async (item: Omit<AppItem, "isActive">) => {
    const newItem: AppItem = {
      ...item,
      isActive: false,
    };
    const updatedItems = [...get().items, newItem];
    set({ items: updatedItems });
    await saveItemsToFile(updatedItems);
  },

  updateItem: async (id: string, updates: Partial<AppItem>) => {
    const updatedItems = get().items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    set({ items: updatedItems });
    await saveItemsToFile(updatedItems);
  },

  removeItem: async (id: string) => {
    const updatedItems = get().items.filter((item) => item.id !== id);
    set({ items: updatedItems });
    await saveItemsToFile(updatedItems);
  },
}));
