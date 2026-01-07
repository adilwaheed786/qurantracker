
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
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      dir="rtl"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-transform duration-300 translate-y-0 sm:translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-900 dark:bg-emerald-950 text-white flex-row-reverse">
          <button onClick={onClose} className="p-2 hover:bg-emerald-800 dark:hover:bg-emerald-900 rounded-full transition-colors active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center space-x-4 space-x-reverse flex-1">
            <span className="text-xl font-bold bg-amber-400 text-emerald-950 w-10 h-10 flex items-center justify-center rounded-xl shadow-lg">
              {juz.number}
            </span>
            <div className="text-right">
              <h2 className="text-md font-bold leading-tight">{juz.nameEnglish}</h2>
              <p className="text-emerald-200 text-[10px] italic arabic-text">{juz.nameArabic}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2 text-center">
            آپ نے کتنا پڑھ لیا ہے؟ نیچے سے انتخاب کریں:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {([1, 2, 3, 4, 5] as ProgressStep[]).map((step) => {
              const label = PROGRESS_LABELS[step];
              const isActive = selectedStep === step;
              
              return (
                <button
                  key={step}
                  onClick={() => setSelectedStep(step)}
                  className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-right active:scale-[0.98] ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 shadow-sm'
                      : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? 'border-emerald-500 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700'}`}>
                      {isActive && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                         <span className={`text-lg arabic-text ${isActive ? 'font-bold text-emerald-800 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                          {label.ur}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">({label.en})</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                    {label.pct}%
                  </div>
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => {
              setSelectedStep(0);
              onSave(0);
            }}
            className="w-full py-3 text-slate-400 dark:text-slate-500 text-[10px] hover:text-red-400 dark:hover:text-red-400 transition-colors active:scale-95"
          >
            اس پارے کی ترقی ختم کریں (Clear)
          </button>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex space-x-3 space-x-reverse pb-[calc(20px+env(safe-area-inset-bottom))]">
          <button
            onClick={() => onSave(selectedStep)}
            className="flex-1 px-4 py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-lg active:scale-95"
          >
            نشان لگائیں
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 transition-colors active:scale-95"
          >
            منسوخ کریں
          </button>
        </div>
      </div>
    </div>
  );
};
