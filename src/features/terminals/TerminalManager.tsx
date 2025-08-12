import React, { useEffect, useState } from "react";
import { useMainGuiStore } from "../../stores/main-gui-store";
import { TerminalComponent } from "./TerminalComponent";

interface TerminalManagerProps {
  pageType: string;
  className?: string;
}

const TerminalManager = ({
  pageType,
  className = "",
}: TerminalManagerProps) => {
  const {
    terminalInstances,
    addTerminal,
    removeTerminal,
    setActiveTerminal,
    getTerminalsForPage,
  } = useMainGuiStore();

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const pageTerminals = getTerminalsForPage(pageType);

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

  const handleRemoveTerminal = (id: string) => {
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
  };

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    if (pageTerminals[index]) {
      setActiveTerminal(pageTerminals[index].id);
    }
  };

  if (pageTerminals.length === 0) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Terminals</h3>
          <button
            onClick={handleAddTerminal}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            + New Terminal
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p>No terminals yet</p>
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
        {pageTerminals.map((terminal, index) => (
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

export default TerminalManager;
