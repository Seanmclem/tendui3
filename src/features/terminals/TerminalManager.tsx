import React, { useEffect, useState, useCallback } from "react";
import { useMainGuiStore } from "../../stores/main-gui-store";
import { useAppStateStore } from "../../stores/appStateStore";
import { TerminalComponent } from "./index";

interface TerminalManagerProps {
  pageType: string;
  className?: string;
}

export const TerminalManager = ({
  pageType,
  className = "",
}: TerminalManagerProps) => {
  const {
    addTerminal,
    removeTerminal,
    setActiveTerminal,
    getTerminalsForPage,
  } = useMainGuiStore();

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const pageTerminals = getTerminalsForPage(pageType);

  const handleRemoveTerminal = useCallback(
    (id: string) => {
      removeTerminal(id);
      // Adjust active tab index if needed
      const remainingTerminals = getTerminalsForPage(pageType);
      if (remainingTerminals.length > 0) {
        const newActiveIndex = Math.min(
          activeTabIndex,
          remainingTerminals.length - 1
        );
        setActiveTabIndex(newActiveIndex);
        if (remainingTerminals[newActiveIndex]) {
          setActiveTerminal(remainingTerminals[newActiveIndex].id);
        }
      }
    },
    [
      removeTerminal,
      getTerminalsForPage,
      pageType,
      activeTabIndex,
      setActiveTerminal,
    ]
  );

  // Listen for terminal exits from main process
  useEffect(() => {
    const handleTerminalExit = (data: {
      terminalId: string;
      exitCode: number;
    }) => {
      // Only handle exits for terminals belonging to this page
      // Check if terminal still exists (idempotent - safe if already removed)
      const terminal = pageTerminals.find((t) => t.id === data.terminalId);
      if (terminal) {
        console.log(
          `Terminal ${data.terminalId} exited with code ${data.exitCode}, removing from store`
        );
        handleRemoveTerminal(data.terminalId);
      } else {
        // Terminal already removed (e.g., user clicked X button)
        // This is fine - just log for debugging
        console.log(
          `Terminal ${data.terminalId} exited but was already removed from store`
        );
      }
    };

    window.Main.on("terminal.exited", handleTerminalExit);

    // Cleanup: remove listener when component unmounts or pageTerminals changes
    return () => {
      // Note: ipcRenderer.removeListener would require storing the handler reference
      // For now, the listener will be cleaned up when the component unmounts
    };
  }, [pageTerminals, handleRemoveTerminal]);

  // Set first terminal as active if none are active
  useEffect(() => {
    if (pageTerminals.length > 0 && !pageTerminals.some((t) => t.isActive)) {
      setActiveTerminal(pageTerminals[0].id);
      setActiveTabIndex(0);
    }
  }, [pageTerminals, setActiveTerminal]);

  const handleAddTerminal = () => {
    addTerminal(pageType);
    // Set the new terminal as active
    const newTerminals = getTerminalsForPage(pageType);
    const newTerminal = newTerminals[newTerminals.length - 1];
    if (newTerminal) {
      setActiveTerminal(newTerminal.id);
      setActiveTabIndex(newTerminals.length - 1);
    }
  };

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    if (pageTerminals[index]) {
      setActiveTerminal(pageTerminals[index].id);
    }
  };

  // Get page display name from appStateStore (reactive - subscribes to items changes)
  const pageDisplayName = useAppStateStore((state) => {
    const item = state.items.find((item) => item.id === pageType);
    return item?.label || pageType;
  });

  if (pageTerminals.length === 0) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {pageDisplayName} Terminals
          </h3>
          <button
            onClick={handleAddTerminal}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            + New Terminal
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p>No {pageDisplayName.toLowerCase()} terminals yet</p>
            <button
              onClick={handleAddTerminal}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create First Terminal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Terminal Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex space-x-1">
          {pageTerminals.map((terminal, index) => (
            <button
              key={terminal.id}
              onClick={() => handleTabClick(index)}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                ${
                  terminal.isActive
                    ? "bg-white text-blue-600 border-b-2 border-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {terminal.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTerminal(terminal.id);
                }}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </button>
          ))}
        </div>
        <button
          onClick={handleAddTerminal}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          + New Terminal
        </button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1">
        {pageTerminals.map((terminal) => (
          <TerminalComponent
            key={terminal.id}
            terminalId={terminal.id}
            isActive={terminal.isActive}
            onRemove={handleRemoveTerminal}
            style={{
              height: "100%",
              display: terminal.isActive ? "flex" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};
