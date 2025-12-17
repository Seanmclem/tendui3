import {
  useAppStateStore,
  AppItem,
  SidebarItem,
} from "../../stores/appStateStore";

const SidebarItemComponent = ({
  id,
  isActive,
  isDisabled,
  icon,
  label,
}: SidebarItem) => {
  const setActiveApp = useAppStateStore((state) => state.setActiveApp);

  return (
    <div
      className={`
        flex items-center px-4 py-3 cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-blue-100 border-r-2 border-blue-500 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onClick={() => !isDisabled && setActiveApp(id)}
    >
      <span className="text-lg mr-3 w-6 text-center">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
};

export const Sidebar = () => {
  const items = useAppStateStore((state) => state.items);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col flex-shrink-0">
      {/* Fixed Header */}
      <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800">TendUI</h1>
        <p className="text-sm text-gray-500">Development Tools</p>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {items.map(({ id, isActive, isDisabled, icon, label }: AppItem) => (
          <SidebarItemComponent
            key={id}
            id={id}
            isActive={isActive}
            isDisabled={isDisabled}
            icon={icon}
            label={label}
          />
        ))}
      </nav>

      {/* Fixed Footer */}
      <div className="p-2 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">v1.0.0</div>
      </div>
    </div>
  );
};
