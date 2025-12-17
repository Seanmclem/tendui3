import React from "react";
import { useAppStateStore } from "../../stores/appStateStore";
import { TerminalManager } from "../terminals";

export const MainArea = () => {
  const items = useAppStateStore((state) => state.items);

  return (
    <>
      {items.map((item) => {
        const { id, isActive, hasTerminals, content } = item;
        const isVisible = isActive === true;

        if (!hasTerminals) {
          return null;
        }

        return (
          <div
            key={id}
            style={{ display: isVisible ? "block" : "none" }}
            className="min-h-full h-full"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {content.title}
              </h2>
              <p className="text-gray-600 mb-4">{content.description}</p>
              <TerminalManager
                pageType={id}
                className="h-[calc(100vh-180px)]"
              />
            </div>
          </div>
        );
      })}
    </>
  );
};
