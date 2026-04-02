import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntakeForm } from './components/IntakeForm';
import { ReportView } from './components/ReportView';
import { Flowchart } from './components/Flowchart';
import { PlatformSOP } from './components/PlatformSOP';
import { StatsDashboard } from './components/StatsDashboard';
import { AdminLogin } from './components/AdminLogin';
import { IntakeData, AnalysisReport } from './types';
import { analyzeIntake } from './services/engine';
import { Shield, Users, Zap, Heart, BarChart3, ChevronRight, Sparkles, Clock3, Menu, X } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'landing' | 'intake' | 'report' | 'stats'>('landing');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const startEvaluation = () => {
    setStartTime(Date.now());
    setView('intake');
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: 'core-philosophy' | 'resource-map') => {
    setView('landing');
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleComplete = async (data: IntakeData) => {
    const durationMs = startTime ? Date.now() - startTime : 0;
    
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ durationMs, data }),
      });
    } catch (error) {
      console.error('Failed to save submission statistics:', error);
    }

    const result = analyzeIntake(data);
    setReport(result);
    setView('report');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-100 selection:text-brand-700">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-10 h-10 bg-cis-gradient rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="w-6 h-6 text-brand-600 fill-brand-600/20" />
              </div>
              <span className="text-xl font-black tracking-tight text-brand-800">有愛無礙</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
              <button 
                onClick={() => scrollToSection('core-philosophy')}
                className="hover:text-brand-600 transition-colors"
              >
                核心理念
              </button>
              <button 
                onClick={() => scrollToSection('resource-map')}
                className="hover:text-brand-600 transition-colors"
              >
                資源地圖
              </button>
              <button 
                onClick={() => setView('stats')}
                className="flex items-center gap-1.5 text-slate-500 hover:text-brand-600 transition-colors"
                title="系統統計"
              >
                <BarChart3 className="w-4 h-4" />
                <span>統計</span>
              </button>
              <button 
                onClick={startEvaluation}
                className="px-6 py-2.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 active:scale-95"
              >
                立即開始
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
              aria-label="切換選單"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-brand-100 space-y-2 text-sm font-bold">
              <button onClick={() => scrollToSection('core-philosophy')} className="w-full text-left px-2 py-2 rounded-lg hover:bg-brand-50 text-slate-600 hover:text-brand-700">核心理念</button>
              <button onClick={() => scrollToSection('resource-map')} className="w-full text-left px-2 py-2 rounded-lg hover:bg-brand-50 text-slate-600 hover:text-brand-700">資源地圖</button>
              <button onClick={() => { setView('stats'); setMobileMenuOpen(false); }} className="w-full text-left px-2 py-2 rounded-lg hover:bg-brand-50 text-slate-600 hover:text-brand-700">系統統計</button>
              <button onClick={startEvaluation} className="w-full mt-2 px-4 py-3 bg-brand-600 text-white rounded-xl text-center">立即開始</button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              {/* Hero Section */}
              <div className="text-center max-w-4xl mx-auto space-y-8 relative">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-200/30 blur-3xl rounded-full -z-10" />
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-bold tracking-wide uppercase border border-brand-200"
                >
                  <Sparkles className="w-4 h-4" />
                  2025 基隆市身障平台支持整合計畫
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                  <span className="text-slate-900">打造</span>
                  <span className="text-cis-gradient"> 有愛無礙 </span>
                  <br />
                  <span className="text-slate-900">的友善城市</span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-bold">
                  評估身心障礙者評估與處置之平台整合。
                </p>
                
                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                  不再迷失於繁雜的制度。我們透過能力導向評估，為您打通醫療、長照、身障與就業的每一個環節，建立溫暖的社會對接路徑。
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={startEvaluation}
                    className="w-full sm:w-auto px-10 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/30 active:scale-95 flex items-center justify-center gap-2"
                  >
                    開始個人化評估 <Zap className="w-5 h-5 fill-white" />
                  </button>
                  <button 
                    onClick={() => scrollToSection('core-philosophy')}
                    className="w-full sm:w-auto px-10 py-4 bg-white text-brand-700 border border-brand-200 rounded-2xl font-bold text-lg hover:bg-brand-50 transition-all"
                  >
                    了解核心理念
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-left pt-3">
                  {[
                    { title: '3 分鐘完成', desc: '問卷精簡，快速得到建議', icon: Clock3 },
                    { title: '跨域整合', desc: '醫療・長照・就業一次串接', icon: Users },
                    { title: '行動清單', desc: '明確下一步，避免資源迷航', icon: ChevronRight }
                  ].map((item, idx) => (
                    <div key={idx} className="hero-metric-card">
                      <item.icon className="w-5 h-5 text-brand-600 mb-2" />
                      <h3 className="font-black text-slate-800">{item.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Philosophy Section */}
              <div id="core-philosophy" className="py-12 scroll-mt-20">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">核心理念</h2>
                  <div className="w-16 h-1.5 bg-brand-500 rounded-full mx-auto mb-6" />
                  <p className="text-xl text-slate-600 font-bold max-w-2xl mx-auto leading-relaxed">
                    以人為本，能力導向。<br className="hidden sm:block" />
                    我們相信每個人都擁有自立生活的潛力。
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {[
                    {
                      title: '整合取代零散',
                      desc: '打破醫療、長照、社政與勞政的制度藩籬，建立單一入口、無縫接軌的支持網絡，讓資源不再碎片化。',
                      icon: <Users className="w-6 h-6 text-blue-600" />,
                      color: 'bg-blue-50 border-blue-100'
                    },
                    {
                      title: '賦能取代依賴',
                      desc: '著重於個案的優勢與潛能，透過精準的資源對接，協助身心障礙者重建生活自理與社會參與能力。',
                      icon: <Zap className="w-6 h-6 text-amber-600" />,
                      color: 'bg-amber-50 border-amber-100'
                    },
                    {
                      title: '家庭支持為基石',
                      desc: '減輕照顧者的負擔，提供喘息與支持服務，讓家庭成為最穩固的後盾，實現照顧者與被照顧者的雙贏。',
                      icon: <Heart className="w-6 h-6 text-rose-600" />,
                      color: 'bg-rose-50 border-rose-100'
                    },
                    {
                      title: '預防與發展並重',
                      desc: '不僅解決眼前的困難，更著眼於未來的潛力發展，從被動接受照顧轉向主動參與社會，實現真正的「有愛無礙」。',
                      icon: <Shield className="w-6 h-6 text-emerald-600" />,
                      color: 'bg-emerald-50 border-emerald-100'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-8 rounded-[32px] border-2 ${item.color} flex gap-6 hover:scale-[1.02] transition-transform duration-300`}>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">{item.title}</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flowchart Section */}
              <div id="resource-map" className="space-y-8 scroll-mt-20">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-slate-800">全生命歷程路徑圖</h2>
                  <p className="text-slate-500 mt-2">打通每一個環節，讓資源真正到位</p>
                </div>
                <Flowchart />
              </div>

              {/* Platform SOP Section */}
              <PlatformSOP />

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: '起點引導', desc: '解決「不知道該不該辦身障證明」的焦慮。', icon: Zap, color: 'bg-amber-50 text-amber-600' },
                  { title: '能力導向', desc: '先優化能力，再考慮機構，讓每個人都能自立生活。', icon: Heart, color: 'bg-rose-50 text-rose-600' },
                  { title: '整合報告', desc: '一次填寫，得到清楚的下一步行動清單與資源地圖。', icon: Users, color: 'bg-brand-50 text-brand-600' },
                ].map((f, i) => (
                  <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-6`}>
                      <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{f.desc}</p>
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
              className="py-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">個人化需求評估</h2>
                <p className="text-slate-500 mt-2">只需 3 分鐘，為您規劃最適路徑</p>
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

          {view === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {!adminToken ? (
                <AdminLogin onLogin={setAdminToken} />
              ) : (
                <StatsDashboard token={adminToken} onLogout={() => setAdminToken(null)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">有愛無礙</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">隱私權政策</a>
              <a href="#" className="hover:text-white transition-colors">服務條款</a>
              <a href="#" className="hover:text-white transition-colors">聯繫我們</a>
            </div>
            <p className="text-sm">© 2024 有愛無礙 Pilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
