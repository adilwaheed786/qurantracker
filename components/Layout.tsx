
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleDarkMode, activeTab, onTabChange }) => {
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-950' : 'bg-[#fdfbf7]'}`} dir="rtl">
      <header className="sticky top-0 z-40 bg-emerald-900 dark:bg-emerald-950 text-white shadow-lg pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-amber-500 p-2 rounded-lg shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">الحافظ</h1>
              <p className="text-xs text-emerald-200">قرآن ٹریکر</p>
            </div>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 bg-emerald-800 dark:bg-emerald-900/50 rounded-xl hover:bg-emerald-700 transition-all active:scale-90"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 pb-24 dark:text-slate-100 text-right">
        {children}
      </main>

      <footer className="w-full max-w-4xl mx-auto px-4 py-8 pb-32 text-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-100 dark:via-emerald-900/30 to-transparent mb-6"></div>
        <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium mb-1">Created for the Ummah</p>
        <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold">
          Developed by <span className="text-emerald-700 dark:text-emerald-500">Engr Adil Waheed</span>
        </p>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-emerald-100 dark:border-slate-800 px-4 pt-2 pb-[calc(12px+env(safe-area-inset-bottom))] flex justify-around items-center z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        <NavItem 
          active={activeTab === 'home'} 
          onClick={() => onTabChange('home')} 
          icon={<HomeIcon />} 
          label="ہوم" 
        />
        <NavItem 
          active={activeTab === 'history'} 
          onClick={() => onTabChange('history')} 
          icon={<HistoryIcon />} 
          label="تاریخ" 
        />
        <NavItem 
          active={activeTab === 'stats'} 
          onClick={() => onTabChange('stats')} 
          icon={<StatsIcon />} 
          label="ترقی" 
        />
        <NavItem 
          active={activeTab === 'settings'} 
          onClick={() => onTabChange('settings')} 
          icon={<SettingsIcon />} 
          label="ترتیبات" 
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active?: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 min-w-[64px] rounded-xl transition-all active:scale-90 ${active ? 'text-emerald-700 dark:text-emerald-400 font-semibold scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-emerald-600'}`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
