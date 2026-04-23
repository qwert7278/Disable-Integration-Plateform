import { useState } from 'react';
import type { CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntakeForm } from './components/IntakeForm';
import { ReportView } from './components/ReportView';
import { Flowchart } from './components/Flowchart';
import { PlatformSOP } from './components/PlatformSOP';
import { IntakeData, AnalysisReport } from './types';
import { analyzeIntake } from './services/engine';
import { Users, Zap, Heart } from 'lucide-react';

const KEELUNG_LOGO_URL = 'https://klctb-ws.klcg.gov.tw/Download.ashx?n=5Z%2B66ZqG5Z%2BO5biC5ZOB54mMIExvZ28tMDIucG5n&u=LzAwMS9VcGxvYWQvT2xkRmlsZS93d3cvS2xjY2FiL1VwbG9hZHMvRG93bmxvYWQvOTgyNUE0M0ItMzUzQy00MUQ1LThCNEItRkY5MERFN0FDMDZBLnBuZw%3D%3D';

const heroPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1762955911431-4c44c7c3f408?auto=format&fit=crop&q=80&w=900',
    alt: '照顧者陪伴長者進行活動',
    className: 'left-6 top-10 h-32 w-44 md:left-10 md:top-12',
    rotate: '-4deg',
  },
  {
    src: 'https://images.unsplash.com/photo-1765228805523-72100b8fa493?auto=format&fit=crop&q=80&w=700',
    alt: '公共空間的無障礙坡道',
    className: 'right-7 top-12 h-32 w-40 md:right-12 md:top-14',
    rotate: '4deg',
  },
  {
    src: 'https://images.unsplash.com/photo-1723433892471-62f113c8c9a0?auto=format&fit=crop&q=80&w=800',
    alt: '輪椅使用者與陪伴者互動',
    className: 'bottom-8 left-12 h-28 w-40 md:bottom-10 md:left-16',
    rotate: '3deg',
  },
];

const featureImages = [
  'https://images.unsplash.com/photo-1765228805523-72100b8fa493?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1762955911431-4c44c7c3f408?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1709127347874-3f4674be5bc8?auto=format&fit=crop&q=80&w=900',
];

export default function App() {
  const [view, setView] = useState<'landing' | 'intake' | 'report'>('landing');
  const [report, setReport] = useState<AnalysisReport | null>(null);

  const handleComplete = (data: IntakeData) => {
    const result = analyzeIntake(data);
    setReport(result);
    setView('report');
  };

  return (
    <div className="relative isolate min-h-screen font-sans selection:bg-brand-100 selection:text-brand-800">
      <a href="#main-content" className="skip-link">跳到主要內容</a>
      <div className="life-ribbon" aria-hidden="true" />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/70 bg-[#fff8f6]/85 shadow-[0_10px_30px_-26px_rgba(126,58,72,0.55)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <button
              type="button"
              className="group flex cursor-pointer items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
              onClick={() => setView('landing')}
              aria-label="回到有愛無礙首頁"
            >
              <div className="flex h-11 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/80 bg-white px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_28px_-18px_rgba(190,18,60,0.55)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <img src={KEELUNG_LOGO_URL} alt="基隆城市品牌 Logo" className="h-8 w-full object-contain" />
              </div>
              <span className="text-base font-black tracking-tight text-brand-900 sm:text-lg">有愛無礙</span>
            </button>
            <div className="hidden items-center gap-3 text-sm font-bold text-slate-500 md:flex">
              <a href="#platform-overview" className="rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200">核心理念</a>
              <a href="#resource-preview" className="rounded-xl px-3 py-2 transition-colors hover:bg-white hover:text-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200">資源地圖</a>
              <button
                type="button"
                onClick={() => setView('intake')}
                className="rounded-2xl bg-brand-700 px-5 py-2.5 text-white shadow-[0_16px_30px_-20px_rgba(190,18,60,0.85)] transition-all hover:-translate-y-0.5 hover:bg-brand-800 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
              >
                立即開始
              </button>
            </div>
            <button
              type="button"
              onClick={() => setView('intake')}
              className="rounded-2xl bg-brand-700 px-4 py-2 text-sm font-black text-white shadow-[0_16px_30px_-20px_rgba(190,18,60,0.85)] transition-all active:scale-95 md:hidden"
            >
              開始
            </button>
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="relative mx-auto max-w-7xl px-3 py-6 focus:outline-none sm:px-6 sm:py-10 lg:px-8">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 sm:space-y-20"
            >
              {/* Hero Section */}
              <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/88 px-4 py-10 text-center shadow-[0_28px_70px_-48px_rgba(126,58,72,0.62)] sm:rounded-[2rem] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                <div className="pointer-events-none absolute inset-x-0 -top-12 h-36 bg-gradient-to-r from-brand-100/35 via-white/40 to-cyan-100/35 blur-2xl" />
                <div className="pointer-events-none absolute inset-x-10 bottom-0 h-28 bg-gradient-to-r from-transparent via-rose-100/45 to-transparent blur-2xl" />
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
                  {heroPhotos.map((photo, index) => (
                    <div
                      key={photo.src}
                      className={`photo-float absolute overflow-hidden rounded-[1.35rem] border border-white/80 bg-white p-1 shadow-[0_22px_48px_-28px_rgba(126,58,72,0.72)] ${photo.className}`}
                      style={{ animationDelay: `${index * 0.9}s`, '--float-rotate': photo.rotate } as CSSProperties}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="h-full w-full rounded-[1rem] object-cover"
                      />
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative inline-flex rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-bold tracking-wide text-brand-700 shadow-sm"
                >
                  2025 基隆市身障平台支持整合計畫
                </motion.div>

                <h1 className="relative mx-auto mt-7 max-w-4xl text-3xl font-black leading-[1.14] tracking-tight text-balance sm:text-4xl md:text-5xl">
                  <span className="text-slate-900">打造</span>
                  <span className="text-cis-gradient"> 有愛無礙 </span>
                  <br />
                  <span className="text-slate-900">的友善城市</span>
                </h1>

                <p className="relative mx-auto mt-6 max-w-2xl text-base font-bold leading-relaxed text-slate-700 sm:mt-7 sm:text-lg">
                  評估身心障礙者評估與處置之平台整合。
                </p>

                <p className="relative mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  不再迷失於繁雜的制度。我們透過能力導向評估，為您打通醫療、長照、身障與就業的每一個環節，建立溫暖的社會對接路徑。
                </p>

                <div className="relative flex flex-col items-center justify-center gap-3 pt-8 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setView('intake')}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-800 px-8 py-4 text-base font-bold text-white shadow-[0_20px_40px_-24px_rgba(134,44,62,0.95)] transition-all hover:-translate-y-0.5 hover:bg-brand-900 active:scale-95 sm:w-auto"
                  >
                    開始個人化評估 <Zap className="h-5 w-5 fill-white" aria-hidden="true" />
                  </button>
                  <a href="#platform-overview" className="w-full rounded-2xl border border-brand-200 bg-white/85 px-8 py-4 text-center text-base font-bold text-brand-700 transition-all hover:-translate-y-0.5 hover:bg-brand-50 active:scale-95 sm:w-auto">
                    了解更多
                  </a>
                </div>

                <div className="relative mt-9 grid gap-3 sm:grid-cols-3 lg:hidden">
                  {heroPhotos.map((photo) => (
                    <img
                      key={photo.src}
                      src={photo.src}
                      alt={photo.alt}
                      className="h-28 w-full rounded-2xl border border-white/80 object-cover shadow-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Flowchart Section */}
              <div id="platform-overview" className="rounded-[1.5rem] border border-white/70 bg-white/58 px-3 py-8 shadow-[0_20px_50px_-42px_rgba(126,58,72,0.45)] sm:rounded-[2rem] sm:px-8 sm:py-10">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">全生命歷程路徑圖</h2>
                  <p className="mt-2 text-slate-500">打通每一個環節，讓資源真正到位</p>
                </div>
                <Flowchart />
              </div>

              {/* Platform SOP Section */}
              <div className="rounded-[1.5rem] border border-white/70 bg-white/52 px-3 shadow-[0_20px_50px_-42px_rgba(126,58,72,0.45)] sm:rounded-[2rem] sm:px-8">
                <PlatformSOP />
              </div>

              {/* Features Grid */}
              <div id="resource-preview" className="grid gap-5 md:grid-cols-3">
                {[
                  { title: '起點引導', desc: '解決「不知道該不該辦身障證明」的焦慮。', icon: Zap, color: 'bg-amber-50 text-amber-600' },
                  { title: '能力導向', desc: '先優化能力，再考慮機構，讓每個人都能自立生活。', icon: Heart, color: 'bg-rose-50 text-rose-600' },
                  { title: '整合報告', desc: '一次填寫，得到清楚的下一步行動清單與資源地圖。', icon: Users, color: 'bg-brand-50 text-brand-600' },
                ].map((f, i) => (
                  <div key={i} className="group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/82 shadow-[0_18px_42px_-34px_rgba(126,58,72,0.55)] transition-all hover:-translate-y-1 hover:bg-white">
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={featureImages[i]}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/0 to-white/5" />
                      <div className={`absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/90 shadow-sm ${f.color}`}>
                        <f.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="p-7">
                      <h3 className="mb-3 text-xl font-bold text-slate-800">{f.title}</h3>
                      <p className="leading-relaxed text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-4 sm:py-8"
            >
              <div className="mb-8 text-center sm:mb-12">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">個人化需求評估</h2>
                <p className="mt-2 text-slate-500">只需 3 分鐘，為您規劃最適路徑</p>
              </div>
              <IntakeForm onComplete={handleComplete} />
            </motion.div>
          )}

          {view === 'report' && report && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReportView report={report} onReset={() => setView('intake')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative mt-12 overflow-hidden border-t border-white/80 bg-white/68 py-12 text-slate-600 shadow-[0_-18px_60px_-56px_rgba(126,58,72,0.5)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-96 rotate-[-8deg] bg-gradient-to-r from-brand-100/40 via-cyan-100/35 to-amber-100/30 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-28 items-center justify-center overflow-hidden rounded-2xl border border-white/80 bg-white px-3 shadow-[0_16px_34px_-26px_rgba(126,58,72,0.6)]">
                <img src={KEELUNG_LOGO_URL} alt="基隆城市品牌 Logo" className="h-9 w-full object-contain" />
              </div>
              <div>
                <span className="text-lg font-black text-brand-900">有愛無礙</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-sm sm:gap-4 md:gap-8">
              <a href="#" className="rounded-xl px-3 py-2 font-semibold transition-colors hover:bg-brand-50 hover:text-brand-700">隱私權政策</a>
              <a href="#" className="rounded-xl px-3 py-2 font-semibold transition-colors hover:bg-brand-50 hover:text-brand-700">服務條款</a>
              <a href="#" className="rounded-xl px-3 py-2 font-semibold transition-colors hover:bg-brand-50 hover:text-brand-700">聯繫我們</a>
            </div>
            <p className="text-sm text-slate-500">© 2024 有愛無礙 Pilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
