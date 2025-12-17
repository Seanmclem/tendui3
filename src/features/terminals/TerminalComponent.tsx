import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { useMainGuiStore } from "../../stores/main-gui-store";

interface TerminalComponentProps {
  terminalId: string;
  isActive: boolean;
  onRemove: (id: string) => void;
  style?: React.CSSProperties;
}

export const TerminalComponent = ({
  terminalId,
  isActive,
  onRemove,
  style,
}: TerminalComponentProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [term, setTerm] = useState<Terminal | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const { setTerminalReady } = useMainGuiStore();

  useEffect(() => {
    if (!isMounted && terminalRef.current) {
      setIsMounted(true);

      // Create new terminal instance
      const newTerm = new Terminal({
        cols: 80,
        rows: 30,
        scrollback: 1000,
      });

      // Open terminal in the DOM element
      newTerm.open(terminalRef.current);
      setTerm(newTerm);

      // Create the terminal process on the main process
      window.Main.createTerminal(terminalId);

      // Handle keystrokes
      newTerm.onData((text: string) => {
        console.log("Terminal keystroke:", text);
        window.Main.sendKeystroke(terminalId, text);
      });

      // Listen for incoming data from this specific terminal
      window.Main.on("terminal.incomingData", (data: any) => {
        // Handle both new format (with terminalId) and legacy format
        if (data.terminalId && data.terminalId === terminalId) {
          newTerm.write(data.data);
        } else if (typeof data === "string") {
          // Legacy format - only write if this is the first/only terminal
          newTerm.write(data);
        }
      });

      // Mark terminal as ready
      setTerminalReady(terminalId);
    }
  }, [isMounted, terminalId, setTerminalReady]);

  // Handle ResizeObserver based on active state
  useEffect(() => {
    if (term && terminalRef.current) {
      // Clean up existing observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      // Only create observer when terminal is active
      if (isActive) {
        const resizeObserver = new ResizeObserver(() => {
          if (term && terminalRef.current) {
            term.resize(80, 30);
          }
        });

        resizeObserver.observe(terminalRef.current);
        resizeObserverRef.current = resizeObserver;
      }
    }

    // Cleanup function
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [term, isActive]);

  useEffect(() => {
    if (term && isActive) {
      // Focus the terminal when it becomes active
      term.focus();
    }
  }, [isActive, term]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (term) {
        term.dispose();
      }
    };
  }, [term]);

  const handleRemove = () => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    if (term) {
      term.dispose();
    }
    window.Main.removeTerminal(terminalId);
    onRemove(terminalId);
  };

  return (
    <div
      style={{
        ...style,
        display: isActive ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">
          Terminal {terminalId}
        </span>
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition-colors text-lg font-bold"
        >
          ×
        </button>
      </div>
      <div ref={terminalRef} className="flex-1" />
    </div>
  );
};
