import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { Layout } from "./features/layout";
import { MainArea } from "./features/main-area";
import { useAppStateStore } from "./stores/appStateStore";

const App = () => {
  const loadItems = useAppStateStore((state) => state.loadItems);

  useEffect(() => {
    // Load sidebar(all apps) configuration on app start (run once on mount)
    loadItems();
  }, []);

  return (
    <Layout>
      {/* Sidebar is rendered by 
      the above^ Layout component, not this component. */}
      <MainArea />
    </Layout>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
