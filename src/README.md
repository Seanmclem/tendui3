# TendUI - Feature-Based Architecture

## 📁 Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── index.ts
├── features/            # Feature-based modules
│   ├── sidebar/         # Sidebar navigation
│   ├── main-area/       # Main content area
│   ├── terminals/       # Terminal functionality
│   └── layout/          # Layout components
├── stores/              # Zustand state management
│   └── sidebarStore.ts
├── types/               # TypeScript type definitions
│   └── sidebar.ts
└── app.tsx              # Main application entry
```

## 🚀 Features

### Sidebar Navigation

- **Data-driven**: Navigation items defined in Zustand store
- **Categories**: Organized by Development, Tools, Settings
- **Active state**: Tracks selected item with visual feedback
- **Icons**: Each item has an emoji icon
- **Hover effects**: Smooth transitions and hover states

### State Management

- **Zustand store**: Lightweight state management
- **Active item tracking**: Knows which sidebar item is selected
- **Category organization**: Groups items logically

### Layout System

- **Fixed sidebar**: Left side, non-draggable
- **Responsive main area**: Content changes based on selection
- **Clean separation**: Sidebar and content are independent

## 🛠️ Usage

### Adding New Sidebar Items

```typescript
// In src/stores/sidebarStore.ts
const sidebarData: SidebarItem[] = [
  // ... existing items
  {
    id: "new-tool",
    label: "New Tool",
    icon: "🆕",
    category: "tools",
  },
];
```

### Adding New Content Pages

```typescript
// In src/features/main-area/MainArea.tsx
case 'new-tool':
  return (
    <div className="p-8">
      <Card title="🆕 New Tool">
        <p className="text-gray-600">Your new tool content here...</p>
      </Card>
    </div>
  );
```

### Creating New Features

1. Create folder in `src/features/`
2. Add your components
3. Export from `index.ts`
4. Import and use in main app

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling
- **Responsive design**: Works on different screen sizes
- **Consistent spacing**: Uses Tailwind's spacing scale
- **Color scheme**: Gray-based with blue accents for active states

## 🔧 Development

The sidebar is fully functional and ready for you to:

- Add real functionality to each section
- Integrate with your terminal system
- Add file operations
- Build out the tools and features
