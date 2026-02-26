import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, Settings, Info, Play, Pause, SkipBack, SkipForward, X, Heart as HeartIcon, Share2, Star, MessageCircle, Send, Mail, LayoutGrid, List } from 'lucide-react';
import { useTheme, getAccentClass, getAccentTextClass, getAccentHex, ThemeColor } from './context/ThemeContext';
import { useAudio, Lesson } from './context/AudioContext';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import lessonsData from './lessons.json';

// --- Components ---

const ExitDialog = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
  const { isDarkMode, accentColor } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-sm overflow-hidden rounded-[40px] p-8 shadow-2xl
              ${isDarkMode ? 'bg-zinc-900 border border-white/10' : 'bg-white'}`}
          >
            <div className="absolute inset-0 opacity-[0.03] islamic-pattern pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] shadow-lg
                ${getAccentClass(accentColor)}`}>
                <X size={40} className="text-white" />
              </div>
              
              <h2 className={`mb-3 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                له کاريال څخه وتل
              </h2>
              <p className={`mb-8 text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                آیا غواړئ له کاريال څخه ووځئ؟
              </p>
              
              <div className="flex w-full gap-4">
                <button
                  onClick={onConfirm}
                  className={`flex-1 rounded-3xl py-4 text-lg font-bold transition-all active:scale-95
                    ${getAccentClass(accentColor)} text-white shadow-lg`}
                >
                  هو
                </button>
                <button
                  onClick={onCancel}
                  className={`flex-1 rounded-3xl py-4 text-lg font-bold transition-all active:scale-95
                    ${isDarkMode ? 'bg-white/5 text-white border border-white/10' : 'bg-gray-100 text-gray-800'}`}
                >
                  نه
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { isDarkMode, accentColor } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // 2 seconds + some buffer for animations
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden
        ${isDarkMode ? 'bg-black' : 'bg-gradient-to-b from-islamic-orange to-orange-700'}`}
    >
      {/* Islamic Pattern Background */}
      <div className={`absolute inset-0 opacity-[0.08] islamic-pattern pointer-events-none 
        ${isDarkMode ? 'invert' : ''}`} />

      {/* Decorative Center Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mb-12"
      >
        <div className={`w-48 h-48 rounded-full border-2 border-dashed opacity-20 animate-spin-slow
          ${isDarkMode ? 'border-gray-600' : 'border-white'}`} />
        <div className={`absolute inset-4 rounded-full flex items-center justify-center shadow-2xl
          ${isDarkMode ? 'bg-zinc-900' : 'bg-white/10 backdrop-blur-md'}`}>
          <Play size={64} fill="white" className="text-white opacity-90 ml-2" />
        </div>
      </motion.div>

      {/* App Name & Subtitle */}
      <div className="text-center px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl font-bold text-white mb-4 tracking-tight"
        >
          د عمرې آډيو لارښود
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white/80 text-lg font-medium"
        >
          ټول ضروري احکام او فضائل په آډيو بڼه
        </motion.p>
      </div>

      {/* Loading Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16"
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-white"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const { isDarkMode, accentColor } = useTheme();
  const accentText = getAccentTextClass(accentColor);

  const tabs = [
    { id: 'home', label: 'کورپاڼه', icon: Home },
    { id: 'favs', label: 'خوښي شوي', icon: Heart },
    { id: 'settings', label: 'تنظيمات', icon: Settings },
    { id: 'about', label: 'زموږ په اړه', icon: Info },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 nav-bar-padding flex items-center justify-around z-40
      ${isDarkMode ? 'bg-black/80 backdrop-blur-xl border-t border-white/10' : 'bg-white/80 backdrop-blur-xl border-t border-black/5 shadow-[0_-8px_24px_rgba(0,0,0,0.04)]'}`}>
      <div className="flex w-full h-16 items-center justify-around px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative group"
            >
              <div className={`relative px-5 py-1 rounded-full transition-all duration-300 flex items-center justify-center
                ${isActive ? `${getAccentClass(accentColor)}/15` : 'group-hover:bg-gray-100 dark:group-hover:bg-white/5'}`}>
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? accentText : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}
                />
              </div>
              <span className={`text-[11px] mt-1 font-bold transition-colors duration-300
                ${isActive ? accentText : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const LessonCard: React.FC<{ lesson: Lesson, onPlay: (l: Lesson) => void, viewMode?: 'list' | 'grid' }> = ({ lesson, onPlay, viewMode = 'list' }) => {
  const { isDarkMode, accentColor } = useTheme();
  const [isFav, setIsFav] = useState(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favs.includes(lesson.id);
  });

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavs;
    if (isFav) {
      newFavs = favs.filter((id: number) => id !== lesson.id);
    } else {
      newFavs = [...favs, lesson.id];
    }
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  if (viewMode === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPlay(lesson)}
        className={`relative p-4 rounded-[28px] mb-4 cursor-pointer overflow-hidden group transition-all duration-300 flex flex-col items-center text-center
          ${isDarkMode ? 'bg-zinc-900 border border-white/5 hover:bg-zinc-800' : 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/[0.03] hover:shadow-md'}`}
      >
        <div className="absolute inset-0 opacity-[0.02] islamic-pattern pointer-events-none" />
        
        <div className="relative z-10 w-full">
          <div className="absolute top-0 right-0">
            <button 
              onClick={toggleFav}
              className={`p-2 rounded-full transition-all active:scale-125 ${isFav ? 'text-red-500' : (isDarkMode ? 'text-gray-600' : 'text-gray-300')}`}
            >
              <HeartIcon size={18} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110
            ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <Play size={28} fill="currentColor" className={getAccentTextClass(accentColor)} />
          </div>
          
          <h3 className={`font-bold text-base mb-2 line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</h3>
          <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-black/5 text-gray-500'}`}>
            {lesson.duration}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onPlay(lesson)}
      className={`relative p-5 rounded-[24px] mb-4 cursor-pointer overflow-hidden group transition-all duration-300
        ${isDarkMode ? 'bg-zinc-900 border border-white/5 hover:bg-zinc-800' : 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/[0.03] hover:shadow-md'}`}
    >
      <div className="absolute inset-0 opacity-[0.02] islamic-pattern pointer-events-none" />
      
      <div className="flex items-center gap-5 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110
          ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
          <Play size={24} fill="currentColor" className={getAccentTextClass(accentColor)} />
        </div>
        
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-black/5 text-gray-500'}`}>
              {lesson.duration}
            </span>
            <p className={`text-[11px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>آډيو لارښود</p>
          </div>
        </div>

        <button 
          onClick={toggleFav}
          className={`p-3 rounded-full transition-all active:scale-125 ${isFav ? 'text-red-500' : (isDarkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500')}`}
        >
          <HeartIcon size={22} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>
    </motion.div>
  );
};

const PlayerOverlay = () => {
  const { isPlayerOpen, setIsPlayerOpen, currentLesson, isPlaying, togglePlay, progress, duration, seek, skip } = useAudio();
  const { isDarkMode, accentColor } = useTheme();
  
  if (!currentLesson) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isPlayerOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          <div className="absolute inset-0 opacity-[0.05] islamic-pattern pointer-events-none" />
          
          <div className="status-bar-padding px-6 flex justify-between items-center relative z-10 h-20">
            <button onClick={() => setIsPlayerOpen(false)} className="p-2">
              <X size={24} />
            </button>
            <h2 className="font-bold text-lg">اوس غږول کيږي</h2>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
            <div className={`w-72 h-72 rounded-full border-4 flex items-center justify-center relative
              ${isDarkMode ? 'border-white/10' : 'border-black/5 shadow-2xl'}`}>
              <div className={`absolute inset-4 rounded-full border border-dashed opacity-20 animate-spin-slow
                ${isDarkMode ? 'border-white' : 'border-black'}`} />
              <div className={`w-56 h-56 rounded-full flex items-center justify-center overflow-hidden shadow-inner
                ${getAccentClass(accentColor)}`}>
                 <Play size={80} className="text-white opacity-20" />
              </div>
            </div>

            <div className="mt-12 text-center">
              <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
              <p className={`text-sm opacity-60`}>د عمرې آډيو لارښود</p>
            </div>

            <div className="w-full mt-12">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-current
                  ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
                style={{ color: getAccentHex(accentColor) }}
              />
              <div className="flex justify-between mt-2 text-xs opacity-50 font-mono">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12">
              <button onClick={() => skip(-10)} className="p-2 opacity-70 hover:opacity-100 transition-opacity">
                <SkipBack size={32} />
              </button>
              
              <button 
                onClick={togglePlay}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95
                  ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
              >
                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="mr-[-4px]" />}
              </button>

              <button onClick={() => skip(10)} className="p-2 opacity-70 hover:opacity-100 transition-opacity">
                <SkipForward size={32} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Screens ---

const HomeScreen = () => {
  const [lessons, setLessons] = useState<Lesson[]>(lessonsData as Lesson[]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => (localStorage.getItem('viewMode') as 'list' | 'grid') || 'list');
  const { playLesson } = useAudio();
  const { isDarkMode, accentColor } = useTheme();

  const toggleViewMode = () => {
    const newMode = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(newMode);
    localStorage.setItem('viewMode', newMode);
  };

  return (
    <div className="pb-32">
      <div className={`relative overflow-hidden mb-8 shadow-xl rounded-b-[56px]
        ${getAccentClass(accentColor)}`}>
        <div className="absolute inset-0 opacity-20 islamic-pattern mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        
        <div className="relative z-10 text-white status-bar-padding px-8 pb-16 pt-12">
          <h1 className="text-5xl font-bold mb-3 leading-tight tracking-tight">د عمرې لارښود</h1>
          <p className="opacity-90 text-sm font-bold tracking-wide">د عمرې مکمل او ضروري آډيو درسونه</p>
        </div>
      </div>

      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ټول درسونه</h2>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleViewMode}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white shadow-sm border border-black/5 text-gray-800'}`}
            >
              {viewMode === 'list' ? <LayoutGrid size={20} /> : <List size={20} />}
            </button>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-zinc-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {lessons.length} موضوعات
            </span>
          </div>
        </div>

        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col'}>
          {lessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onPlay={playLesson} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FavoritesScreen = () => {
  const [favLessons, setFavLessons] = useState<Lesson[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => (localStorage.getItem('viewMode') as 'list' | 'grid') || 'list');
  const { playLesson } = useAudio();
  const { isDarkMode } = useTheme();

  const loadFavs = () => {
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavLessons((lessonsData as Lesson[]).filter(l => favIds.includes(l.id)));
  };

  useEffect(() => {
    loadFavs();
    window.addEventListener('favoritesChanged', loadFavs);
    return () => window.removeEventListener('favoritesChanged', loadFavs);
  }, []);

  const toggleViewMode = () => {
    const newMode = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(newMode);
    localStorage.setItem('viewMode', newMode);
  };

  return (
    <div className="px-6 status-bar-padding pb-32">
      <div className="flex items-center justify-between mb-8 pt-6">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>خوښي شوي</h1>
        
        <button 
          onClick={toggleViewMode}
          className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-white shadow-sm border border-black/5 text-gray-800'}`}
        >
          {viewMode === 'list' ? <LayoutGrid size={20} /> : <List size={20} />}
        </button>
      </div>
      
      {favLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <Heart size={64} className="mb-4" />
          <p className="text-center font-medium">تر اوسه کوم درس خوښ شوی نه دی</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col'}>
          {favLessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} onPlay={playLesson} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
};

const SettingsScreen = () => {
  const { isDarkMode, setIsDarkMode, accentColor, setAccentColor, autoNext, setAutoNext } = useTheme();
  
  const colors: {id: ThemeColor, hex: string}[] = [
    { id: 'orange', hex: '#F27D26' },
    { id: 'green', hex: '#2E7D32' },
    { id: 'blue', hex: '#0288D1' },
    { id: 'purple', hex: '#7B1FA2' },
    { id: 'red', hex: '#C62828' },
    { id: 'gold', hex: '#D4AF37' },
    { id: 'gray', hex: '#616161' },
    { id: 'teal', hex: '#00897B' },
    { id: 'dark-green', hex: '#1B5E20' },
    { id: 'navy', hex: '#1A237E' },
  ];

  const SettingItem = ({ label, children, icon: Icon }: { label: string, children: React.ReactNode, icon?: any }) => (
    <div className={`flex items-center justify-between p-5 rounded-3xl mb-3 transition-all
      ${isDarkMode ? 'bg-zinc-900 border border-white/5' : 'bg-white shadow-sm border border-black/[0.03]'}`}>
      <div className="flex items-center gap-4">
        {Icon && <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}><Icon size={20} /></div>}
        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{label}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="px-6 status-bar-padding pb-32">
      <h1 className={`text-3xl font-bold mb-8 pt-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>تنظيمات</h1>

      <div className="mb-8">
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-40 px-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>ظاهر</h3>
        <SettingItem label="د شپې حالت" icon={Home}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-14 h-8 rounded-full transition-all duration-300 relative
              ${isDarkMode ? getAccentClass(accentColor) : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 shadow-md
              ${isDarkMode ? 'right-1 bg-white' : 'left-1 bg-white'}`} />
          </button>
        </SettingItem>

        <div className={`p-6 rounded-[32px] mb-3 ${isDarkMode ? 'bg-zinc-900 border border-white/5' : 'bg-white shadow-sm border border-black/[0.03]'}`}>
          <p className={`font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>د اپ رنګ</p>
          <div className="grid grid-cols-5 gap-4">
            {colors.map(c => (
              <button
                key={c.id}
                onClick={() => setAccentColor(c.id)}
                className={`w-10 h-10 rounded-full border-4 transition-all duration-300 active:scale-75
                  ${accentColor === c.id ? 'border-white ring-2 ring-current shadow-xl scale-110' : 'border-transparent opacity-60'}`}
                style={{ backgroundColor: c.hex, color: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-40 px-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>غږول</h3>
        <SettingItem label="بل درس اوتومات شروع شي" icon={Play}>
          <button 
            onClick={() => setAutoNext(!autoNext)}
            className={`w-14 h-8 rounded-full transition-all duration-300 relative
              ${autoNext ? getAccentClass(accentColor) : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 shadow-md bg-white
              ${autoNext ? 'right-1' : 'left-1'}`} />
          </button>
        </SettingItem>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className={`p-5 rounded-[32px] flex flex-col items-center justify-center gap-3 font-bold transition-all active:scale-95
          ${isDarkMode ? 'bg-zinc-900 text-white border border-white/5' : 'bg-white shadow-sm border border-black/[0.03] text-gray-800'}`}>
          <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><Share2 size={24} /></div>
          اپ شريکول
        </button>

        <button className={`p-5 rounded-[32px] flex flex-col items-center justify-center gap-3 font-bold transition-all active:scale-95
          ${isDarkMode ? 'bg-zinc-900 text-white border border-white/5' : 'bg-white shadow-sm border border-black/[0.03] text-gray-800'}`}>
          <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}><Star size={24} /></div>
          درجه ورکول
        </button>
      </div>
    </div>
  );
};

const AboutScreen = () => {
  const { isDarkMode, accentColor } = useTheme();

  const ContactBtn = ({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-full p-5 rounded-[32px] mb-4 flex items-center gap-5 font-bold transition-all active:scale-[0.98]
        ${isDarkMode ? 'bg-zinc-900 text-white border border-white/5' : 'bg-white shadow-sm border border-black/[0.03] text-gray-800 hover:shadow-md'}`}
    >
      <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center text-white shadow-lg ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-lg">{label}</span>
    </button>
  );

   return (
  <div className="px-6 status-bar-padding pb-32">
    <div className="flex flex-col items-center mb-10 pt-6">
      <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden
        ${getAccentClass(accentColor)}`}>
        <div className="absolute inset-0 opacity-20 islamic-pattern" />
        <Info size={48} className="text-white relative z-10" />
      </div>
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>زموږ په اړه</h1>
    </div>
    
    <div className={`p-8 rounded-[40px] mb-10 leading-relaxed text-justify relative overflow-hidden
      ${isDarkMode ? 'bg-zinc-900 text-gray-300 border border-white/5' : 'bg-white shadow-sm border border-black/[0.03] text-gray-600'}`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] islamic-pattern pointer-events-none" />
      
      <p className="mb-6 text-lg">
        دا اپ د عمرې اړوند مهم او ضروري آډيو درسونه وړاندې کوي، تر څو مسلمانان وکولای شي د عمرې طريقه، احکام او فضائل په اسانه توګه زده کړي.
      </p>

      <p className="mb-6 text-lg">
        دا کاريال مکمل افلاین دی او د کارولو لپاره انټرنېټ ته اړتيا نه لري.
      </p>

      <p className="mb-6 text-lg">
        زموږ موخه دا ده چې اسلامي علم په ساده، ښکلي او منظم ډول خلکو ته وړاندې کړو. 
      </p>

      {/* نوي لينونه */}
      <p className="mb-2 text-lg font-medium text-center">
        کاريال جوړوونکی: عبيدالله غفاري
      </p>

      <p className="mb-6 text-lg font-medium text-center">
        جمع او ترتيب: الحاج ډاکټر فريدون احرار
      </p>

      <div className={`h-px w-20 mx-auto my-8 opacity-20 ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
      
      <p className="font-bold text-center text-xl text-current" style={{ color: getAccentHex(accentColor) }}>
        الله تعالی دې زموږ دا هڅه قبوله کړي.
      </p>
    </div>

    <div className="space-y-2">
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-40 px-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>اړيکه</h3>
      <ContactBtn icon={Send} label="ټليګرام" color="bg-[#0088cc]" onClick={() => window.open('https://t.me/obaidapp')} />
      <ContactBtn icon={MessageCircle} label="واټساپ" color="bg-[#25D366]" onClick={() => window.open('https://wa.me/93779705897')} />
      <ContactBtn icon={Mail} label="بريښناليک" color="bg-[#EA4335]" onClick={() => window.location.href = 'mailto: obaidkhanghafari@gmail.com'} />
    </div>
  </div>
);
};

// --- Main App ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);
  const { isDarkMode } = useTheme();
  const { isPlayerOpen, setIsPlayerOpen } = useAudio();

  // Handle Tab Change with History
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setTabHistory(prev => [...prev, tab]);
    }
  };

  // Capacitor Back Button Handling
  useEffect(() => {
    const handleBackButton = async () => {
      if (showExitDialog) {
        setShowExitDialog(false);
      } else if (isPlayerOpen) {
        setIsPlayerOpen(false);
      } else if (activeTab !== 'home') {
        const newHistory = [...tabHistory];
        newHistory.pop(); // Remove current tab
        const prevTab = newHistory.length > 0 ? newHistory[newHistory.length - 1] : 'home';
        setActiveTab(prevTab);
        setTabHistory(newHistory.length > 0 ? newHistory : ['home']);
      } else {
        setShowExitDialog(true);
      }
    };

    const backListener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      backListener.then(l => l.remove());
    };
  }, [isPlayerOpen, activeTab, tabHistory, setIsPlayerOpen, showExitDialog]);

  // Capacitor Status Bar Styling
  useEffect(() => {
    const updateStatusBar = async () => {
      try {
        await StatusBar.setStyle({
          style: isDarkMode ? Style.Dark : Style.Light
        });
        if (isDarkMode) {
          await StatusBar.setBackgroundColor({ color: '#000000' });
        } else {
          await StatusBar.setBackgroundColor({ color: '#F27D26' }); // Match header color
        }
      } catch (e) {
        console.warn('StatusBar plugin not available', e);
      }
    };
    updateStatusBar();
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-black' : 'bg-[#f8f9fa]'}`}>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <div className="max-w-md mx-auto min-h-screen relative flex flex-col">
          <main className="flex-1">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'favs' && <FavoritesScreen />}
            {activeTab === 'settings' && <SettingsScreen />}
            {activeTab === 'about' && <AboutScreen />}
          </main>

          <PlayerOverlay />
          <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
          
          <ExitDialog 
            isOpen={showExitDialog} 
            onConfirm={() => CapacitorApp.exitApp()} 
            onCancel={() => setShowExitDialog(false)} 
          />
        </div>
      )}
    </div>
  );
}
