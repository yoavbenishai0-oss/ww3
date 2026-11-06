import React from 'react';
import { PlayerDecisionRecord, OutcomeType, SimulationStats } from '../types/simulation';
import { DISCUSSION_QUESTIONS } from '../data/crisisData';
import { Shield, Radio, CheckCircle2, AlertOctagon, Printer, RotateCcw, Award, BookOpen } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface DebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  outcome: OutcomeType;
  finalStats: SimulationStats;
  decisionHistory: PlayerDecisionRecord[];
  onRestart: () => void;
  onOpenHistoricalDossier: () => void;
}

export const DebriefModal: React.FC<DebriefModalProps> = ({
  isOpen,
  onClose,
  outcome,
  finalStats,
  decisionHistory,
  onRestart,
  onOpenHistoricalDossier,
}) => {
  if (!isOpen) return null;

  const isHolocaust = outcome === 'nuclear_holocaust';

  // הערכה לפי מטריצת תומאס רובינסון
  const computeRobinsonEvaluation = () => {
    if (isHolocaust) {
      return {
        grade: 'כישלון קטסטרופלי: השמדת האינטרס הלאומי הראשוני',
        scoreColor: 'text-red-500',
        summary:
          'הקרבת את האינטרס הלאומי הראשוני והעליון של המדינה (הישרדות פיזית וקיום העם) בניסיון להקדים מתקפה שמעולם לא הייתה קיימת. בעידן הגרעיני, תומאס רובינסון מדגיש כי מניעת מלחמה גרעינית מקרית היא אינטרס ראשוני משותף שגובר על כל יריבות. נכנעת לפחדים משניים מפני מבוכה או פגיעה במוניטין הצבאי, והבאת להשמדה טוטאלית.',
        alignmentVerdict:
          'אבחון שגוי של אינטרסים זהים (מניעת השמדה הדדית) כאילו היו משחק סכום אפס של מתקפת פתע עוינת.',
      };
    } else {
      return {
        grade: 'הצלחה מופתית: הבטחת האינטרס הלאומי הראשוני',
        scoreColor: 'text-emerald-400',
        summary:
          'הצלחת להציב מעל לכל את האינטרס הלאומי הראשוני של רובינסון: הישרדות פיזית של האומה ושמירה על הריבונות. עמדת בפרץ מול לחצי הגנרלים והבהלה המשרדית, הבנת שלנשיא קלינטון אין שום סיבה רציונלית לפתוח במתקפה גרעינית בלתי-מוצדקת, ומנעת אסון עולמי.',
        alignmentVerdict:
          'זיהוי מדויק של העובדה שרוסיה וארה"ב חולקות אינטרס עליון זהה במניעת מלחמה תרמו-גרעינית כתוצאה מתאונה.',
      };
    }
  };

  // הערכה לפי תיאוריית C3I של סטיבן צימבלה
  const computeCimbalaEvaluation = () => {
    if (isHolocaust) {
      return {
        grade: 'כישלון: נפילה מוחלטת למלכודת ה"תמיד"',
        scoreColor: 'text-red-500',
        summary:
          'סטיבן צימבלה מזהיר מפני פרדוקס ה"תמיד / לעולם לא": נשק גרעיני חייב תמיד לפעול במקרה של מתקפה מורשית, אך לעולם לא לפעול עקב טעות. עקב לחץ הזמן הכבד (פחות מ-8 דקות) ופחד ה-"Use-it-or-lose-it" מפיצוץ EMP, נתת לפרוטוקול האוטומטי הצבאי להוביל את המדינה, ושברת את הטאבו הגרעיני.',
        controlVerdict:
          'כישלון בשליטה בהסלמה; מתן אפשרות לאוטומציה בירוקרטית-צבאית לעקוף שיקול דעת מדיני.',
      };
    } else {
      return {
        grade: 'הצלחה: ריסון מושלם של ההסלמה וסיום המשבר',
        scoreColor: 'text-emerald-400',
        summary:
          'הפגנת שליטה מרשימה בפרדוקס ה-C3I של צימבלה. למרות עמימות בחיישנים, חיכוך בירוקרטי חמור (המסמך שנקבר במשרד החוץ) וזמן תגובה קצר ביותר, אכפת את התנאי הבלתי מתפשר של "לעולם לא", עצרת את ספירלת התגובה האוטומטית, ושמרת על הפיקוח המדיני.',
        controlVerdict:
          'הפעלת סמכות אזרחית-פוליטית עליונה על אוטומציית השיגור של הפיקוד הצבאי.',
      };
    }
  };

  const robinsonEval = computeRobinsonEvaluation();
  const cimbalaEval = computeCimbalaEvaluation();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl print:border-none print:shadow-none print:max-h-none print:w-full">
        
        {/* כותרת החלונית */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between flex-wrap gap-3 ${
          isHolocaust
            ? 'bg-red-950/80 border-red-800/80 text-red-200'
            : 'bg-emerald-950/70 border-emerald-800/80 text-emerald-100'
        }`}>
          <div className="flex items-center gap-3">
            {isHolocaust ? (
              <AlertOctagon className="w-9 h-9 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-9 h-9 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-terminal uppercase tracking-widest text-stone-400">
                סיכום תרגיל כיתתי ביחב"ל · כרטיס ניתוח תיאורטי
              </div>
              <h1 className="font-tactical font-bold text-2xl sm:text-3xl tracking-tight text-white">
                {isHolocaust
                  ? 'תוצאה קטסטרופלית: שואה גרעינית מקרית בעולם'
                  : 'תוצאה היסטורית: ריסון גרעיני, המשבר נפתר בשלום'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => {
                soundFX.playTerminalClick();
                handlePrint();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-terminal transition-colors cursor-pointer border border-stone-700"
              title="הדפסת דף ניתוח כיתתי לחלוקה"
            >
              <Printer className="w-3.5 h-3.5 text-stone-300" />
              <span>הדפסת דף סיכום</span>
            </button>
            <button
              onClick={() => {
                soundFX.playTerminalClick();
                onRestart();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-terminal font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>שחק שוב</span>
            </button>
          </div>
        </div>

        {/* גוף הניתוח עם גלילה */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-stone-200 font-sans print:overflow-visible">
          
          {/* לוח נתונים סופי */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-950 border border-stone-800 rounded p-4 text-center font-terminal">
            <div>
              <div className="text-[11px] text-stone-400">מדד הישרדות לאומית</div>
              <div className={`text-2xl font-bold mt-1 ${robinsonEval.scoreColor}`}>
                {finalStats.nationalSurvival}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-stone-400">רמת הסלמה סופית</div>
              <div className="text-xl font-bold mt-1 text-stone-200">
                {finalStats.escalationLevel}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-stone-400">שלמות ערוצי C3I</div>
              <div className="text-2xl font-bold mt-1 text-cyan-400">
                {finalStats.c3iIntegrity}%
              </div>
            </div>
          </div>

          {/* פרק 1: ניתוח לפי תומאס רובינסון (אינטרסים לאומיים) */}
          <div className="bg-stone-950 border border-stone-800 rounded p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h2 className="font-tactical font-bold text-lg text-stone-100">
                  1. תומאס רובינסון: הערכת מטריצת האינטרסים הלאומיים
                </h2>
              </div>
              <span className={`text-xs font-terminal font-bold ${robinsonEval.scoreColor}`}>
                {robinsonEval.grade}
              </span>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              {robinsonEval.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-stone-900/60 p-3 rounded border border-stone-800/80">
              <div>
                <strong className="text-amber-400 block mb-1">אינטרס ראשוני מול אינטרסים משניים:</strong>
                <p className="text-stone-300 leading-relaxed">
                  רובינסון מגדיר <em>אינטרס ראשוני</em> כהגנה על הקיום הפיזי, הריבונות והזהות של המדינה. <em>אינטרסים משניים</em> כוללים כבוד, יוקרה צבאית והימנעות מביקורת פנימית. במשבר זה, הפחדים המשניים דחפו לפעולה נמהרת שהעמידה בסכנה את עצם קיומה של האומה.
                </p>
              </div>
              <div>
                <strong className="text-cyan-400 block mb-1">הערכת יישור אינטרסים (Alignment):</strong>
                <p className="text-stone-300 leading-relaxed">
                  {robinsonEval.alignmentVerdict}
                </p>
              </div>
            </div>
          </div>

          {/* פרק 2: ניתוח לפי סטיבן צימבלה (C3I ושליטה בהסלמה) */}
          <div className="bg-stone-950 border border-stone-800 rounded p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                <h2 className="font-tactical font-bold text-lg text-stone-100">
                  2. סטיבן צימבלה: פגיעות C3I ושליטה בהסלמה
                </h2>
              </div>
              <span className={`text-xs font-terminal font-bold ${cimbalaEval.scoreColor}`}>
                {cimbalaEval.grade}
              </span>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              {cimbalaEval.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-stone-900/60 p-3 rounded border border-stone-800/80">
              <div>
                <strong className="text-red-400 block mb-1">פרדוקס ה"תמיד / לעולם לא":</strong>
                <p className="text-stone-300 leading-relaxed">
                  צימבלה מסביר כי הפגיעות של מערכי פיקוד לפעימת EMP יוצרת לחץ אדיר לשיגור עם התרעה (Launch on Warning). מנהיגים נדחפים לפעול בטרם אומתו הנתונים מחשש שיושמדו ללא יכולת תגובה.
                </p>
              </div>
              <div>
                <strong className="text-emerald-400 block mb-1">שליטה בהסלמה וסיום לחימה:</strong>
                <p className="text-stone-300 leading-relaxed">
                  {cimbalaEval.controlVerdict}
                </p>
              </div>
            </div>
          </div>

          {/* פרק 3: יומן החלטות כרונולוגי של השחקן */}
          <div className="bg-stone-950 border border-stone-800 rounded p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h2 className="font-tactical font-bold text-base text-stone-100">
                3. יומן החלטות נשיאותיות וניתוח תיאורטי צעד-אחר-צעד
              </h2>
              <span className="text-xs text-stone-400 font-terminal">
                {decisionHistory.length} צעדים מבצעיים נרשמו
              </span>
            </div>

            <div className="space-y-2">
              {decisionHistory.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-stone-900/80 border border-stone-800 rounded p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-terminal font-bold text-amber-400">
                        שלב {idx + 1} ({rec.timestamp.split(' ')[0]})
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="font-semibold text-stone-200">
                        אפשרות {rec.choiceId}: {rec.choiceLabel}
                      </span>
                    </div>
                    <div className="text-stone-400 text-[11px] leading-relaxed">
                      <strong>אבחנה תיאורטית:</strong> {rec.robinsonAnalysis}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-terminal text-[11px] shrink-0">
                    <span
                      className={
                        rec.survivalChange >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'
                      }
                    >
                      {rec.survivalChange >= 0 ? `+${rec.survivalChange}%` : `${rec.survivalChange}%`} הישרדות
                    </span>
                    <span className="text-stone-500">/</span>
                    <span className="text-stone-300">{rec.newEscalation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* פרק 4: 3 שאלות לדיון כיתתי */}
          <div className="bg-stone-950 border border-amber-900/60 rounded p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-900/40 pb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="font-tactical font-bold text-lg text-amber-200">
                4. שאלות מפתח לדיון וסמינר בכיתה
              </h2>
            </div>

            <div className="space-y-4">
              {DISCUSSION_QUESTIONS.map((q) => (
                <div key={q.number} className="bg-stone-900/80 border border-stone-800 rounded p-3.5 space-y-2">
                  <div className="text-xs font-tactical font-bold text-amber-400 tracking-wide">
                    שאלה {q.number}: {q.title}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans font-medium">
                    "{q.question}"
                  </p>
                  <div className="text-[11px] text-stone-400 font-terminal border-t border-stone-800/60 pt-1.5">
                    <strong>עיגון ספרותי:</strong> {q.academicContext}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* קישור לתיק המסמכים */}
          <div className="flex items-center justify-between p-4 bg-stone-950 border border-stone-800 rounded flex-wrap gap-3">
            <div className="text-xs text-stone-300">
              מעוניינים לראות את האיגרת הרשמית שאבדה במשרד החוץ ואת יומני המכ"ם שסווגו בזמן אמת?
            </div>
            <button
              onClick={() => {
                soundFX.playTerminalClick();
                onOpenHistoricalDossier();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-terminal font-semibold transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>עיון באיגרת מנורווגיה וביומני המכ"ם</span>
            </button>
          </div>

        </div>

        {/* תחתית החלונית */}
        <div className="bg-stone-950 border-t border-stone-800 px-5 py-3.5 flex items-center justify-between flex-wrap gap-2 print:hidden">
          <span className="text-xs text-stone-400 font-terminal">
            משבר הטיל הנורווגי 1995 · סימולציה פדגוגית ביחסים בינלאומיים
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFX.playTerminalClick();
                onRestart();
              }}
              className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-black text-xs font-tactical font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              הפעל מחדש ובחן אסטרטגיה שונה
            </button>
            <button
              onClick={() => {
                soundFX.playTerminalClick();
                onClose();
              }}
              className="px-4 py-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-terminal transition-colors cursor-pointer"
            >
              חזרה לחדר המצב
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
