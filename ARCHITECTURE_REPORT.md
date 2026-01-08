# TendUI3 Architecture Report

## Executive Summary

TendUI3 is an **Electron-based desktop application** that provides a development toolkit with terminal management capabilities. The app uses React for the UI, Zustand for state management, and Electron's IPC (Inter-Process Communication) for secure communication between the main process (Node.js) and renderer process (React).

---

## 1. Project Architecture Overview

### Technology Stack

- **Framework**: Electron 37.2.4
- **UI Library**: React 19.1.0
- **State Management**: Zustand 5.0.7
- **Terminal Emulator**: xterm.js 4.19.0
- **Terminal Backend**: node-pty 1.0.0
- **Styling**: Tailwind CSS 3.4.17
- **Build Tool**: Electron Forge with Webpack

### Process Model

The application follows Electron's standard process model:

- **Main Process** (`src/index.ts`): Node.js process that manages the application lifecycle, creates windows, and handles system-level operations
- **Renderer Process** (`src/renderer.ts` → `src/app.tsx`): React application running in a BrowserWindow
- **Preload Script** (`src/preload.ts`): Bridge between main and renderer processes, exposing secure IPC APIs

---

## 2. Communication Architecture

### 2.1 IPC Communication Flow

The application uses Electron's IPC (Inter-Process Communication) for secure communication between processes:

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Renderer       │         │   Preload    │         │  Main Process   │
│  (React)        │────────▶│   Script     │────────▶│  (Node.js)      │
│                 │         │              │         │                 │
│  window.Main.*  │         │  contextBridge│        │  ipcMain.on()   │
└─────────────────┘         └──────────────┘         └─────────────────┘
```

### 2.2 IPC Channels and Their Purposes

#### Terminal Management

- **`terminal.create`** (Renderer → Main)

  - Purpose: Creates a new terminal process using node-pty
  - Payload: `terminalId: string`
  - Response: Main process spawns a pty process and stores it in `terminalProcesses` Map
  - Data Flow: Main process listens for terminal output and sends it back via `terminal.incomingData`

- **`terminal.remove`** (Renderer → Main)

  - Purpose: Kills and removes a terminal process
  - Payload: `terminalId: string`
  - Effect: Process is killed and removed from `terminalProcesses` Map

- **`terminal.keystroke`** (Renderer → Main)

  - Purpose: Sends user input to a specific terminal
  - Payload: `{ terminalId: string, payload: string }`
  - Effect: Writes data to the pty process

- **`terminal.incomingData`** (Main → Renderer)
  - Purpose: Streams terminal output from pty process to renderer
  - Payload: `{ terminalId: string, data: string }`
  - Listener: Each `TerminalComponent` listens for its specific `terminalId`

#### File Operations

- **`getFile`** (Renderer → Main)

  - Purpose: Reads a file (currently hardcoded to read `package.json`)
  - Payload: `string` (directory path)
  - Response: `getFile` event with file contents

- **`saveFile`** (Renderer → Main)

  - Purpose: Writes content to a file
  - Payload: `{ path: string, contents: string }`
  - Response: `saveFileResponse` event with status

- **`goGetFolderOpenDialog`** (Renderer → Main)

  - Purpose: Opens a folder picker dialog or reads a specific folder
  - Payload: `string | undefined` (optional folder path)
  - Response: `getFolderResponse` with `{ contents: string[], selectedFolderPath: string }`

- **`goGetSpecificFolder`** (Renderer → Main)
  - Purpose: Reads directory contents without dialog
  - Payload: `string` (folder path)
  - Response: `goGetSpecificFolder_Response` with directory contents

#### Window Controls

- **`minimize`**, **`maximize`**, **`close`** (Renderer → Main)
  - Purpose: Window management controls
  - Used by: AppBar component (not currently visible in codebase)

### 2.3 Preload Script API (`window.Main`)

The preload script (`src/preload.ts`) exposes a secure API to the renderer process:

```typescript
window.Main = {
  // Terminal operations
  createTerminal(terminalId: string)
  removeTerminal(terminalId: string)
  sendKeystroke(terminalId: string, payload: any)

  // File operations
  saveFilePlease(payload: any)
  goGetFolderOpenDialog(payload?: any)
  goGetSpecificFolder(path: string)
  goGetFile(payload?: string)

  // Window controls
  Minimize(), Maximize(), Close()

  // Event listener
  on(channel: string, callback: (data: any) => void)
}
```

**Security Note**: The preload script uses `contextBridge` to safely expose APIs without enabling `nodeIntegration` in the renderer, following Electron security best practices.

---

## 3. State Management Architecture

The application uses **Zustand** for state management with two main stores:

### 3.1 App State Store (`appStateStore.ts`)

**Purpose**: Manages the sidebar navigation and page/app configuration

**State Structure**:

```typescript
interface AppItem {
  id: string; // Unique identifier (e.g., "home", "terminals", "files")
  label: string; // Display name
  icon: string; // Emoji icon
  isActive?: boolean; // Currently selected page
  isDisabled?: boolean; // Whether item is disabled
  hasTerminals?: boolean; // Whether this page supports terminals
  content: {
    title: string;
    description: string;
    className?: string;
  };
  terminals?: Terminal[]; // Legacy/unused
  activeTerminalId?: string; // Legacy/unused
}
```

**Store Methods**:

- `setActiveApp(id: string)`: Sets which page/app is currently active
- `getLabelById(id: string)`: Retrieves label for a given app ID

**Data Source**: Hardcoded `sidebarData` array with predefined pages:

- Home
- Terminals
- File Explorer
- Git
- Calculator
- Converter
- Generator
- Preferences
- About

**Consumers**:

- `Sidebar.tsx`: Reads `items` to render navigation
- `MainArea.tsx`: Reads `items` to determine which content to display
- `TerminalManager.tsx`: Uses `getLabelById` to get page display names

### 3.2 Main GUI Store (`main-gui-store.ts`)

**Purpose**: Manages terminal instances and their lifecycle

**State Structure**:

```typescript
interface TerminalInstance {
  id: string; // Unique terminal ID (e.g., "terminal-1234567890-abc123")
  name: string; // Display name (e.g., "Terminals 1")
  isActive: boolean; // Whether this terminal tab is active
  pageType: string; // Which page owns this terminal (e.g., "terminals", "files")
  isReady?: boolean; // Whether terminal process is initialized
}
```

**Store Methods**:

- `addTerminal(pageType: string)`: Creates a new terminal instance for a page
- `removeTerminal(id: string)`: Removes a terminal instance
- `setActiveTerminal(id: string)`: Activates a specific terminal (deactivates others in same page)
- `getActiveTerminal(pageType: string)`: Gets the active terminal for a page
- `getTerminalsForPage(pageType: string)`: Gets all terminals for a specific page
- `setTerminalReady(id: string)`: Marks terminal as ready
- `handleTerminalData(terminalId, data)`: Placeholder for terminal data processing

**Additional State**:

- `menuOptions: string[]`: Array of menu options (currently unused in UI)
- `selectedMenuOption: string`: Currently selected menu option (unused)

**Consumers**:

- `TerminalManager.tsx`: Primary consumer - manages terminal tabs and lifecycle
- `TerminalComponent.tsx`: Uses `setTerminalReady` when terminal initializes

### 3.3 State Flow Example: Creating a Terminal

1. User clicks "New Terminal" button in `TerminalManager`
2. `TerminalManager` calls `addTerminal(pageType)` from `main-gui-store`
3. Store creates new `TerminalInstance` with unique ID and name
4. Store updates `terminalInstances` array
5. `TerminalManager` re-renders with new terminal tab
6. `TerminalComponent` mounts and calls `window.Main.createTerminal(terminalId)`
7. Preload script sends IPC message to main process
8. Main process spawns pty process and stores it
9. `TerminalComponent` sets up xterm.js and listens for `terminal.incomingData`
10. Main process streams terminal output back via IPC

---

## 4. Component Hierarchy

```
App (app.tsx)
└── Layout
    ├── Sidebar
    │   └── SidebarItemComponent (multiple)
    └── MainArea
        └── TerminalManager (for each page with hasTerminals=true)
            └── TerminalComponent (for each terminal instance)
                └── xterm.js Terminal instance
```

### Component Responsibilities

#### `App` (`app.tsx`)

- Root component
- Renders `Layout` with `MainArea` as children

#### `Layout` (`Layout.tsx`)

- Provides overall page structure
- Renders `Sidebar` and main content area

#### `Sidebar` (`Sidebar.tsx`)

- Displays navigation items from `appStateStore`
- Handles navigation clicks via `setActiveApp()`
- Reads: `useAppStateStore((state) => state.items)`

#### `MainArea` (`MainArea.tsx`)

- Displays content for active page
- Filters items by `hasTerminals` flag
- Only renders `TerminalManager` for pages that support terminals
- Reads: `useAppStateStore((state) => state.items)`

#### `TerminalManager` (`TerminalManager.tsx`)

- Manages terminal tabs for a specific page
- Handles adding/removing terminals
- Manages active terminal state
- Reads: `useMainGuiStore` for terminal instances
- Reads: `useAppStateStore` for page display name

#### `TerminalComponent` (`TerminalComponent.tsx`)

- Individual terminal instance UI
- Integrates xterm.js terminal emulator
- Handles IPC communication for terminal I/O
- Manages terminal lifecycle (create, remove, resize)
- Writes: `setTerminalReady()` when initialized

---

## 5. Data Organization and Flow

### 5.1 Terminal Data Flow

```
User Types → xterm.js → TerminalComponent → window.Main.sendKeystroke()
                                                      ↓
                                              IPC: terminal.keystroke
                                                      ↓
                                              Main Process (node-pty)
                                                      ↓
                                              pty.onData() event
                                                      ↓
                                              IPC: terminal.incomingData
                                                      ↓
                                              TerminalComponent listener
                                                      ↓
                                              xterm.js.write()
```

### 5.2 Terminal Process Storage

**Main Process** (`src/index.ts`):

- Uses a `Map<string, any>` called `terminalProcesses`
- Key: `terminalId` (string)
- Value: pty process instance
- Lifecycle: Created on `terminal.create`, deleted on `terminal.remove` or process exit

**Renderer Process**:

- Terminal metadata stored in Zustand (`main-gui-store`)
- Terminal UI state managed by React components
- xterm.js Terminal instances stored in component state

### 5.3 Synchronization Between Main Process and Renderer Store

**Current Synchronization Mechanism**:

The `main-gui-store` (renderer) and `terminalProcesses` Map (main process) are kept in sync through **manual coordination** during user-initiated actions:

#### Terminal Creation Flow:

1. **Renderer**: `TerminalManager.handleAddTerminal()` → calls `addTerminal(pageType)` → updates `main-gui-store`
2. **Renderer**: `TerminalComponent` mounts → calls `window.Main.createTerminal(terminalId)` → IPC message
3. **Main Process**: Receives `terminal.create` → spawns pty process → stores in `terminalProcesses` Map

**Result**: Both sides have the terminal registered ✅

#### Terminal Removal Flow (User-Initiated):

1. **Renderer**: User clicks remove → `TerminalComponent.handleRemove()`
2. **Renderer**: Calls `window.Main.removeTerminal(terminalId)` → IPC message
3. **Main Process**: Receives `terminal.remove` → kills pty process → removes from `terminalProcesses` Map
4. **Renderer**: Calls `onRemove(terminalId)` → updates `main-gui-store` (removes from store)

**Result**: Both sides remove the terminal ✅

#### Terminal Exit Flow (Automatic/Unhandled Exit):

**Solution Implemented**: When a terminal process exits on its own (e.g., user types `exit` command, process crashes, or shell terminates):

1. **Main Process**: `ptyProcess.onExit()` handler fires → checks if terminal still exists in Map
2. **Main Process**: If terminal exists (unexpected exit), sends `terminal.exited` IPC message to renderer
3. **Renderer**: `TerminalManager` listens for `terminal.exited` events
4. **Renderer**: Calls `handleRemoveTerminal()` → removes from `main-gui-store`
5. **Result**: Both sides are synchronized ✅

**Double-Removal Prevention**:

- **Manual removal**: When user clicks remove button, main process deletes from Map BEFORE calling `kill()`, so `onExit` handler sees terminal is already gone and doesn't send `terminal.exited`
- **Automatic exit**: When process exits unexpectedly, terminal still exists in Map, so `onExit` sends notification to renderer
- **Renderer safeguard**: Checks if terminal exists in store before attempting removal (idempotent operation)

### 5.4 Page/Terminal Relationship

The application supports **page-specific terminals**:

- Each page (e.g., "Terminals", "File Explorer") can have multiple terminal instances
- Terminals are scoped to their `pageType`
- Only one terminal per page can be active at a time
- Terminal names are generated based on page display name (e.g., "Terminals 1", "File Explorer 2")

### 5.5 Active State Management

**Page Active State**:

- Managed in `appStateStore`
- Only one page can be `isActive: true` at a time
- Controlled by `setActiveApp(id)`
- Stored in: `items[].isActive` (boolean flag on each AppItem)

**Terminal Active State**:

- Managed in `main-gui-store`
- Only one terminal per page can be `isActive: true`
- Controlled by `setActiveTerminal(id)`
- Stored in: `terminalInstances[].isActive` (boolean flag on each TerminalInstance)
- **Scoped by `pageType`**: When setting a terminal active, only terminals in the same page are affected (see `setActiveTerminal` logic below)

**How Separate Are They?**

The states are **functionally independent** but have **UI-level coupling**:

#### State Independence:

1. **Different Stores**: Page state in `appStateStore`, terminal state in `main-gui-store`
2. **No Direct Interaction**: Changing page active state does NOT modify terminal active states, and vice versa
3. **Persistent Across Page Switches**: Terminal active states are preserved when switching pages. Each page "remembers" which terminal was active:
   ```typescript
   // From setActiveTerminal (main-gui-store.ts:101-104)
   isActive:
     term.pageType === targetTerminal.pageType
       ? term.id === id              // Only affects same page
       : term.isActive,               // Other pages keep their state
   ```

#### UI-Level Coupling:

1. **Visibility Control**: Terminals are only visible when their page is active (via `display: none` in `MainArea.tsx`)
2. **Per-Page Scoping**: Terminal active state is scoped by `pageType`, meaning:
   - Page "Terminals" can have Terminal 2 active
   - Page "File Explorer" can have Terminal 1 active
   - Both can be "active" simultaneously in state, but only the visible page's terminal is actually displayed

#### Example Scenario:

1. User is on "Terminals" page → Terminal "Terminals 2" is active
2. User switches to "File Explorer" page → "Terminals" page becomes inactive (hidden)
3. Terminal "Terminals 2" remains `isActive: true` in state, but is not visible
4. "File Explorer" page shows its own active terminal (e.g., "File Explorer 1")
5. User switches back to "Terminals" → "Terminals 2" is still active and becomes visible again

**Result**: The states are separate in storage and logic, but terminal visibility is gated by page visibility. This allows each page to maintain its own "memory" of which terminal was active, providing a better UX when switching between pages.

---

## 6. Key Design Patterns

### 6.1 Separation of Concerns

- **Main Process**: System operations, file I/O, terminal processes
- **Renderer Process**: UI rendering, user interactions
- **Preload Script**: Secure IPC bridge

### 6.2 State Management Pattern

- **Global State**: Zustand stores for shared application state
- **Local State**: React `useState` for component-specific state (e.g., `isMounted`, `activeTabIndex`)
- **Derived State**: Computed values from stores (e.g., `getTerminalsForPage`)

### 6.3 Terminal Lifecycle Pattern

1. **Creation**: User action → Store update → Component mount → IPC create → Main process spawn
2. **Initialization**: xterm.js setup → IPC listener registration → Ready state
3. **Active State**: Tab click → Store update → Component visibility change
4. **Cleanup**: Remove action → IPC remove → Main process kill → Component unmount → xterm.js dispose

### 6.4 Event-Driven Communication

- **Unidirectional**: Renderer → Main (commands)
- **Bidirectional**: Main → Renderer (terminal data streaming)
- **Reactive**: Zustand stores trigger React re-renders on state changes

---

## 7. Current Limitations and Unused Features

### Unused/Incomplete Features

1. **File Operations**: IPC handlers exist but are not used in UI components
2. **Menu Options**: `menuOptions` and `selectedMenuOption` in `main-gui-store` are defined but unused
3. **AppItem.terminals**: Legacy field in `AppItem` interface, not actively used
4. **AppItem.activeTerminalId**: Legacy field, terminal state managed in `main-gui-store` instead
5. **Window Controls**: IPC handlers exist but no AppBar component visible

### Hardcoded Values

- Terminal dimensions: `cols: 80, rows: 30` (hardcoded in multiple places)
- Shell selection: `zsh` on macOS, `powershell.exe` on Windows
- File reading: Currently hardcoded to read `package.json` only

---

## 8. Data Consumption Patterns

### Reading State

- **Reactive Reads**: Components use Zustand hooks to subscribe to state changes
  ```typescript
  const items = useAppStateStore((state) => state.items);
  ```
- **One-time Reads**: Using `getState()` for non-reactive access
  ```typescript
  const getLabelById = useAppStateStore.getState().getLabelById;
  ```

### Writing State

- **Direct Mutations**: Store methods update state directly
  ```typescript
  setActiveApp(id); // Updates all items, setting one as active
  ```

### Side Effects

- **IPC Communication**: Triggered by user actions or component lifecycle
- **Terminal I/O**: Continuous data streaming via IPC events
- **Component Lifecycle**: useEffect hooks manage terminal initialization and cleanup

---

## 9. Summary

**Communication**:

- Electron IPC for main ↔ renderer communication
- Preload script provides secure API bridge
- Event-driven, bidirectional data flow for terminals

**State Management**:

- Two Zustand stores: `appStateStore` (pages/navigation) and `main-gui-store` (terminals)
- Reactive state updates trigger React re-renders
- Terminal metadata in Zustand, terminal processes in main process Map

**Data Organization**:

- Page-centric architecture: terminals belong to pages
- Terminal instances scoped by `pageType`
- Active state managed separately for pages and terminals

**Component Architecture**:

- Hierarchical React component tree
- Separation between UI (renderer) and system operations (main)
- Terminal components manage their own xterm.js instances

This architecture provides a scalable foundation for adding more features while maintaining clear separation between UI, state, and system-level operations.
