import { Utensils } from 'lucide-react';
import type { Language } from '../types';

interface SiteHeaderProps {
  language: Language;
  onToggleLanguage: () => void;
}

export default function SiteHeader({ language, onToggleLanguage }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-amber-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 via-rose-300 to-pink-300 text-white shadow-md"><Utensils className="h-5 w-5" /></div>
          <h1 className="flex items-center gap-2 font-display text-lg font-bold text-slate-800 sm:text-xl">Happy Yum Diary
            <span className="hidden rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600 sm:inline-block">{language === 'en' ? 'Warm Food Blog' : 'ချစ်စရာ စားဖွယ်ရာ ဒိုင်ယာရီ'}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onToggleLanguage} aria-label={language === 'en' ? 'Switch to Myanmar' : 'Switch to English'} title={language === 'en' ? 'Switch to Myanmar' : 'Switch to English'} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-2xl leading-none transition-colors hover:bg-slate-200">
            <span aria-hidden="true">{language === 'en' ? '🇲🇲' : '🇬🇧'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}