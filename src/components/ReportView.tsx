import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisReport, ActionStep } from '../types';
import { 
  FileText, MapPin, ExternalLink, ArrowRight, 
  CheckCircle2, Info, ListOrdered, Phone, 
  AlertCircle, Network, BarChart3, TrendingUp, TrendingDown, ShieldAlert,
  Zap, Target, Home, Lightbulb, User
} from 'lucide-react';
import { MindMap } from './MindMap';
import { RadarChart } from './RadarChart';

interface Props {
  report: AnalysisReport;
  onReset: () => void;
}

const DetailedStepCard: React.FC<{ step: ActionStep; index: number }> = ({ step, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">{step.title}</h4>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{step.agency}</span>
          </div>
        </div>
        <ArrowRight className={`w-5 h-5 text-slate-300 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 space-y-6 border-t border-slate-50">
              {step.painPoint && (
                <div className="flex gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">解決痛點</div>
                    <div className="text-sm text-rose-800">{step.painPoint}</div>
                  </div>
                </div>
              )}

              <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>

              {step.sop && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <ListOrdered className="w-4 h-4 text-brand-600" />
                    標準作業程序 (SOP)
                  </div>
                  <div className="space-y-3 pl-2">
                    {step.sop.map((s, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-slate-100 pb-2 last:pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-brand-500" />
                        <div className="text-sm font-bold text-slate-700">{s.step}</div>
                        <div className="text-sm text-slate-500">{s.action}</div>
                        {s.docs && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {s.docs.map(doc => (
                              <span key={doc} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200">
                                📄 {doc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                {step.contact && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="w-4 h-4" /> {step.contact}
                  </div>
                )}
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-600 text-sm font-bold hover:underline"
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

export const ReportView: React.FC<Props> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'steps' | 'mindmap'>('analysis');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cis-gradient p-10 rounded-[40px] text-brand-900 shadow-2xl shadow-brand-200/50 border border-white/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <FileText className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-brand-600" />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-1">Improve Plan</h2>
              <div className="text-lg font-bold opacity-80">深度對接與資源整合報告</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="px-5 py-2.5 bg-white/40 rounded-2xl text-sm font-black backdrop-blur-md border border-white/60 text-brand-900 shadow-sm">
              個案類型：{report.quadrant.name}
            </div>
            <div className="px-5 py-2.5 bg-white/40 rounded-2xl text-sm font-black backdrop-blur-md border border-white/60 text-brand-900 shadow-sm">
              建議路徑：{report.recommendedPath}
            </div>
          </div>
          <p className="text-brand-900 text-xl leading-relaxed font-bold">
            {report.summary}
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit mx-auto sticky top-20 z-40 shadow-sm border border-slate-200">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'analysis' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BarChart3 className="w-4 h-4" /> 現況評估與分群
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'steps' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <ListOrdered className="w-4 h-4" /> 對接路徑與清單
        </button>
        <button
          onClick={() => setActiveTab('mindmap')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'mindmap' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Network className="w-4 h-4" /> 資源整合地圖
        </button>
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
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-600" />
                  六邊形能力雷達圖
                </h3>
                <RadarChart data={report.radarData} />
              </div>
              
              <div className="space-y-6">
                <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 h-1/2 flex flex-col justify-center">
                  <h4 className="text-emerald-700 text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" /> 三大優勢
                  </h4>
                  <ul className="space-y-3">
                    {report.strengths.map(s => (
                      <li key={s} className="text-emerald-800 text-lg font-medium flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 h-1/2 flex flex-col justify-center">
                  <h4 className="text-rose-700 text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingDown className="w-6 h-6" /> 三大困境
                  </h4>
                  <ul className="space-y-3">
                    {report.weaknesses.map(w => (
                      <li key={w} className="text-rose-800 text-lg font-medium flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500" /> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Row 2: Four-Quadrant Capability Model (Full Width) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="mb-16">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Network className="w-5 h-5 text-brand-600" />
                  四象限能力分群模型 (分流判讀)
                </h3>
                <p className="text-slate-500 text-sm font-medium ml-7">評估身心障礙者評估與處置之平台整合</p>
              </div>
              
              <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Left: The Chart (Span 7) */}
                <div className="lg:col-span-7 space-y-12">
                  <div className="relative aspect-square bg-white rounded-[48px] border-2 border-slate-100 p-16 shadow-2xl mx-auto w-full max-w-[600px] group/chart">
                    {/* Quadrant Background Colors with subtle gradients */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-[0.08] pointer-events-none rounded-[48px] overflow-hidden">
                      <div className="bg-gradient-to-br from-blue-400 to-blue-600 border-r border-b border-slate-200" />
                      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 border-b border-slate-200" />
                      <div className="bg-gradient-to-br from-rose-400 to-rose-600 border-r border-slate-200" />
                      <div className="bg-gradient-to-br from-amber-400 to-amber-600" />
                    </div>

                    {/* Grid Lines & Axes */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Main Axes */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-900 rounded-l-[48px]" />
                      <div className="absolute left-0 right-0 bottom-0 h-2 bg-slate-900 rounded-b-[48px]" />
                      
                      {/* Reference Lines */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400/50 border-l border-dashed" />
                      <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-400/50 border-t border-dashed" />
                    </div>
                    
                    {/* X-Axis Scale */}
                    <div className="absolute -bottom-12 left-0 right-0 flex justify-between px-2 text-[13px] font-black text-slate-900 z-20">
                      <div className="flex flex-col items-start translate-y-2">
                        <div className="w-1 h-4 bg-slate-900 mb-2 rounded-full" />
                        <span className="bg-white px-4 py-1.5 rounded-2xl border-2 border-rose-100 shadow-lg text-rose-600 whitespace-nowrap">0 (低發展)</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-1 h-8 bg-brand-600 mb-2 rounded-full" />
                        <span className="bg-brand-600 text-white px-5 py-1.5 rounded-full shadow-xl ring-4 ring-white whitespace-nowrap">中位線 2.5</span>
                      </div>
                      <div className="flex flex-col items-end translate-y-2">
                        <div className="w-1 h-4 bg-slate-900 mb-2 rounded-full" />
                        <span className="bg-white px-4 py-1.5 rounded-2xl border-2 border-emerald-100 shadow-lg text-emerald-600 whitespace-nowrap">5 (高發展)</span>
                      </div>
                    </div>

                    {/* Y-Axis Scale */}
                    <div className="absolute -left-32 top-0 bottom-0 flex flex-col justify-between py-2 text-[13px] font-black text-slate-900 items-end pr-8 z-20">
                      <div className="flex items-center gap-4 translate-x-2">
                        <span className="bg-white px-4 py-1.5 rounded-2xl border-2 border-emerald-100 shadow-lg text-emerald-600 whitespace-nowrap">5 (高穩定)</span>
                        <div className="w-4 h-1 bg-slate-900 rounded-full" />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-brand-600 text-white px-5 py-1.5 rounded-full shadow-xl ring-4 ring-white whitespace-nowrap">中位線 2.5</span>
                        <div className="w-8 h-1 bg-brand-600 rounded-full" />
                      </div>
                      <div className="flex items-center gap-4 translate-x-2">
                        <span className="bg-white px-4 py-1.5 rounded-2xl border-2 border-rose-100 shadow-lg text-rose-600 whitespace-nowrap">0 (低穩定)</span>
                        <div className="w-4 h-1 bg-slate-900 rounded-full" />
                      </div>
                    </div>

                    {/* Axis Titles with Icons */}
                    <div className="absolute -top-12 left-0">
                      <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-xl z-30 flex items-center gap-2 ring-4 ring-white">
                        <div className="p-1 bg-brand-500 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black tracking-tight leading-none">照顧穩定度</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Stability Index ↑</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-28">
                      <div className="bg-slate-900 text-white px-6 py-2 rounded-2xl shadow-xl z-30 flex items-center gap-3 ring-4 ring-white">
                        <div className="p-1 bg-amber-500 rounded-lg">
                          <Zap className="w-4 h-4 text-white" />
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
                        <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center border-2 border-emerald-200 shadow-sm">
                          <Target className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-[16px] font-black text-emerald-900 bg-white/95 px-5 py-2 rounded-2xl border-2 border-emerald-100 shadow-xl">IV. 穩定預防</div>
                      </div>
                    </div>
                    <div className="absolute top-12 left-12 text-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center border-2 border-orange-200 shadow-sm">
                          <Home className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-[16px] font-black text-orange-900 bg-white/95 px-5 py-2 rounded-2xl border-2 border-orange-100 shadow-xl">II. 家庭可撐</div>
                      </div>
                    </div>
                    <div className="absolute bottom-12 right-12 text-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center border-2 border-amber-200 shadow-sm">
                          <Lightbulb className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="text-[16px] font-black text-amber-900 bg-white/95 px-5 py-2 rounded-2xl border-2 border-amber-100 shadow-xl">III. 高潛力孤立</div>
                      </div>
                    </div>
                    <div className="absolute bottom-12 left-12 text-center z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center border-2 border-rose-200 shadow-sm">
                          <ShieldAlert className="w-6 h-6 text-rose-600" />
                        </div>
                        <div className="text-[16px] font-black text-rose-900 bg-white/95 px-5 py-2 rounded-2xl border-2 border-rose-100 shadow-xl">I. 高度依賴</div>
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
                      <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20 scale-150" />
                      <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-30 group-hover/point:opacity-50 transition-opacity" />
                      <div className="w-12 h-12 bg-brand-600 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center relative z-10 group-hover/point:scale-110 transition-transform">
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

                  {/* Score Summary Cards - Arranged Downwards/Structured */}
                  <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto mt-36">
                    <div className="p-8 bg-white rounded-[32px] border-2 border-slate-100 shadow-sm flex items-center justify-between group hover:border-brand-200 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-brand-50 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <TrendingUp className="w-8 h-8 text-brand-600" />
                        </div>
                        <div>
                          <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Y軸：照顧穩定度評分</div>
                          <div className="text-sm text-slate-600 font-medium">家庭支持系統 × 個人自理能力</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-slate-900">{report.quadrant.stability.toFixed(1)}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">/ 5.0 滿分</div>
                      </div>
                    </div>
                    <div className="p-8 bg-white rounded-[32px] border-2 border-slate-100 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">X軸：自立發展度評分</div>
                          <div className="text-sm text-slate-600 font-medium">工作能力 × 發展意願 × 經濟基礎</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-slate-900">{report.quadrant.development.toFixed(1)}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">/ 5.0 滿分</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Details (Span 5) */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="p-8 bg-brand-50 rounded-[40px] border-2 border-brand-100 relative overflow-hidden shadow-sm">
                    <div className="absolute -top-4 -right-4 p-4 opacity-5">
                      <Network className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-5 h-5 rounded-full shadow-md ring-4 ring-white ${
                        report.quadrant.id === 'I' ? 'bg-rose-500' :
                        report.quadrant.id === 'II' ? 'bg-orange-500' :
                        report.quadrant.id === 'III' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div className="text-xl font-black text-brand-900 uppercase tracking-tighter">當前落點：第 {report.quadrant.id} 象限</div>
                    </div>
                    <h4 className="text-2xl font-black text-brand-800 mb-4">{report.quadrant.name}</h4>
                    <p className="text-base text-brand-700 leading-relaxed font-medium">{report.quadrant.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">分流定義與資源導向</h5>
                    {[
                      { id: 'IV', name: '穩定預防型', color: 'bg-emerald-500', desc: '高功能 × 高支持。重點在於優化生活品質與持續發展。', action: '社區參與、自立生活、就業發展' },
                      { id: 'III', name: '高潛力孤立型', color: 'bg-amber-500', desc: '高功能 × 低支持。具備發展潛力但生活基礎不足，平台最關鍵族群。', action: '職業重建、經濟支持、社會支持' },
                      { id: 'II', name: '家庭可撐型', color: 'bg-orange-500', desc: '低功能 × 高支持。重點在於減輕家庭照顧負擔。', action: '長照與家庭支援、輔具與環境' },
                      { id: 'I', name: '高度依賴區', color: 'bg-rose-500', desc: '低功能 × 低支持。立即整合資源型，優先穩定生活與醫療。', action: '醫療整合、長期照護、經濟補助' }
                    ].map(q => (
                      <div key={q.id} className={`p-5 rounded-3xl border-2 transition-all duration-300 ${
                        report.quadrant.id === q.id 
                          ? 'bg-white border-brand-200 shadow-xl scale-[1.03] z-10' 
                          : 'bg-slate-50/30 border-slate-100 opacity-50 grayscale-[0.5]'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl ${q.color} text-white flex items-center justify-center font-black text-sm shadow-sm`}>{q.id}</div>
                            <span className="text-sm font-black text-slate-800">{q.name}</span>
                          </div>
                          {report.quadrant.id === q.id && (
                            <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-1 rounded-md uppercase">Current</span>
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
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Referral Summary */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-brand-600" />
                  轉介摘要與行動目標
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">核心改善目標</h4>
                    <div className="space-y-2">
                      {report.actionPlan.referralSummary.goals.map((goal, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-brand-50 rounded-xl text-brand-800 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">主要面臨困境</h4>
                    <div className="space-y-2">
                      {report.actionPlan.referralSummary.keyDifficulties.map((diff, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl text-rose-800 text-sm font-medium">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {diff}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-800">
                  <ListOrdered className="w-6 h-6 text-brand-600" />
                  <h3 className="text-xl font-bold">你可以啟動的資源類型</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {report.resourceCategories.map((category, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        {category.title}
                      </h4>
                      <ul className="space-y-2">
                        {category.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-slate-600 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Document Checklist */}
              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-400" />
                  文件準備清單
                </h3>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  提前準備以下文件，可降低制度摩擦成本，減少補件往返。
                </p>
                <div className="space-y-3">
                  {report.actionPlan.documentChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-5 h-5 rounded bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-800">
                <MapPin className="w-6 h-6 text-brand-600" />
                <h3 className="text-xl font-bold">資源地圖</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">中央政府資源</h4>
                  <div className="space-y-4">
                    {report.resources.central.map((res, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-slate-800 font-bold text-sm">{res.title}</div>
                          {res.link && <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-brand-500" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase">{res.agency}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">地方執行窗口</h4>
                  <div className="space-y-4">
                    {report.resources.local.map((res, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-slate-800 font-bold text-sm">{res.title}</div>
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-brand-500" />
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase">{res.agency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tracking & Feedback Section */}
              <div className="bg-emerald-900 p-8 rounded-3xl text-white shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  對接追蹤與回饋
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm">個案同意並產出轉介資料</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-sm">指派對接角色與協助預約</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 opacity-50">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-sm">回填對接狀態與定期追蹤</span>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold transition-colors text-sm">
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
