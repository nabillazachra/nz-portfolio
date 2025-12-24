import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Linkedin, Mail, Phone, MapPin, ExternalLink, 
  Briefcase, GraduationCap, User, 
  BarChart3, FolderPlus, Trash2, LogOut, Send, CheckCircle, Upload,
  Moon, Sun, Pencil, Search, Image as ImageIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { dataService } from './services/dataService';
import { WORK_EXPERIENCE, EDUCATION, SKILLS, CONTACT_INFO } from './constants';
import { Project, Message, DashboardStats } from './types';

// --- Animations ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemScale = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }: any) => {
  const baseStyle = "px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95";
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20",
    outline: "border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-primary dark:text-slate-300"
  };
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <motion.div 
    variants={fadeInUp}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true }}
    className="mb-16 text-center relative"
  >
    <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
    {subtitle && <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{subtitle}</p>}
    <div className="w-20 h-1.5 bg-gradient-to-r from-blue-400 to-primary mx-auto mt-6 rounded-full"></div>
  </motion.div>
);

const Card = ({ children, className = '', noHover = false }: any) => (
  <motion.div 
    whileHover={!noHover ? { y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

// --- Theme Hook ---
const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nz_theme') === 'dark' ||
        (!('nz_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nz_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nz_theme', 'light');
    }
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
};

// --- Public Page Components ---

const Navbar = ({ darkMode, toggleTheme }: { darkMode: boolean, toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Resume', id: 'resume' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    if (!isLandingPage) {
      window.location.href = `/#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-2xl font-serif font-bold text-slate-900 dark:text-white cursor-pointer flex items-center gap-1 group">
            Nabilla<span className="text-primary group-hover:animate-bounce">.</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.id)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left py-1"
              >
                {link.name}
              </button>
            ))}
            
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary border border-primary/20 rounded-full hover:bg-primary hover:text-white transition-all">
              Admin
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.id)}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {link.name}
                </button>
              ))}
               <Link to="/login" className="block px-3 py-3 text-base font-medium text-slate-400 hover:text-primary">Admin Login</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
    {/* Background glow */}
    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-serif font-bold text-white">Nabilla Zachra</h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Crafting user-centered design solutions for various software and digital products. 
            Merging design thinking with technical expertise to build better webs.
          </p>
          <div className="flex gap-4 pt-2">
             <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-white"><Linkedin size={18}/></a>
             <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-white"><Mail size={18}/></a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-6 text-white/90">Contact</h3>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-center gap-3 hover:text-white transition-colors group">
              <span className="p-2 bg-slate-800 rounded-lg group-hover:bg-primary transition-colors"><Mail size={16}/></span> 
              {CONTACT_INFO.email}
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors group">
              <span className="p-2 bg-slate-800 rounded-lg group-hover:bg-primary transition-colors"><Phone size={16}/></span> 
              {CONTACT_INFO.phone}
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors group">
              <span className="p-2 bg-slate-800 rounded-lg group-hover:bg-primary transition-colors"><MapPin size={16}/></span> 
              {CONTACT_INFO.location}
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-6 text-white/90">Quick Links</h3>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li><button onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-white transition hover:translate-x-1 inline-block">Portfolio</button></li>
            <li><a href="https://linkedin.com/in/nabilla-zachra" target="_blank" rel="noreferrer" className="hover:text-white transition hover:translate-x-1 inline-block">LinkedIn Profile</a></li>
            <li><a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:text-white transition hover:translate-x-1 inline-block">Dribbble Shots</a></li>
            <li><Link to="/login" className="hover:text-white transition hover:translate-x-1 inline-block">Admin Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-16 pt-8 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center">
        <span>&copy; {new Date().getFullYear()} Nabilla Zachra. All rights reserved.</span>
        <span className="mt-2 md:mt-0">Designed & Built with React</span>
      </div>
    </div>
  </footer>
);

const Home = () => {
  return (
    <div className="pt-20 lg:pt-28 pb-20 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      <div className="absolute top-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
      <div className="absolute -bottom-8 left-20 -z-10 w-[600px] h-[600px] bg-pink-100/50 dark:bg-pink-900/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen opacity-70"></div>

      {/* Hero */}
      <section className="relative py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-primary text-xs font-semibold tracking-wide uppercase mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Available for projects
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 dark:text-white leading-[1.1]">
                Design that <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">works</span> for people.
              </h1>
              <p className="mt-8 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                With over 5 years of experience, I build solid foundations in crafting user-centered solutions using React, Figma, and Design Thinking.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior: 'smooth'})}>
                   <Button>View Portfolio</Button>
                </button>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior: 'smooth'})}>
                   <Button variant="outline">Contact Me</Button>
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center relative"
            >
               {/* Floating Image Animation */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-80 h-80 lg:w-96 lg:h-96 z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] rotate-6 opacity-20 blur-2xl"></div>
                <img 
                  src="https://picsum.photos/seed/nabilla/800/800" 
                  alt="Nabilla Zachra" 
                  className="relative w-full h-full object-cover rounded-[2rem] border-8 border-white dark:border-slate-800 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500"
                />
                
                {/* Floating Cards */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl flex items-center gap-3 border border-slate-50 dark:border-slate-700 z-20"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><CheckCircle size={20}/></div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Experience</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">5+ Years</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute top-10 -right-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-50 dark:border-slate-700 z-20"
                >
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-600"></div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 text-center">50+ Happy Clients</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="My Expertise" subtitle="A blend of technical and creative skills refined over years of practice." />
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {SKILLS.slice(0, 4).map((skill) => (
              <motion.div key={skill.name} variants={itemScale}>
                <Card className="text-center h-full hover:bg-blue-50/50 dark:hover:bg-slate-700/50 group">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <CheckCircle size={28} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{skill.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{skill.category}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Resume = () => (
  <section className="py-24 bg-slate-50 dark:bg-slate-950 relative">
     {/* Pattern */}
     <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
    
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <SectionTitle title="Resume" subtitle="My professional journey and educational background." />
      
      <div className="space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
               <Briefcase size={32} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Work Experience</h3>
          </div>
          <div className="space-y-8">
            {WORK_EXPERIENCE.map((job, idx) => (
              <motion.div 
                key={job.id} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors duration-300 group"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 group-hover:border-primary group-hover:scale-125 transition-all duration-300"></div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{job.role}</h4>
                <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3 mt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company}</span>
                  <span>•</span>
                  <span>{job.period}</span>
                </div>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  {job.description.map((desc, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 opacity-50"></span>
                      <span className="leading-relaxed">{desc}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-primary/10 rounded-xl text-primary">
               <GraduationCap size={32} />
             </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Education</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {EDUCATION.map((edu, idx) => (
              <motion.div 
                 key={edu.id}
                 whileHover={{ y: -5 }}
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-t-4 border-t-transparent hover:border-t-primary">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{edu.company}</h4>
                  <p className="text-primary font-medium mb-1">{edu.role}</p>
                  <p className="text-sm text-slate-400 mb-4">{edu.period}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{edu.description[0]}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(dataService.getProjects());
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-blue-50/80 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/80 dark:bg-purple-900/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Portfolio" subtitle="Recent projects showcasing my skills in Design and Development." />
        
        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <FolderPlus size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4"/>
            <p>No projects added yet.</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={itemScale}>
                <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border border-slate-100 dark:border-slate-700 flex flex-col h-full hover:-translate-y-2">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                      <a href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="text-white font-medium flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:underline">
                        View Details <ExternalLink size={16} />
                      </a>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">{project.description}</p>
                    <div className="text-xs font-medium text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <span>{project.date}</span>
                      <a href={project.link || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ExternalLink size={14}/>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.sendMessage(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    // Reset submitted state after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle title="Get in Touch" subtitle="Have a project in mind? Let's work together." />
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1 space-y-6"
          >
            <Card className="text-center hover:border-primary/30 group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                <Mail size={22} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Email</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 break-all">{CONTACT_INFO.email}</p>
            </Card>
            <Card className="text-center hover:border-primary/30 group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                <Phone size={22} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Phone</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{CONTACT_INFO.phone}</p>
            </Card>
            <Card className="text-center hover:border-primary/30 group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                <Linkedin size={22} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Social</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{CONTACT_INFO.linkedin}</p>
            </Card>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="md:col-span-2"
          >
            <Card className="h-full">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-600 dark:text-slate-400">Thank you for reaching out. I'll get back to you soon.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8">Send another</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                      <input 
                        required
                        type="email" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                    <textarea 
                      required
                      rows={5} 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none dark:text-white"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full py-4 text-lg shadow-xl shadow-blue-500/20">
                    <Send size={20} /> Send Message
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Single Page Layout ---

const LandingPage = ({ darkMode, toggleTheme }: { darkMode: boolean, toggleTheme: () => void }) => (
  <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
    <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
    <div id="home" className="scroll-mt-0"><Home /></div>
    <div id="resume" className="scroll-mt-0"><Resume /></div>
    <div id="portfolio" className="scroll-mt-0"><Portfolio /></div>
    <div id="contact" className="scroll-mt-0"><Contact /></div>
    <Footer />
  </div>
);

// --- CRM / Admin Pages ---

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@demo.com' && password === 'admin') {
      localStorage.setItem('nz_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin@demo.com / admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <User size={32} />
             </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Admin Login</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in to manage your portfolio</p>
          </div>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </motion.div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="admin@demo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="admin"
              />
            </div>
            <Button type="submit" className="w-full py-3">Sign In</Button>
          </form>
          <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-slate-500 hover:text-primary transition-colors">Back to Website</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const AdminLayout = ({ children, darkMode, toggleTheme }: any) => {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState('');
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem('nz_auth');
    if (!auth) navigate('/login');
    setActivePath(location.pathname);
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('nz_auth');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <BarChart3 size={20} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderPlus size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">N.</div>
          <span className="text-lg font-serif font-bold tracking-wide">Dashboard</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activePath === item.path ? 'bg-primary text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button onClick={toggleTheme} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg w-full transition-all mb-2">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg w-full transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-slate-900 shadow-sm h-16 flex items-center justify-between px-6 md:hidden z-10">
          <span className="font-bold text-slate-900 dark:text-white">CRM</span>
          <div className="flex gap-4">
             <button onClick={toggleTheme} className="text-slate-500 dark:text-slate-400">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={handleLogout} className="text-slate-500 dark:text-slate-400"><LogOut size={20} /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50">
          {children}
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ views: 0, projects: 0, messages: 0 });
  const data = [
    { name: 'Mon', views: 40 },
    { name: 'Tue', views: 30 },
    { name: 'Wed', views: 20 },
    { name: 'Thu', views: 27 },
    { name: 'Fri', views: 18 },
    { name: 'Sat', views: 23 },
    { name: 'Sun', views: 34 },
  ];

  useEffect(() => {
    setStats(dataService.getStats());
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome back, Nabilla!</h2>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your portfolio today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500" noHover>
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-xl"><User size={24} /></div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Views</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.views}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500" noHover>
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><FolderPlus size={24} /></div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Projects</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.projects}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 hover:shadow-lg transition-shadow border-l-4 border-l-green-500" noHover>
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl"><Mail size={24} /></div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Messages</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.messages}</p>
          </div>
        </Card>
      </div>

      <Card className="h-[450px]" noHover>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Visitor Analytics</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.1)'}} 
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff'}}
            />
            <Bar dataKey="views" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} activeBar={{fill: '#1d4ed8'}} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '', category: '', image: 'https://picsum.photos/800/600', description: '', date: '', link: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = useCallback(() => {
    setProjects(dataService.getProjects());
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500kb limit warning
        alert("File size is large. It might exceed local storage limits.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProject({ ...newProject, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (project: Project) => {
    setNewProject({
      title: project.title,
      category: project.category,
      image: project.image,
      description: project.description,
      date: project.date,
      link: project.link || ''
    });
    setEditingId(project.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
       // Update existing
       const updatedProject: Project = {
          id: editingId,
          ...newProject
       };
       dataService.updateProject(updatedProject);
    } else {
       // Create new
       const project: Project = {
          id: Date.now().toString(),
          ...newProject
       };
       try {
         dataService.addProject(project);
       } catch (err) {
         alert("Failed to save project. The image might be too large for browser storage.");
         return;
       }
    }
    
    loadProjects();
    setIsFormOpen(false);
    setEditingId(null);
    setNewProject({ title: '', category: '', image: 'https://picsum.photos/800/600', description: '', date: '', link: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dataService.deleteProject(id);
      loadProjects();
    }
  };

  const handleCancel = () => {
     setIsFormOpen(false);
     setEditingId(null);
     setNewProject({ title: '', category: '', image: 'https://picsum.photos/800/600', description: '', date: '', link: '' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Project Management</h2>
        <Button onClick={() => setIsFormOpen(true)}><FolderPlus size={18} /> Add Project</Button>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="mb-8 border-primary/20 ring-4 ring-primary/5 dark:ring-primary/10" noHover>
              <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    placeholder="Title" required 
                    className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})}
                  />
                  <input 
                    placeholder="Category (e.g. UI/UX)" required 
                    className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})}
                  />
                  
                  {/* Image Input Section */}
                  <div className="flex gap-2">
                     <div className="flex-1 relative">
                        <input 
                          placeholder="Image URL or Select File" required 
                          className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                          value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})}
                        />
                     </div>
                     <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        title="Upload Photo"
                     >
                        <Upload size={20} />
                     </button>
                     <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                     />
                  </div>

                  <input 
                    type="date" required 
                    className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newProject.date} onChange={e => setNewProject({...newProject, date: e.target.value})}
                  />
                </div>
                
                 {/* Image Preview - Updated to show for both URL and Base64 */}
                {newProject.image && (
                   <div className="w-full h-40 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative flex items-center justify-center">
                      <img src={newProject.image} alt="Preview" className="h-full w-full object-contain" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')} />
                      <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/60 px-2 py-1 text-xs rounded shadow-sm text-slate-800 dark:text-white">Preview</div>
                   </div>
                )}

                 <input 
                    placeholder="Project Link (Optional)" 
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})}
                  />

                <textarea 
                  placeholder="Description" required 
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" rows={3}
                  value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                />
                <div className="flex gap-3 pt-2">
                  <Button type="submit">{editingId ? 'Update Project' : 'Save Project'}</Button>
                  <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="relative group overflow-hidden" noHover>
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-100 dark:bg-slate-900">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" className="text-xs px-3 py-1.5" onClick={() => handleEdit(project)}>
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button variant="danger" className="text-xs px-3 py-1.5" onClick={() => handleDelete(project.id)}>
                    <Trash2 size={14} /> Delete
                  </Button>
               </div>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{project.title}</h3>
            <div className="flex justify-between items-center mt-2">
               <span className="text-sm text-primary font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{project.category}</span>
               <span className="text-xs text-slate-400">{project.date}</span>
            </div>
            {project.link && (
               <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-primary flex items-center gap-1">
                     <ExternalLink size={12} /> {project.link}
                  </a>
               </div>
            )}
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMessages(dataService.getMessages());
  }, []);

  const filteredMessages = messages.filter(msg => 
     msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
         <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Inbox</h2>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
               type="text" 
               placeholder="Search messages..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-64"
            />
         </div>
      </div>

      <Card className="overflow-hidden p-0 shadow-lg" noHover>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-5 font-semibold text-slate-700 dark:text-slate-300">From</th>
                <th className="p-5 font-semibold text-slate-700 dark:text-slate-300">Subject</th>
                <th className="p-5 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                <th className="p-5 font-semibold text-slate-700 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredMessages.map(msg => (
                <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 dark:text-white">{msg.name}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{msg.email}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-medium text-slate-900 dark:text-white">{msg.subject}</div>
                    <div className="text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5 opacity-80 group-hover:opacity-100">{msg.message}</div>
                  </td>
                  <td className="p-5 text-slate-500 dark:text-slate-400">{msg.date}</td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${msg.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'}`}>
                      {msg.read ? 'Read' : 'New'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMessages.length === 0 && (
             <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                <Mail size={48} className="mb-4 opacity-50"/>
                <p>No messages found.</p>
             </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// --- Main App Component ---

const App = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    dataService.init();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage darkMode={darkMode} toggleTheme={toggleTheme} />} />
        
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout darkMode={darkMode} toggleTheme={toggleTheme}><Dashboard /></AdminLayout>} />
        <Route path="/admin/projects" element={<AdminLayout darkMode={darkMode} toggleTheme={toggleTheme}><AdminProjects /></AdminLayout>} />
        <Route path="/admin/messages" element={<AdminLayout darkMode={darkMode} toggleTheme={toggleTheme}><AdminMessages /></AdminLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
