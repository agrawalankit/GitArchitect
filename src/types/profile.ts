export type SectionId =
  | 'header'
  | 'whatIDo'
  | 'byTheNumbers'
  | 'approach'
  | 'techStack'
  | 'stats'
  | 'projects'
  | 'focus'
  | 'content'
  | 'contact'
  | 'custom';

export interface SectionMeta {
  id: SectionId;
  label: string;
  enabled: boolean;
  iconName: string;
}

export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'x' | 'github' | 'youtube' | 'medium' | 'devto' | 'hashnode' | 'instagram' | 'email' | 'website';
  url: string;
  label: string;
}

export interface BulletItem {
  id: string;
  emoji: string;
  text: string;
}

export interface MetricItem {
  id: string;
  stat: string;
  label: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech: string[];
  stars?: string;
  link?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export type BadgeStyle = 'for-the-badge' | 'flat' | 'flat-square' | 'plastic';

export interface StatsWidgetConfig {
  showStats: boolean;
  showLanguages: boolean;
  showStreak: boolean;
  showSnake: boolean;
  showTrophies: boolean;
  theme: string;
  hideBorder: boolean;
}

export interface TechCategories {
  languages: string[];
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
  ai_ml: string[];
  tools: string[];
}

export interface ProfileData {
  name: string;
  githubUsername: string;
  pronouns: string;
  title: string;
  tagline?: string;
  location: string;
  company: string;
  email: string;
  website: string;
  avatarUrl?: string;
  quote: string;
  aboutMe: string;
  whatIDo: BulletItem[];
  byTheNumbers: MetricItem[];
  approach: string[];
  techStack: TechCategories;
  badgeStyle: BadgeStyle;
  statsWidgets: StatsWidgetConfig;
  currentFocus: string[];
  featuredProjects: ProjectItem[];
  contentOrArticles: ContentItem[];
  socials: SocialLink[];
  customMarkdown: string;
  sections: SectionMeta[];
}
