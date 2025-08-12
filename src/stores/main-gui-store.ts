import { create } from "zustand";

interface TerminalInstance {
  id: string;
  name: string;
  isActive: boolean;
  pageType: string; // Which page this terminal belongs to
  isReady?: boolean; // Whether the terminal process is ready
}

interface MainGuiState {
  menuOptions: string[];
  setMenuOptions: (update: string[]) => void;

  selectedMenuOption: string;
  setSelectedMenuOption: (update: string) => void;

  // Page-specific terminal management
  terminalInstances: TerminalInstance[];
  addTerminal: (pageType: string) => void;
  removeTerminal: (id: string) => void;
  setActiveTerminal: (id: string) => void;
  getActiveTerminal: (pageType: string) => TerminalInstance | null;
  getTerminalsForPage: (pageType: string) => TerminalInstance[];

  // Terminal data handling
  setTerminalReady: (id: string) => void;
  handleTerminalData: (terminalId: string, data: string) => void;
}

// Helper function to get page display name
const getPageDisplayName = (pageType: string): string => {
  const pageNames: Record<string, string> = {
    terminals: "Terminal",
    files: "File Explorer",
    git: "Git",
    calculator: "Calculator",
    converter: "Converter",
    generator: "Generator",
  };
  return pageNames[pageType] || pageType;
};

export const useMainGuiStore = create<MainGuiState>((set, get) => ({
  menuOptions: ["Home", "package.json", "Vite", "Astro"],
  setMenuOptions: (update: string[]) => set({ menuOptions: update }),

  selectedMenuOption: "package.json",
  setSelectedMenuOption: (update: string) =>
    set({ selectedMenuOption: update }),

  // Page-specific terminal management
  terminalInstances: [],
  addTerminal: (pageType: string) => {
    const { terminalInstances } = get();
    const pageTerminals = terminalInstances.filter(
      (term) => term.pageType === pageType
    );

    const pageDisplayName = getPageDisplayName(pageType);
    const newTerminal: TerminalInstance = {
      id: `terminal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${pageDisplayName} ${pageTerminals.length + 1}`,
      isActive: true,
      pageType,
      isReady: false,
    };

    // Deactivate all other terminals in the same page
    const updatedInstances = terminalInstances.map((term) => ({
      ...term,
      isActive: term.pageType === pageType ? false : term.isActive,
    }));

    set({
      terminalInstances: [...updatedInstances, newTerminal],
    });
  },

  removeTerminal: (id: string) => {
    const { terminalInstances } = get();
    const terminalToRemove = terminalInstances.find((term) => term.id === id);
    const filtered = terminalInstances.filter((term) => term.id !== id);

    // If we're removing the active terminal and there are others in the same page, activate the first one
    if (terminalToRemove && terminalToRemove.isActive) {
      const pageTerminals = filtered.filter(
        (term) => term.pageType === terminalToRemove.pageType
      );
      if (pageTerminals.length > 0) {
        pageTerminals[0].isActive = true;
      }
    }

    set({ terminalInstances: filtered });
  },

  setActiveTerminal: (id: string) => {
    const { terminalInstances } = get();
    const targetTerminal = terminalInstances.find((term) => term.id === id);
    if (!targetTerminal) return;

    const updatedInstances = terminalInstances.map((term) => ({
      ...term,
      isActive:
        term.pageType === targetTerminal.pageType
          ? term.id === id
          : term.isActive,
    }));
    set({ terminalInstances: updatedInstances });
  },

  getActiveTerminal: (pageType: string) => {
    const { terminalInstances } = get();
    return (
      terminalInstances.find(
        (term) => term.pageType === pageType && term.isActive
      ) || null
    );
  },

  getTerminalsForPage: (pageType: string) => {
    const { terminalInstances } = get();
    return terminalInstances.filter((term) => term.pageType === pageType);
  },

  // Terminal data handling
  setTerminalReady: (id: string) => {
    const { terminalInstances } = get();
    const updatedInstances = terminalInstances.map((term) =>
      term.id === id ? { ...term, isReady: true } : term
    );
    set({ terminalInstances: updatedInstances });
  },

  handleTerminalData: (terminalId: string, data: string) => {
    // This method can be used to handle incoming terminal data
    // For now, it's a placeholder for future data processing
    console.log(`Terminal ${terminalId} received data:`, data);
  },
}));
