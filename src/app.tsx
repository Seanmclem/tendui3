import React from "react";
import { createRoot } from "react-dom/client";
import { Button, Card, Input, Badge } from "./components";

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card title="🚀 Component Library Demo" className="text-center">
          <p className="text-gray-600 mb-4">
            Welcome to your Electron app with reusable components!
          </p>
          <div className="flex justify-center space-x-2">
            <Badge variant="success">Ready</Badge>
            <Badge variant="info">React 19</Badge>
            <Badge variant="warning">TypeScript</Badge>
          </div>
        </Card>

        {/* Counter Section */}
        <Card title="Counter Component">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 mb-4">
              Count: {count}
            </p>
            <div className="space-x-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setCount(count - 1)}
              >
                Decrease
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setCount(count + 1)}
              >
                Increase
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Form Section */}
        <Card title="Input Components">
          <div className="space-y-4">
            <Input
              label="Text Input"
              placeholder="Enter some text..."
              value={inputValue}
              onChange={setInputValue}
            />

            <Input
              label="Email Input"
              type="email"
              placeholder="Enter your email..."
            />

            <Input
              label="Password Input"
              type="password"
              placeholder="Enter password..."
            />

            <Input
              label="Input with Error"
              placeholder="This input has an error"
              error="This field is required"
            />

            <Input
              label="Disabled Input"
              placeholder="This input is disabled"
              disabled
            />
          </div>
        </Card>

        {/* Button Showcase */}
        <Card title="Button Variants">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Sizes:</h4>
              <div className="space-x-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">Variants:</h4>
              <div className="space-x-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Badge Showcase */}
        <Card title="Badge Components">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Variants:</h4>
              <div className="space-x-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Sizes:</h4>
              <div className="space-x-2">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
