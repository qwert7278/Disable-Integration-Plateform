import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntakeData, DisabilityStatus } from '../types';
import { ChevronRight, ChevronLeft, Star, Info, User, Users, Heart, Stethoscope, Home, Briefcase, Smile, HelpCircle, Activity } from 'lucide-react';
import { TAIWAN_CITIES, HOUSING_TYPES } from '../constants';

interface Props {
  onComplete: (data: IntakeData) => void;
}

const ScoreButtons: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const anchors = [
    "完全無法/需要完全依賴",
    "幾乎無法",
    "需要大量協助",
    "部分可自行完成",
    "大致可自行完成",
    "完全可以自己完成"
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4, 5].map(v => (
          <div key={v} className="group relative flex flex-col items-center">
            <button
              type="button"
              onClick={() => onChange(v)}
              className={`w-10 h-10 rounded-lg border transition-all flex items-center justify-center font-bold ${
                value === v ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20' : 'bg-white text-slate-400 border-slate-200 hover:border-brand-300'
              }`}
            >
              {v}
            </button>
            <div className="absolute top-full mt-2 w-24 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-tight">
              {anchors[v]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IntakeForm: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IntakeData>({
    respondentType: 'family',
    currentStage: 'home-awhile',
    primaryConcern: 'unknown',
    age: '',
    city: '基隆市',
    district: '',
    education: 'university',
    livingStatus: 'with-family',
    source: 'disease',
    onsetTime: 'recovery',
    hasCertificate: 'unsure',
    certificateDetails: { degree: 'mild', number: '', category: '' },
    travelCardStatus: 'none',
    condition: 'stroke',
    considerWork: 'maybe',
    physical: { indoorMobility: 3, outdoorMobility: 3, transfer: 3, balance: 3, endurance: 3, chronicControl: 3, pain: 5, rehabStatus: 3 },
    selfCare: { eating: 3, bathing: 3, toileting: 3, dressing: 3, medication: 3, housework: 3, errands: 3 },
    cognition: { orientation: 3, memory: 3, judgment: 3, expression: 3, comprehension: 3, mood: 3, mobileUse: 3, computerUse: 3, aiUsage: 3, learningAbility: 3, softwareUsage: 3 },
    economy: { skills: 3, intent: 3, capacity: 3, remoteFeasibility: 3, supportNeeds: 3, economicRole: 3, economicPressure: 3, welfareStatus: 3 },
    family: { cohabitants: 3, caregiverHealth: 3, careHours: 3, familyAttitude: 3, resourceKnowledge: 3, familyConflict: 5, emergencyBackup: 3 },
    social: { socialSupport: 3, communityParticipation: 3, isolation: 5, lifeGoals: 3, selfEfficacy: 3, sleep: 3, emotionalDistress: 5 },
    housingType: 'elevator',
    accessibility: { 
      bathroom: true, threshold: true, aisle: true, bedside: true, entrance: true, 
      kitchen: false, bedroom: true, livingRoom: true,
      smartHome: false, overallBarrier: 5,
      outdoorRamp: true, outdoorElevator: true, outdoorSidewalk: true, outdoorLighting: true,
      exitDifficulty: false, streetDifficulty: false,
      appointmentService: false, iBusApp: false
    },
    transportation: { score: 3, mobilityAid: 'none', bus: true, mrt: false, train: false, taxi: true, travelCard: false }
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);
  const totalSteps = 9;

  const updateNested = (category: keyof IntakeData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      <div className="bg-brand-50/50 px-8 py-4 border-b border-brand-100 flex justify-between items-center">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${step >= i + 1 ? 'bg-cis-gradient shadow-sm' : 'bg-slate-200'}`} />
          ))}
        </div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">步驟 {step} / {totalSteps}</span>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">了解您的需求</h2>
                <p className="text-slate-500 font-medium">在開始之前，我們先簡單了解您的現況，以便提供更精準的導航建議。</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                    1. 您目前填寫的身份是？
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: '本人', value: 'self', icon: User },
                      { label: '家屬', value: 'family', icon: Users },
                      { label: '其他協助者', value: 'other', icon: Heart }
                    ].map(v => (
                      <button 
                        key={v.value} 
                        onClick={() => setData({ ...data, respondentType: v.value as any })} 
                        className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 transition-all gap-3 ${
                          data.respondentType === v.value 
                            ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-md shadow-brand-500/10' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-200 hover:bg-slate-50'
                        }`}
                      >
                        <v.icon className={`w-8 h-8 ${data.respondentType === v.value ? 'text-brand-600' : 'text-slate-300'}`} />
                        <span className="font-bold">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                    2. 目前大概在哪個階段？
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: '還在住院中', value: 'hospitalized', icon: Stethoscope },
                      { label: '剛出院回到家', value: 'just-discharged', icon: Home },
                      { label: '已經在家一段時間', value: 'home-awhile', icon: Activity },
                      { label: '生活大致穩定', value: 'stable', icon: Smile },
                      { label: '想開始規劃工作/重返社會', value: 'planning-work', icon: Briefcase }
                    ].map(v => (
                      <button 
                        key={v.value} 
                        onClick={() => setData({ ...data, currentStage: v.value as any })} 
                        className={`flex items-center p-4 rounded-2xl border-2 transition-all gap-4 ${
                          data.currentStage === v.value 
                            ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-md shadow-brand-500/10' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.currentStage === v.value ? 'bg-brand-100' : 'bg-slate-50'}`}>
                          <v.icon className={`w-6 h-6 ${data.currentStage === v.value ? 'text-brand-600' : 'text-slate-400'}`} />
                        </div>
                        <span className="font-bold">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                    3. 您現在最想先解決什麼？
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: '我不知道回家後要怎麼照顧', value: 'care', icon: Heart },
                      { label: '我現在很多日常事情做不了', value: 'daily-life', icon: Home },
                      { label: '我在溝通或理解上有困難', value: 'cognition', icon: Smile },
                      { label: '我在想未來能不能工作或賺錢', value: 'work-economy', icon: Briefcase },
                      { label: '家裡照顧壓力很大', value: 'family-pressure', icon: Users },
                      { label: '我最近情緒或生活很悶', value: 'social-emotional', icon: Activity },
                      { label: '我出門或家裡環境不方便', value: 'housing-transport', icon: Home },
                      { label: '我真的不知道從哪開始', value: 'unknown', icon: HelpCircle }
                    ].map(v => (
                      <button 
                        key={v.value} 
                        onClick={() => setData({ ...data, primaryConcern: v.value as any })} 
                        className={`flex items-center p-4 rounded-2xl border-2 transition-all gap-4 ${
                          data.primaryConcern === v.value 
                            ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-md shadow-brand-500/10' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-brand-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.primaryConcern === v.value ? 'bg-brand-100' : 'bg-slate-50'}`}>
                          <v.icon className={`w-5 h-5 ${data.primaryConcern === v.value ? 'text-brand-600' : 'text-slate-400'}`} />
                        </div>
                        <span className="font-bold text-sm">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">1. 基本資料與制度狀態</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">年齡</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200" value={data.age} onChange={e => setData({ ...data, age: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">居住縣市</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" 
                    value={data.city} 
                    onChange={e => setData({ ...data, city: e.target.value })}
                  >
                    {TAIWAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">教育程度</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white" 
                  value={data.education} 
                  onChange={e => setData({ ...data, education: e.target.value as any })}
                >
                  {[
                    { label: '不識字', value: 'none' },
                    { label: '國小', value: 'primary' },
                    { label: '國中', value: 'junior-high' },
                    { label: '高中/職', value: 'senior-high' },
                    { label: '大學/專科', value: 'university' },
                    { label: '研究所及以上', value: 'graduate' }
                  ].map(edu => (
                    <option key={edu.value} value={edu.value}>{edu.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">失能/障礙來源</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '先天', value: 'congenital' },
                    { label: '後天疾病', value: 'disease' },
                    { label: '意外', value: 'accident' },
                    { label: '職災', value: 'occupational' },
                    { label: '老化', value: 'aging' }
                  ].map(v => (
                    <button key={v.value} onClick={() => setData({ ...data, source: v.value as any })} className={`py-2 rounded-xl border text-sm ${data.source === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">身障證明狀態</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '無', value: 'none' },
                    { label: '知道但未辦', value: 'unsure' },
                    { label: '申請過未通過', value: 'failed' },
                    { label: '已持證', value: 'yes' }
                  ].map(v => (
                    <button key={v.value} onClick={() => setData({ ...data, hasCertificate: v.value as any })} className={`py-2 rounded-xl border text-sm ${data.hasCertificate === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {data.hasCertificate === 'yes' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  className="space-y-4 pt-4 border-t border-slate-100"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">身障等級</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '輕度', value: 'mild' },
                        { label: '中度', value: 'moderate' },
                        { label: '重度', value: 'severe' },
                        { label: '極重度', value: 'profound' }
                      ].map(v => (
                        <button 
                          key={v.value} 
                          onClick={() => setData({ ...data, certificateDetails: { ...data.certificateDetails!, degree: v.value as any } })} 
                          className={`py-2 rounded-xl border text-xs ${data.certificateDetails?.degree === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">證明編號</label>
                      <input 
                        type="text" 
                        placeholder="例：12345678"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" 
                        value={data.certificateDetails?.number} 
                        onChange={e => setData({ ...data, certificateDetails: { ...data.certificateDetails!, number: e.target.value } })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">障礙類別 (ICF)</label>
                      <input 
                        type="text" 
                        placeholder="例：第一類"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm" 
                        value={data.certificateDetails?.category} 
                        onChange={e => setData({ ...data, certificateDetails: { ...data.certificateDetails!, category: e.target.value } })} 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-sm font-semibold text-slate-600">愛心悠遊卡/博愛卡狀態</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '未辦理', value: 'none' },
                    { label: '辦理中', value: 'applying' },
                    { label: '已領取', value: 'yes' }
                  ].map(v => (
                    <button key={v.value} onClick={() => setData({ ...data, travelCardStatus: v.value as any })} className={`py-2 rounded-xl border text-sm ${data.travelCardStatus === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">2. 身體狀況評估</h2>
              <div className="space-y-4">
                {[
                  { label: '在家裡的移動情形', key: 'indoorMobility' },
                  { label: '外出的移動情形', key: 'outdoorMobility' },
                  { label: '從床到椅子/馬桶的移位', key: 'transfer' },
                  { label: '平衡穩定度 (是否容易跌倒)', key: 'balance' },
                  { label: '耐力 (走或站的持久度)', key: 'endurance' },
                  { label: '如果沒有人幫忙，你能不能知道或管理自己的血壓、血糖等狀況？', key: 'chronicControl' },
                  { label: '疼痛控制穩定度 (0:極痛, 5:無痛)', key: 'pain' },
                  { label: '復健或運動的規律性', key: 'rehabStatus' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.physical as any)[q.key]} onChange={v => updateNested('physical', q.key, v)} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">3. 日常生活自理能力</h2>
              <div className="space-y-4">
                {[
                  { label: '自行進食', key: 'eating' },
                  { label: '自行洗澡', key: 'bathing' },
                  { label: '自行上廁所', key: 'toileting' },
                  { label: '自行穿脫衣服', key: 'dressing' },
                  { label: '按時吃藥與藥物管理', key: 'medication' },
                  { label: '處理家事或準備餐點', key: 'housework' },
                  { label: '出門處理日常事務 (如：買東西、繳費)', key: 'errands' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.selfCare as any)[q.key]} onChange={v => updateNested('selfCare', q.key, v)} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">4. 認知、溝通與數位能力</h2>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">1</span>
                    認知與情緒穩定
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: '能否記得最近發生的事', key: 'memory' },
                      { label: '能否清楚今天日期與自己在哪裡', key: 'orientation' },
                      { label: '日常生活遇到事情時，你能不能自己判斷怎麼做？', key: 'judgment' },
                      { label: '情緒與行為是否穩定', key: 'mood' },
                    ].map(q => (
                      <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-sm font-medium text-slate-700">{q.label}</span>
                        <ScoreButtons value={(data.cognition as any)[q.key]} onChange={v => updateNested('cognition', q.key, v)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">2</span>
                    溝通與數位工具
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: '清楚表達自己的需求', key: 'expression' },
                      { label: '理解他人說明的內容', key: 'comprehension' },
                      { label: '手機使用能力 (如：聯絡、查資料)', key: 'mobileUse' },
                      { label: '電腦或平板使用能力', key: 'computerUse' },
                      { label: '未來是否願意嘗試用語音助理或AI工具幫助生活？', key: 'aiUsage' },
                      { label: '學習新事物或新軟體的意願', key: 'learningAbility' },
                    ].map(q => (
                      <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-sm font-medium text-slate-700">{q.label}</span>
                        <ScoreButtons value={(data.cognition as any)[q.key]} onChange={v => updateNested('cognition', q.key, v)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">5. 工作與經濟能力</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 space-y-3">
                  <label className="text-sm font-bold text-brand-800 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    您目前是否考慮重新工作或參與社會活動？
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: '有，想規劃', value: 'yes' },
                      { label: '可能會', value: 'maybe' },
                      { label: '暫時沒有', value: 'no' },
                      { label: '目前無法考慮', value: 'later' }
                    ].map(v => (
                      <button key={v.value} onClick={() => setData({ ...data, considerWork: v.value as any })} className={`py-2 px-3 rounded-xl border text-xs transition-all ${data.considerWork === v.value ? 'bg-brand-500 border-brand-600 text-white font-bold' : 'bg-white border-brand-200 text-brand-600 hover:border-brand-400'}`}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {(data.considerWork === 'yes' || data.considerWork === 'maybe') ? (
                    <>
                      {[
                        { label: '目前的技能等級與經驗', key: 'skills' },
                        { label: '重返工作的意願', key: 'intent' },
                        { label: '目前的體力與工作負荷能力', key: 'capacity' },
                        { label: '在家或遠距工作的可行性', key: 'remoteFeasibility' },
                        { label: '工作中需要的協助程度 (0:極高需求, 5:不需協助)', key: 'supportNeeds' },
                      ].map(q => (
                        <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <span className="text-sm font-medium text-slate-700">{q.label}</span>
                          <ScoreButtons value={(data.economy as any)[q.key]} onChange={v => updateNested('economy', q.key, v)} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-500 text-sm italic">已為您跳過細節工作評估。若未來有需要，隨時可於報告中重新評估。</p>
                    </div>
                  )}

                  <hr className="border-slate-100" />
                  
                  {[
                    { label: '目前生活費主要是靠自己還是他人？', key: 'economicRole' },
                    { label: '經濟可承受度 (0:極大壓力, 5:無壓力)', key: 'economicPressure' },
                    { label: '目前是否有領取政府補助（如低收、中低收或其他補助）？', key: 'welfareStatus' },
                  ].map(q => (
                    <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-sm font-medium text-slate-700">{q.label}</span>
                      <ScoreButtons value={(data.economy as any)[q.key]} onChange={v => updateNested('economy', q.key, v)} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">6. 家庭支持情況</h2>
              <div className="space-y-4">
                {[
                  { label: '家裡有人願意持續幫忙照顧您嗎？', key: 'cohabitants' },
                  { label: '主要照顧者的身體健康狀況', key: 'caregiverHealth' },
                  { label: '平均每天大約有人能陪伴/照顧幾小時？', key: 'careHours' },
                  { label: '家人是否支持尋求外部幫助（例如申請服務或找專業協助）？', key: 'familyAttitude' },
                  { label: '家人是否知道去哪裡找相關資源？', key: 'resourceKnowledge' },
                  { label: '家庭互動穩定度 (0:嚴重, 5:無)', key: 'familyConflict' },
                  { label: '若主要照顧者突然不能幫忙，是否有其他人可支援？', key: 'emergencyBackup' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.family as any)[q.key]} onChange={v => updateNested('family', q.key, v)} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">7. 心情與社交生活</h2>
              <div className="space-y-4">
                {[
                  { label: '平常是否常與朋友、家人或他人互動？', key: 'socialSupport' },
                  { label: '最近是否有參與外出活動、興趣或社區事務？', key: 'communityParticipation' },
                  { label: '你平常會不會很少和人說話或互動？', key: 'isolation' },
                  { label: '覺得人生目前是否有明確目標或想做的事？', key: 'lifeGoals' },
                  { label: '覺得自己是否有能力讓生活變好 (自我效能)？', key: 'selfEfficacy' },
                  { label: '最近的睡眠品質狀況', key: 'sleep' },
                  { label: '情緒穩定程度 (0:嚴重, 5:無)', key: 'emotionalDistress' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.social as any)[q.key]} onChange={v => updateNested('social', q.key, v)} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 9 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">8. 居住環境與交通方便性</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">住家型態 (是否有電梯/出入方便性)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {HOUSING_TYPES.map(v => (
                      <button key={v.value} onClick={() => setData({ ...data, housingType: v.value as any })} className={`py-2 px-3 rounded-xl border text-sm text-left transition-all ${data.housingType === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500 hover:border-brand-200'}`}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
                  <label className="text-sm font-bold text-blue-800 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    你會不會因為家裡或外出環境不方便，而減少活動？
                  </label>
                  <ScoreButtons value={data.accessibility.overallBarrier} onChange={v => updateNested('accessibility', 'overallBarrier', v)} />
                  <div className="flex justify-between px-1 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                    <span>0: 經常因此不敢活動</span>
                    <span>5: 完全不會，環境很友善</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">居家無障礙 (室內空間)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: '浴廁安全設施', key: 'bathroom' },
                        { label: '全室無門檻', key: 'threshold' },
                        { label: '走道寬敞可迴轉', key: 'aisle' },
                        { label: '床邊安全扶手', key: 'bedside' },
                        { label: '出入口無障礙', key: 'entrance' },
                        { label: '廚房無障礙', key: 'kitchen' },
                        { label: '臥室無障礙', key: 'bedroom' },
                        { label: '客廳無障礙', key: 'livingRoom' },
                        { label: '智慧家居設備', key: 'smartHome' }
                      ].map(q => (
                        <button key={q.key} onClick={() => updateNested('accessibility', q.key, !(data.accessibility as any)[q.key])} className={`py-2 px-3 rounded-xl border text-left text-sm flex items-center justify-between transition-all ${(data.accessibility as any)[q.key] ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 text-slate-500 hover:border-emerald-200'}`}>
                          {q.label}
                          {(data.accessibility as any)[q.key] && <Star className="w-4 h-4 fill-emerald-500" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">室外外出便利性</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { label: '門口設有斜坡', key: 'outdoorRamp' },
                        { label: '社區具備電梯', key: 'outdoorElevator' },
                        { label: '周邊人行道平整', key: 'outdoorSidewalk' },
                        { label: '夜間照明充足', key: 'outdoorLighting' },
                        { label: '進出門口困難', key: 'exitDifficulty', warning: true },
                        { label: '到街道不便', key: 'streetDifficulty', warning: true },
                        { label: '具備預約接送服務', key: 'appointmentService' },
                        { label: '會用公車預約App', key: 'iBusApp' }
                      ].map(q => (
                        <button 
                          key={q.key} 
                          onClick={() => updateNested('accessibility', q.key, !(data.accessibility as any)[q.key])} 
                          className={`py-2 px-3 rounded-xl border text-left text-sm flex items-center justify-between transition-all ${
                            (data.accessibility as any)[q.key] 
                              ? q.warning ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold' : 'bg-blue-50 border-blue-500 text-blue-700 font-bold' 
                              : 'border-slate-200 text-slate-500 hover:border-blue-200'
                          }`}
                        >
                          {q.label}
                          {(data.accessibility as any)[q.key] && (
                            q.warning ? <Info className="w-4 h-4 text-rose-500" /> : <Star className="w-4 h-4 fill-blue-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">輔具使用狀況</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { label: '無使用', value: 'none' },
                        { label: '手動輪椅', value: 'manual-wheelchair' },
                        { label: '電動輪椅', value: 'electric-wheelchair' },
                        { label: '助行器', value: 'walker' },
                        { label: '拐杖', value: 'cane' }
                      ].map(v => (
                        <button key={v.value} onClick={() => updateNested('transportation', 'mobilityAid', v.value)} className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${data.transportation.mobilityAid === v.value ? 'bg-brand-500 border-brand-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-500 hover:border-brand-300'}`}>
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-slate-600">交通可行性 (一步出行結構化)</label>
                    <div className="group relative">
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                      <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        評估住家與大眾運輸工具的可近性與便利程度。
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: '公車', key: 'bus' },
                      { label: '捷運', key: 'mrt' },
                      { label: '火車', key: 'train' },
                      { label: '計程車', key: 'taxi' }
                    ].map(m => (
                      <button key={m.key} onClick={() => updateNested('transportation', m.key, !(data.transportation as any)[m.key])} className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${(data.transportation as any)[m.key] ? 'bg-brand-500 border-brand-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-500 hover:border-brand-300'}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">你會不會因為交通不方便，而減少出門？</label>
                    <ScoreButtons value={data.transportation.score} onChange={v => updateNested('transportation', 'score', v)} />
                    <div className="flex justify-between px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>0: 經常因此不敢出門</span>
                      <span>5: 完全不會，交通很方便</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between">
          {step > 1 ? (
            <button onClick={prev} className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors">
              <ChevronLeft className="w-5 h-5" /> 上一步
            </button>
          ) : <div />}
          
          <button onClick={step === totalSteps ? () => onComplete(data) : next} className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20">
            {step === totalSteps ? '生成深度整合報告' : '下一步'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
