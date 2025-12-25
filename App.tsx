import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Linkedin, Mail, Phone, MapPin, ExternalLink, 
  Briefcase, GraduationCap, User, 
  BarChart3, FolderPlus, Trash2, LogOut, Send, CheckCircle, Upload,
  Moon, Sun, Pencil, Search, LayoutDashboard
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

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', ...props }: any) => {
  const baseStyle = "px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 transform";
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20",
    outline: "border-2 border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-primary dark:text-slate-300"
  };
  return (
    <motion.button 
      whileHover={props.disabled ? {} : { scale: 1.02 }}
      whileTap={props.disabled ? {} : { scale: 0.98 }}
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className} ${props.disabled ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
      disabled={props.disabled}
      {...props}
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
      {/* Decorative Blobs - Only for Public Site */}
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    dataService.sendMessage(formData);
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Get in Touch" subtitle="Have a project in mind? Let's discuss how we can work together." />
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">Contact Information</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              I'm currently available for freelance work and full-time opportunities. 
              If you have a project that needs some creative touch, feel free to contact me.
            </p>
            
            <div className="space-y-6">
              <Card className="flex items-center gap-4 hover:border-primary/50 group cursor-pointer" noHover>
                 <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Email</p>
                    <p className="text-slate-900 dark:text-white font-medium">{CONTACT_INFO.email}</p>
                 </div>
              </Card>
              
              <Card className="flex items-center gap-4 hover:border-primary/50 group cursor-pointer" noHover>
                 <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Phone</p>
                    <p className="text-slate-900 dark:text-white font-medium">{CONTACT_INFO.phone}</p>
                 </div>
              </Card>

              <Card className="flex items-center gap-4 hover:border-primary/50 group cursor-pointer" noHover>
                 <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Location</p>
                    <p className="text-slate-900 dark:text-white font-medium">{CONTACT_INFO.location}</p>
                 </div>
              </Card>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send Me a Message</h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                          placeholder="John Doe"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                          placeholder="john@example.com"
                        />
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                      placeholder="Project Inquiry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                    <textarea 
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white resize-none"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                     {isSubmitting ? (
                       <span className="flex items-center gap-2">
                         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                         Sending...
                       </span>
                     ) : (
                       <>Send Message <Send size={18} /></>
                     )}
                  </Button>

                  {submitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg flex items-center gap-3 text-sm font-medium border border-green-100 dark:border-green-800"
                    >
                       <CheckCircle size={20} />
                       Message sent successfully! I'll get back to you soon.
                    </motion.div>
                  )}
               </form>
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
    <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="text-center mb-8">
             <div className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                NZ.
             </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 uppercase tracking-wider">Restricted Access</p>
          </div>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded text-sm mb-6 flex items-center gap-2 border border-red-100 dark:border-red-900"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {error}
            </motion.div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                placeholder="admin@demo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-all"
                placeholder="admin"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded hover:bg-black dark:hover:bg-gray-200 transition-colors">
              Sign In
            </button>
          </form>
          <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-800">
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">← Back to Portfolio</Link>
          </div>
        </div>
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
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Projects', path: '/admin/projects', icon: <FolderPlus size={18} /> },
    { name: 'Messages', path: '/admin/messages', icon: <Mail size={18} /> },
  ];

  return (
    // Admin layout uses 'font-sans' explicitly to differentiate from public site
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
      {/* Sidebar - Visual Distinction: Darker, sharper */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-2xl z-20 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-sm">NZ</div>
          <div>
             <span className="block text-sm font-bold tracking-wide">Admin Panel</span>
             <span className="block text-xs text-slate-500">v1.0.2</span>
          </div>
        </div>
        
        <div className="p-4">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
           <nav className="space-y-1">
             {menuItems.map((item) => (
               <Link 
                 key={item.path} 
                 to={item.path}
                 className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-200 ${
                   activePath === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                 }`}
               >
                 {item.icon}
                 <span>{item.name}</span>
               </Link>
             ))}
           </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50">
           <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><User size={14}/></div>
              <div className="overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">Nabilla Z.</p>
                 <p className="text-xs text-slate-500 truncate">Admin</p>
              </div>
           </div>
           <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded w-full transition-all mb-1 text-sm">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded w-full transition-all text-sm">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 md:hidden z-10">
          <span className="font-bold text-gray-900 dark:text-white">Admin</span>
          <div className="flex gap-4">
             <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400"><LogOut size={20} /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
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
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Portfolio performance metrics</p>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Views</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.views}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg"><BarChart3 size={24} /></div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
           <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.projects}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg"><FolderPlus size={24} /></div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
           <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Inbox</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.messages}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-lg"><Mail size={24} /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Traffic Analysis</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', fontSize: '12px'}}
              />
              <Bar dataKey="views" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
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
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dataService.deleteProject(deleteId);
      loadProjects();
      setDeleteId(null);
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
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
           <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your portfolio items</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition flex items-center gap-2">
           <FolderPlus size={16} /> Add Project
        </button>
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setDeleteId(null)}
          >
             <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
             >
                 <div className="h-1 bg-red-500"></div>
                 <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Trash2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Project</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                      Are you sure you want to delete this project? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                       <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                       <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-medium text-sm hover:bg-red-700 transition">Delete</button>
                    </div>
                 </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Project' : 'Add New Project'}</h3>
                 <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Title</label>
                     <input 
                       required 
                       className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                       value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Category</label>
                     <input 
                       required 
                       className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                       value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})}
                     />
                  </div>
                  
                  {/* Image Input Section */}
                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Image Source</label>
                     <div className="flex gap-2">
                        <div className="flex-1">
                           <input 
                             placeholder="Image URL or Select File" required 
                             className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                             value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})}
                           />
                        </div>
                        <button 
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                           className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                           title="Upload Photo"
                        >
                           <Upload size={18} />
                        </button>
                        <input 
                           type="file" 
                           ref={fileInputRef}
                           className="hidden" 
                           accept="image/*"
                           onChange={handleImageUpload}
                        />
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Date</label>
                     <input 
                       type="date" required 
                       className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                       value={newProject.date} onChange={e => setNewProject({...newProject, date: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Project Link</label>
                     <input 
                        placeholder="https://..." 
                        className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})}
                      />
                  </div>
                </div>
                
                 {/* Image Preview */}
                {newProject.image && (
                   <div className="w-full h-40 bg-gray-50 dark:bg-black/20 rounded border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
                      <img src={newProject.image} alt="Preview" className="h-full w-full object-contain" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')} />
                      <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 text-xs rounded text-white">Preview</div>
                   </div>
                )}

                <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Description</label>
                   <textarea 
                     required 
                     className="w-full p-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm" rows={3}
                     value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                   />
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 transition">
                    {editingId ? 'Save Changes' : 'Create Project'}
                  </button>
                  <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-900">
               <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleEdit(project)} className="p-2 bg-white text-gray-900 rounded-full hover:bg-blue-50 hover:text-blue-600 transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition">
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">{project.title}</h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded whitespace-nowrap">{project.category}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 h-8">{project.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                 <span>{project.date}</span>
                 {project.link && <ExternalLink size={12} />}
              </div>
            </div>
          </div>
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
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
         <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Client inquiries and contact form submissions</p>
         </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
               type="text" 
               placeholder="Search inbox..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 text-sm"
            />
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Sender</th>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Subject</th>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredMessages.map(msg => (
                <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white font-medium mb-0.5">{msg.subject}</div>
                    <div className="text-gray-500 dark:text-gray-400 truncate max-w-xs text-xs">{msg.message}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{msg.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      msg.read 
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {msg.read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMessages.length === 0 && (
             <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-3">
                   <Mail size={20} />
                </div>
                <p>No messages found matching your criteria.</p>
             </div>
          )}
        </div>
      </div>
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
