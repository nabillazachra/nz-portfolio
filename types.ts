export interface Project {
  id: string;
  title: string;
  category: string; // e.g., "UI/UX", "Web Dev"
  image: string;
  description: string;
  link?: string;
  date: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  type: 'work' | 'education' | 'volunteer';
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'Design' | 'Development' | 'Tools';
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface DashboardStats {
  views: number;
  projects: number;
  messages: number;
}