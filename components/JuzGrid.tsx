
import React from 'react';
import { JUZ_DATA } from '../constants';
import { UserProgress, ProgressStep, PROGRESS_LABELS } from '../types';

interface JuzGridProps {
  progress: UserProgress;
  onSelectJuz: (juzNum: number) => void;
}

export const JuzGrid: React.FC<JuzGridProps> = ({ progress, onSelectJuz }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
      {JUZ_DATA.map((juz) => {
        const juzStep = (progress.juzProgress[juz.number] || 0) as ProgressStep;
        const completionPercentage = PROGRESS_LABELS[juzStep].pct;

        return (
          <button
            key={juz.number}
            onClick={() => onSelectJuz(juz.number)}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-50 dark:border-slate-800 text-right transition-all hover:shadow-md dark:hover:shadow-black/20 hover:border-emerald-200 dark:hover:border-emerald-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-right">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
                  {juz.number}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{juz.nameEnglish}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">شروع: {juz.startSurah}</p>
              </div>
              <div className="arabic-text text-2xl text-emerald-800 dark:text-emerald-500 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                {juz.nameArabic}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight flex-row-reverse">
                <span>{juzStep === 5 ? 'مکمل' : `${completionPercentage}%`}</span>
                <span className="arabic-text text-sm text-emerald-600 dark:text-emerald-400">{PROGRESS_LABELS[juzStep].ur}</span>
              </div>
              <div className="h-2 w-full bg-emerald-50 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner transition-colors">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out float-right ${juzStep === 5 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {juzStep === 5 && (
              <div className="absolute top-2 left-2">
                <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full p-1 shadow-sm ring-2 ring-white dark:ring-slate-800">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
