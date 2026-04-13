// Feather icon names to use instead of emoji for goals
// These are guaranteed to render on iOS with @expo/vector-icons

export const GOAL_ICONS = [
  'monitor', 'smartphone', 'home', 'truck', 'map',
  'tablet', 'book', 'heart', 'zap', 'headphones',
  'camera', 'music', 'sun', 'dollar-sign', 'target',
  'key', 'briefcase', 'star', 'gift', 'shield',
  'award', 'cpu', 'wifi', 'umbrella',
] as const;

export type GoalIconName = (typeof GOAL_ICONS)[number];

// Default icons for the pre-populated goals
export const DEFAULT_GOAL_ICONS: Record<string, GoalIconName> = {
  'default-macbook': 'monitor',
  'default-tech': 'cpu',
  'default-moving': 'home',
};
