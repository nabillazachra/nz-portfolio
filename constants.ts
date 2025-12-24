import { Experience, Project, Skill } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Learning Platform UI',
    category: 'UI/UX Design',
    image: 'https://picsum.photos/seed/uiux1/800/600',
    description: 'A comprehensive learning management system design focusing on student engagement.',
    date: '2023-11-15'
  },
  {
    id: '2',
    title: 'Corporate Dashboard',
    category: 'Web Development',
    image: 'https://picsum.photos/seed/webdev1/800/600',
    description: 'React-based dashboard for data visualization and employee management.',
    date: '2023-08-20'
  },
  {
    id: '3',
    title: 'Fintech Mobile App',
    category: 'Mobile Design',
    image: 'https://picsum.photos/seed/mobile1/800/600',
    description: 'High-fidelity prototypes for a seamless banking experience.',
    date: '2024-01-10'
  }
];

export const WORK_EXPERIENCE: Experience[] = [
  {
    id: 'w1',
    role: 'UX/UI Designer',
    company: 'PT Nutech Integrasi (Telkom Indonesia)',
    period: 'March 2022 – Present',
    type: 'work',
    description: [
      'Designing user interfaces and user experiences for web, mobile applications, desktop, and vending machines.',
      'Conducting user research and usability testing to gather insights.',
      'Collaborating with cross-functional teams to ensure a seamless experience.',
      'Creating wireframes and high-fidelity mockups for BUMN company projects.'
    ]
  },
  {
    id: 'w2',
    role: 'UI/UX Design Mentor',
    company: 'Telkom Indonesia (Remote)',
    period: 'June 2024 – Oct 2024',
    type: 'work',
    description: [
      'Mentoring 10+ mentees in comprehending challenging concepts.',
      'Providing constructive feedback on assignments.',
      'Teaching commitment to mentees\' development and academic success.'
    ]
  },
  {
    id: 'w3',
    role: 'Assistant UI/UX Instructor',
    company: 'Skill Academy by Ruangguru',
    period: 'June 2023 – Present',
    type: 'work',
    description: [
      'Assisted 5000+ students in comprehending challenging concepts.',
      'Collaborated with lead instructors to facilitate engaging online sessions.'
    ]
  },
  {
    id: 'w4',
    role: 'Web Developer',
    company: 'PT Galeri Teknologi Bersama',
    period: 'Dec 2021 – Feb 2022',
    type: 'work',
    description: [
      'Bug fixing in SmartERP and Quality Checking.',
      'Developed new features using CodeIgniter 3, CSS, JQuery, and AJAX.',
      'Redesigned Front End SpeedClass Landing Page.'
    ]
  }
];

export const EDUCATION: Experience[] = [
  {
    id: 'e1',
    role: 'Bachelor of Information Systems',
    company: 'Universitas Terbuka',
    period: 'Expected 2027',
    type: 'education',
    description: ['Relevant Coursework: Software Engineering, UX/UI, Data Analysis, Algorithms.']
  },
  {
    id: 'e2',
    role: 'Diploma 3 Secretary',
    company: 'ASM Kencana Bandung',
    period: 'Sep 2020 - Nov 2023',
    type: 'education',
    description: ['Major in Secretary of Public Relations.']
  }
];

export const SKILLS: Skill[] = [
  { name: 'Figma', level: 95, category: 'Design' },
  { name: 'React JS', level: 85, category: 'Development' },
  { name: 'UI Design', level: 95, category: 'Design' },
  { name: 'User Research', level: 90, category: 'Design' },
  { name: 'HTML/CSS', level: 90, category: 'Development' },
  { name: 'JavaScript', level: 80, category: 'Development' },
  { name: 'Adobe Illustrator', level: 75, category: 'Tools' },
  { name: 'Prototyping', level: 90, category: 'Design' },
];

export const CONTACT_INFO = {
  phone: '+62 89637354424',
  email: 'nabillazachra14@gmail.com',
  linkedin: 'Nabilla Zachra',
  location: 'Bekasi, West Java 17145'
};