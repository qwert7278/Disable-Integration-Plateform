import React from 'react';
import { motion } from 'motion/react';

type StepVariant = 'assessment' | 'matching' | 'navigation';

const steps: Array<{
  title: string;
  desc: string;
  variant: StepVariant;
  shell: string;
}> = [
  {
    title: '1. 深度評估',
    desc: '填寫 6 大維度問卷，包含病況、能力、環境與經濟狀況。',
    variant: 'assessment',
    shell: 'from-sky-50 to-blue-100',
  },
  {
    title: '2. 智能判讀',
    desc: '系統自動對接中央與地方資源，判斷最適生活路徑。',
    variant: 'matching',
    shell: 'from-brand-50 to-rose-100',
  },
  {
    title: '3. 執行導航',
    desc: '產出個人化整合報告，包含各項申請的 SOP 與文件清單。',
    variant: 'navigation',
    shell: 'from-emerald-50 to-amber-100',
  },
];

const StepArtwork = ({ variant }: { variant: StepVariant }) => {
  if (variant === 'assessment') {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden="true">
        <rect x="24" y="18" width="48" height="62" rx="12" fill="#EFF6FF" stroke="#60A5FA" strokeWidth="3" />
        <path d="M38 18h20l-2 8H40l-2-8Z" fill="#DBEAFE" stroke="#2563EB" strokeLinejoin="round" strokeWidth="3" />
        <path d="m36 46 6 6 14-16M35 64h28" fill="none" stroke="#2563EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <circle cx="68" cy="31" r="6" fill="#FFE4E6" />
      </svg>
    );
  }

  if (variant === 'matching') {
    return (
      <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden="true">
        <rect x="28" y="28" width="40" height="40" rx="12" fill="#FFF1F2" stroke="#C94458" strokeWidth="3" />
        <path d="M48 17v10M48 69v10M17 48h10M69 48h10M26 26l7 7M63 63l7 7M70 26l-7 7M33 63l-7 7" stroke="#F43F5E" strokeLinecap="round" strokeWidth="3" />
        <path d="M38 49c6-11 14-11 20 0-6 9-14 9-20 0Z" fill="#FFE4E6" stroke="#A83549" strokeLinejoin="round" strokeWidth="3" />
        <circle cx="48" cy="49" r="5" fill="#A83549" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden="true">
      <path d="M26 22h35l11 12v40a5 5 0 0 1-5 5H26a5 5 0 0 1-5-5V27a5 5 0 0 1 5-5Z" fill="#F0FDFA" stroke="#0F766E" strokeLinejoin="round" strokeWidth="3" />
      <path d="M60 22v14h13" fill="#CCFBF1" stroke="#0F766E" strokeLinejoin="round" strokeWidth="3" />
      <path d="M34 47h24M34 59h17" stroke="#0F766E" strokeLinecap="round" strokeWidth="4" />
      <path d="M61 63c-9 2-16 6-21 13 10-1 18-5 24-12" fill="#FEF3C7" stroke="#B45309" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
};

export const PlatformSOP = () => {
  return (
    <div className="py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-800">平台運作流程 (SOP)</h2>
        <p className="mt-2 text-slate-500">簡單三步驟，打通繁雜的資源申請環節</p>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3">
        <div className="absolute left-0 top-1/2 z-0 hidden h-px w-full -translate-y-12 bg-gradient-to-r from-transparent via-brand-100 to-transparent md:block" />

        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.14, duration: 0.58, ease: [0.32, 0.72, 0, 1] }}
            className="group relative z-10 flex flex-col items-center text-center"
          >
            <div className={`mb-6 grid h-28 w-28 place-items-center rounded-[2rem] bg-gradient-to-br ${step.shell} shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_20px_42px_-30px_rgba(126,58,72,0.52)] ring-1 ring-white/80 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1 group-hover:scale-[1.03]`}>
              <StepArtwork variant={step.variant} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-800">{step.title}</h3>
            <p className="max-w-[250px] text-sm leading-relaxed text-slate-500">
              {step.desc}
            </p>

            {index < steps.length - 1 && (
              <div className="my-6 md:hidden" aria-hidden="true">
                <svg className="h-10 w-10 rotate-90 text-brand-300" viewBox="0 0 56 32" fill="none">
                  <path d="M7 16c11-10 27-10 38 0" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                  <path d="m39 10 7 6-7 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
