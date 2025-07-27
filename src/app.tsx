import React from "react";
import { createRoot } from "react-dom/client";

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🚀 Electron + React + TypeScript
        </h1>

        <p className="text-lg text-gray-700 mb-6">
          Welcome to your modern Electron application!
        </p>

        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 mb-4">
            Count: {count}
          </p>

          <div className="space-x-4">
            <button
              onClick={() => setCount(count - 1)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Decrease
            </button>

            <button
              onClick={() => setCount(count + 1)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Increase
            </button>

            <button
              onClick={() => setCount(0)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-100 rounded border border-yellow-300">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            ✅ Tailwind CSS Test
          </h2>
          <p className="text-yellow-700">
            If you see colors and styling, Tailwind is working!
          </p>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
