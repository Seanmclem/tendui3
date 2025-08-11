import React from "react";
import { useSidebarStore } from "../../stores/sidebarStore";
import { SidebarItem, SidebarCategory } from "../../types/sidebar";

const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
  const { setActiveItem, activeItemId } = useSidebarStore();
  const isActive = activeItemId === item.id;

  return (
    <div
      className={`
        flex items-center px-4 py-3 cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-blue-100 border-r-2 border-blue-500 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }
        ${item.isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onClick={() => !item.isDisabled && setActiveItem(item.id)}
    >
      <span className="text-lg mr-3 w-6 text-center">{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </div>
  );
};

const SidebarCategoryComponent = ({
  category,
}: {
  category: SidebarCategory;
}) => {
  if (category.items.length === 0) return null;

  return (
    <div className="mb-2">
      {category.label && (
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {category.label}
        </div>
      )}
      {category.items.map((item) => (
        <SidebarItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};

const Sidebar = () => {
  const { categories } = useSidebarStore();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col flex-shrink-0">
      {/* Fixed Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800">TendUI</h1>
        <p className="text-sm text-gray-500">Development Tools</p>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {categories.map((category) => (
          <SidebarCategoryComponent key={category.id} category={category} />
        ))}
      </nav>

      {/* Fixed Footer */}
      <div className="p-2 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">v1.0.0</div>
      </div>
    </div>
  );
};

export default Sidebar;
