export type EscalationLevel = 
  | 'רגיעה יחסית' 
  | 'זהירות' 
  | 'כוננות גבוהה' 
  | 'כוננות עליונה (DEFCON 1)' 
  | 'הטאבו הגרעיני נשבר';

export interface SimulationStats {
  nationalSurvival: number; // 0 - 100%
  escalationLevel: EscalationLevel;
  c3iIntegrity: number;     // 0 - 100%
}

export interface ChoiceOption {
  id: 'A' | 'B' | 'C';
  label: string;
  description: string;
  historicalNote: string;
  theoreticalRationale: {
    robinson: string;
    cimbala: string;
  };
  statDeltas: {
    survival: number;
    c3i: number;
    escalation: EscalationLevel;
  };
  timePenaltySeconds: number;
  terminalLog: string;
}

export interface DecisionNode {
  id: string;
  timestamp: string; // e.g. "T-08:00 (09:24 שעון מוסקבה)"
  targetTimeRemaining: number; // seconds
  title: string;
  briefing: {
    intelHeader: string;
    speaker: string;
    speakerRole: string;
    message: string;
    radarTelemetry: {
      origin: string;
      speed: string;
      apogee: string;
      estimatedImpact: string;
      radarSite: string;
    };
  };
  choices: ChoiceOption[];
}

export interface PlayerDecisionRecord {
  nodeId: string;
  nodeTitle: string;
  timestamp: string;
  choiceId: 'A' | 'B' | 'C';
  choiceLabel: string;
  robinsonAnalysis: string;
  cimbalaAnalysis: string;
  survivalChange: number;
  c3iChange: number;
  newEscalation: EscalationLevel;
}

export type OutcomeType = 
  | 'historical_peace'      // עמידה בפרץ והימנעות מקטסטרופה (היסטוריה)
  | 'nuclear_holocaust'     // אישור שיגור - מלחמת עולם שלישית (כישלון קולוסאלי)
  | 'cautious_restraint'    // כוננות קונבנציונלית / אימות מודיעיני
  | 'time_expired_freeze';  // שיתוק מול השעון
