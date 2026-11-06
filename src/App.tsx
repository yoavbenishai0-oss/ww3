import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { RadarDisplay } from './components/RadarDisplay';
import { ChegetTerminal } from './components/ChegetTerminal';
import { BriefingPanel } from './components/BriefingPanel';
import { DebriefModal } from './components/DebriefModal';
import { HistoricalDossierModal } from './components/HistoricalDossierModal';
import { InstructorGuideModal } from './components/InstructorGuideModal';
import { DECISION_NODES } from './data/crisisData';
import { ChoiceOption, SimulationStats, PlayerDecisionRecord, OutcomeType } from './types/simulation';
import { soundFX } from './utils/audio';
import { Terminal, Award } from 'lucide-react';

export default function App() {
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(480); // 8 דקות
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [chegetUnlocked, setChegetUnlocked] = useState<boolean>(false);
  const [hasLaunched, setHasLaunched] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [stats, setStats] = useState<SimulationStats>({
    nationalSurvival: 100,
    escalationLevel: 'זהירות',
    c3iIntegrity: 85,
  });

  const [decisionHistory, setDecisionHistory] = useState<PlayerDecisionRecord[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '09:24:00 שעון מוסקבה: מכ"ם SPRN גזרה 11-צפון רכש מטרה בגובה רב.',
    '09:24:15 שעון מוסקבה: רשת קזבק C3I חוברה לשולחן הנשיאותי בקרמלין.',
    '09:24:30 שעון מוסקבה: הנשיא ילצין מתודרך על ידי המטה הכללי.',
  ]);

  // מצבי חלוניות
  const [isDebriefOpen, setIsDebriefOpen] = useState<boolean>(false);
  const [isHistoricalDossierOpen, setIsHistoricalDossierOpen] = useState<boolean>(false);
  const [isInstructorGuideOpen, setIsInstructorGuideOpen] = useState<boolean>(false);
  const [instructorModeActive, setInstructorModeActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<OutcomeType>('historical_peace');

  // שעון ספירה לאחור ראשי
  useEffect(() => {
    if (!isTimerRunning || isDebriefOpen || hasLaunched) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (currentNodeIndex === 2) {
            handleTimeExpiration();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isDebriefOpen, hasLaunched, currentNodeIndex]);

  // טיפול בתום הזמן במהלך דילמת השיא
  const handleTimeExpiration = () => {
    soundFX.playWarningAlert();
    setTerminalLogs((prev) => [
      'הזמן אזל: חלון היירוט והתגובה נסגר. גורל המפקדות הוכרע.',
      ...prev,
    ]);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleAdjustTimer = (deltaSeconds: number) => {
    setSecondsRemaining((prev) => Math.max(10, prev + deltaSeconds));
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.setMuted(nextMuted);
  };

  const handleToggleCheget = () => {
    setChegetUnlocked((prev) => !prev);
    setTerminalLogs((prev) => [
      `מפתח הצפנה נשיאותי ${!chegetUnlocked ? 'סובב — מזוודת הצ\'גט נפתחה' : 'הוחזר למצב נעול — הצ\'גט מאובטח'}.`,
      ...prev,
    ]);
  };

  const handleSelectChoice = useCallback((choice: ChoiceOption) => {
    setIsProcessing(true);
    const currentNode = DECISION_NODES[currentNodeIndex];

    // חישוב מדדים מעודכנים
    const nextSurvival = Math.max(0, Math.min(100, stats.nationalSurvival + choice.statDeltas.survival));
    const nextC3I = Math.max(0, Math.min(100, stats.c3iIntegrity + choice.statDeltas.c3i));
    const nextEscalation = choice.statDeltas.escalation;

    setStats({
      nationalSurvival: nextSurvival,
      escalationLevel: nextEscalation,
      c3iIntegrity: nextC3I,
    });

    // תיעוד החלטת השחקן
    const record: PlayerDecisionRecord = {
      nodeId: currentNode.id,
      nodeTitle: currentNode.title,
      timestamp: currentNode.timestamp,
      choiceId: choice.id,
      choiceLabel: choice.label,
      robinsonAnalysis: choice.theoreticalRationale.robinson,
      cimbalaAnalysis: choice.theoreticalRationale.cimbala,
      survivalChange: choice.statDeltas.survival,
      c3iChange: choice.statDeltas.c3i,
      newEscalation: nextEscalation,
    };

    setDecisionHistory((prev) => [...prev, record]);

    // הפחתת קנס זמן
    setSecondsRemaining((prev) => Math.max(15, prev - choice.timePenaltySeconds));

    // עדכון יומן הטלפרינטר
    setTerminalLogs((prev) => [
      `צו נשיאותי: אפשרות ${choice.id} בוצעה.`,
      choice.terminalLog,
      ...prev,
    ]);

    // מקרה מיוחד: צומת 1 בחירה A פותחת אוטומטית את הצ'גט
    if (currentNodeIndex === 0 && choice.id === 'A') {
      setChegetUnlocked(true);
    }

    // מקרה מיוחד: צומת 3 בחירה A (לחיצה על הכפתור הגרעיני)
    if (currentNodeIndex === 2 && choice.id === 'A') {
      setHasLaunched(true);
      setOutcome('nuclear_holocaust');
      soundFX.playNuclearLaunchRumble();
      setTimeout(() => {
        setIsDebriefOpen(true);
        setIsProcessing(false);
      }, 2500);
      return;
    }

    // מעבר לצומת הבא או סיום
    if (currentNodeIndex < DECISION_NODES.length - 1) {
      setTimeout(() => {
        setCurrentNodeIndex((prev) => prev + 1);
        setIsProcessing(false);
      }, 500);
    } else {
      // הושלם צומת 4 בהצלחה
      soundFX.playStandDownChime();
      setOutcome('historical_peace');
      setTimeout(() => {
        setIsDebriefOpen(true);
        setIsProcessing(false);
      }, 1000);
    }
  }, [currentNodeIndex, stats]);

  // ניסיון לחיצה ישירה על כפתור השיגור בצ'גט
  const handleDirectLaunchAttempt = () => {
    if (!chegetUnlocked || hasLaunched) return;
    if (currentNodeIndex === 2) {
      const node3ChoiceA = DECISION_NODES[2].choices[0];
      handleSelectChoice(node3ChoiceA);
    } else {
      soundFX.playWarningAlert();
      setTerminalLogs((prev) => [
        'אזהרת אבטחה: מנגנון הנעילה דורש קודי אימות מרובי שלבים טרם שחרור כפתור השיגור.',
        ...prev,
      ]);
    }
  };

  const handleResetSimulation = () => {
    setCurrentNodeIndex(0);
    setSecondsRemaining(480);
    setIsTimerRunning(true);
    setChegetUnlocked(false);
    setHasLaunched(false);
    setIsProcessing(false);
    setStats({
      nationalSurvival: 100,
      escalationLevel: 'זהירות',
      c3iIntegrity: 85,
    });
    setDecisionHistory([]);
    setTerminalLogs([
      '09:24:00 שעון מוסקבה: הסימולציה הופעלה מחדש. מכ"ם SPRN גזרה 11-צפון פעיל.',
      '09:24:15 שעון מוסקבה: רשת קזבק הופעלה. הנשיא בוריס ילצין יושב מול המזוודה.',
    ]);
    setIsDebriefOpen(false);
  };

  const currentNode = DECISION_NODES[currentNodeIndex];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* סרגל עליון */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={handleResetSimulation}
        onOpenInstructorGuide={() => setIsInstructorGuideOpen(true)}
        onOpenDocuments={() => setIsHistoricalDossierOpen(true)}
        instructorModeActive={instructorModeActive}
        onToggleInstructorMode={() => setInstructorModeActive((prev) => !prev)}
      />

      {/* לוח מחוונים ושעון ספירה לאחור */}
      <StatsDashboard
        stats={stats}
        secondsRemaining={secondsRemaining}
        isTimerRunning={isTimerRunning}
        onToggleTimer={handleToggleTimer}
        onAdjustTimer={handleAdjustTimer}
        currentNodeIndex={currentNodeIndex}
        totalNodes={DECISION_NODES.length}
        instructorModeActive={instructorModeActive}
      />

      {/* אזור חדר המצב המרכזי */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
        
        {/* עמודה ימנית: תדריך נשיאותי, בחירות ויומן טלפרינטר (7 עמודות) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex-1">
            <BriefingPanel
              node={currentNode}
              onSelectChoice={handleSelectChoice}
              instructorModeActive={instructorModeActive}
              isProcessing={isProcessing}
            />
          </div>

          {/* יומן תקשורת וטלפרינטר בזמן אמת */}
          <div className="bg-stone-950 border border-stone-800 rounded p-3 text-xs font-terminal flex flex-col">
            <div className="flex items-center justify-between text-stone-400 mb-1.5 border-b border-stone-800/80 pb-1">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                מברק טלפרינטר // תעבורת רשת קזבק ו-SPRN בזמן אמת
              </span>
              <span className="text-[10px] text-stone-400">הצפנה: GOST-28147</span>
            </div>

            <div className="space-y-1 max-h-24 overflow-y-auto text-[11px] leading-relaxed text-stone-400">
              {terminalLogs.slice(0, 5).map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-amber-500/80 shrink-0">›</span>
                  <span className={index === 0 ? 'text-emerald-300 font-semibold' : 'text-stone-400'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* עמודה שמאלית: מכ"ם התרעה מוקדמת SPRN ומזוודת הצ'גט (5 עמודות) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex-1 min-h-[340px]">
            <RadarDisplay
              currentNodeIndex={currentNodeIndex}
              telemetry={currentNode.briefing.radarTelemetry}
              hasLaunched={hasLaunched}
            />
          </div>

          <div className="flex-shrink-0">
            <ChegetTerminal
              isUnlocked={chegetUnlocked}
              onToggleUnlock={handleToggleCheget}
              currentNodeIndex={currentNodeIndex}
              hasLaunched={hasLaunched}
              onDirectLaunchAttempt={handleDirectLaunchAttempt}
            />
          </div>
        </div>

      </main>

      {/* באנר לפתיחת כרטיס הניתוח לאחר קבלת החלטות */}
      {decisionHistory.length >= 3 && !isDebriefOpen && (
        <div className="bg-stone-900 border-t border-stone-800 p-3 text-center">
          <button
            onClick={() => {
              soundFX.playTerminalClick();
              setIsDebriefOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-tactical font-bold text-sm tracking-wider shadow-lg transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>פתיחת כרטיס ניתוח תיאורטי מקיף ביחסים בינלאומיים</span>
          </button>
        </div>
      )}

      {/* חלוניות מודאליות */}
      <DebriefModal
        isOpen={isDebriefOpen}
        onClose={() => setIsDebriefOpen(false)}
        outcome={outcome}
        finalStats={stats}
        decisionHistory={decisionHistory}
        onRestart={handleResetSimulation}
        onOpenHistoricalDossier={() => {
          setIsDebriefOpen(false);
          setIsHistoricalDossierOpen(true);
        }}
      />

      <HistoricalDossierModal
        isOpen={isHistoricalDossierOpen}
        onClose={() => setIsHistoricalDossierOpen(false)}
      />

      <InstructorGuideModal
        isOpen={isInstructorGuideOpen}
        onClose={() => setIsInstructorGuideOpen(false)}
      />
    </div>
  );
}
