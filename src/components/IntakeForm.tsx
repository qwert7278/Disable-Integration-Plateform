import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntakeData, DisabilityStatus } from '../types';
import { ChevronRight, ChevronLeft, Star, Info } from 'lucide-react';
import { TAIWAN_CITIES, HOUSING_TYPES } from '../constants';

interface Props {
  onComplete: (data: IntakeData) => void;
}

const ScoreButtons: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5].map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`w-10 h-10 rounded-lg border transition-all flex items-center justify-center font-bold ${
            value === v ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20' : 'bg-white text-slate-400 border-slate-200 hover:border-brand-300'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
    <div className="flex justify-between px-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
      <span>0: 最差/極大壓力</span>
      <span>5: 最佳/完全獨立</span>
    </div>
  </div>
);

const YesNoButtons: React.FC<{ value?: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => onChange(true)}
      className={`px-6 py-2 rounded-xl border transition-all font-bold ${
        value === true ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20' : 'bg-white text-slate-500 border-slate-200 hover:border-brand-300'
      }`}
    >
      是
    </button>
    <button
      type="button"
      onClick={() => onChange(false)}
      className={`px-6 py-2 rounded-xl border transition-all font-bold ${
        value === false ? 'bg-slate-600 text-white border-slate-600 shadow-lg shadow-slate-600/20' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
      }`}
    >
      否
    </button>
  </div>
);

export const IntakeForm: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IntakeData>({
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
    physical: { indoorMobility: undefined as any, outdoorMobility: undefined as any, transfer: undefined as any, balance: undefined as any, endurance: undefined as any, chronicControl: undefined as any, pain: undefined as any, rehabStatus: undefined as any },
    selfCare: { eating: undefined as any, bathing: undefined as any, toileting: undefined as any, dressing: undefined as any, medication: undefined as any, housework: undefined as any, errands: undefined as any },
    cognition: { orientation: undefined as any, memory: undefined as any, judgment: undefined as any, expression: undefined as any, comprehension: undefined as any, mood: undefined as any, mobileUse: undefined as any, computerUse: undefined as any, aiUsage: undefined as any, learningAbility: undefined as any, softwareUsage: undefined as any, reading: undefined as any, writing: undefined as any },
    economy: { skills: undefined as any, intent: undefined as any, capacity: undefined as any, remoteFeasibility: undefined as any, supportNeeds: undefined as any, economicRole: undefined as any, economicPressure: undefined as any, welfareStatus: undefined as any, delayedMedicalCare: undefined as any, stableIncome: undefined as any, willingToTrain: undefined as any },
    family: { cohabitants: undefined as any, caregiverHealth: undefined as any, careHours: undefined as any, familyAttitude: undefined as any, resourceKnowledge: undefined as any, familyConflict: undefined as any, emergencyBackup: undefined as any, caregiverRespite: undefined as any, familyCrisis: undefined as any },
    social: { socialSupport: undefined as any, communityParticipation: undefined as any, isolation: undefined as any, lifeGoals: undefined as any, selfEfficacy: undefined as any, sleep: undefined as any, emotionalDistress: undefined as any, lifeSatisfaction: undefined as any, feelsRespected: undefined as any, experiencedDiscrimination: undefined as any },
    housingType: 'elevator',
    accessibility: { 
      bathroom: undefined as any, threshold: undefined as any, aisle: undefined as any, bedside: undefined as any, entrance: undefined as any, 
      kitchen: undefined as any, bedroom: undefined as any, livingRoom: undefined as any,
      smartHome: undefined as any, 
      outdoorRamp: undefined as any, outdoorElevator: undefined as any, outdoorSidewalk: undefined as any, outdoorLighting: undefined as any,
      exitDifficulty: undefined as any, streetDifficulty: undefined as any,
      appointmentService: undefined as any, iBusApp: undefined as any
    },
    transportation: { score: undefined as any, mobilityAid: 'none', bus: undefined as any, mrt: undefined as any, train: undefined as any, taxi: undefined as any, travelCard: undefined as any },
    missedMedicalDueToTransport: undefined as any,
    reducedOutingsDueToEnvironment: undefined as any
  });

  const next = () => {
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const totalSteps = 8;

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
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">A1. 基本背景與制度狀態</h2>
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

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">① 身體功能評估 (0=最差 / 5=最好)</h2>
              <div className="space-y-4">
                {[
                  { label: '室內移動', key: 'indoorMobility' },
                  { label: '室外移動', key: 'outdoorMobility' },
                  { label: '移位能力 (床↔椅)', key: 'transfer' },
                  { label: '平衡與跌倒風險', key: 'balance' },
                  { label: '耐力 (走/站持久度)', key: 'endurance' },
                  { label: '慢性病控制 (血壓/血糖)', key: 'chronicControl' },
                  { label: '疼痛程度 (0:極痛, 5:無痛)', key: 'pain' },
                  { label: '復健規律性', key: 'rehabStatus' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.physical as any)[q.key]} onChange={v => updateNested('physical', q.key, v)} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">② 生活自理評估 (0=最差 / 5=最好)</h2>
              <div className="space-y-4">
                {[
                  { label: '進食', key: 'eating' },
                  { label: '洗澡', key: 'bathing' },
                  { label: '如廁', key: 'toileting' },
                  { label: '穿衣', key: 'dressing' },
                  { label: '用藥管理', key: 'medication' },
                  { label: '家務/備餐', key: 'housework' },
                  { label: '外出辦事', key: 'errands' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.selfCare as any)[q.key]} onChange={v => updateNested('selfCare', q.key, v)} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">③ 認知與溝通 (0=嚴重困難 / 5=完全正常)</h2>
              <div className="space-y-4">
                {[
                  { label: '定向感', key: 'orientation' },
                  { label: '記憶力', key: 'memory' },
                  { label: '判斷力', key: 'judgment' },
                  { label: '溝通表達', key: 'expression' },
                  { label: '理解能力', key: 'comprehension' },
                  { label: '情緒穩定度', key: 'mood' },
                  { label: '手機使用能力', key: 'mobileUse' },
                  { label: '電腦使用能力', key: 'computerUse' },
                  { label: 'AI 使用能力', key: 'aiUsage' },
                  { label: '學習能力與意願', key: 'learningAbility' },
                  { label: '文字/辦公軟體使用', key: 'softwareUsage' },
                  { label: '閱讀能力', key: 'reading' },
                  { label: '書寫能力', key: 'writing' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.cognition as any)[q.key]} onChange={v => updateNested('cognition', q.key, v)} />
                  </div>
                ))}

                {/* Conditional Logic for Cognition */}
                <AnimatePresence>
                  {data.cognition.judgment <= 2 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-rose-700">是否曾簽署不理解文件？</span>
                      <YesNoButtons value={data.cognition.signedUnunderstoodDoc} onChange={v => updateNested('cognition', 'signedUnunderstoodDoc', v)} />
                    </motion.div>
                  )}
                  {data.cognition.mood <= 2 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-rose-700">是否持續低落兩週以上？</span>
                        <YesNoButtons value={data.cognition.persistentLowMood} onChange={v => updateNested('cognition', 'persistentLowMood', v)} />
                      </div>
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-rose-700 flex items-center gap-1"><Info className="w-4 h-4" /> 是否有自傷想法？ (高風險標記)</span>
                        <YesNoButtons value={data.cognition.selfHarmThoughts} onChange={v => updateNested('cognition', 'selfHarmThoughts', v)} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">④ 工作與經濟能力 (0=高度依賴 / 5=高度自立)</h2>
              <div className="space-y-4">
                {[
                  { label: '最高學歷/技能等級', key: 'skills' },
                  { label: '工作意願', key: 'intent' },
                  { label: '工作體力/能力', key: 'capacity' },
                  { label: '遠距工作可行性', key: 'remoteFeasibility' },
                  { label: '職務支持需求 (0:極高需求, 5:低需求)', key: 'supportNeeds' },
                  { label: '經濟角色', key: 'economicRole' },
                  { label: '經濟壓力 (0:極大壓力, 5:無壓力)', key: 'economicPressure' },
                  { label: '福利資格', key: 'welfareStatus' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.economy as any)[q.key]} onChange={v => updateNested('economy', q.key, v)} />
                  </div>
                ))}

                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否曾因經濟延誤就醫</span>
                  <YesNoButtons value={data.economy.delayedMedicalCare} onChange={v => updateNested('economy', 'delayedMedicalCare', v)} />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否有穩定收入來源</span>
                  <YesNoButtons value={data.economy.stableIncome} onChange={v => updateNested('economy', 'stableIncome', v)} />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否願意接受技能訓練</span>
                  <YesNoButtons value={data.economy.willingToTrain} onChange={v => updateNested('economy', 'willingToTrain', v)} />
                </div>

                {/* Conditional Logic for Economy */}
                <AnimatePresence>
                  {data.economy.intent >= 4 && data.economy.capacity <= 2 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-700">是否需職務再設計？</span>
                      <YesNoButtons value={data.economy.needJobRedesign} onChange={v => updateNested('economy', 'needJobRedesign', v)} />
                    </motion.div>
                  )}
                  {data.economy.economicPressure <= 2 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-rose-700">是否有債務？</span>
                      <YesNoButtons value={data.economy.hasDebt} onChange={v => updateNested('economy', 'hasDebt', v)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">⑤ 家庭支持量能 (0=極度不足 / 5=高度穩定)</h2>
              <div className="space-y-4">
                {[
                  { label: '同住者協助意願', key: 'cohabitants' },
                  { label: '照顧者健康狀況', key: 'caregiverHealth' },
                  { label: '可提供照顧時數', key: 'careHours' },
                  { label: '家庭支持態度', key: 'familyAttitude' },
                  { label: '資源運用知識', key: 'resourceKnowledge' },
                  { label: '家庭衝突程度 (0:嚴重衝突, 5:無衝突)', key: 'familyConflict' },
                  { label: '緊急備援方案', key: 'emergencyBackup' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.family as any)[q.key]} onChange={v => updateNested('family', q.key, v)} />
                  </div>
                ))}

                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">照顧者是否有喘息機會</span>
                  <YesNoButtons value={data.family.caregiverRespite} onChange={v => updateNested('family', 'caregiverRespite', v)} />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否曾因照顧產生家庭危機</span>
                  <YesNoButtons value={data.family.familyCrisis} onChange={v => updateNested('family', 'familyCrisis', v)} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">⑥ 社會參與與心理 (0=極度困難 / 5=非常良好)</h2>
              <div className="space-y-4">
                {[
                  { label: '社交支持系統', key: 'socialSupport' },
                  { label: '社區參與頻率', key: 'communityParticipation' },
                  { label: '孤立程度 (0:嚴重孤立, 5:無孤立)', key: 'isolation' },
                  { label: '生活目標明確度', key: 'lifeGoals' },
                  { label: '自我效能感', key: 'selfEfficacy' },
                  { label: '睡眠品質', key: 'sleep' },
                  { label: '情緒困擾程度 (0:嚴重困擾, 5:無困擾)', key: 'emotionalDistress' },
                  { label: '生活滿意度', key: 'lifeSatisfaction' },
                ].map(q => (
                  <div key={q.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-sm font-medium text-slate-700">{q.label}</span>
                    <ScoreButtons value={(data.social as any)[q.key]} onChange={v => updateNested('social', q.key, v)} />
                  </div>
                ))}

                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否感到被尊重</span>
                  <YesNoButtons value={data.social.feelsRespected} onChange={v => updateNested('social', 'feelsRespected', v)} />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否曾遭歧視</span>
                  <YesNoButtons value={data.social.experiencedDiscrimination} onChange={v => updateNested('social', 'experiencedDiscrimination', v)} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">A3. 居住環境與交通可近性</h2>
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
                    <label className="text-xs font-bold text-slate-400 uppercase">綜合交通便利評分</label>
                    <ScoreButtons value={data.transportation.score} onChange={v => updateNested('transportation', 'score', v)} />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否曾因交通困難放棄就醫</span>
                  <YesNoButtons value={data.missedMedicalDueToTransport} onChange={v => setData({ ...data, missedMedicalDueToTransport: v })} />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">是否因環境因素減少外出</span>
                  <YesNoButtons value={data.reducedOutingsDueToEnvironment} onChange={v => setData({ ...data, reducedOutingsDueToEnvironment: v })} />
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
