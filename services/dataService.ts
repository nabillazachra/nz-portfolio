import { Project, Message, DashboardStats } from '../types';
import { INITIAL_PROJECTS } from '../constants';

const STORAGE_KEYS = {
  PROJECTS: 'nz_projects',
  MESSAGES: 'nz_messages',
  STATS: 'nz_stats'
};

// Initialize Storage if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    const mockMessages: Message[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', subject: 'Project Inquiry', message: 'Hi Nabilla, I love your portfolio. Are you available for freelance?', date: '2024-05-12', read: false },
      { id: '2', name: 'Recruiter Jane', email: 'jane@tech.com', subject: 'Job Opportunity', message: 'We have an opening for a Senior UX Designer.', date: '2024-05-10', read: true },
    ];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(mockMessages));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify({ views: 1240, projects: INITIAL_PROJECTS.length, messages: 2 }));
  }
};

export const dataService = {
  init: initStorage,
  
  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },

  addProject: (project: Project) => {
    const projects = dataService.getProjects();
    const updated = [project, ...projects];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    dataService.updateStats('projects', updated.length);
  },

  deleteProject: (id: string) => {
    const projects = dataService.getProjects();
    const updated = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    dataService.updateStats('projects', updated.length);
  },

  getMessages: (): Message[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  },

  sendMessage: (msg: Omit<Message, 'id' | 'date' | 'read'>) => {
    const messages = dataService.getMessages();
    const newMessage: Message = {
      ...msg,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    const updated = [newMessage, ...messages];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
    dataService.updateStats('messages', updated.length);
  },

  getStats: (): DashboardStats => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : { views: 0, projects: 0, messages: 0 };
  },

  updateStats: (key: keyof DashboardStats, value: number) => {
    const stats = dataService.getStats();
    const newStats = { ...stats, [key]: value };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
  }
};