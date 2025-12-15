import React from "react";
import { useSidebarStore } from "../../types/sidebar";
import { Card, Badge } from "../../components";
import { TerminalManager } from "../terminals";

const MainArea = () => {
  const { getActiveApp: getActiveItem } = useSidebarStore();
  const activeItem = getActiveItem();

  if (!activeItem) {
    return (
      <div className="p-8">
        <Card title="Select an item">
          <p className="text-gray-600">
            Choose an option from the sidebar to get started.
          </p>
        </Card>
      </div>
    );
  }

  const { content } = activeItem;

  if (activeItem.hasTerminals) {
    return (
      <div className="min-h-full h-full">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {content.title}
          </h2>
          <p className="text-gray-600 mb-4">{content.description}</p>
          <TerminalManager
            pageType={activeItem.id}
            className="h-[calc(100vh-180px)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="p-8">
        <Card title={content.title} className={content.className}>
          <p className="text-gray-600 mb-4">{content.description}</p>

          {/* Special content for home page */}
          {activeItem.id === "home" && (
            <div className="flex justify-center space-x-2">
              <Badge variant="success">Ready</Badge>
              <Badge variant="info">React 19</Badge>
              <Badge variant="warning">TypeScript</Badge>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MainArea;
