import React from 'react';
import { X, GraduationCap, Clock, Award, Shield } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface InstructorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructorGuideModal: React.FC<InstructorGuideModalProps> = ({
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
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-tactical font-bold text-lg text-stone-100 tracking-wide">
                סילבוס ומדריך למרצה: תרגיל כיתתי ביחסים בינלאומיים
              </h2>
              <div className="text-[11px] font-terminal text-stone-400">
                ביטחון לאומי ולימודי אסטרטגיה · מערך תרגול בן 10 דקות
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playTerminalClick();
              onClose();
            }}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="סגור מדריך"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* גוף המדריך */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto text-stone-200 text-xs sm:text-sm font-sans">
          
          {/* מתווה זמנים מומלץ לשיעור */}
          <div className="bg-stone-950 border border-stone-800 rounded p-4 space-y-3">
            <div className="flex items-center gap-2 font-tactical font-bold text-amber-400 text-base border-b border-stone-800 pb-2">
              <Clock className="w-4 h-4" />
              <span>מתווה זמנים מומלץ לתרגיל בן 10 דקות בכיתה</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-stone-900 p-3 rounded border border-stone-800 space-y-1">
                <div className="font-terminal font-bold text-emerald-400">דקות 00:00 – 02:00</div>
                <div className="font-semibold text-stone-200">הצגת המקרה והגדרת התפקיד</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  הקרן את הסימולציה על מסך הכיתה. הגדר סטודנט אחד (או את מליאת הכיתה) כנשיא רוסיה בוריס ילצין בבוקר ה-25 בינואר 1995.
                </p>
              </div>

              <div className="bg-stone-900 p-3 rounded border border-stone-800 space-y-1">
                <div className="font-terminal font-bold text-amber-400">דקות 02:00 – 07:00</div>
                <div className="font-semibold text-stone-200">קבלת החלטות מול השעון</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  התקדמו בארבעת הצמתים. מומלץ להשתמש בכפתור [השהה] בשעון בצומת 2 ובצומת 3 כדי לקיים הצבעה בכיתה: "מי בעד פתיחת הצ'גט? מי בעד נצירה?"
                </p>
              </div>

              <div className="bg-stone-900 p-3 rounded border border-stone-800 space-y-1">
                <div className="font-terminal font-bold text-cyan-400">דקות 07:00 – 10:00</div>
                <div className="font-semibold text-stone-200">תחקיר תיאורטי ודיון</div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  הציגו את כרטיס המשוב התיאורטי. נתחו את מושגי רובינסון (אינטרס ראשוני מול משני) ואת פרדוקס "תמיד/לעולם לא" של צימבלה באמצעות 3 שאלות הדיון.
                </p>
              </div>
            </div>
          </div>

          {/* ליבת התיאוריה הפדגוגית */}
          <div className="bg-stone-950 border border-stone-800 rounded p-4 space-y-3">
            <div className="flex items-center gap-2 font-tactical font-bold text-cyan-300 text-base border-b border-stone-800 pb-2">
              <Shield className="w-4 h-4" />
              <span>הליבה התיאורטית: שני הוגים מרכזיים ביחב"ל</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-900 p-3 rounded border border-stone-800">
                <div className="font-semibold text-amber-300 text-sm mb-1">
                  1. תומאס רובינסון (Thomas W. Robinson) — "אינטרסים לאומיים"
                </div>
                <ul className="list-disc list-inside text-stone-300 space-y-1 text-[11px] leading-relaxed">
                  <li><strong>אינטרס ראשוני מול משני:</strong> הישרדות פיזית של האומה והגנה על שלמותה הטריטוריאלית (ראשוני) לעומת יוקרה פוליטית, גאווה לאומית והימנעות ממבוכה בירוקרטית (משני).</li>
                  <li><strong>האינטרס הגרעיני העליון:</strong> בעידן התרמו-גרעיני, מניעת מלחמה גרעינית בטעות היא אינטרס ראשוני זהה ומשותף לכל המעצמות, הגובר על כל יריבות פוליטית.</li>
                  <li><strong>יישור אינטרסים (Alignment):</strong> בחינה האם יחסי המדינות במשבר מוכתבים על ידי אינטרסים מנוגדים לחלוטין (משחק סכום אפס), זהים (הישרדות הדדית), או משלימים.</li>
                </ul>
              </div>

              <div className="bg-stone-900 p-3 rounded border border-stone-800">
                <div className="font-semibold text-cyan-300 text-sm mb-1">
                  2. סטיבן צימבלה (Stephen J. Cimbala) — "על מלחמה גרעינית: הרתעה, הסלמה ושליטה"
                </div>
                <ul className="list-disc list-inside text-stone-300 space-y-1 text-[11px] leading-relaxed">
                  <li><strong>פרדוקס ה"תמיד / לעולם לא":</strong> מערך ה-C3I חייב תמיד להבטיח שיגור כשיש פקודה חוקית, אך לעולם לא לאפשר שיגור עקב טעות. הפגיעות לפעימת EMP דוחפת לפאניקת "השתמש בו או אבד אותו".</li>
                  <li><strong>חיכוך בירוקרטי וערפל קרב:</strong> כיצד מחיצות בין-משרדיות (מודל התהליך הארגוני של גראהם אליסון) מונעות ממידע דיפלומטי קריטי להגיע למפקדות המכ"ם.</li>
                  <li><strong>שליטה בהסלמה וסיום לחימה:</strong> החשיבות של עצירת האוטומציה הצבאית על ידי התערבות אזרחית מודעת ושמירה על הטאבו הגרעיני.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* טיפים להפעלת הכיתה */}
          <div className="bg-stone-950 border border-stone-800 rounded p-4 space-y-2">
            <div className="flex items-center gap-2 font-tactical font-bold text-emerald-400 text-base border-b border-stone-800 pb-2">
              <Award className="w-4 h-4" />
              <span>דגשים פדגוגיים להפעלת הסטודנטים</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              שימו לב לתחושת הדחיפות של הסטודנטים בצומת 3 (היפרדות שלבים). לעיתים קרובות סטודנטים נוטים ללחוץ על כפתור השיגור מתוך חרדה שלא יישארו חסרי אונים. הדגישו בפניהם שבעולם האמיתי, הריסון שגילה בוריס ילצין נחשב לאחד ממעשי המנהיגות האמיצים ביותר בהיסטוריה, שבו מנהיג אזרחי סירב לפחד הצבאי והציל את העולם מכליה.
            </p>
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
            סגור מדריך
          </button>
        </div>

      </div>
    </div>
  );
};
