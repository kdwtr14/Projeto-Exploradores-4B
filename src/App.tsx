/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  setYear
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Plus, 
  Check,
  Printer, 
  RotateCcw, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  X,
  ClipboardList,
  Scale,
  Rocket,
  Trophy,
  Medal,
  Star,
  Bell,
  Search,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Category, Level } from './types';

const STORAGE_KEY = 'exploradores_db_v4';
const CALENDAR_STORAGE_KEY = 'exploradores_calendar_v1';
const SETTINGS_STORAGE_KEY = 'exploradores_settings_v1';
const POINT_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3';

type View = 'dashboard' | 'class' | 'reports' | 'performance' | 'calendar' | 'settings';

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "ALEXANDRE GUIMARAES LEAL", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 2, name: "ANELLIZE VITORIA DE OLIVEIRA PIRES", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 3, name: "BRENNER DERR DEMENJON", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 4, name: "CLAUDEMAR RAFAEL RIBEIRO DE LIMA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 5, name: "EMILY SOFIA CASTRO LOPES", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 6, name: "GABRIEL BARBOSA MOREIRA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 7, name: "GUSTAVO LUZ HANEMANN DA SILVA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 8, name: "HELLOA DA SILVA SACHUK", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 9, name: "HUGO GABRIEL MOISES GONÇALVES", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 10, name: "ITALO EDILSON DE CAMARGO BARROSO", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 11, name: "KARLLA CRUZ LIMA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 12, name: "LARISSA VITORIA LOPES BATISTA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 13, name: "MARCOS ANTONIO DOS SANTOS PEREIRA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 14, name: "MARIANE FELIX RIBEIRO", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 15, name: "MARIA VITÓRIA CAMARGO MIRANDA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 16, name: "MATHEUS APARECIDO GONCALVES MENDES", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 17, name: "PABLO DOS SANTOS NASCIMENTO TRINDADE", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 18, name: "PEDRO EDUARDO SOUZA SALUSTIANO", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 19, name: "RENE CORREIA DE LIMA SILVA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
  { id: 20, name: "SAMUEL FELIPE SILVA DE OLIVEIRA", points: 0, categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }, attendance: [format(new Date(), 'yyyy-MM-dd')] },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
    return INITIAL_STUDENTS;
  });

  const [newStudentName, setNewStudentName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetState, setResetState] = useState<'idle' | 'confirming' | 'success'>('idle');
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [animatingStudentId, setAnimatingStudentId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [classDays, setClassDays] = useState<string[]>(() => {
    const saved = localStorage.getItem(CALENDAR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      className: '4º Ano B',
      year: '2026',
      teacherName: 'Professor(a)',
      schoolName: 'Exploradores do Conhecimento',
      projectName: 'Exploradores'
    };
  });

  // Auto-mark presence for today on load and cleanup any "Clodovalter" student
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStudents(prev => {
      let changed = false;
      // Filter out any student named Clodovalter (case insensitive)
      let next = prev.filter(s => !s.name.toLowerCase().includes('clodovalter'));
      if (next.length !== prev.length) changed = true;

      next = next.map(s => {
        if (!s.attendance?.includes(today)) {
          changed = true;
          return { ...s, attendance: [...(s.attendance || []), today] };
        }
        return s;
      });
      return changed ? next : prev;
    });
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(classDays));
  }, [classDays]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Sound effect
  const playPointSound = () => {
    const audio = new Audio(POINT_SOUND_URL);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed:", e));
  };

  const addStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent: Student = {
      id: Date.now(),
      name: newStudentName.trim(),
      points: 0,
      categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 },
      attendance: [format(new Date(), 'yyyy-MM-dd')]
    };
    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
  };

  const toggleAttendance = (studentId: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const isPresent = s.attendance?.includes(today);
        return {
          ...s,
          attendance: isPresent 
            ? s.attendance.filter(d => d !== today)
            : [...(s.attendance || []), today]
        };
      }
      return s;
    }));
  };

  const deleteStudent = (id: number) => {
    if (window.confirm("Deseja realmente remover este explorador?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      setToast({ message: 'Explorador removido com sucesso! 🗑️', visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const editName = (id: number) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    const newName = prompt("Editar nome do explorador:", student.name);
    if (newName && newName.trim()) {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, name: newName.trim() } : s));
    }
  };

  const awardPoints = (value: number) => {
    if (!selectedCategory || selectedStudentId === null) return;
    
    const student = students.find(s => s.id === selectedStudentId);
    const today = format(new Date(), 'yyyy-MM-dd');
    const isPresent = student?.attendance?.includes(today);

    if (!isPresent) {
      setToast({ message: `Ação bloqueada: ${student?.name} está marcado com falta hoje! 🚫`, visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      setIsModalOpen(false);
      return;
    }
    
    setStudents(prev => prev.map(s => {
      if (s.id === selectedStudentId) {
        return {
          ...s,
          points: s.points + value,
          categories: {
            ...s.categories,
            [selectedCategory]: s.categories[selectedCategory] + value
          }
        };
      }
      return s;
    }));
    
    playPointSound();
    setAnimatingStudentId(selectedStudentId);
    setTimeout(() => setAnimatingStudentId(null), 1000);

    setToast({ message: `+${value} pontos para ${student?.name}! 🚀`, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);

    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const toggleReset = () => {
    if (resetState === 'idle') {
      setResetState('confirming');
      setTimeout(() => setResetState('idle'), 3000);
    } else if (resetState === 'confirming') {
      setStudents(prev => prev.map(s => ({
        ...s,
        points: 0,
        categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }
      })));
      setResetState('success');
      setTimeout(() => setResetState('idle'), 2000);
    }
  };

  const getLevel = (points: number): Level => {
    if (points <= 19) return { 
      name: "Recruta", 
      color: "bg-slate-100 text-slate-600", 
      emoji: "🪖",
      starSize: 20,
      starColor: "#94A3B8",
      starOpacity: 0.2
    };
    if (points <= 39) return { 
      name: "Sargento", 
      color: "bg-blue-50 text-blue-600", 
      emoji: "🛡️",
      starSize: 28,
      starColor: "#3B82F6",
      starOpacity: 0.4
    };
    if (points <= 59) return { 
      name: "Capitão", 
      color: "bg-cyan-50 text-cyan-600", 
      emoji: "🦅",
      starSize: 36,
      starColor: "#06B6D4",
      starOpacity: 0.6
    };
    if (points <= 99) return { 
      name: "Tenente", 
      color: "bg-orange-50 text-orange-600", 
      emoji: "⚔️",
      starSize: 44,
      starColor: "#F59E0B",
      starOpacity: 0.8
    };
    return { 
      name: "General", 
      color: "bg-purple-50 text-purple-600", 
      emoji: "⭐",
      starSize: 52,
      starColor: "#8B5CF6",
      starOpacity: 1.0
    };
  };

  const getProgress = (points: number) => {
    if (points <= 19) return (points / 20) * 100;
    if (points <= 39) return ((points - 20) / 20) * 100;
    if (points <= 59) return ((points - 40) / 20) * 100;
    if (points <= 99) return ((points - 60) / 40) * 100;
    return 100;
  };

  const sortedStudents = useMemo(() => {
    return [...students]
      .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.points - a.points);
  }, [students, searchQuery]);

  const stats = useMemo(() => {
    const totalPoints = students.reduce((acc, s) => acc + s.points, 0);
    const avgPoints = students.length > 0 ? (totalPoints / students.length).toFixed(1) : 0;
    const topStudent = sortedStudents[0];
    return { totalPoints, avgPoints, topStudent };
  }, [students, sortedStudents]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 flex-col z-50 no-print">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Rocket size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">{settings.projectName}</h1>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <SidebarItem icon={<Users size={20} />} label="Minha Turma" active={activeView === 'class'} onClick={() => setActiveView('class')} />
            <SidebarItem icon={<FileText size={20} />} label="Relatórios" active={activeView === 'reports'} onClick={() => setActiveView('reports')} />
            <SidebarItem icon={<TrendingUp size={20} />} label="Desempenho" active={activeView === 'performance'} onClick={() => setActiveView('performance')} />
            <SidebarItem icon={<Calendar size={20} />} label="Calendário" active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} />
            <SidebarItem icon={<Settings size={20} />} label="Configurações" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Trophy size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Objetivo do Pelotão</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[65%] rounded-full" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-2">650 / 1000 pontos</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Alto Comando</h3>
            <div className="space-y-2">
              {sortedStudents.slice(0, 3).map((s, i) => {
                const level = getLevel(s.points);
                return (
                  <div key={s.id} className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <span className="text-xs font-bold text-slate-600 truncate w-24">{s.name.split(' ')[0]} {level.emoji}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{s.points} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <div className="md:pl-64 min-h-screen">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 no-print">
          <div />
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end pr-6 border-r border-slate-100">
              <p className="text-lg font-black text-slate-900 leading-tight">{settings.teacherName}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tight text-right mt-0.5">
                {settings.projectName} • {settings.schoolName}
              </p>
              <p className="text-xs text-blue-600 font-black uppercase tracking-widest mt-1">
                {settings.className} • {settings.year}
              </p>
            </div>
            <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-8 pt-8">
          {activeView === 'dashboard' && (
            <>
              {/* Stats Overview - Highlights */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Overall Leader - First Position */}
                <div className="bg-white p-6 rounded-[2rem] card-shadow border-2 border-yellow-100 flex flex-col justify-between relative overflow-hidden group hover:border-yellow-200 transition-all bg-gradient-to-br from-white to-yellow-50/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Trophy size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Líder Geral</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm shadow-sm">
                      🥇
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black text-slate-900 truncate">{stats.topStudent?.name || '---'}</p>
                    <p className="text-sm font-bold text-yellow-600">
                      {stats.topStudent?.points || 0} pontos totais
                    </p>
                  </div>
                </div>

                {[
                  { cat: 'Organização' as Category, icon: <ClipboardList size={18} />, color: 'blue', emoji: '📋' },
                  { cat: 'Disciplina' as Category, icon: <Scale size={18} />, color: 'purple', emoji: '⚖️' },
                  { cat: 'Desempenho' as Category, icon: <Rocket size={18} />, color: 'pink', emoji: '🚀' }
                ].map(({ cat, icon, color, emoji }) => {
                  // Tie-breaker: sort by category points, then by total points
                  const leader = [...students].sort((a, b) => (b.categories[cat] - a.categories[cat]) || (b.points - a.points))[0];
                  const colors = {
                    blue: 'bg-blue-50 text-blue-600 border-blue-100',
                    purple: 'bg-purple-50 text-purple-600 border-purple-100',
                    pink: 'bg-pink-50 text-pink-600 border-pink-100'
                  };
                  
                  return (
                    <div key={cat} className="bg-white p-6 rounded-[2rem] card-shadow border border-slate-50 flex flex-col justify-between relative overflow-hidden group hover:border-blue-100 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          {icon}
                          <span className="text-[10px] font-black uppercase tracking-widest">Destaque {cat}</span>
                        </div>
                        <div className={`w-8 h-8 rounded-xl ${colors[color as keyof typeof colors]} flex items-center justify-center text-sm shadow-sm`}>
                          {emoji}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{leader?.name || '---'}</p>
                        <p className={`text-xs font-bold ${color === 'blue' ? 'text-blue-600' : color === 'purple' ? 'text-purple-600' : 'text-pink-600'}`}>
                          {leader?.categories[cat] || 0} pontos
                        </p>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Search and Actions */}
              <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-8 no-print">
                <div className="flex w-full md:w-auto gap-2">
                  <div className="relative flex-1 md:w-64 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar aluno..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all"
                  >
                    <Printer size={20} />
                  </button>
                  <button 
                    onClick={toggleReset}
                    className={`px-4 py-3 rounded-2xl border transition-all flex items-center gap-2 font-bold text-sm ${
                      resetState === 'confirming' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-100' : 'bg-white border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100'
                    }`}
                  >
                    <RotateCcw size={18} className={resetState === 'confirming' ? 'animate-spin' : ''} />
                    <span>{resetState === 'confirming' ? 'Confirmar?' : 'Zerar Tudo'}</span>
                  </button>
                </div>
              </div>

              {/* Student List */}
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {sortedStudents.map((student, index) => {
                    const level = getLevel(student.points);
                    const isTop3 = index < 3 && student.points > 0;
                    const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                    
                    return (
                      <motion.div 
                        key={student.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-6 rounded-[2.5rem] card-shadow border border-slate-50 relative group overflow-hidden hover:border-blue-100 transition-colors"
                      >
                        {/* Local Gratification Animation */}
                        <AnimatePresence>
                          {animatingStudentId === student.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden rounded-[2.5rem]"
                            >
                              {[...Array(12)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0, x: 0, y: 0 }}
                                  animate={{ 
                                    scale: [0, 1, 0],
                                    x: (Math.random() - 0.5) * 300,
                                    y: (Math.random() - 0.5) * 300,
                                    rotate: Math.random() * 360
                                  }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className="absolute text-2xl"
                                >
                                  {['⭐', '✨', '🎉', '🚀'][Math.floor(Math.random() * 4)]}
                                </motion.div>
                              ))}
                              <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: [0.5, 1.5, 1], opacity: [0, 0.2, 0] }}
                                transition={{ duration: 0.5 }}
                                className="bg-blue-500 absolute inset-0 rounded-[2.5rem]"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-5">
                            <div className="relative shrink-0">
                              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-blue-200 transition-colors">
                                <motion.div
                                  key={level.name}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                >
                                  <Star 
                                    size={level.starSize} 
                                    fill={level.starColor} 
                                    color={level.starColor}
                                    style={{ 
                                      opacity: level.starOpacity,
                                      filter: level.starOpacity > 0.6 ? `drop-shadow(0 0 12px ${level.starColor})` : 'none'
                                    }}
                                    className="transition-all duration-500"
                                  />
                                </motion.div>
                              </div>
                              {isTop3 && (
                                <div className="absolute -top-2 -right-2 text-2xl drop-shadow-md z-10">
                                  {medalEmoji}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="text-lg font-black text-slate-800 truncate leading-tight">{student.name}</h3>
                                <button 
                                  onClick={() => editName(student.id)} 
                                  className="no-print text-slate-300 hover:text-blue-500 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`${level.color} px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm`}>
                                  {level.emoji} {level.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                  {student.points} pts
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 max-w-xs hidden lg:block px-8">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso do Nível</span>
                              <span className="text-[10px] font-black text-blue-600">{Math.round(getProgress(student.points))}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${getProgress(student.points)}%` }}
                                className="bg-blue-600 h-full rounded-full"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 no-print">
                            <button 
                              onClick={() => {
                                setSelectedStudentId(student.id);
                                setIsModalOpen(true);
                              }} 
                              disabled={!student.attendance?.includes(format(new Date(), 'yyyy-MM-dd'))}
                              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                                student.attendance?.includes(format(new Date(), 'yyyy-MM-dd'))
                                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                              }`}
                            >
                              <Rocket size={18} />
                              {student.attendance?.includes(format(new Date(), 'yyyy-MM-dd')) ? 'Avaliar' : 'Ausente'}
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Deseja zerar a pontuação de ${student.name}?`)) {
                                  setStudents(prev => prev.map(s => s.id === student.id ? {
                                    ...s,
                                    points: 0,
                                    categories: { 'Organização': 0, 'Disciplina': 0, 'Desempenho': 0 }
                                  } : s));
                                }
                              }}
                              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                              title="Zerar Pontuação"
                            >
                              <RotateCcw size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Category Breakdown */}
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex gap-8">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Organização</span>
                              <span className="text-sm font-black text-slate-700">{student.categories.Organização}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Disciplina</span>
                              <span className="text-sm font-black text-slate-700">{student.categories.Disciplina}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Desempenho</span>
                              <span className="text-sm font-black text-slate-700">{student.categories.Desempenho}</span>
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            <div className="flex -space-x-2">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px]">
                                  {['⭐', '🔥', '⚡'][i]}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Quick Actions Section */}
              <section className="mt-12 mb-8 no-print">
                <h2 className="text-xl font-black text-slate-800 mb-6">Ações Rápidas</h2>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => setActiveView('reports')} className="bg-white p-6 rounded-[2rem] card-shadow border border-slate-50 flex flex-col items-center gap-3 hover:bg-slate-50 transition-all group text-left">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Relatório</span>
                  </button>
                  <button onClick={() => setActiveView('performance')} className="bg-white p-6 rounded-[2rem] card-shadow border border-slate-50 flex flex-col items-center gap-3 hover:bg-slate-50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ClipboardList size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Desempenho</span>
                  </button>
                  <button onClick={() => setActiveView('calendar')} className="bg-white p-6 rounded-[2rem] card-shadow border border-slate-50 flex flex-col items-center gap-3 hover:bg-slate-50 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Calendário</span>
                  </button>
                </div>
              </section>
            </>
          )}

          {activeView === 'class' && (
            <ClassView 
              students={students} 
              newStudentName={newStudentName}
              setNewStudentName={setNewStudentName}
              addStudent={addStudent}
              onDelete={deleteStudent}
              onToggleAttendance={toggleAttendance}
            />
          )}
          {activeView === 'reports' && (
            <ReportsView 
              students={students} 
              onDelete={deleteStudent}
              onToggleAttendance={toggleAttendance}
            />
          )}
          {activeView === 'performance' && <PerformanceView students={students} />}
          {activeView === 'calendar' && <CalendarView classDays={classDays} setClassDays={setClassDays} />}
          {activeView === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}
        </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40 no-print md:hidden">
        <button 
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button 
          onClick={() => setActiveView('class')}
          className={`flex flex-col items-center gap-1 ${activeView === 'class' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Users size={20} />
          <span className="text-[10px] font-bold uppercase">Turma</span>
        </button>
        <button 
          onClick={() => setActiveView('reports')}
          className={`flex flex-col items-center gap-1 ${activeView === 'reports' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <FileText size={20} />
          <span className="text-[10px] font-bold uppercase">Relatórios</span>
        </button>
        <button 
          onClick={() => setActiveView('settings')}
          className={`flex flex-col items-center gap-1 ${activeView === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-bold uppercase">Ajustes</span>
        </button>
      </nav>

      {/* Score Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-slate-50 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600" />
              
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Rocket size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Avaliar Explorador</h2>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  {students.find(s => s.id === selectedStudentId)?.name}
                </p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Selecione a Categoria</p>
                  <div className="grid grid-cols-3 gap-3">
                    <CategoryButtonSmall 
                      label="Org" 
                      icon={<ClipboardList size={18} />} 
                      selected={selectedCategory === 'Organização'}
                      onClick={() => setSelectedCategory('Organização')}
                    />
                    <CategoryButtonSmall 
                      label="Dis" 
                      icon={<Scale size={18} />} 
                      selected={selectedCategory === 'Disciplina'}
                      onClick={() => setSelectedCategory('Disciplina')}
                    />
                    <CategoryButtonSmall 
                      label="Des" 
                      icon={<Rocket size={18} />} 
                      selected={selectedCategory === 'Desempenho'}
                      onClick={() => setSelectedCategory('Desempenho')}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Atribuir Pontos</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => awardPoints(5)} 
                      disabled={!selectedCategory}
                      className="flex-1 bg-white text-slate-800 py-6 rounded-3xl text-3xl font-black hover:bg-slate-50 transition-all border-2 border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +5
                    </button>
                    <button 
                      onClick={() => awardPoints(10)} 
                      disabled={!selectedCategory}
                      className="flex-1 bg-blue-600 text-white py-6 rounded-3xl text-3xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3 no-print border border-slate-800"
          >
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <span className="text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer for print */}
      <footer className="hidden print:block mt-12 text-center border-t pt-8 text-slate-400 text-xs font-medium">
        Relatório gerado em {new Date().toLocaleDateString('pt-BR')} - Projeto Exploradores do Conhecimento
      </footer>
      </div>
    </div>
  );
}

function CategoryButtonSmall({ label, icon, selected, onClick }: { label: string, icon: ReactNode, selected: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
        selected ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'
      }`}
    >
      <div className={`${selected ? 'text-white' : 'text-blue-600'}`}>
        {icon}
      </div>
      <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ClassView({ 
  students, 
  newStudentName, 
  setNewStudentName, 
  addStudent,
  onDelete,
  onToggleAttendance
}: { 
  students: Student[], 
  newStudentName: string, 
  setNewStudentName: (val: string) => void, 
  addStudent: () => void,
  onDelete: (id: number) => void,
  onToggleAttendance: (id: number) => void
}) {
  const sortedNames = [...students].sort((a, b) => a.name.localeCompare(b.name));
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Add Student Input */}
      <div className="bg-white p-3 rounded-[2rem] card-shadow border border-slate-50 no-print flex gap-3 items-center">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Plus size={20} />
        </div>
        <input 
          type="text" 
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addStudent()}
          placeholder="Adicionar novo explorador à turma..." 
          className="flex-1 px-4 py-2 rounded-xl bg-transparent border-none focus:ring-0 outline-none text-sm font-medium"
        />
        <button 
          onClick={addStudent}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          Salvar
        </button>
      </div>

      <div className="bg-white rounded-[3rem] card-shadow border border-slate-50 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Lista de Chamada e Gestão</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Controle de Presença e Alunos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {sortedNames.map((s, i) => (
            <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-400 transition-colors w-4">{i + 1}</span>
                <span className="text-sm font-bold text-slate-700">{s.name}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {s.attendance?.includes(today) ? 'Presente' : 'Faltou'}
                  </span>
                  <button 
                    onClick={() => onToggleAttendance(s.id)}
                    className={`w-10 h-6 rounded-full relative transition-colors ${
                      s.attendance?.includes(today) ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div 
                      animate={{ x: s.attendance?.includes(today) ? 18 : 2 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                  className="p-3 rounded-xl bg-white text-slate-300 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all border border-slate-100 flex items-center justify-center"
                  title="Remover Aluno"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ReportsView({ 
  students, 
  onDelete, 
  onToggleAttendance 
}: { 
  students: Student[], 
  onDelete: (id: number) => void,
  onToggleAttendance: (id: number) => void
}) {
  const categories: Category[] = ['Organização', 'Disciplina', 'Desempenho'];
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const getLeader = (category: Category) => {
    return [...students].sort((a, b) => b.categories[category] - a.categories[category])[0];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(cat => {
          const leader = getLeader(cat);
          return (
            <div key={cat} className="bg-white p-6 rounded-[2.5rem] card-shadow border border-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                {cat === 'Organização' && <ClipboardList size={80} />}
                {cat === 'Disciplina' && <Scale size={80} />}
                {cat === 'Desempenho' && <Rocket size={80} />}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{cat}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                  🥇
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{leader?.name || '---'}</p>
                  <p className="text-xs font-bold text-blue-600">{leader?.categories[cat] || 0} pontos</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[3rem] card-shadow border border-slate-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800">Tabela de Pontuação e Presença</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Data: {format(new Date(), 'dd/MM/yyyy')}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aluno</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Presença</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Org.</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Disc.</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Des.</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.sort((a, b) => b.points - a.points).map(s => (
                <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-4 font-bold text-slate-700 text-sm">{s.name}</td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => onToggleAttendance(s.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        s.attendance?.includes(today) 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'bg-white border-slate-200 text-transparent hover:border-emerald-200'
                      }`}
                    >
                      <Check size={14} strokeWidth={4} />
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-500 text-sm">{s.categories.Organização}</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-500 text-sm">{s.categories.Disciplina}</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-500 text-sm">{s.categories.Desempenho}</td>
                  <td className="px-4 py-4 text-right font-black text-blue-600">{s.points}</td>
                  <td className="px-8 py-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(s.id);
                      }}
                      className="p-3 rounded-xl bg-slate-50 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center mx-auto"
                      title="Remover Aluno"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function PerformanceView({ students }: { students: Student[] }) {
  const data = useMemo(() => {
    return students
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map(s => ({
        name: s.name.split(' ')[0],
        pontos: s.points,
        org: s.categories.Organização,
        dis: s.categories.Disciplina,
        des: s.categories.Desempenho
      }));
  }, [students]);

  const categoryData = useMemo(() => {
    const totals = students.reduce((acc, s) => ({
      org: acc.org + s.categories.Organização,
      dis: acc.dis + s.categories.Disciplina,
      des: acc.des + s.categories.Desempenho
    }), { org: 0, dis: 0, des: 0 });

    return [
      { name: 'Organização', value: totals.org, color: '#3B82F6' },
      { name: 'Disciplina', value: totals.dis, color: '#8B5CF6' },
      { name: 'Desempenho', value: totals.des, color: '#EC4899' }
    ];
  }, [students]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] card-shadow border border-slate-50">
          <h3 className="text-xl font-black text-slate-800 mb-8">Top 10 Exploradores</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="pontos" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2563EB' : '#60A5FA'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] card-shadow border border-slate-50">
          <h3 className="text-xl font-black text-slate-800 mb-8">Distribuição por Categoria</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-4">
            {categoryData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-bold text-slate-600">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800">{cat.value} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CalendarView({ classDays, setClassDays }: { classDays: string[], setClassDays: (days: string[]) => void }) {
  const [currentDate, setCurrentDate] = useState(setYear(new Date(), 2026));
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const toggleDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    if (classDays.includes(dateStr)) {
      setClassDays(classDays.filter(d => d !== dateStr));
    } else {
      setClassDays([...classDays, dateStr]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[3rem] card-shadow border border-slate-50 p-8"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Marque os dias de aula</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 transition-all"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {calendarDays.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = classDays.includes(dateStr);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={i}
              onClick={() => toggleDay(day)}
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all relative
                ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
                ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}
                ${isToday && !isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
              `}
            >
              <span className="text-sm font-black">{format(day, 'd')}</span>
              {isSelected && <div className="w-1 h-1 rounded-full bg-white/50" />}
            </button>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-slate-500">Dia de Aula</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-100" />
            <span className="text-xs font-bold text-slate-500">Sem Aula</span>
          </div>
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Total de aulas: {classDays.length}
        </p>
      </div>
    </motion.div>
  );
}

function SettingsView({ settings, setSettings }: { settings: any, setSettings: (s: any) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="bg-white rounded-[3rem] card-shadow border border-slate-50 p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Configurações</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Personalize seu painel</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Projeto (App)</label>
            <input 
              type="text" 
              value={settings.projectName}
              onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome da Escola</label>
            <input 
              type="text" 
              value={settings.schoolName}
              onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Turma</label>
              <input 
                type="text" 
                value={settings.className}
                onChange={(e) => setSettings({ ...settings, className: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Ano Letivo</label>
              <input 
                type="text" 
                value={settings.year}
                onChange={(e) => setSettings({ ...settings, year: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nome do Professor</label>
            <input 
              type="text" 
              value={settings.teacherName}
              onChange={(e) => setSettings({ ...settings, teacherName: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="pt-10 border-t border-slate-50">
          <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4">Zona de Perigo</h4>
          <button 
            onClick={() => {
              if (confirm("Isso apagará TODOS os dados permanentemente. Continuar?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full px-6 py-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Apagar Todos os Dados do Sistema
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
      active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, suffix, trend, trendUp, icon, color }: { label: string, value: string | number, suffix: string, trend: string, trendUp: boolean, icon: ReactNode, color: 'blue' | 'purple' | 'emerald' }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] card-shadow border border-slate-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-400">
          {icon}
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-slate-800">{value}</span>
        <span className="text-xs text-slate-400 font-bold">{suffix}</span>
      </div>
    </div>
  );
}

function CategoryButton({ label, icon, selected, onClick }: { label: string, icon: ReactNode, selected: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
        selected ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'
      }`}
    >
      <div className={`${selected ? 'text-white' : 'text-blue-600'}`}>
        {icon}
      </div>
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}
