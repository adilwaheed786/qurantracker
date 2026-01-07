
import React from 'react';
import { Juz, ProgressStep, PROGRESS_LABELS } from '../types';

interface ProgressModalProps {
  juz: Juz;
  currentStep: ProgressStep;
  onClose: () => void;
  onSave: (step: ProgressStep) => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ juz, currentStep, onClose, onSave }) => {
  const [selectedStep, setSelectedStep] = React.useState<ProgressStep>(currentStep);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300" dir="rtl">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full duration-300 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-900 dark:bg-emerald-950 text-white flex-row-reverse">
          <button onClick={onClose} className="p-2 hover:bg-emerald-800 dark:hover:bg-emerald-900 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center space-x-4 space-x-reverse flex-1">
            <span className="text-2xl font-bold bg-amber-400 text-emerald-950 w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg ring-4 ring-emerald-800/50 dark:ring-emerald-900/50">
              {juz.number}
            </span>
            <div className="text-right">
              <h2 className="text-lg font-bold leading-tight">{juz.nameEnglish}</h2>
              <p className="text-emerald-200 text-xs italic arabic-text">{juz.nameArabic}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-bold mb-4 text-center">
            آپ نے کتنا پڑھ لیا ہے؟ نیچے سے انتخاب کریں:
          </p>

          <div className="grid grid-cols-1 gap-3">
            {([1, 2, 3, 4, 5] as ProgressStep[]).map((step) => {
              const label = PROGRESS_LABELS[step];
              const isActive = selectedStep === step;
              
              return (
                <button
                  key={step}
                  onClick={() => setSelectedStep(step)}
                  className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-right ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 shadow-md transform scale-[1.02]'
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'border-emerald-500 bg-white dark:bg-slate-900' : 'border-slate-300 dark:border-slate-600'}`}>
                      {isActive && <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3">
                         <span className={`text-xl arabic-text ${isActive ? 'font-bold text-emerald-800 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          {label.ur}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">({label.en})</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                    {label.pct}%
                  </div>
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => setSelectedStep(0)}
            className="w-full py-2 text-slate-400 dark:text-slate-500 text-xs hover:text-red-400 dark:hover:text-red-400 transition-colors"
          >
            اس پارے کی ترقی ختم کریں (Clear)
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex space-x-3 space-x-reverse transition-colors">
          <button
            onClick={() => onSave(selectedStep)}
            className="flex-1 px-4 py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-200 dark:shadow-black/40 active:scale-95"
          >
            نشان لگائیں
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            منسوخ کریں
          </button>
        </div>
      </div>
    </div>
  );
};
