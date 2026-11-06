import React from 'react';
import { Volume2, VolumeX, BookOpen, RotateCcw, GraduationCap, ShieldAlert } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onOpenInstructorGuide: () => void;
  onOpenDocuments: () => void;
  instructorModeActive: boolean;
  onToggleInstructorMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onReset,
  onOpenInstructorGuide,
  onOpenDocuments,
  instructorModeActive,
  onToggleInstructorMode,
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: מיתוג וכותרת */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-500 font-tactical font-bold text-lg">
          Ж
        </div>
        <div>
          <span className="font-tactical font-bold text-lg tracking-wider text-stone-100">
            10 דקות לאפס
          </span>
          <span className="hidden sm:inline text-xs text-stone-400 font-terminal mr-2">
            · משבר הטיל הנורווגי 1995
          </span>
        </div>
      </div>

      {/* Zone 2: כפתורי ניווט וכלים כיתתיים */}
      <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-stone-300">
        <button
          onClick={() => {
            soundFX.playTerminalClick();
            onOpenDocuments();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-stone-800 hover:text-stone-100 transition-colors cursor-pointer"
          title="צפייה במזכר המקורי מנורווגיה וביומני המכ״ם"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">תיק מסמכים היסטורי</span>
        </button>

        <button
          onClick={() => {
            soundFX.playTerminalClick();
            onOpenInstructorGuide();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-stone-800 hover:text-stone-100 transition-colors cursor-pointer"
          title="מדריך פדגוגי וסילבוס לסמינר ביחסים בינלאומיים"
        >
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">סילבוס ודיון כיתתי</span>
        </button>

        <button
          onClick={() => {
            soundFX.playTerminalClick();
            onToggleMute();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-stone-800 hover:text-stone-100 transition-colors cursor-pointer"
          title={isMuted ? 'הפעל שמע' : 'השתק שמע'}
          aria-label={isMuted ? 'הפעל שמע' : 'השתק שמע'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-stone-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="hidden lg:inline">{isMuted ? 'מושתק' : 'שמע פעיל'}</span>
        </button>

        <button
          onClick={() => {
            soundFX.playTerminalClick();
            onReset();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-stone-800 hover:text-red-400 transition-colors cursor-pointer"
          title="הפעלת הסימולציה מחדש"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
          <span className="hidden sm:inline">איפוס</span>
        </button>
      </nav>

      {/* Zone 3: פעולה מרכזית - מצב מרצה להקרנה בכיתה */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            soundFX.playTerminalClick();
            onToggleInstructorMode();
          }}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer border ${
            instructorModeActive
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700 hover:text-white'
          }`}
          title="הפעלת הערות תיאורטיות למרצה על גבי המסך"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>{instructorModeActive ? 'מצב מרצה: פעיל' : 'תצוגת כיתה'}</span>
        </button>
      </div>
    </header>
  );
};
