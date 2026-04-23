import React from 'react';
import { DimensionScore } from '../types';
import { Activity, Utensils, Smartphone, Briefcase, Home, Users, TrendingUp, Target, AlertCircle } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Activity,
  Utensils,
  Smartphone,
  Briefcase,
  Home,
  Users,
};

interface Props {
  data: DimensionScore[];
}

const getLevel = (score: number) => {
  if (score >= 4) {
    return {
      label: '明顯優勢',
      tone: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      bar: 'bg-emerald-500',
      note: '可作為後續自立與資源對接的主要支點。',
    };
  }
  if (score >= 3) {
    return {
      label: '相對穩定',
      tone: 'text-teal-700 bg-teal-50 border-teal-100',
      bar: 'bg-teal-500',
      note: '目前具備基礎能力，建議維持並逐步補強。',
    };
  }
  if (score >= 2) {
    return {
      label: '需要補強',
      tone: 'text-amber-700 bg-amber-50 border-amber-100',
      bar: 'bg-amber-500',
      note: '可能影響日常安排，適合導入訓練或外部支持。',
    };
  }
  return {
    label: '優先支持',
    tone: 'text-brand-700 bg-brand-50 border-brand-100',
    bar: 'bg-brand-500',
    note: '建議列為近期資源介入與追蹤重點。',
  };
};

const polarPoint = (score: number, fullMark: number, index: number, total: number, radius: number, center: number) => {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const scaledRadius = (score / fullMark) * radius;
  return {
    x: center + scaledRadius * Math.cos(angle),
    y: center + scaledRadius * Math.sin(angle),
  };
};

export const RadarChart: React.FC<Props> = ({ data }) => {
  const size = 360;
  const center = size / 2;
  const radius = 132;
  const levels = 5;
  const sorted = [...data].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const average = data.reduce((sum, item) => sum + item.score, 0) / Math.max(data.length, 1);
  const averageLevel = getLevel(average);
  const points = data.map((item, index) => polarPoint(item.score, item.fullMark, index, data.length, radius, center));
  const polygonPoints = points.map(point => `${point.x},${point.y}`).join(' ');
  const radarSummary = `六大能力平均 ${average.toFixed(1)} 分。最穩定能力是 ${strongest?.name || '尚無資料'}，${strongest ? strongest.score.toFixed(1) : '0'} 分。優先補強是 ${weakest?.name || '尚無資料'}，${weakest ? weakest.score.toFixed(1) : '0'} 分。`;

  return (
    <div className="space-y-5">
      <p className="sr-only">{radarSummary}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-black text-brand-700">
            <Target className="h-4 w-4" />
            整體輪廓
          </div>
          <div className="text-3xl font-black text-brand-900">{average.toFixed(1)}</div>
          <div className="text-xs font-bold text-slate-500">六大能力平均 / 5</div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-black text-emerald-700">
            <TrendingUp className="h-4 w-4" />
            最穩定能力
          </div>
          <div className="text-lg font-black text-emerald-900">{strongest?.name || '評估中'}</div>
          <div className="text-xs font-bold text-slate-500">{strongest ? `${strongest.score.toFixed(1)} 分` : '尚無資料'}</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-black text-amber-700">
            <AlertCircle className="h-4 w-4" />
            優先補強
          </div>
          <div className="text-lg font-black text-amber-900">{weakest?.name || '評估中'}</div>
          <div className="text-xs font-bold text-slate-500">{weakest ? `${weakest.score.toFixed(1)} 分` : '尚無資料'}</div>
        </div>
      </div>

      <div className="grid items-center gap-6 xl:grid-cols-[minmax(320px,0.95fr)_minmax(360px,1.05fr)]">
        <div className="rounded-[2rem] border border-slate-100 bg-gradient-to-b from-white to-brand-50/25 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div className="relative mx-auto aspect-square w-full max-w-[390px]">
            <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full overflow-visible" role="img" aria-labelledby="radar-title radar-desc">
              <title id="radar-title">六大能力雷達圖</title>
              <desc id="radar-desc">{radarSummary}</desc>
              <defs>
                <linearGradient id="radarArea" x1="88" x2="276" y1="72" y2="292" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F43F5E" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#0F766E" stopOpacity="0.18" />
                </linearGradient>
                <filter id="radarShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#A83549" floodOpacity="0.16" />
                </filter>
              </defs>

              {Array.from({ length: levels }).map((_, levelIndex) => {
                const levelRadius = (radius / levels) * (levelIndex + 1);
                const ringPoints = data
                  .map((item, index) => polarPoint(item.fullMark * ((levelIndex + 1) / levels), item.fullMark, index, data.length, radius, center))
                  .map(point => `${point.x},${point.y}`)
                  .join(' ');

                return (
                  <g key={levelIndex}>
                    <polygon points={ringPoints} fill="none" stroke={levelIndex === levels - 1 ? '#CBD5E1' : '#E8EEF5'} strokeWidth={levelIndex === levels - 1 ? 1.5 : 1} />
                    <text x={center + 7} y={center - levelRadius + 4} className="fill-slate-400 text-[11px] font-black">
                      {levelIndex + 1}
                    </text>
                  </g>
                );
              })}

              {data.map((item, index) => {
                const end = polarPoint(item.fullMark, item.fullMark, index, data.length, radius, center);
                const label = polarPoint(item.fullMark, item.fullMark, index, data.length, radius + 38, center);
                const anchor = label.x > center + 8 ? 'start' : label.x < center - 8 ? 'end' : 'middle';
                return (
                  <g key={item.name}>
                    <line x1={center} y1={center} x2={end.x} y2={end.y} stroke="#E2E8F0" strokeWidth="1.5" />
                    <text x={label.x} y={label.y - 6} textAnchor={anchor} className="fill-slate-800 text-[14px] font-black">
                      {item.name}
                    </text>
                    <text x={label.x} y={label.y + 12} textAnchor={anchor} className="fill-brand-600 text-[12px] font-black">
                      {item.score.toFixed(1)} / 5
                    </text>
                  </g>
                );
              })}

              <polygon points={polygonPoints} fill="url(#radarArea)" stroke="#C94458" strokeWidth="4" strokeLinejoin="round" filter="url(#radarShadow)" />
              {points.map((point, index) => (
                <g key={data[index].name}>
                  <circle cx={point.x} cy={point.y} r="7" fill="#C94458" stroke="white" strokeWidth="4" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          {data.map(item => {
            const Icon = iconMap[item.icon || 'Activity'] || Activity;
            const level = getLevel(item.score);
            const percentage = Math.max(0, Math.min(100, (item.score / item.fullMark) * 100));

            return (
              <div key={item.name} className="rounded-2xl border border-slate-100 bg-white/88 p-4 shadow-sm" aria-label={`${item.name}，${item.score.toFixed(1)} 分，${level.label}。${item.description}`}>
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black text-slate-900">{item.name}</span>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${level.tone}`}>{level.label}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">{item.score.toFixed(1)}</div>
                    <div className="text-[11px] font-bold text-slate-400">/ 5</div>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${level.bar}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`rounded-2xl border p-4 ${averageLevel.tone}`}>
        <div className="text-sm font-black">怎麼看這張圖</div>
        <p className="mt-1 text-sm font-semibold leading-relaxed">
          分數越接近 5，代表該能力越穩定、越能支撐自立生活；越接近 0，代表越需要外部資源、訓練或照顧支持。雷達圖越飽滿，表示六大能力越均衡；若某一角明顯內縮，通常就是下一步優先補強的方向。
        </p>
      </div>
    </div>
  );
};
