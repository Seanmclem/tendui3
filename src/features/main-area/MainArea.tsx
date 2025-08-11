import React from "react";
import { useSidebarStore } from "../../stores/sidebarStore";
import { Button, Card, Input, Badge } from "../../components";

const MainArea = () => {
  const { activeItemId, getActiveItem } = useSidebarStore();
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
