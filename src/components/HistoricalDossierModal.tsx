import React from 'react';
import { X, FileText, Radio, Quote, BookOpen } from 'lucide-react';
import { HISTORICAL_DOCUMENTS } from '../data/crisisData';
import { soundFX } from '../utils/audio';

interface HistoricalDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoricalDossierModal: React.FC<HistoricalDossierModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* כותרת החלונית */}
        <div className="bg-stone-950 border-b border-stone-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-tactical font-bold text-lg text-stone-100 tracking-wide">
                תיק מסמכים היסטורי: משבר הטיל הנורווגי 1995
              </h2>
              <div className="text-[11px] font-terminal text-stone-400">
                ארכיון מקורות ראשוניים · מסמכים מסווגים
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playTerminalClick();
              onClose();
            }}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="סגור חלונית מסמכים"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* תוכן המסמכים */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-stone-200 text-xs sm:text-sm font-sans">
          
          {/* מסמך 1: האיגרת הנורווגית האבודה */}
          <div className="bg-stone-950 border border-stone-800 rounded p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-terminal text-amber-400 border-b border-stone-800 pb-2">
              <FileText className="w-4 h-4" />
              <span className="font-bold">מסמך 1: האיגרת הדיפלומטית שנקברה במשרד החוץ (Note Verbale 42/94)</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400">21 בדצמבר 1994</span>
            </div>
            <pre className="font-terminal text-xs text-stone-300 whitespace-pre-line leading-relaxed bg-stone-900/60 p-3 rounded border border-stone-800/80">
              {HISTORICAL_DOCUMENTS.memoText}
            </pre>
            <div className="text-[11px] text-stone-400 italic">
              <strong>הקשר היסטורי:</strong> נורווגיה העבירה איגרת זו לשגרירות הרוסית 35 ימים לפני השיגור. הפקידות הרוסית תייקה את המכתב כמסמך מדעי לא-דחוף, והוא מעולם לא הועבר למערך ההתרעה המוקדמת של הצבא.
            </div>
          </div>

          {/* מסמך 2: יומן מכ"ם אולנגורסק */}
          <div className="bg-stone-950 border border-stone-800 rounded p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-terminal text-emerald-400 border-b border-stone-800 pb-2">
              <Radio className="w-4 h-4" />
              <span className="font-bold">מסמך 2: קטעים מיומן המכ"ם באולנגורסק בזמן אמת</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400">25 בינואר 1995</span>
            </div>
            <pre className="font-terminal text-xs text-emerald-300/90 whitespace-pre-line leading-relaxed bg-stone-900/60 p-3 rounded border border-stone-800/80">
              {HISTORICAL_DOCUMENTS.declassifiedLog}
            </pre>
          </div>

          {/* מסמך 3: דברי ילצין לעיתונאים */}
          <div className="bg-stone-950 border border-stone-800 rounded p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-terminal text-cyan-400 border-b border-stone-800 pb-2">
              <Quote className="w-4 h-4" />
              <span className="font-bold">מסמך 3: מסיבת העיתונאים של הנשיא בוריס ילצין</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400">26 בינואר 1995</span>
            </div>
            <blockquote className="font-terminal text-xs sm:text-sm text-cyan-200/90 italic bg-stone-900/60 p-3 rounded border border-stone-800/80 leading-relaxed">
              {HISTORICAL_DOCUMENTS.yeltsinQuote}
            </blockquote>
          </div>

        </div>

        {/* תחתית החלונית */}
        <div className="bg-stone-950 border-t border-stone-800 p-3 sm:p-4 flex justify-end">
          <button
            onClick={() => {
              soundFX.playTerminalClick();
              onClose();
            }}
            className="px-4 py-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-terminal transition-colors cursor-pointer"
          >
            סגור תיק מסמכים
          </button>
        </div>

      </div>
    </div>
  );
};
