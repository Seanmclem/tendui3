import { useMainGuiStore } from "../../stores/main-gui-store";
import { useAppStateStore } from "../../stores/appStateStore";

export const Home = () => {
  const terminalInstances = useMainGuiStore((state) => state.terminalInstances);
  const items = useAppStateStore((state) => state.items);

  // Get home page config from store
  const homeItem = items.find((item) => item.id === "home");

  const {
    title: homeTitle,
    description: homeDescription,
    className: homeClassName,
  } = homeItem?.content || {};

  // Calculate dynamic stats
  const totalTerminals = terminalInstances.length;
  const pagesWithTerminals = items.filter((item) => item.hasTerminals).length;
  const totalPages = items.length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className={`mb-8 ${homeClassName}`}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{homeTitle}</h1>
        <p className="text-lg text-gray-600">{homeDescription}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalPages}
              </p>
            </div>
            <div className="text-4xl">📄</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Terminals
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalTerminals}
              </p>
            </div>
            <div className="text-4xl">💻</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Terminal Pages
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {pagesWithTerminals}
              </p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items
            .filter((item) => item.hasTerminals)
            .slice(0, 4)
            .map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  useAppStateStore.getState().setActiveApp(item.id);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">
                      {item.content.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity or Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Getting Started
        </h2>
        <p className="text-gray-700 mb-4">
          TendUI is your all-in-one development toolkit. Navigate through the
          sidebar to access different tools and features.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Create terminals for different pages to manage your workflow</li>
          <li>Use the sidebar to switch between different tools</li>
          <li>Each page can have multiple terminal instances</li>
        </ul>
      </div>
    </div>
  );
};
