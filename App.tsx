
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Layout } from './components/Layout';
import { JuzGrid } from './components/JuzGrid';
import { ProgressModal } from './components/ProgressModal';
import { UserProgress, ProgressStep, PROGRESS_LABELS } from './types';
import { JUZ_DATA } from './constants';

const LOCAL_STORAGE_KEY = 'al_hafiz_user_progress';
const THEME_KEY = 'al_hafiz_theme_mode';

type TabType = 'home' | 'history' | 'stats' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      lastReadJuz: 1,
      lastReadStep: 0,
      juzProgress: {},
      history: []
    };
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [selectedJuzNum, setSelectedJuzNum] = useState<number | null>(null);
  const [reflection, setReflection] = useState<string>('');
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSaveProgress = (step: ProgressStep) => {
    if (selectedJuzNum === null) return;

    setProgress(prev => {
      const newJuzProgress = { ...prev.juzProgress, [selectedJuzNum]: step };
      const newHistory = [{
        date: new Date().toISOString(),
        juz: selectedJuzNum,
        step: step
      }, ...prev.history].slice(0, 20);

      return {
        ...prev,
        lastReadJuz: selectedJuzNum,
        lastReadStep: step,
        juzProgress: newJuzProgress,
        history: newHistory
      };
    });

    setSelectedJuzNum(null);
  };

  const getDailyReflection = useCallback(async () => {
    setIsLoadingReflection(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a short, 1-sentence inspirational spiritual reflection from the Holy Quran to encourage someone who is reading Juz ${progress.lastReadJuz}. Make it warm and encouraging. Respond in Urdu with English translation.`,
      });
      setReflection(response.text || 'قرآن پاک کی تلاوت دلوں کا سکون ہے۔ Reading Quran is the peace of hearts.');
    } catch (error) {
      setReflection('تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔ The best of you are those who learn the Quran and teach it.');
    } finally {
      setIsLoadingReflection(false);
    }
  }, [progress.lastReadJuz]);

  useEffect(() => {
    getDailyReflection();
  }, [getDailyReflection]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const lastJuz = JUZ_DATA.find(j => j.number === progress.lastReadJuz);
  const totalCompleted = Object.values(progress.juzProgress).filter(s => s === 5).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 px-2">پچھلی تلاوت (History)</h2>
            {progress.history.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-600 italic">کوئی ہسٹری موجود نہیں۔</div>
            ) : (
              progress.history.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
                  <div className="text-right">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">پارہ {item.juz}</div>
                    <div className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString('ur-PK')}</div>
                  </div>
                  <div className="arabic-text text-lg text-slate-700 dark:text-slate-200">
                    {PROGRESS_LABELS[item.step].ur}
                  </div>
                </div>
              ))
            )}
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 px-2">آپ کی ترقی (Stats)</h2>
            <div className="bg-emerald-900 text-white p-8 rounded-3xl text-center shadow-xl">
               <div className="text-5xl font-black mb-2">{Math.round((totalCompleted / 30) * 100)}%</div>
               <div className="text-emerald-300 uppercase tracking-widest text-xs font-bold">مجموعی قرآن مکمل</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                  <div className="text-2xl font-black text-emerald-600">{totalCompleted}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tight">مکمل پارے</div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                  <div className="text-2xl font-black text-amber-500">{30 - totalCompleted}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tight">باقی پارے</div>
               </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 px-2">ترتیبات (Settings)</h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
              <button onClick={toggleDarkMode} className="w-full p-5 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="font-semibold text-slate-700 dark:text-slate-200">ڈارک موڈ</span>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'left-7' : 'left-1'}`} />
                </div>
              </button>
              <button 
                onClick={() => {
                  if(confirm('کیا آپ تمام ڈیٹا ختم کرنا چاہتے ہیں؟')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full p-5 flex justify-between items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-slate-100 dark:border-slate-800"
              >
                <span className="font-semibold">ڈیٹا ری سیٹ کریں</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Welcome & Reflection Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-emerald-50 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors mb-6">
              <div className="absolute top-0 left-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                </svg>
              </div>
              <div className="relative z-10 text-right">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1 leading-tight">اسلام علیکم</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">اللہ آپ کے قرآن کے سفر میں برکت ڈالے۔</p>

                <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm leading-relaxed min-h-[60px] flex items-center justify-center italic text-center">
                  {isLoadingReflection ? (
                    <div className="flex space-x-2 space-x-reverse items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <div className="w-full">“{reflection}”</div>
                  )}
                </div>
              </div>
            </div>

            {/* Continue Reading Card */}
            {lastJuz && (
              <div className="bg-emerald-900 dark:bg-emerald-950 rounded-3xl p-6 text-white shadow-2xl shadow-emerald-900/20 dark:shadow-black/40 relative overflow-hidden group transition-colors text-right mb-6">
                <div className="absolute -left-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold mb-1 block">یہاں سے جاری رکھیں</span>
                    <h3 className="text-2xl font-bold">{lastJuz.nameEnglish}</h3>
                    <p className="text-emerald-200 text-sm italic arabic-text">{lastJuz.nameArabic} (پارہ {lastJuz.number})</p>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-amber-400">{PROGRESS_LABELS[progress.lastReadStep].pct}%</div>
                    <div className="text-[10px] text-emerald-300 font-bold uppercase">پارہ کی ترقی</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse bg-emerald-800/40 dark:bg-emerald-900/40 p-3 rounded-xl border border-emerald-700/50 dark:border-emerald-800/50">
                    <div className="bg-amber-400 p-1.5 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-950" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex flex-col text-white flex-1">
                      <span className="text-[10px] text-emerald-300 font-bold uppercase">مقام:</span>
                      <span className="text-lg font-bold arabic-text">{PROGRESS_LABELS[progress.lastReadStep].ur}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedJuzNum(progress.lastReadJuz)}
                    className="w-full bg-amber-400 text-emerald-950 py-4 rounded-2xl font-black hover:bg-amber-300 transition-all shadow-xl active:scale-[0.98] duration-150 text-sm uppercase tracking-wider"
                  >
                    اگلا نشان لگائیں
                  </button>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-50 dark:border-slate-800 shadow-sm flex items-center space-x-4 space-x-reverse transition-colors">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none mb-1">{totalCompleted}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-tight">مکمل پارے</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-emerald-50 dark:border-slate-800 shadow-sm flex items-center space-x-4 space-x-reverse transition-colors">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none mb-1">30</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-tight">کل پارے</div>
                </div>
              </div>
            </div>

            {/* Juz List */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-6 px-1 flex-row-reverse">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">تمام 30 پارے</h2>
                <div className="h-1 flex-1 mx-4 bg-slate-100 dark:bg-slate-800 rounded-full opacity-50" />
              </div>
              <JuzGrid
                progress={progress}
                onSelectJuz={setSelectedJuzNum}
              />
            </div>
          </>
        );
    }
  };

  return (
    <Layout 
      darkMode={darkMode} 
      toggleDarkMode={toggleDarkMode} 
      activeTab={activeTab} 
      onTabChange={(tab) => setActiveTab(tab as TabType)}
    >
      <section className="animate-in fade-in duration-500">
        {renderContent()}
      </section>

      {/* Modals */}
      {selectedJuzNum !== null && (
        <ProgressModal
          juz={JUZ_DATA.find(j => j.number === selectedJuzNum)!}
          currentStep={(progress.juzProgress[selectedJuzNum] || 0) as ProgressStep}
          onClose={() => setSelectedJuzNum(null)}
          onSave={handleSaveProgress}
        />
      )}
    </Layout>
  );
};

export default App;
