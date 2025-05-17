interface Tab {
  key: string;
  title: string;
  component: React.ComponentType;
}

interface TabNavigatorProps {
  tabs: Tab[];
  initialTab?: number;
}

export function TabNavigator({ tabs, initialTab = 0 }: TabNavigatorProps) {
  // ... existing code ...
} 