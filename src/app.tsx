import { createRoot } from "react-dom/client";
import { Layout } from "./features/layout";
import { MainArea } from "./features/main-area";

const App = () => {
  return (
    <Layout>
      <MainArea />
    </Layout>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
