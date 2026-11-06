import React, { useState } from 'react';
import { Key, Lock, Unlock, AlertOctagon } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface ChegetTerminalProps {
  isUnlocked: boolean;
  onToggleUnlock: () => void;
  currentNodeIndex: number;
  hasLaunched: boolean;
  onDirectLaunchAttempt?: () => void;
}

export const ChegetTerminal: React.FC<ChegetTerminalProps> = ({
  isUnlocked,
  onToggleUnlock,
  currentNodeIndex,
  hasLaunched,
  onDirectLaunchAttempt,
}) => {
  const [safetyCoverOpen, setSafetyCoverOpen] = useState(false);

  return (
    <div className="bg-stone-900 border border-stone-800 rounded flex flex-col h-full overflow-hidden text-stone-200">
      {/* מסגרת עליונה של מזוודת הצ'גט */}
      <div className="bg-stone-950 border-b border-stone-800 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-tactical font-bold text-sm tracking-wider text-stone-100">
            מזוודת הפיקוד «צ'גט» (ЧЕГЕТ) // רשת קזבק
          </span>
        </div>
        <div className="text-[10px] font-terminal text-stone-400">
          דגם 9K-79 · סודי ביותר
        </div>
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* נורות חיווי חומרה (סגנון סובייטי) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-stone-950/80 border border-stone-800 rounded p-2 flex flex-col items-center text-center">
            <span className="text-[9px] font-terminal text-stone-400 mb-1">רשת קזבק / קשר</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-terminal text-emerald-400 font-bold">מחובר</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded p-2 flex flex-col items-center text-center">
            <span className="text-[9px] font-terminal text-stone-400 mb-1">מכ"ם התרעה SPRN</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              <span className="text-[11px] font-terminal text-red-400 font-bold">אזעקה</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded p-2 flex flex-col items-center text-center">
            <span className="text-[9px] font-terminal text-stone-400 mb-1">טילי סילו RVSN</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isUnlocked
                    ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                    : 'bg-stone-600'
                }`}
              />
              <span
                className={`text-[11px] font-terminal font-bold ${
                  isUnlocked ? 'text-amber-400' : 'text-stone-500'
                }`}
              >
                {isUnlocked ? 'דרוך' : 'נעול'}
              </span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded p-2 flex flex-col items-center text-center">
            <span className="text-[9px] font-terminal text-stone-400 mb-1">צוללות טייפון</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isUnlocked
                    ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                    : 'bg-stone-600'
                }`}
              />
              <span
                className={`text-[11px] font-terminal font-bold ${
                  isUnlocked ? 'text-amber-400' : 'text-stone-500'
                }`}
              >
                {isUnlocked ? 'מוצפן' : 'פסיבי'}
              </span>
            </div>
          </div>
        </div>

        {/* פאנל מפתח הצפנה נשיאותי */}
        <div className="bg-stone-950 border border-stone-800/90 rounded p-3 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-terminal text-stone-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              מפתח הצפנה נשיאותי
            </span>
            <span
              className={`text-[11px] font-terminal px-2 py-0.5 rounded font-semibold ${
                isUnlocked
                  ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              {isUnlocked ? 'המפתח מסובב: פתוח' : 'מצב בטוח: נעול'}
            </span>
          </div>

          <p className="text-xs text-stone-400 mb-3 leading-relaxed">
            מזוודת הצ'גט דורשת אימות משולש (הנשיא ילצין, שר ההגנה גרצ'וב, והרמטכ"ל קולסניקוב). סיבוב המפתח מפעיל ממסרי שיגור לחטיבות הטילים האסטרטגיים.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFX.playChegetKey();
                onToggleUnlock();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded font-terminal text-xs font-bold transition-all cursor-pointer border ${
                isUnlocked
                  ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-amber-600/60'
                  : 'bg-red-950/80 hover:bg-red-900/90 text-red-200 border-red-700'
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-4 h-4 text-amber-400" />
                  <span>נעילת המזוודה / ביטול דריכה</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>סיבוב מפתח נשיאותי (דריכה לפקודה)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* מודול כפתור שיגור גרעיני */}
        <div className="bg-stone-950 border border-red-950/80 rounded p-3 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-terminal font-bold text-red-400 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-red-500" />
              כפתור השיגור הגרעיני «ПУСК»
            </div>
            <div className="text-[11px] text-stone-400">
              {currentNodeIndex === 2
                ? 'הגנרלים סובבו את מפתחותיהם. ההכרעה מוטלת עליך.'
                : 'נעול מאחורי פרוטוקול שלבי ההתרעה.'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playTerminalClick();
                setSafetyCoverOpen(!safetyCoverOpen);
              }}
              className="text-[10px] font-terminal px-2 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer"
            >
              {safetyCoverOpen ? 'סגור מכסה מגן' : 'הרם מכסה מגן'}
            </button>

            {safetyCoverOpen && (
              <button
                disabled={!isUnlocked || hasLaunched}
                onClick={() => {
                  if (onDirectLaunchAttempt) {
                    onDirectLaunchAttempt();
                  }
                }}
                className={`px-3 py-1.5 rounded font-tactical font-bold text-xs uppercase tracking-wider transition-all border ${
                  isUnlocked && !hasLaunched
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.7)] cursor-pointer animate-pulse'
                    : 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed'
                }`}
                title={isUnlocked ? 'לחץ לאישור שיגור מכת מנע/תגמול' : 'יש לפתוח את מפתח הצ\'גט תחילה'}
              >
                שיגור (ПУСК)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
