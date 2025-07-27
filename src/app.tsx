import React from "react";
import { createRoot } from "react-dom/client";

// Example component
const Header: React.FC = () => (
  <header
    style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "1rem",
      textAlign: "center",
      borderRadius: "8px 8px 0 0",
    }}
  >
    <h1>🚀 Electron + React + TypeScript</h1>
    <p>Welcome to your modern Electron application!</p>
  </header>
);

// Example component with props
interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = React.useState(initialValue);

  return (
    <div
      style={{
        padding: "1rem",
        textAlign: "center",
        background: "#f8f9fa",
        borderRadius: "8px",
        margin: "1rem 0",
      }}
    >
      <h3>Counter Component</h3>
      <p>
        Count: <strong>{count}</strong>
      </p>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            padding: "0.5rem 1rem",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Decrease
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: "0.5rem 1rem",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Increase
        </button>
        <button
          onClick={() => setCount(initialValue)}
          style={{
            padding: "0.5rem 1rem",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Header />

      <main
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Counter initialValue={42} />

        <div
          style={{
            padding: "1rem",
            background: "#e9ecef",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        >
          <h3>🎉 You're all set!</h3>
          <p>
            This is a React component running in Electron with TypeScript
            support.
          </p>
          <ul>
            <li>✅ React 19 with TypeScript</li>
            <li>✅ Electron Forge with Webpack</li>
            <li>✅ Hot reloading in development</li>
            <li>✅ Modern JSX transform</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

// Create and render the React app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
