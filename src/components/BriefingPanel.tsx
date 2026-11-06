import React from 'react';
import { DecisionNode, ChoiceOption } from '../types/simulation';
import { Shield, ArrowLeft, UserCheck } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface BriefingPanelProps {
  node: DecisionNode;
  onSelectChoice: (choice: ChoiceOption) => void;
  instructorModeActive: boolean;
  isProcessing: boolean;
}

export const BriefingPanel: React.FC<BriefingPanelProps> = ({
  node,
  onSelectChoice,
  instructorModeActive,
  isProcessing,
}) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded flex flex-col h-full overflow-hidden text-stone-200">
      {/* כותרת הצומת */}
      <div className="bg-stone-950 border-b border-stone-800 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800/80 text-red-400 font-terminal text-xs font-bold">
            {node.timestamp}
          </span>
          <h2 className="font-tactical font-bold text-base text-stone-100 tracking-wide">
            {node.title}
          </h2>
        </div>
        <span className="text-[11px] font-terminal text-stone-400">
          חדר המצב בקרמלין · מוסקבה
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
        {/* תדריך מודיעיני מבצעי */}
        <div className="bg-stone-950/70 border border-stone-800 rounded p-4 relative">
          <div className="flex items-center gap-2 text-xs font-terminal text-stone-400 mb-2 border-b border-stone-800/80 pb-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-400 font-semibold">{node.briefing.speaker}</span>
            <span>·</span>
            <span className="text-stone-400">{node.briefing.speakerRole}</span>
          </div>

          <div className="text-sm text-stone-200 leading-relaxed font-sans space-y-2.5 whitespace-pre-line">
            {node.briefing.message}
          </div>
        </div>

        {/* תיבת הסבר תיאורטי למרצה בכיתה */}
        {instructorModeActive && (
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/50 rounded text-xs text-cyan-200">
            <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>הדילמה התיאורטית ביחב"ל עבור צומת זה:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] leading-relaxed">
              <div>
                <strong className="text-cyan-300">רובינסון:</strong> שימו לב לסטודנטים המבלבלים בין יוקרה צבאית או פחד ממבוכה (אינטרס משני) לבין הישרדות קיומית (אינטרס ראשוני).
              </div>
              <div>
                <strong className="text-cyan-300">צימבלה:</strong> אתגרו את הכיתה לגבי פרדוקס "תמיד/לעולם לא". המתנה לאימות עלולה לסכן את הפיקוד; ירי עכשיו ישמיד את האנושות.
              </div>
            </div>
          </div>
        )}

        {/* אפשרויות ההכרעה הנשיאותית */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-terminal uppercase tracking-wider text-stone-400 flex items-center justify-between">
            <span>נדרשת הכרעה נשיאותית מיידית:</span>
            <span className="text-amber-400 font-bold">בחר קו פעולה אחד מבין שלוש האפשרויות</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {node.choices.map((choice) => (
              <button
                key={choice.id}
                disabled={isProcessing}
                onClick={() => {
                  soundFX.playTerminalClick();
                  onSelectChoice(choice);
                }}
                className="group text-right bg-stone-950 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/60 rounded p-3.5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-stone-800 group-hover:bg-amber-500 group-hover:text-black text-amber-400 font-terminal font-bold text-xs flex items-center justify-center transition-colors">
                        {choice.id}
                      </span>
                      <span className="font-tactical font-bold text-sm sm:text-base text-stone-100 group-hover:text-amber-300 transition-colors">
                        {choice.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-terminal shrink-0">
                      <span className="text-stone-400">עלות זמן:</span>
                      <span className="text-red-400 font-semibold">-{choice.timePenaltySeconds} שניות</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 pr-8 leading-relaxed mb-2.5">
                    {choice.description}
                  </p>
                </div>

                {/* תגי ניתוח תיאורטי מקדים */}
                <div className="pr-8 pt-2 border-t border-stone-800/60 flex flex-wrap items-center gap-2 text-[10px] font-terminal text-stone-400">
                  <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-emerald-400">
                    רובינסון: {choice.theoreticalRationale.robinson.split(':')[0]}
                  </span>
                  <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-cyan-400">
                    צימבלה: {choice.theoreticalRationale.cimbala.split(':')[0]}
                  </span>
                  <span className="mr-auto text-stone-400 group-hover:text-amber-400 flex items-center gap-1">
                    בצע פקודה <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
