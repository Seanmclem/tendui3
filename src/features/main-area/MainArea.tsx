import { useAppStateStore } from "../../stores/appStateStore";
import { TerminalManager } from "../terminals";
import { Home } from "../home/Home";

export const MainArea = () => {
  const items = useAppStateStore((state) => state.items);

  /**
   * MainArea component displays the main content area of the application.
   *
   * Responsibilities:
   * - Displays content for the active page (title, description)
   * - Renders TerminalManager for pages that support terminals (hasTerminals: true)
   * - Renders Home component for the home page (always available)
   * - Renders content for other non-terminal pages (Preferences, About, etc.)
   * - Shows/hides content based on which page is active (isActive)
   *
   * Note: The sidebar is rendered by the Layout component, not this component.
   */
  return (
    <>
      {items.map((item) => {
        const { id, isActive, hasTerminals, content } = item;
        const isVisible = isActive === true;

        if (!isVisible) {
          return null;
        }

        // Home page - always show with dynamic content
        if (id === "home") {
          return (
            <div
              key={id}
              style={{ display: isVisible ? "block" : "none" }}
              className="min-h-full h-full overflow-auto"
            >
              <Home />
            </div>
          );
        }

        // Pages with terminals
        if (hasTerminals) {
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
        }

        // Other pages without terminals (Preferences, About, etc.)
        return (
          <div
            key={id}
            style={{ display: isVisible ? "block" : "none" }}
            className="min-h-full h-full overflow-auto"
          >
            <div className="p-8 max-w-4xl mx-auto">
              <div className={content.className || ""}>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {content.title}
                </h2>
                <p className="text-lg text-gray-600">{content.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
