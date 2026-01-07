
export interface Juz {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  startSurah: string;
}

// 0: Not started
// 1: Al-Juz (الجز - Start)
// 2: Rub' (ربع - 1/4)
// 3: Nisf (نصف - 1/2)
// 4: Salasa (ثلاثة - 3/4)
// 5: Complete (مکمل)
export type ProgressStep = 0 | 1 | 2 | 3 | 4 | 5;

export interface UserProgress {
  lastReadJuz: number;
  lastReadStep: ProgressStep;
  juzProgress: Record<number, ProgressStep>;
  history: {
    date: string;
    juz: number;
    step: ProgressStep;
  }[];
}

export const PROGRESS_LABELS: Record<ProgressStep, { ur: string; en: string; pct: number }> = {
  0: { ur: "شروع نہیں کیا", en: "Not Started", pct: 0 },
  1: { ur: "الجز", en: "Al-Juz (Start)", pct: 5 },
  2: { ur: "ربع", en: "Rub' (1/4)", pct: 25 },
  3: { ur: "نصف", en: "Nisf (1/2)", pct: 50 },
  4: { ur: "ثلاثة", en: "Salasa (3/4)", pct: 75 },
  5: { ur: "مکمل", en: "Complete", pct: 100 }
};
