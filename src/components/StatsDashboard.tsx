import React from 'react';
import { Play, Pause, AlertTriangle, ShieldCheck, Activity, Radio, Clock } from 'lucide-react';
import { SimulationStats, EscalationLevel } from '../types/simulation';
import { soundFX } from '../utils/audio';

interface StatsDashboardProps {
  stats: SimulationStats;
  secondsRemaining: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onAdjustTimer: (deltaSeconds: number) => void;
  currentNodeIndex: number;
  totalNodes: number;
  instructorModeActive: boolean;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  secondsRemaining,
  isTimerRunning,
  onToggleTimer,
  onAdjustTimer,
  currentNodeIndex,
  totalNodes,
  instructorModeActive,
}) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // מיפוי צבעים וסגנון לפי רמת ההסלמה
  const getEscalationStyle = (level: EscalationLevel) => {
    switch (level) {
      case 'רגיעה יחסית':
        return {
          badge: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-400',
          bar: 'bg-emerald-500',
          percent: 20,
        };
      case 'זהירות':
        return {
          badge: 'bg-yellow-950/60 border-yellow-500/40 text-yellow-400',
          dot: 'bg-yellow-400',
          bar: 'bg-yellow-500',
          percent: 40,
        };
      case 'כוננות גבוהה':
        return {
          badge: 'bg-amber-950/60 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-400',
          bar: 'bg-amber-500',
          percent: 70,
        };
      case 'כוננות עליונה (DEFCON 1)':
        return {
          badge: 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse',
          dot: 'bg-red-500',
          bar: 'bg-red-600',
          percent: 90,
        };
      case 'הטאבו הגרעיני נשבר':
        return {
          badge: 'bg-rose-950 border-rose-500 text-rose-200 animate-pulse',
          dot: 'bg-rose-600',
          bar: 'bg-rose-600',
          percent: 100,
        };
    }
  };

  const escStyle = getEscalationStyle(stats.escalationLevel);

  return (
    <div className="bg-stone-900 border-b border-stone-800 p-3 sm:p-4 text-stone-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4 items-stretch">
        
        {/* מדד 1: שעון ספירה לאחור */}
        <div className="bg-stone-950 border border-stone-800/90 rounded p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1 font-terminal">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              חלון תגובה עד לפגיעה
            </span>
            <span className="text-[11px] font-terminal text-stone-500">
              שלב {currentNodeIndex + 1}/{totalNodes}
            </span>
          </div>

          <div className="flex items-center justify-between my-1">
            <div className="flex items-baseline gap-2">
              <span
                className={`font-terminal font-bold text-3xl sm:text-4xl tracking-wider tabular-nums ${
                  secondsRemaining <= 120
                    ? 'text-red-500 text-glow-red animate-pulse'
                    : secondsRemaining <= 300
                    ? 'text-amber-400 text-glow-amber'
                    : 'text-stone-100'
                }`}
              >
                {timeFormatted}
              </span>
              <span className="text-xs text-stone-400 font-terminal uppercase">
                {secondsRemaining <= 60 ? 'קריטי' : 'שנותרו'}
              </span>
            </div>

            {/* בקרי שעון */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  soundFX.playTerminalClick();
                  onToggleTimer();
                }}
                className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                title={isTimerRunning ? 'השהה שעון לדיון בכיתה' : 'המשך שעון'}
                aria-label={isTimerRunning ? 'השהה שעון' : 'המשך שעון'}
              >
                {isTimerRunning ? (
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>

              {instructorModeActive && (
                <>
                  <button
                    onClick={() => onAdjustTimer(-30)}
                    className="px-1.5 py-1 text-[10px] font-terminal rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                    title="הפחת 30 שניות"
                  >
                    -30ש
                  </button>
                  <button
                    onClick={() => onAdjustTimer(30)}
                    className="px-1.5 py-1 text-[10px] font-terminal rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                    title="הוסף 30 שניות"
                  >
                    +30ש
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="text-[11px] text-stone-400 font-terminal flex items-center justify-between">
            <span>מכ"ם התרעה SPRN</span>
            <span className={isTimerRunning ? 'text-emerald-400' : 'text-amber-400'}>
              {isTimerRunning ? 'שעון רץ' : 'מושהה (לדיון כיתתי)'}
            </span>
          </div>
        </div>

        {/* מדד 2: אינטרס ראשוני / הישרדות לאומית */}
        <div className="bg-stone-950 border border-stone-800/90 rounded p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1 font-terminal">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              אינטרס ראשוני: הישרדות
            </span>
            <span className="text-[10px] text-stone-500 font-terminal">רובינסון</span>
          </div>

          <div className="my-1 flex items-baseline justify-between">
            <span
              className={`font-terminal font-bold text-2xl sm:text-3xl tabular-nums ${
                stats.nationalSurvival >= 70
                  ? 'text-emerald-400'
                  : stats.nationalSurvival >= 40
                  ? 'text-amber-400'
                  : 'text-red-500'
              }`}
            >
              {Math.max(0, stats.nationalSurvival)}%
            </span>
            <span className="text-xs text-stone-300 font-medium">
              {stats.nationalSurvival >= 75
                ? 'המדינה שלמה'
                : stats.nationalSurvival >= 40
                ? 'פגיעות מוגברת'
                : 'סכנת כליה'}
            </span>
          </div>

          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stats.nationalSurvival >= 70
                  ? 'bg-emerald-500'
                  : stats.nationalSurvival >= 40
                  ? 'bg-amber-500'
                  : 'bg-red-600'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, stats.nationalSurvival))}%` }}
            />
          </div>
        </div>

        {/* מדד 3: סולם ההסלמה */}
        <div className="bg-stone-950 border border-stone-800/90 rounded p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1 font-terminal">
              <Activity className="w-3.5 h-3.5 text-red-400" />
              סולם ההסלמה
            </span>
            <span className="text-[10px] text-stone-500 font-terminal">שליטה (צימבלה)</span>
          </div>

          <div className="my-1 flex items-center justify-between">
            <div className={`px-2.5 py-1 rounded border text-xs font-semibold ${escStyle.badge}`}>
              {stats.escalationLevel}
            </div>
            <span className="text-xs text-stone-400 font-terminal">
              {stats.escalationLevel === 'הטאבו הגרעיני נשבר'
                ? 'שואה עולמית'
                : stats.escalationLevel === 'כוננות עליונה (DEFCON 1)'
                ? 'טרום שיגור'
                : 'אירוע מוכל'}
            </span>
          </div>

          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${escStyle.bar}`}
              style={{ width: `${escStyle.percent}%` }}
            />
          </div>
        </div>

        {/* מדד 4: שלמות ה-C3I והאמון במערכת */}
        <div className="bg-stone-950 border border-stone-800/90 rounded p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1 font-terminal">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              ערוצי פיקוד ושליטה (C3I)
            </span>
            <span className="text-[10px] text-stone-500 font-terminal">תמיד / לעולם לא</span>
          </div>

          <div className="my-1 flex items-baseline justify-between">
            <span
              className={`font-terminal font-bold text-2xl sm:text-3xl tabular-nums ${
                stats.c3iIntegrity >= 65
                  ? 'text-cyan-400'
                  : stats.c3iIntegrity >= 40
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {Math.max(0, stats.c3iIntegrity)}%
            </span>
            <span className="text-xs text-stone-300 font-medium">
              {stats.c3iIntegrity >= 70
                ? 'אימות קווים תקין'
                : stats.c3iIntegrity >= 40
                ? 'ערפל בירוקרטי'
                : 'החשכה קרובה'}
            </span>
          </div>

          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stats.c3iIntegrity >= 65
                  ? 'bg-cyan-500'
                  : stats.c3iIntegrity >= 40
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, stats.c3iIntegrity))}%` }}
            />
          </div>
        </div>

      </div>

      {/* שורת הערת מרצה (מוצגת במצב כיתה) */}
      {instructorModeActive && (
        <div className="mt-2.5 max-w-7xl mx-auto p-2.5 bg-amber-950/40 border border-amber-600/40 rounded text-xs text-amber-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>הנחיה לדיון בכיתה:</strong> שאל את הסטודנטים: האם פתיחת מזוודת הצ'גט מפרה את עקרון "לעולם לא" של צימבלה, או שמא היא ממלאת את דרישת ההרתעה של "תמיד"?
            </span>
          </div>
          <span className="text-[11px] font-terminal text-amber-300">
            לחץ על כפתור [השהה] בשעון כדי לאפשר הצבעה ודיון
          </span>
        </div>
      )}
    </div>
  );
};
