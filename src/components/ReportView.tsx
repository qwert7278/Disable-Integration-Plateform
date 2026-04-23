import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisReport, ActionStep } from '../types';
import { 
  FileText, MapPin, ExternalLink, ArrowRight, 
  CheckCircle2, Info, ListOrdered, Phone, 
  AlertCircle, Network, BarChart3, TrendingUp, TrendingDown, ShieldAlert,
  Zap, Target, Home, Lightbulb, User, Volume2, VolumeX, Printer, Download
} from 'lucide-react';
import { MindMap } from './MindMap';
import { RadarChart } from './RadarChart';
import { AccessibilityController } from './AccessibilityController';
import { speak, stopSpeaking } from '../services/tts';

interface Props {
  report: AnalysisReport;
  onReset: () => void;
}

const DetailedStepCard: React.FC<{ step: ActionStep; index: number }> = ({ step, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const firstSop = step.sop?.[0];

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm transition-all hover:border-brand-100 hover:shadow-[0_18px_44px_-36px_rgba(126,58,72,0.45)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full bg-white p-5 text-left transition-colors hover:bg-brand-50/25 sm:p-6"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-lg font-black text-brand-700 ring-1 ring-brand-100">
              {index + 1}
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black text-slate-500">
                  優先對接
                </span>
                <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11px] font-black text-brand-700">
                  {step.agency}
                </span>
              </div>
              <h4 className="text-xl font-black leading-snug text-slate-900">{step.title}</h4>
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-7 text-slate-500">
                {step.painPoint || step.description}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
            <span className="text-xs font-black text-slate-400">{isOpen ? '收合內容' : '查看細節'}</span>
            <ArrowRight className={`h-5 w-5 text-brand-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-slate-100 bg-slate-50/50 px-5 pb-6 pt-5 sm:px-6">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="mb-2 text-xs font-black text-slate-400">推薦原因</div>
                  <p className="text-sm font-bold leading-7 text-slate-700">{step.painPoint || step.description}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="mb-2 text-xs font-black text-slate-400">對接窗口</div>
                  <p className="text-sm font-black leading-7 text-slate-800">{step.agency}</p>
                  {step.contact && (
                    <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Phone className="h-4 w-4" /> {step.contact}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                  <div className="mb-2 text-xs font-black text-brand-600">下一步</div>
                  <p className="text-sm font-bold leading-7 text-brand-900">
                    {firstSop ? `${firstSop.step}：${firstSop.action}` : '先聯繫窗口確認資格與申請方式。'}
                  </p>
                </div>
              </div>

              <p className="rounded-2xl border border-slate-100 bg-white p-4 text-sm font-semibold leading-7 text-slate-600">
                {step.description}
              </p>

              {step.sop && (
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-800">
                    <ListOrdered className="h-4 w-4 text-brand-600" />
                    建議申請流程
                  </div>
                  <div className="space-y-4">
                    {step.sop.map((s, i) => (
                      <div key={i} className="relative border-l-2 border-brand-100 pl-5">
                        <div className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-brand-200">
                          <div className="h-2 w-2 rounded-full bg-brand-500" />
                        </div>
                        <div className="text-sm font-black text-slate-800">{s.step}</div>
                        <div className="mt-1 text-sm font-semibold leading-6 text-slate-500">{s.action}</div>
                        {s.docs && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {s.docs.map(doc => (
                              <span key={doc} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-500">
                                {doc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-bold text-slate-400">
                  建議先完成這一項，再進入下一個對接項目。
                </div>
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-4 py-2 text-sm font-black text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    官方入口 <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const quadrantDefinitions = [
  {
    id: 'I',
    name: '自立發展型',
    shortName: '自立發展',
    color: 'bg-emerald-500',
    softBg: 'bg-emerald-50/65',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    mutedText: 'text-emerald-700',
    desc: '生活支持與發展動能都相對穩定，適合進一步規劃職業重建、社會參與或自立生活目標。',
    action: '職業重建、社會參與、自立生活規劃',
  },
  {
    id: 'II',
    name: '穩定生活型',
    shortName: '穩定生活',
    color: 'bg-sky-500',
    softBg: 'bg-sky-50/65',
    border: 'border-sky-200',
    text: 'text-sky-800',
    mutedText: 'text-sky-700',
    desc: '生活基盤相對穩定，但發展動能或工作條件較受限，重點是維持生活品質並逐步增加參與。',
    action: '維持長照支持、社區參與、功能維持',
  },
  {
    id: 'III',
    name: '潛力待援型',
    shortName: '潛力待援',
    color: 'bg-amber-500',
    softBg: 'bg-amber-50/65',
    border: 'border-amber-200',
    text: 'text-amber-800',
    mutedText: 'text-amber-700',
    desc: '具備發展意願或能力，但照顧與生活基盤仍不夠穩，建議先補足支持再銜接發展資源。',
    action: '強化家庭支持、導入居服、穩定後銜接職重',
  },
  {
    id: 'IV',
    name: '高危支持型',
    shortName: '高危支持',
    color: 'bg-rose-500',
    softBg: 'bg-rose-50/65',
    border: 'border-rose-200',
    text: 'text-rose-800',
    mutedText: 'text-rose-700',
    desc: '生活穩定度與發展動能都偏低，需要先降低風險，建立照顧、安全與福利支持。',
    action: '照顧管理、緊急支持、福利補助與安全改善',
  },
] as const;

const hopefulGoals: Record<AnalysisReport['quadrant']['id'], string> = {
  I: '目前已經有不錯的生活基礎，可以把重點放在職業重建、社會參與與自立生活規劃，讓能力慢慢轉成更穩定的日常。',
  II: '目前生活基礎相對穩定，可以先守住既有支持，再用較低壓力的方式增加社區參與與生活目標。',
  III: '目前看得到發展潛力，建議先把照顧與環境支持補起來，等生活更穩後再銜接職重或自立訓練。',
  IV: '目前需要先把安全、照顧與福利支持接住。一步一步降低風險後，仍然可以重新建立比較穩定的生活節奏。',
};

const keelungResourceCards = [
  {
    category: '生活自立',
    title: '自立生活支持服務 / 個人助理',
    desc: '協助外出、購物、休閒活動與社會參與，適合想增加自主生活與外出參與的人。',
    contact: '愛加倍社會福利關懷協會 02-2428-7761',
    href: 'https://www.klcg.gov.tw/wSite/public/Attachment/01306/f1767151716369.pdf',
  },
  {
    category: '輔具與環境',
    title: '基隆市輔具資源中心',
    desc: '提供輔具諮詢、評估、適配、維修、回收、借用轉贈與展示體驗。',
    contact: '02-2469-6966',
    href: 'https://www.klatrc.tw/',
  },
  {
    category: '交通外出',
    title: '復康巴士 / 無障礙交通平台',
    desc: '協助就醫、復健、社會參與等外出需求，可透過平台或電話預約。',
    contact: '02-2468-0655',
    href: 'https://www.klcg.gov.tw/tw/klcg1/2805.html',
  },
  {
    category: '經濟支持',
    title: '身心障礙生活補助',
    desc: '符合資格者可向戶籍所在地區公所社政課申請，減輕日常生活負擔。',
    contact: '戶籍所在地區公所社政課',
    href: 'https://www.klcg.gov.tw/tw/klcg1/2798-113116.html',
  },
  {
    category: '日間支持',
    title: '社區日照 / 小作所',
    desc: '提供生活自理、人際互動、休閒活動、健康促進與社區適應等支持。',
    contact: '依據點洽詢基隆市身心障礙福利服務簡介',
    href: 'https://www.klcg.gov.tw/wSite/public/Attachment/01306/f1767151716369.pdf',
  },
  {
    category: '工作發展',
    title: '職業重建服務',
    desc: '提供就業媒合、職業輔導評量、職務再設計與職業訓練。',
    contact: '社會處勞資關係科 02-2436-5690/5',
    href: 'https://www.klcg.gov.tw/wSite/public/Attachment/01306/f1767151716369.pdf',
  },
] as const;

type QuadrantDefinition = (typeof quadrantDefinitions)[number];

const PrintableReport: React.FC<{
  report: AnalysisReport;
  currentQuadrantDefinition: QuadrantDefinition;
  abilityAverage: number;
  topActions: ActionStep[];
}> = ({ report, currentQuadrantDefinition, abilityAverage, topActions }) => {
  const printedAt = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <section className="print-report" aria-label="整合健檢報告列印友善版">
      <article className="print-page print-page-summary">
        <header className="print-header">
          <div>
            <div className="print-eyebrow">身心障礙全流程整合導航平台</div>
            <h1>整合健檢報告</h1>
            <p>目前狀況、能力輪廓與下一步資源摘要</p>
          </div>
          <div className="print-date">產出日期：{printedAt}</div>
        </header>

        <section className="print-hero">
          <div>
            <div className="print-label">目前落點</div>
            <h2>第 {report.quadrant.id} 象限：{report.quadrant.name}</h2>
            <p>{currentQuadrantDefinition.desc}</p>
          </div>
          <div className="print-route">
            <span>建議路徑</span>
            <strong>{report.recommendedPath}</strong>
          </div>
        </section>

        <section className="print-score-grid">
          {[
            { label: '六大能力平均', value: abilityAverage.toFixed(1), note: '0 到 5 分' },
            { label: '照顧穩定度', value: report.quadrant.stability.toFixed(1), note: '家庭支持與自理基礎' },
            { label: '自立發展度', value: report.quadrant.development.toFixed(1), note: '工作意願與發展條件' },
          ].map(item => (
            <div className="print-score-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          ))}
        </section>

        <section className="print-two-columns">
          <div className="print-panel">
            <h3>已具備的基礎</h3>
            <ul>
              {report.strengths.slice(0, 4).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="print-panel">
            <h3>優先補強</h3>
            <ul>
              {report.weaknesses.slice(0, 4).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="print-panel print-summary-block">
          <h3>可以前進的方向</h3>
          <p>{hopefulGoals[report.quadrant.id]}</p>
        </section>

        <section className="print-panel print-summary-block">
          <h3>摘要說明</h3>
          <p>{report.summary}</p>
        </section>

        <section className="print-panel">
          <h3>建議先對接的前 3 項資源</h3>
          <div className="print-actions">
            {topActions.map((step, index) => (
              <div className="print-action-item" key={`${step.title}-${index}`}>
                <div className="print-action-index">{index + 1}</div>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.painPoint || step.description}</p>
                  <span>{step.agency}{step.contact ? `｜${step.contact}` : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>

      <article className="print-page print-page-resources">
        <header className="print-header print-header-compact">
          <div>
            <div className="print-eyebrow">下一步對接清單</div>
            <h1>資源與文件準備</h1>
          </div>
          <div className="print-date">第 {report.quadrant.id} 象限：{report.quadrant.name}</div>
        </header>

        <section className="print-two-columns">
          <div className="print-panel">
            <h3>這次先努力的目標</h3>
            <ul>
              {report.actionPlan.referralSummary.goals.slice(0, 4).map(goal => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </div>
          <div className="print-panel">
            <h3>需要先處理的卡點</h3>
            <ul>
              {report.actionPlan.referralSummary.keyDifficulties.slice(0, 4).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="print-panel">
          <h3>文件準備清單</h3>
          <div className="print-checklist">
            {report.actionPlan.documentChecklist.slice(0, 8).map(item => (
              <div key={item}>□ {item}</div>
            ))}
          </div>
        </section>

        <section className="print-panel">
          <h3>基隆資源盤點</h3>
          <div className="print-resource-grid">
            {keelungResourceCards.map(resource => (
              <div className="print-resource-card" key={resource.title}>
                <span>{resource.category}</span>
                <strong>{resource.title}</strong>
                <p>{resource.desc}</p>
                <small>{resource.contact}</small>
              </div>
            ))}
          </div>
        </section>

        <footer className="print-footer">
          本報告為導航與對接討論輔助，實際資格、補助、名額與服務內容仍以各主管機關及服務單位公告為準。
        </footer>
      </article>
    </section>
  );
};

export const ReportView: React.FC<Props> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'steps' | 'mindmap'>('analysis');
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const currentQuadrantDefinition = quadrantDefinitions.find(q => q.id === report.quadrant.id) || quadrantDefinitions[0];
  const abilityAverage = report.radarData.reduce((sum, item) => sum + item.score, 0) / Math.max(report.radarData.length, 1);
  const abilityAveragePercent = Math.max(0, Math.min(100, (abilityAverage / 5) * 100));
  const topActions = report.actionPlan.prioritizedTasks.slice(0, 3);
  const reportVoiceSummary = useMemo(() => {
    const strengths = report.strengths.slice(0, 3).join('、') || '目前尚無明顯優勢';
    const weaknesses = report.weaknesses.slice(0, 3).join('、') || '目前尚無明顯困境';
    const actions = topActions.map((step, index) => `第 ${index + 1} 項，${step.title}，窗口是${step.agency}`).join('。') || '目前以維持穩定與定期追蹤為主';

    return [
      '整合健檢報告摘要。',
      `目前落在第 ${report.quadrant.id} 象限，${report.quadrant.name}。`,
      `六大能力平均約 ${abilityAverage.toFixed(1)} 分，照顧穩定度 ${report.quadrant.stability.toFixed(1)} 分，自立發展度 ${report.quadrant.development.toFixed(1)} 分。`,
      `目前比較有基礎的能力是：${strengths}。`,
      `建議優先補強的面向是：${weaknesses}。`,
      hopefulGoals[report.quadrant.id],
      `建議先對接的資源包括：${actions}。`,
      '您可以切換到對接路徑與清單，查看每一項資源的推薦原因、對接窗口與下一步。'
    ].join(' ');
  }, [abilityAverage, report, topActions]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const toggleReportTTS = () => {
    const nextState = !isTTSActive;
    setIsTTSActive(nextState);

    if (!nextState) {
      stopSpeaking();
      setCurrentSpeech('');
      return;
    }

    setCurrentSpeech(reportVoiceSummary);
    speak(reportVoiceSummary, 1.0, () => setCurrentSpeech(''));
  };

  const openPrintDialog = () => {
    stopSpeaking();
    setIsTTSActive(false);
    setCurrentSpeech('');

    const previousTitle = document.title;
    document.title = `整合健檢報告-${report.quadrant.id}象限-${report.quadrant.name}`;
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.title = previousTitle;
      }, 400);
    }, 80);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20 sm:space-y-8">
      <PrintableReport
        report={report}
        currentQuadrantDefinition={currentQuadrantDefinition}
        abilityAverage={abilityAverage}
        topActions={topActions}
      />
      <AccessibilityController
        isActive={isTTSActive}
        onToggle={toggleReportTTS}
        currentText={currentSpeech}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-4 shadow-[0_28px_80px_-58px_rgba(126,58,72,0.55)] sm:rounded-[40px] sm:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-brand-100/70 via-white to-cyan-100/60" />
        <div className="pointer-events-none absolute -right-10 top-8 opacity-[0.07]">
          <FileText className="h-40 w-40 text-slate-900" />
        </div>

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100 sm:h-14 sm:w-14 sm:rounded-3xl">
                <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">Improve Plan</div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">整合健檢報告</h2>
                <div className="mt-1 text-sm font-bold text-slate-500">目前狀況、能力輪廓與下一步資源摘要</div>
              </div>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <button
                type="button"
                onClick={toggleReportTTS}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition-all active:scale-[0.98] sm:w-fit ${
                  isTTSActive
                    ? 'border-brand-200 bg-brand-700 text-white shadow-sm hover:bg-brand-800'
                    : 'border-brand-100 bg-white text-brand-700 hover:bg-brand-50'
                }`}
                aria-pressed={isTTSActive}
                aria-label={isTTSActive ? '停止朗讀整合報告摘要' : '朗讀整合報告摘要'}
              >
                {isTTSActive ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {isTTSActive ? '停止朗讀' : '朗讀報告摘要'}
              </button>
              <button
                type="button"
                onClick={openPrintDialog}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 active:scale-[0.98] sm:w-fit"
              >
                <Printer className="h-4 w-4" />
                列印友善版
              </button>
              <button
                type="button"
                onClick={openPrintDialog}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition-all hover:bg-brand-800 active:scale-[0.98] sm:w-fit"
                aria-label="下載 PDF，將開啟列印視窗，可選擇另存為 PDF"
              >
                <Download className="h-4 w-4" />
                下載 PDF
              </button>
            </div>

            <div className="rounded-[2rem] border border-brand-100 bg-brand-50/70 p-6">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black ${currentQuadrantDefinition.softBg} ${currentQuadrantDefinition.border} ${currentQuadrantDefinition.text}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${currentQuadrantDefinition.color}`} />
                  目前落在第 {report.quadrant.id} 象限：{report.quadrant.name}
                </span>
                <span className="rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-black text-slate-600">
                  建議路徑：{report.recommendedPath}
                </span>
              </div>
              <p className="text-lg font-black leading-relaxed text-slate-900">
                目前整體能力平均約 {abilityAverage.toFixed(1)} 分，照顧穩定度 {report.quadrant.stability.toFixed(1)} 分，自立發展度 {report.quadrant.development.toFixed(1)} 分。
              </p>
              <p className="mt-3 text-base font-semibold leading-8 text-slate-600">
                這份結果不是要幫個案貼標籤，而是幫本人與家屬快速看見：現在站在哪裡、哪裡已經有基礎、下一步可以先接哪些資源。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-600">已具備的基礎</div>
                <div className="space-y-2">
                  {report.strengths.slice(0, 3).map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm font-black text-emerald-900">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-5">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-amber-600">優先補強</div>
                <div className="space-y-2">
                  {report.weaknesses.slice(0, 3).map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm font-black text-amber-900">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-brand-100 bg-white/76 p-5">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-brand-600">可以前進的方向</div>
                <p className="text-sm font-bold leading-7 text-slate-700">{hopefulGoals[report.quadrant.id]}</p>
              </div>
            </div>

            <details className="group rounded-3xl border border-slate-100 bg-white/80 p-5">
              <summary className="cursor-pointer list-none text-sm font-black text-slate-700">
                詳細摘要
                <span className="ml-2 text-xs font-bold text-slate-400 group-open:hidden">展開閱讀</span>
                <span className="ml-2 hidden text-xs font-bold text-slate-400 group-open:inline">收合</span>
              </summary>
              <p className="mt-3 text-sm font-semibold leading-8 text-slate-600">{report.summary}</p>
            </details>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white/82 p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-slate-900">能力概況</div>
                <div className="text-xs font-bold text-slate-400">0 到 5 分，越高代表越穩定</div>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-black ${currentQuadrantDefinition.softBg} ${currentQuadrantDefinition.text}`}>
                {currentQuadrantDefinition.shortName}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-[190px_1fr] lg:grid-cols-1 xl:grid-cols-[190px_1fr]">
              <div className="relative mx-auto grid h-44 w-44 place-items-center rounded-full bg-brand-50">
                <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="80" cy="80" r="66" fill="none" stroke="#FFE8E3" strokeWidth="14" />
                  <circle
                    cx="80"
                    cy="80"
                    r="66"
                    fill="none"
                    stroke="#A83549"
                    strokeLinecap="round"
                    strokeWidth="14"
                    strokeDasharray={`${abilityAveragePercent * 4.15} 415`}
                  />
                </svg>
                <div className="text-center">
                  <div className="text-4xl font-black text-brand-900">{abilityAverage.toFixed(1)}</div>
                  <div className="text-xs font-black text-slate-400">平均 / 5</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: '照顧穩定度', value: report.quadrant.stability, icon: TrendingUp },
                  { label: '自立發展度', value: report.quadrant.development, icon: Zap },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                        <item.icon className="h-4 w-4 text-brand-600" />
                        {item.label}
                      </div>
                      <div className="text-xl font-black text-slate-900">{item.value.toFixed(1)}</div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.max(0, Math.min(100, (item.value / 5) * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
                <Target className="h-4 w-4 text-brand-600" />
                建議先對接的資源
              </div>
              <div className="space-y-3">
                {topActions.length > 0 ? topActions.map((step, index) => (
                  <div key={`${step.title}-${index}`} className="flex items-start gap-3 rounded-2xl bg-white p-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xs font-black text-brand-700">{index + 1}</div>
                    <div>
                      <div className="text-sm font-black text-slate-900">{step.title}</div>
                      <div className="text-xs font-bold leading-5 text-slate-500">{step.agency}</div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl bg-white p-3 text-sm font-bold text-slate-500">
                    目前以維持穩定與定期追蹤為主。
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('steps')}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 px-4 py-3 text-sm font-black text-white transition-all hover:bg-brand-800 active:scale-[0.98]"
              >
                查看完整對接清單 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 -mx-4 overflow-x-auto border-y border-slate-200 bg-slate-100/95 p-2 shadow-sm backdrop-blur sm:top-20 sm:mx-auto sm:w-fit sm:rounded-2xl sm:border" role="tablist" aria-label="報告內容分頁">
        <div className="flex min-w-max gap-1">
        <button
          onClick={() => setActiveTab('analysis')}
          role="tab"
          aria-selected={activeTab === 'analysis'}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 ${activeTab === 'analysis' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BarChart3 className="w-4 h-4" /> 現況評估與分群
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          role="tab"
          aria-selected={activeTab === 'steps'}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 ${activeTab === 'steps' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ListOrdered className="w-4 h-4" /> 對接路徑與清單
        </button>
        <button
          onClick={() => setActiveTab('mindmap')}
          role="tab"
          aria-selected={activeTab === 'mindmap'}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-6 ${activeTab === 'mindmap' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Network className="w-4 h-4" /> 資源整合地圖
        </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Row 1: Radar Chart + Advantages/Challenges */}
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-brand-600" />
                      六邊形能力雷達圖
                    </h3>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      以 0 到 5 分呈現六大能力，幫助快速判斷目前最穩定與最需要支持的面向。
                    </p>
                  </div>
                  <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-2 text-sm font-black text-brand-700">
                    能力越接近 5，表示越穩定
                  </div>
                </div>
                <RadarChart data={report.radarData} />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-100">
                  <h4 className="text-emerald-700 text-xl font-black mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" /> 三大優勢
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
                    {report.strengths.map((s, index) => (
                      <div key={s} className="rounded-2xl border border-emerald-100 bg-white/70 p-4">
                        <div className="mb-2 text-xs font-black text-emerald-500">#{index + 1}</div>
                        <div className="text-lg font-black text-emerald-900">{s}</div>
                        <p className="mt-1 text-xs font-semibold leading-relaxed text-emerald-700">
                          可作為後續資源對接與自立規劃的支撐點。
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-brand-50/80 p-6 rounded-3xl border border-brand-100">
                  <h4 className="text-brand-700 text-xl font-black mb-4 flex items-center gap-2">
                    <TrendingDown className="w-6 h-6" /> 三大困境
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
                    {report.weaknesses.map((w, index) => (
                      <div key={w} className="rounded-2xl border border-brand-100 bg-white/70 p-4">
                        <div className="mb-2 text-xs font-black text-brand-500">#{index + 1}</div>
                        <div className="text-lg font-black text-brand-900">{w}</div>
                        <p className="mt-1 text-xs font-semibold leading-relaxed text-brand-700">
                          建議優先確認是否需要外部服務、訓練或照顧支持。
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Four-Quadrant Capability Model (Full Width) */}
            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
              <div className="mb-8 sm:mb-16">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Network className="w-5 h-5 text-brand-600" />
                  四象限能力分群模型 (分流判讀)
                </h3>
                <p className="text-slate-500 text-sm font-medium ml-7">評估身心障礙者評估與處置之平台整合</p>
              </div>
              
              <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Left: The Chart (Span 7) */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="-mx-4 overflow-x-auto px-28 pb-32 pt-14 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0">
                  <div className="relative mx-auto aspect-square w-full min-w-[520px] max-w-[600px] rounded-[48px] border border-slate-200 bg-white p-16 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.45)] group/chart">
                    {/* Quadrant Background Colors with subtle gradients */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none rounded-[48px] overflow-hidden">
                      <div className="bg-sky-50/80 border-r border-b border-slate-200/70" />
                      <div className="bg-emerald-50/80 border-b border-slate-200/70" />
                      <div className="bg-rose-50/70 border-r border-slate-200/70" />
                      <div className="bg-amber-50/70" />
                    </div>

                    {/* Grid Lines & Axes */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Main Axes */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-800 rounded-l-[48px]" />
                      <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-slate-800 rounded-b-[48px]" />
                      
                      {/* Reference Lines */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-slate-400/60" />
                      <div className="absolute left-0 right-0 top-1/2 h-px border-t border-dashed border-slate-400/60" />
                    </div>
                    
                    {/* X-Axis Scale */}
                    <div className="absolute -bottom-12 left-0 right-0 flex justify-between px-2 text-[13px] font-black text-slate-700 z-20">
                      <div className="flex flex-col items-start translate-y-2">
                        <div className="w-1 h-4 bg-slate-700 mb-2 rounded-full" />
                        <span className="bg-white/95 px-4 py-1.5 rounded-2xl border border-slate-200 shadow-sm whitespace-nowrap">0 低發展</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-1 h-8 bg-brand-600 mb-2 rounded-full" />
                        <span className="bg-brand-700 text-white px-5 py-1.5 rounded-full shadow-sm ring-4 ring-white whitespace-nowrap">中位線 2.5</span>
                      </div>
                      <div className="flex flex-col items-end translate-y-2">
                        <div className="w-1 h-4 bg-slate-700 mb-2 rounded-full" />
                        <span className="bg-white/95 px-4 py-1.5 rounded-2xl border border-slate-200 shadow-sm whitespace-nowrap">5 高發展</span>
                      </div>
                    </div>

                    {/* Y-Axis Scale */}
                    <div className="absolute -left-32 top-0 bottom-0 flex flex-col justify-between py-2 text-[13px] font-black text-slate-700 items-end pr-8 z-20">
                      <div className="flex items-center gap-4 translate-x-2">
                        <span className="bg-white/95 px-4 py-1.5 rounded-2xl border border-slate-200 shadow-sm whitespace-nowrap">5 高穩定</span>
                        <div className="w-4 h-1 bg-slate-700 rounded-full" />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-brand-700 text-white px-5 py-1.5 rounded-full shadow-sm ring-4 ring-white whitespace-nowrap">中位線 2.5</span>
                        <div className="w-8 h-1 bg-brand-700 rounded-full" />
                      </div>
                      <div className="flex items-center gap-4 translate-x-2">
                        <span className="bg-white/95 px-4 py-1.5 rounded-2xl border border-slate-200 shadow-sm whitespace-nowrap">0 低穩定</span>
                        <div className="w-4 h-1 bg-slate-700 rounded-full" />
                      </div>
                    </div>

                    {/* Axis Titles with Icons */}
                    <div className="absolute -top-12 left-0">
                      <div className="bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-sm z-30 flex items-center gap-2 ring-4 ring-white border border-slate-200">
                        <div className="p-1 bg-brand-50 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-brand-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black tracking-tight leading-none">照顧穩定度</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Stability Index ↑</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-28">
                      <div className="bg-white text-slate-800 px-6 py-2 rounded-2xl shadow-sm z-30 flex items-center gap-3 ring-4 ring-white border border-slate-200">
                        <div className="p-1 bg-amber-50 rounded-lg">
                          <Zap className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black tracking-tight leading-none">自立發展度</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Development Index →</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quadrant Indicators with Icons */}
                    <div className="absolute top-12 right-12 text-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-200">
                          <Target className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-[15px] font-black text-emerald-900 bg-white/95 px-5 py-2 rounded-2xl border border-emerald-100 shadow-sm">I. 自立發展</div>
                      </div>
                    </div>
                    <div className="absolute top-12 left-12 text-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 bg-sky-50 rounded-2xl flex items-center justify-center border border-sky-200">
                          <Home className="w-6 h-6 text-sky-600" />
                        </div>
                        <div className="text-[15px] font-black text-sky-900 bg-white/95 px-5 py-2 rounded-2xl border border-sky-100 shadow-sm">II. 穩定生活</div>
                      </div>
                    </div>
                    <div className="absolute bottom-12 right-12 text-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
                          <Lightbulb className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="text-[15px] font-black text-amber-900 bg-white/95 px-5 py-2 rounded-2xl border border-amber-100 shadow-sm">III. 潛力待援</div>
                      </div>
                    </div>
                    <div className="absolute bottom-12 left-12 text-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-200">
                          <ShieldAlert className="w-6 h-6 text-rose-600" />
                        </div>
                        <div className="text-[15px] font-black text-rose-900 bg-white/95 px-5 py-2 rounded-2xl border border-rose-100 shadow-sm">IV. 高危支持</div>
                      </div>
                    </div>

                    {/* The Point - More Premium */}
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                      className="absolute w-16 h-16 z-50 flex items-center justify-center cursor-pointer group/point"
                      style={{ 
                        left: `${(report.quadrant.development / 5) * 100}%`, 
                        bottom: `${(report.quadrant.stability / 5) * 100}%`,
                        transform: 'translate(-50%, 50%)'
                      }}
                    >
                      <div className="absolute inset-0 bg-brand-500 rounded-full opacity-15 scale-150" />
                      <div className="w-12 h-12 bg-brand-600 rounded-full border-[6px] border-white shadow-lg flex items-center justify-center relative z-10 group-hover/point:scale-110 transition-transform">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Enhanced Tooltip */}
                      <div className="absolute bottom-full mb-6 opacity-0 group-hover/point:opacity-100 transition-all translate-y-2 group-hover/point:translate-y-0 pointer-events-none z-[60]">
                        <div className="bg-slate-900 text-white p-4 rounded-[24px] shadow-2xl border border-white/10 flex flex-col items-center min-w-[140px]">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">個案精確落點</span>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-slate-500">發展</span>
                              <span className="text-lg font-black">{report.quadrant.development.toFixed(1)}</span>
                            </div>
                            <div className="w-px h-8 bg-slate-700" />
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-slate-500">穩定</span>
                              <span className="text-lg font-black">{report.quadrant.stability.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-slate-900 rotate-45 mx-auto -mt-2" />
                      </div>
                    </motion.div>
                  </div>
                  </div>

                  {/* Score Summary Cards - Arranged Downwards/Structured */}
                  <div className="mx-auto mt-6 grid max-w-[800px] gap-4 md:grid-cols-2 sm:mt-36 sm:gap-6">
                    <div className="group flex items-center justify-between rounded-[1.5rem] border-2 border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-brand-200 sm:rounded-[32px] sm:p-8">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-brand-50 transition-transform group-hover:scale-110 sm:h-16 sm:w-16 sm:rounded-[20px]">
                          <TrendingUp className="h-6 w-6 text-brand-600 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Y軸：照顧穩定度評分</div>
                          <div className="text-sm text-slate-600 font-medium">家庭支持系統 × 個人自理能力</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-slate-900 sm:text-4xl">{report.quadrant.stability.toFixed(1)}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">/ 5.0 滿分</div>
                      </div>
                    </div>
                    <div className="group flex items-center justify-between rounded-[1.5rem] border-2 border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-amber-200 sm:rounded-[32px] sm:p-8">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-amber-50 transition-transform group-hover:scale-110 sm:h-16 sm:w-16 sm:rounded-[20px]">
                          <Zap className="h-6 w-6 text-amber-600 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">X軸：自立發展度評分</div>
                          <div className="text-sm text-slate-600 font-medium">工作能力 × 發展意願 × 經濟基礎</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-slate-900 sm:text-4xl">{report.quadrant.development.toFixed(1)}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">/ 5.0 滿分</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Details (Span 5) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className={`p-8 bg-white rounded-[36px] border ${currentQuadrantDefinition.border} relative overflow-hidden shadow-[0_20px_54px_-44px_rgba(15,23,42,0.45)]`}>
                    <div className={`absolute inset-y-0 left-0 w-2 ${currentQuadrantDefinition.color}`} />
                    <div className="absolute -top-4 -right-4 p-4 opacity-[0.04]">
                      <Network className="w-32 h-32" />
                    </div>
                    <div className="relative flex items-center gap-4 mb-6">
                      <div className={`w-4 h-4 rounded-full ${currentQuadrantDefinition.color} shadow-sm ring-4 ring-white`} />
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">當前落點</div>
                        <div className="text-xl font-black text-slate-900">第 {report.quadrant.id} 象限</div>
                      </div>
                    </div>
                    <h4 className={`text-3xl font-black mb-4 ${currentQuadrantDefinition.text}`}>{report.quadrant.name}</h4>
                    <p className="text-base text-slate-600 leading-relaxed font-semibold">{report.quadrant.description}</p>
                    <div className={`mt-5 rounded-2xl border ${currentQuadrantDefinition.border} ${currentQuadrantDefinition.softBg} p-4 text-sm font-bold leading-relaxed ${currentQuadrantDefinition.mutedText}`}>
                      建議讀法：先看落點所在象限，再對照 X 軸「自立發展度」與 Y 軸「照顧穩定度」。這個象限代表目前資源介入的優先順序，不是能力的永久標籤。
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">分流定義與資源導向</h5>
                    {quadrantDefinitions.map(q => (
                      <div key={q.id} className={`p-5 rounded-3xl border transition-all duration-300 ${
                        report.quadrant.id === q.id 
                          ? `bg-white ${q.border} shadow-[0_18px_42px_-34px_rgba(15,23,42,0.45)] z-10`
                          : 'bg-white/55 border-slate-100 opacity-70'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl ${q.color} text-white flex items-center justify-center font-black text-sm shadow-sm`}>{q.id}</div>
                            <span className="text-sm font-black text-slate-800">{q.name}</span>
                          </div>
                          {report.quadrant.id === q.id && (
                            <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${q.softBg} ${q.text}`}>目前</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">{q.desc}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>核心策略：{q.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Risk Warning Section (Full Width) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-600" />
                風險提示與預警
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {report.risks.map((risk, i) => (
                  <div key={i} className={`p-6 rounded-[32px] border-2 shadow-sm transition-all hover:shadow-md flex flex-col ${
                    risk.level === 'high' ? 'bg-rose-50 border-rose-200' : 
                    risk.level === 'medium' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${
                          risk.level === 'high' ? 'bg-rose-600 text-white' : 
                          risk.level === 'medium' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {risk.level === 'high' ? '高風險' : risk.level === 'medium' ? '中風險' : '低風險'}
                        </span>
                        <span className="text-xs font-black text-slate-400">#{risk.type}</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">建議介入</div>
                    </div>
                    <p className={`text-sm leading-relaxed font-bold mb-6 flex-grow ${
                      risk.level === 'high' ? 'text-rose-900' : 
                      risk.level === 'medium' ? 'text-amber-900' : 'text-emerald-900'
                    }`}>
                      {risk.description}
                    </p>
                    <div className={`text-xs p-4 rounded-2xl border ${
                      risk.level === 'high' ? 'bg-white/50 border-rose-100 text-rose-700' : 
                      risk.level === 'medium' ? 'bg-white/50 border-amber-100 text-amber-700' : 'bg-white/50 border-emerald-100 text-emerald-700'
                    }`}>
                      <span className="font-black mr-2">處理對策：</span>
                      {risk.level === 'high' ? '立即啟動個案管理，安排專業人員到府評估並導入緊急支援系統。' : 
                       risk.level === 'medium' ? '納入定期追蹤清單，提供相關衛教資訊並媒合社區支持團體。' : '維持現狀，鼓勵參與預防性社區活動，定期自我監測。'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'steps' && (
          <motion.div
            key="steps"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]"
          >
            <div className="space-y-8">
              {/* Referral Summary */}
              <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-brand-50/80 via-white to-cyan-50/60 p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-2xl font-black text-slate-900">
                        <FileText className="h-6 w-6 text-brand-600" />
                        行動指標與對接路徑
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
                        依據能力雷達圖與四象限落點，先盤點可以讓生活更安穩的服務，再依優先順序安排申請與追蹤。
                      </p>
                    </div>
                    <span className={`w-fit rounded-2xl border px-4 py-2 text-sm font-black ${currentQuadrantDefinition.softBg} ${currentQuadrantDefinition.border} ${currentQuadrantDefinition.text}`}>
                      {currentQuadrantDefinition.name}
                    </span>
                  </div>
                </div>

                <div className="grid gap-5 p-7 md:grid-cols-3">
                  {[
                    { title: '先接住生活', desc: '把安全、照顧、交通與輔具先穩住。', icon: ShieldAlert },
                    { title: '再銜接資源', desc: '依需求安排補助、服務、協會或職重窗口。', icon: Network },
                    { title: '持續追蹤', desc: '確認申請進度，定期更新下一步。', icon: TrendingUp },
                  ].map(item => (
                    <div key={item.title} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
                      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-600 shadow-sm">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="text-base font-black text-slate-900">{item.title}</div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-5 border-t border-slate-100 p-7 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-black text-slate-500">這次先努力的目標</h4>
                    <div className="space-y-2">
                      {report.actionPlan.referralSummary.goals.map((goal, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/55 p-3 text-sm font-bold text-brand-800">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-black text-slate-500">需要先處理的卡點</h4>
                    <div className="space-y-2">
                      {report.actionPlan.referralSummary.keyDifficulties.map((diff, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-3 text-sm font-bold text-amber-900">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {diff}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-center gap-2 text-slate-800">
                    <ListOrdered className="h-6 w-6 text-brand-600" />
                    <h3 className="text-xl font-black">優先對接清單</h3>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">建議從前 3 項開始，降低申請壓力。</p>
                </div>
                <div className="space-y-4">
                  {report.actionPlan.prioritizedTasks.map((step, i) => (
                    <DetailedStepCard key={i} step={step} index={i} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Document Checklist */}
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-slate-900">
                  <FileText className="h-5 w-5 text-brand-600" />
                  文件準備清單
                </h3>
                <p className="mb-5 text-sm font-semibold leading-7 text-slate-500">
                  先備好常見文件，申請補助或服務時比較不容易來回補件。
                </p>
                <div className="space-y-3">
                  {report.actionPlan.documentChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
                      <MapPin className="h-5 w-5 text-brand-600" />
                      基隆資源盤點
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-500">
                      可依個案需求與窗口確認資格、名額與申請方式。
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {keelungResourceCards.map(resource => (
                    <a
                      key={resource.title}
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-3xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-brand-600 ring-1 ring-brand-100">
                          {resource.category}
                        </span>
                        <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-500" />
                      </div>
                      <div className="text-sm font-black text-slate-900">{resource.title}</div>
                      <p className="mt-1 text-xs font-semibold leading-6 text-slate-500">{resource.desc}</p>
                      <div className="mt-3 text-xs font-black text-slate-400">{resource.contact}</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Tracking & Feedback Section */}
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
                  <TrendingUp className="h-5 w-5 text-brand-600" />
                  對接追蹤與回饋
                </h3>
                <div className="space-y-3">
                  {[
                    '個案同意並產出轉介資料',
                    '確認第一順位窗口與申請方式',
                    '回填對接狀態與定期追蹤',
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-brand-500' : 'bg-slate-300'}`} />
                      <span className={`text-sm font-bold ${index === 0 ? 'text-slate-800' : 'text-slate-500'}`}>{item}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-5 w-full rounded-2xl bg-brand-700 py-3 text-sm font-black text-white transition-colors hover:bg-brand-800">
                  啟動標準化對接流程
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'mindmap' && (
          <motion.div
            key="mindmap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-slate-800">
              <Network className="w-6 h-6 text-brand-600" />
              <h3 className="text-xl font-bold">跨體系整合導航圖</h3>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[600px]">
              <MindMap data={report.mindMapData} />
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
              <Info className="w-6 h-6 text-blue-500 shrink-0" />
              <div className="text-sm text-blue-800 leading-relaxed">
                此圖展示了從<strong>能力評估</strong>到<strong>六大制度體系</strong>的映射關係。
                您可以清楚看到各個部會（長照、身障、醫療、勞動、保險、民間）的對接路徑。
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-12">
        <button
          onClick={onReset}
          className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-xl active:scale-95"
        >
          重新評估
        </button>
      </div>
    </div>
  );
};
