import React, { useEffect, useRef, useState } from 'react';
import { Crosshair } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface RadarDisplayProps {
  currentNodeIndex: number;
  telemetry: {
    origin: string;
    speed: string;
    apogee: string;
    estimatedImpact: string;
    radarSite: string;
  };
  hasLaunched: boolean;
}

export const RadarDisplay: React.FC<RadarDisplayProps> = ({
  currentNodeIndex,
  telemetry,
  hasLaunched,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let pingCounter = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // רקע כהה פוספורי
      ctx.fillStyle = '#06100d';
      ctx.fillRect(0, 0, width, height);

      // מרכז המכ"ם
      const centerX = width * 0.48;
      const centerY = height * 0.52;
      const maxRadius = Math.min(width, height) * 0.44;

      // מעגלי טווח
      ctx.strokeStyle = '#0e3a2b';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (maxRadius / 4) * r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#1c7552';
        ctx.font = '10px Heebo, sans-serif';
        ctx.fillText(`${r * 400} ק"מ`, centerX + 4, centerY - (maxRadius / 4) * r + 12);
      }

      // קווי שתי וערב
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.strokeStyle = '#0e3a2b';
      ctx.stroke();

      // גיאוגרפיה סכמטית: חופי נורווגיה וחצי האי קולה
      ctx.strokeStyle = '#225540';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 130, centerY + 110);
      ctx.lineTo(centerX - 110, centerY + 40); // חוף מערבי
      ctx.lineTo(centerX - 80, centerY - 20);  // אזור אנדויה
      ctx.lineTo(centerX - 20, centerY - 50);  // נורדקאפ
      ctx.lineTo(centerX + 60, centerY - 20);  // מורמנסק / חצי האי קולה
      ctx.lineTo(centerX + 110, centerY + 50); // מפרץ הים הלבן
      ctx.stroke();

      // כיתובי מפה בעברית
      ctx.fillStyle = '#2db87d';
      ctx.font = '10px Heebo, sans-serif';
      ctx.fillText('ים נורווגיה', centerX - 160, centerY - 60);
      ctx.fillText('ים ברנץ', centerX + 15, centerY - 90);
      ctx.fillText('חצי האי קולה', centerX + 30, centerY + 25);
      ctx.fillText('סוואלברד / שפיצברגן', centerX - 70, centerY - 145);

      // סימון אתר המכ"ם: אולנגורסק
      const olenX = centerX + 45;
      const olenY = centerY - 5;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(olenX, olenY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#34d399';
      ctx.fillText('אולנגורסק [SPRN]', olenX + 8, olenY + 3);

      // סימון אתר השיגור: אנדויה
      const andoyaX = centerX - 80;
      const andoyaY = centerY - 20;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(andoyaX, andoyaY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('אתר אנדויה', andoyaX - 65, andoyaY + 4);

      // אזור התרסקות: שפיצברגן
      const spitsX = centerX - 40;
      const spitsY = centerY - 135;
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(spitsX, spitsY, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#f87171';
      ctx.fillText('אזור פגיעה', spitsX + 10, spitsY + 3);

      // עקומת המסלול הבליסטי
      ctx.beginPath();
      ctx.moveTo(andoyaX, andoyaY);
      const controlX = centerX - 30;
      const controlY = centerY - 110;
      ctx.quadraticCurveTo(controlX, controlY, spitsX, spitsY);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // חישוב מיקום הטיל לאורך המסלול לפי שלב
      const progressByNode = [0.25, 0.55, 0.8, 1.0];
      const prog = progressByNode[Math.min(currentNodeIndex, 3)];
      const t = prog;
      const targetX = Math.pow(1 - t, 2) * andoyaX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * spitsX;
      const targetY = Math.pow(1 - t, 2) * andoyaY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * spitsY;

      // קרן מכ"ם מסתובבת
      angle += 0.025;
      const sweepEndX = centerX + Math.cos(angle) * maxRadius;
      const sweepEndY = centerY + Math.sin(angle) * maxRadius;

      const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, angle - 0.35, angle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // קו הסריקה
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(sweepEndX, sweepEndY);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // נקודת המטרה
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 5, 0, Math.PI * 2);
      ctx.fill();

      // הילה סביב המטרה
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 8 + Math.sin(angle * 4) * 3, 0, Math.PI * 2);
      ctx.stroke();

      // תווית מטרה
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(targetX + 10, targetY - 26, 115, 24);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.strokeRect(targetX + 10, targetY - 26, 115, 24);

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 9px Heebo, sans-serif';
      ctx.fillText(currentNodeIndex >= 2 ? 'מטרה 01 [היפרדות]' : 'מטרה 01 [טיל חשוד]', targetX + 14, targetY - 14);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px Heebo, sans-serif';
      ctx.fillText(`גובה: ${telemetry.apogee.split(' ')[0]}`, targetX + 14, targetY - 5);

      // אם שוגר נשק גרעיני
      if (hasLaunched) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fee2e2';
        ctx.font = 'bold 16px Rubik, sans-serif';
        ctx.fillText('שואה גרעינית עולמית — מתקפת תגמול שוגרה', width * 0.12, height * 0.5);
      }

      // צפצוף מכ"ם תקופתי
      pingCounter++;
      if (pingCounter % 160 === 0) {
        soundFX.playRadarPing();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentNodeIndex, telemetry, hasLaunched]);

  return (
    <div className="bg-stone-950 border border-stone-800 rounded flex flex-col h-full overflow-hidden">
      {/* כותרת תחנת המכ"ם */}
      <div className="bg-stone-900 border-b border-stone-800 px-3 py-2 flex items-center justify-between text-xs font-terminal">
        <div className="flex items-center gap-2 text-emerald-400">
          <Crosshair className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-bold tracking-wide">מכ"ם התרעה דנסטר-M // גזרה 11-צפון</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-400">סטטוס:</span>
          <span className="text-emerald-400 text-glow-green font-semibold">נעילת מעקב</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      {/* מסך מכ"ם ראשי עם שכבת CRT */}
      <div className="relative flex-1 min-h-[280px] sm:min-h-[320px] bg-black crt-screen">
        <canvas
          ref={canvasRef}
          width={520}
          height={340}
          className="w-full h-full object-cover block"
        />

        {/* חלונית נתוני מטרה מוצמדת */}
        <div className="absolute top-2 right-2 z-10 bg-stone-900/90 border border-emerald-500/30 rounded p-2 text-[10px] font-terminal text-stone-300 pointer-events-none max-w-[210px] backdrop-blur-sm">
          <div className="text-emerald-400 font-semibold mb-1 border-b border-stone-800 pb-0.5">
            חתימה אקוסטית / טלמטריה
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            <span className="text-stone-400">תחנה:</span>
            <span className="text-stone-200">אולנגורסק</span>
            <span className="text-stone-400">עצם:</span>
            <span className="text-red-400 font-bold">Black Brant XII</span>
            <span className="text-stone-400">מהירות:</span>
            <span className="text-stone-200">{telemetry.speed.split(' ')[0]}</span>
            <span className="text-stone-400">גובה שיא:</span>
            <span className="text-amber-400 font-bold">{telemetry.apogee.split(' ')[0]}</span>
          </div>
        </div>

        {/* מקרא */}
        <div className="absolute bottom-2 left-2 z-10 bg-stone-900/90 border border-stone-800 rounded px-2 py-1 text-[9px] font-terminal text-stone-400 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> התרעה רוסית
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> מטרה בלתי מזוהה
          </span>
        </div>
      </div>

      {/* פס טלמטריה תחתון */}
      <div className="bg-stone-900/90 border-t border-stone-800 p-2.5 text-xs font-terminal grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-300">
        <div>
          <span className="text-[10px] text-stone-400 block">נקודת שיגור</span>
          <span className="text-amber-300 text-[11px] truncate block" title={telemetry.origin}>
            {telemetry.origin.split('(')[0]}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 block">פרופיל מהירות</span>
          <span className="text-stone-200 text-[11px]">{telemetry.speed}</span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 block">שיא גובה חזוי</span>
          <span className="text-emerald-400 text-[11px]">{telemetry.apogee}</span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 block">הערכת פגיעה</span>
          <span className="text-red-400 text-[11px] truncate block">{telemetry.estimatedImpact}</span>
        </div>
      </div>
    </div>
  );
};
