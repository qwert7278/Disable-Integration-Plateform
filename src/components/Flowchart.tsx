import React from 'react';
import { motion } from 'motion/react';

type StageVariant = 'medical' | 'home' | 'life' | 'career';

const stages: Array<{
  id: string;
  name: string;
  variant: StageVariant;
  shell: string;
  accent: string;
}> = [
  { id: 'medical', name: '醫療期', variant: 'medical', shell: 'from-sky-50 to-blue-100', accent: 'text-sky-600' },
  { id: 'home', name: '家庭支持', variant: 'home', shell: 'from-brand-50 to-rose-100', accent: 'text-brand-600' },
  { id: 'optimization', name: '生活優化', variant: 'life', shell: 'from-emerald-50 to-teal-100', accent: 'text-teal-700' },
  { id: 'career', name: '職業重建', variant: 'career', shell: 'from-amber-50 to-orange-100', accent: 'text-amber-700' },
];

const StageArtwork = ({ variant }: { variant: StageVariant }) => {
  if (variant === 'medical') {
    return (
      <svg viewBox="0 0 96 96" className="relative h-20 w-20" aria-hidden="true">
        <defs>
          <linearGradient id="medicalFill" x1="18" x2="78" y1="16" y2="78" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BAE6FD" />
            <stop offset="1" stopColor="#FDF2F8" />
          </linearGradient>
        </defs>
        <path d="M48 17c16 0 29 12 29 28 0 20-23 34-29 37-6-3-29-17-29-37 0-16 13-28 29-28Z" fill="url(#medicalFill)" />
        <path d="M31 49h11l5-14 8 25 5-11h8" fill="none" stroke="#0369A1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <path d="M48 30v13M41.5 36.5h13" stroke="#BE123C" strokeLinecap="round" strokeWidth="4" />
        <circle cx="70" cy="27" r="6" fill="#FFF7ED" stroke="#38BDF8" strokeWidth="2" />
      </svg>
    );
  }

  if (variant === 'home') {
    return (
      <svg viewBox="0 0 96 96" className="relative h-20 w-20" aria-hidden="true">
        <defs>
          <linearGradient id="homeFill" x1="20" x2="78" y1="19" y2="82" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE4E6" />
            <stop offset="1" stopColor="#FFF7ED" />
          </linearGradient>
        </defs>
        <path d="M24 45 48 25l24 20v31a5 5 0 0 1-5 5H29a5 5 0 0 1-5-5V45Z" fill="url(#homeFill)" />
        <path d="M20 47 48 23l28 24" fill="none" stroke="#A83549" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <path d="M39 81V60a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v21" fill="none" stroke="#A83549" strokeLinecap="round" strokeWidth="4" />
        <path d="M31 59c4-8 11-6 17 0 6-6 13-8 17 0" fill="none" stroke="#FB7185" strokeLinecap="round" strokeWidth="4" />
        <circle cx="27" cy="24" r="6" fill="#FEF3C7" />
      </svg>
    );
  }

  if (variant === 'life') {
    return (
      <svg viewBox="0 0 96 96" className="relative h-20 w-20" aria-hidden="true">
        <defs>
          <linearGradient id="lifeFill" x1="18" x2="76" y1="20" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CCFBF1" />
            <stop offset="1" stopColor="#F0FDFA" />
          </linearGradient>
        </defs>
        <path d="M24 75c7-22 22-36 48-48-1 27-15 45-40 52" fill="url(#lifeFill)" />
        <path d="M25 75c17-15 30-26 47-48" fill="none" stroke="#0F766E" strokeLinecap="round" strokeWidth="4" />
        <path d="M43 56c-6-8-14-10-22-6 4 8 11 12 22 6ZM55 43c1-10 7-16 17-18 1 10-5 17-17 18Z" fill="#99F6E4" stroke="#0F766E" strokeLinejoin="round" strokeWidth="3" />
        <circle cx="35" cy="27" r="8" fill="#FFF7ED" stroke="#14B8A6" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" className="relative h-20 w-20" aria-hidden="true">
      <defs>
        <linearGradient id="careerFill" x1="19" x2="77" y1="21" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF3C7" />
          <stop offset="1" stopColor="#FFE4E6" />
        </linearGradient>
      </defs>
      <rect x="21" y="34" width="54" height="39" rx="12" fill="url(#careerFill)" />
      <path d="M38 34v-7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v7" fill="none" stroke="#B45309" strokeLinecap="round" strokeWidth="4" />
      <path d="M23 49c12 6 37 6 50 0M48 47v8" stroke="#B45309" strokeLinecap="round" strokeWidth="4" />
      <path d="M28 73c10-10 22-14 37-12" fill="none" stroke="#A83549" strokeLinecap="round" strokeWidth="3" />
      <circle cx="68" cy="25" r="6" fill="#ECFEFF" stroke="#F59E0B" strokeWidth="2" />
    </svg>
  );
};

export const Flowchart = () => {
  return (
    <div className="py-8 sm:overflow-x-auto sm:py-12">
      <div className="flex flex-col items-center gap-2 px-2 sm:min-w-[820px] sm:flex-row sm:justify-between sm:px-4">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.08, duration: 0.58, ease: [0.32, 0.72, 0, 1] }}
              className="group flex w-full max-w-[11rem] flex-col items-center sm:w-36"
            >
              <div className={`relative mb-3 grid h-24 w-24 place-items-center rounded-[1.75rem] bg-gradient-to-br ${stage.shell} shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_20px_42px_-30px_rgba(126,58,72,0.52)] ring-1 ring-white/80 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1 group-hover:scale-[1.03] sm:mb-4 sm:h-28 sm:w-28 sm:rounded-[2rem]`}>
                <div className="absolute inset-2 rounded-[1.45rem] bg-white/42" />
                <StageArtwork variant={stage.variant} />
              </div>
              <span className={`text-base font-bold ${stage.accent}`}>{stage.name}</span>
            </motion.div>
            {index < stages.length - 1 && (
              <div className="relative h-16 w-10 sm:mx-4 sm:h-12 sm:w-auto sm:flex-1" aria-hidden="true">
                <svg className="absolute inset-0 h-full w-full sm:hidden" viewBox="0 0 40 64" fill="none" preserveAspectRatio="none">
                  <path d="M20 4V48" stroke="#F2A2A5" strokeLinecap="round" strokeWidth="3" strokeDasharray="6 8" />
                  <path d="M10 43L20 58L30 43" stroke="#C94458" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                </svg>
                <svg className="absolute inset-0 hidden h-full w-full text-brand-300 sm:block" viewBox="0 0 160 48" fill="none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`flowArrow-${index}`} x1="0" x2="160" y1="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFE8E3" stopOpacity="0" />
                      <stop offset="0.35" stopColor="#F2A2A5" stopOpacity="0.72" />
                      <stop offset="1" stopColor="#C94458" />
                    </linearGradient>
                    <filter id={`flowArrowGlow-${index}`} x="-8" y="-8" width="176" height="64" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FFD1C8" floodOpacity="0.55" />
                    </filter>
                  </defs>
                  <path
                    d="M8 24H137"
                    stroke={`url(#flowArrow-${index})`}
                    strokeLinecap="round"
                    strokeWidth="3"
                    strokeDasharray="8 10"
                    filter={`url(#flowArrowGlow-${index})`}
                  />
                  <path
                    d="M132 13L148 24L132 35"
                    stroke="#C94458"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    filter={`url(#flowArrowGlow-${index})`}
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
