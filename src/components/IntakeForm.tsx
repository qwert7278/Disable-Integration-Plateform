import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntakeData, DisabilityStatus } from '../types';
import { ChevronRight, ChevronLeft, Star, Info, User, Users, Heart, Stethoscope, Home, Briefcase, Smile, HelpCircle, Activity, Shield } from 'lucide-react';
import { TAIWAN_CITIES, HOUSING_TYPES, ICF_CATEGORIES, SCORE_ANCHORS, DEFAULT_ABILITY_ANCHORS, QUESTION_TITLES } from '../constants';
import { speak, stopSpeaking } from '../services/tts';
import { Volume2, VolumeX } from 'lucide-react';
import { AccessibilityController } from './AccessibilityController';

interface Props {
  onComplete: (data: IntakeData) => void;
}

const ScoreButtons: React.FC<{ value: number; onChange: (v: number) => void; customAnchors?: string[]; autoSpeak?: boolean; onSpeak?: (text: string) => void }> = ({ value, onChange, customAnchors, autoSpeak, onSpeak }) => {
  const defaultAnchors = [
    "完全無法，需要完全依賴他人",
    "幾乎無法，需要他人高度協助",
    "大多時候無法，只在特定情況不需協助",
    "可以做，但會卡住或需要一點幫忙",
    "大致可自行完成",
    "完全可以自己完成"
  ];

  const anchors = customAnchors || defaultAnchors;

  const handleSelect = (v: number) => {
    onChange(v);
    if (autoSpeak && onSpeak) {
      onSpeak(`選擇了 ${v} 分：${anchors[v]}`);
    }
  };

  const handleHover = (v: number) => {
    if (autoSpeak && onSpeak) {
      onSpeak(`${v} 分：${anchors[v]}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between gap-1 sm:justify-start">
        {[0, 1, 2, 3, 4, 5].map(v => (
          <div key={v} className="group relative flex flex-col items-center">
            <button
              type="button"
              onMouseEnter={() => handleHover(v)}
              onFocus={() => handleHover(v)}
              onClick={() => handleSelect(v)}
              aria-label={`${v} 分：${anchors[v]}`}
              aria-pressed={value === v}
              className={`w-10 h-10 rounded-lg border transition-all flex items-center justify-center font-bold ${value === v ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20' : 'bg-white text-slate-400 border-slate-200 hover:border-brand-300'
                }`}
            >
              {v}
            </button>
            <div className="absolute top-full mt-2 w-40 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center shadow-2xl border border-slate-700/50 leading-normal font-bold">
              {anchors[v]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const STEP_TITLES: Record<number, string> = {
  1: "步驟 1：前導問題",
  2: "步驟 2：基本資料與法定身障鑑定狀態",
  3: "步驟 3：身體狀況評估",
  4: "步驟 4：日常生活自理能力",
  5: "步驟 5：認知、溝通與數位能力",
  6: "步驟 6：工作與經濟能力",
  7: "步驟 7：家庭支持情況",
  8: "步驟 8：心情與社交生活",
  9: "步驟 9：居住環境與交通方便性",
};

const QUESTION_LABELS: Record<string, string> = {
  ...QUESTION_TITLES,
  age: '年齡',
  city: '居住縣市',
  education: '教育程度',
  source: '障礙成因或來源',
  hasCertificate: '身心障礙證明狀態',
  travelCardStatus: '愛心悠遊卡或博愛卡狀態',
  housingType: '住家型態，是否有電梯或出入方便',
  indoorAccessibility: '居家無障礙，室內空間',
  outdoorAccessibility: '室外外出便利性',
  mobilityAid: '輔具使用狀況',
  transportationOptions: '交通可行性，可使用的交通方式',
  transportationScore: QUESTION_TITLES.transportationScore,
};

const STEP_QUESTION_KEYS: Record<number, string[]> = {
  1: ['respondentType', 'currentStage', 'primaryConcern'],
  2: ['age', 'city', 'education', 'source', 'hasCertificate', 'travelCardStatus'],
  3: ['healthMonitoring', 'pain', 'rehabStatus', 'indoorMobility', 'transfer', 'transferToilet', 'outdoorMobility', 'balance', 'endurance', 'chronicControl'],
  4: ['eating', 'bathing', 'toileting', 'dressing', 'medication', 'housework', 'errands'],
  5: ['memory', 'orientation', 'judgment', 'mood', 'expression', 'comprehension', 'mobileUse', 'computerUse', 'aiUsage', 'learningAbility', 'softwareUsage'],
  6: ['skills', 'intent', 'capacity', 'remoteFeasibility', 'supportNeeds', 'economicRole', 'economicPressure', 'welfareStatus'],
  7: ['cohabitants', 'caregiverHealth', 'careHours', 'familyAttitude', 'resourceKnowledge', 'familyConflict', 'emergencyBackup'],
  8: ['socialSupport', 'communityParticipation', 'isolation', 'lifeGoals', 'selfEfficacy', 'sleep', 'emotionalDistress'],
  9: ['housingType', 'overallBarrier', 'indoorAccessibility', 'outdoorAccessibility', 'mobilityAid', 'transportationOptions', 'transportationScore'],
};

const getQuestionLabel = (key: string) => QUESTION_LABELS[key] || key;

const buildStepAnnouncement = (currentStep: number) => {
  const title = STEP_TITLES[currentStep] || `步驟 ${currentStep}`;
  const questions = (STEP_QUESTION_KEYS[currentStep] || []).map(getQuestionLabel);
  const questionList = questions.map((q, index) => `第 ${index + 1} 題，${q}`).join('。');
  const scoreGuide = currentStep >= 3
    ? '遇到 0 到 5 分的題目時，請先聽完題目，再選擇最接近現在狀況的分數。0 分代表很困難或完全無法，5 分代表可以自己完成。'
    : '請先聽完問題，再選擇最接近現在狀況的選項。';

  return `${title}。本頁會先朗讀題目，再讓您作答。${scoreGuide}本頁題目包含：${questionList}。您可以用 Tab 鍵移動到每個選項，焦點停留時系統會念出選項內容。`;
};

export const IntakeForm: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<string>('');
  const formTopRef = useRef<HTMLDivElement>(null);
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
    physical: { healthMonitoring: 3, pain: 5, rehabStatus: 3, indoorMobility: 3, transfer: 3, transferToilet: 3, outdoorMobility: 3, balance: 3, endurance: 3, chronicControl: 3 },
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

  const next = () => {
    setStep(s => s + 1);
    stopSpeaking();
  };
  const prev = () => {
    setStep(s => s - 1);
    stopSpeaking();
  };

  const speakText = (text: string, rate = 1.08) => {
    if (!text.trim()) return;
    setCurrentSpeech(text);
    speak(text, rate, () => setCurrentSpeech(''));
  };

  useEffect(() => {
    if (isTTSActive) {
      // Small delay to let animations finish
      const timer = setTimeout(() => {
        speakText(buildStepAnnouncement(step), 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step, isTTSActive]);

  const handleSpeak = (text: string) => {
    if (!isTTSActive) return;
    speakText(text);
  };

  const speakCurrentStep = () => {
    if (!isTTSActive) {
      setIsTTSActive(true);
    }
    speakText(buildStepAnnouncement(step), 1);
  };

  const toggleTTS = () => {
    const newState = !isTTSActive;
    setIsTTSActive(newState);
    if (!newState) {
      stopSpeaking();
      setCurrentSpeech('');
    } else {
      speakText("語音朗讀模式已開啟。您可以按朗讀本頁題目，先聽完本頁說明，再用 Tab 鍵移動到題目和選項。");
    }
  };

  const handleFocusableSpeak = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!isTTSActive) return;

    const target = event.target as HTMLElement;
    const interactive = target.closest('button, input, select, textarea') as HTMLElement | null;
    if (!interactive) return;

    const questionButtonText = interactive.getAttribute('title') === '朗讀題目'
      ? interactive.parentElement?.querySelector('span')?.textContent?.trim()
      : '';
    const label =
      interactive.getAttribute('aria-label') ||
      questionButtonText ||
      interactive.getAttribute('placeholder') ||
      interactive.textContent?.trim() ||
      interactive.getAttribute('title') ||
      '';

    if (label) {
      handleSpeak(label.replace(/\s+/g, ' '));
    }
  };

  const totalSteps = 9;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    formTopRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [step]);

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
    <div ref={formTopRef} className="relative scroll-mt-24" onFocusCapture={handleFocusableSpeak}>
      <AccessibilityController
        isActive={isTTSActive}
        onToggle={toggleTTS}
        currentText={currentSpeech}
      />
      <div className="max-w-3xl mx-auto overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 sm:rounded-3xl">
        <div className="flex flex-col gap-4 border-b border-brand-100 bg-brand-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex w-full gap-1 sm:w-auto">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 sm:w-6 sm:flex-none ${step >= i + 1 ? 'bg-cis-gradient shadow-sm' : 'bg-slate-200'}`} />
              ))}
            </div>
            <button
              onClick={toggleTTS}
              aria-pressed={isTTSActive}
              aria-label={isTTSActive ? '關閉語音朗讀模式' : '開啟語音朗讀模式'}
              className={`flex min-h-10 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${isTTSActive
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-300'
                }`}
            >
              {isTTSActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {isTTSActive ? '語音模式：開啟' : '語音模式：關閉'}
            </button>
            <button
              type="button"
              onClick={speakCurrentStep}
              aria-label="朗讀本頁題目與作答說明"
              className="flex min-h-10 items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50"
            >
              <Volume2 className="w-3.5 h-3.5" />
              朗讀本頁題目
            </button>
          </div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">步驟 {step} / {totalSteps}</span>
        </div>

        <div className="p-4 sm:p-8">
          {isTTSActive && (
            <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-sm text-slate-700 flex items-start gap-3">
              <Volume2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
              <p className="leading-relaxed">
                語音模式已開啟。可以先按「朗讀本頁題目」，再用 Tab 鍵移動到每個選項；焦點停留時會朗讀內容，按 Enter 或空白鍵即可選擇。
              </p>
            </div>
          )}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">了解您的需求</h2>
                  <p className="text-slate-500 font-medium">在開始之前，我們先簡單了解您的現況，以便提供更精準的導航建議。</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-lg font-bold text-slate-700 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                        1. {QUESTION_TITLES.respondentType}
                      </div>
                      <span className="text-xs text-slate-400 ml-3.5 font-normal">若非本人填寫，請依照當事者意願或詢問當事者填答選項，其不能表達意思者例外</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                      {[
                        { label: '本人', value: 'self', icon: User },
                        { label: '家屬', value: 'family', icon: Users },
                        { label: '其他協助者', value: 'other', icon: Heart }
                      ].map(v => (
                        <button
                          key={v.value}
                          type="button"
                          aria-pressed={data.respondentType === v.value}
                          onMouseEnter={() => handleSpeak(v.label)}
                          onClick={() => {
                            setData({ ...data, respondentType: v.value as any });
                            handleSpeak(`已選擇填寫人：${v.label}`);
                          }}
                          className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl border-2 transition-all gap-3 ${data.respondentType === v.value
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
                      2. {QUESTION_TITLES.currentStage}
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
                          type="button"
                          aria-pressed={data.currentStage === v.value}
                          onMouseEnter={() => handleSpeak(v.label)}
                          onClick={() => {
                            setData({ ...data, currentStage: v.value as any });
                            handleSpeak(`已選擇階段：${v.label}`);
                          }}
                          className={`flex items-center p-4 rounded-2xl border-2 transition-all gap-4 ${data.currentStage === v.value
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
                      3. {QUESTION_TITLES.primaryConcern}
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
                          type="button"
                          aria-pressed={data.primaryConcern === v.value}
                          onMouseEnter={() => handleSpeak(v.label)}
                          onClick={() => {
                            setData({ ...data, primaryConcern: v.value as any });
                            handleSpeak(`已選擇問題：${v.label}`);
                          }}
                          className={`flex items-center p-4 rounded-2xl border-2 transition-all gap-4 ${data.primaryConcern === v.value
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
                <h2 className="text-2xl font-bold text-slate-800">1. 基本資料與法定身障鑑定狀態</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">年齡</label>
                    <input
                      type="number"
                      aria-label="年齡，請輸入目前年齡"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200"
                      value={data.age}
                      onChange={e => setData({ ...data, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">居住縣市</label>
                    <select
                      aria-label={`居住縣市，目前選擇 ${data.city}`}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"
                      value={data.city}
                      onChange={e => {
                        setData({ ...data, city: e.target.value });
                        handleSpeak(`已選擇居住縣市：${e.target.value}`);
                      }}
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
                    aria-label="教育程度"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white"
                    value={data.education}
                    onChange={e => {
                      const label = e.currentTarget.selectedOptions[0]?.textContent || e.target.value;
                      setData({ ...data, education: e.target.value as any });
                      handleSpeak(`已選擇教育程度：${label}`);
                    }}
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
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { label: '先天', value: 'congenital' },
                      { label: '後天疾病', value: 'disease' },
                      { label: '意外', value: 'accident' },
                      { label: '職災', value: 'occupational' },
                      { label: '老化', value: 'aging' }
                    ].map(v => (
                      <button
                        key={v.value}
                        type="button"
                        aria-pressed={data.source === v.value}
                        onMouseEnter={() => handleSpeak(v.label)}
                        onClick={() => {
                          setData({ ...data, source: v.value as any });
                          handleSpeak(`已選擇來源：${v.label}`);
                        }}
                        className={`py-2 rounded-xl border text-sm ${data.source === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}
                      >
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
                      <button
                        key={v.value}
                        type="button"
                        aria-pressed={data.hasCertificate === v.value}
                        onMouseEnter={() => handleSpeak(v.label)}
                        onClick={() => {
                          setData({ ...data, hasCertificate: v.value as any });
                          handleSpeak(`已選擇狀態：${v.label}`);
                        }}
                        className={`py-2 rounded-xl border text-sm ${data.hasCertificate === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}
                      >
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
                            type="button"
                            aria-pressed={data.certificateDetails?.degree === v.value}
                            onMouseEnter={() => handleSpeak(v.label)}
                            onClick={() => {
                              setData({ ...data, certificateDetails: { ...data.certificateDetails!, degree: v.value as any } });
                              handleSpeak(`已選擇證明等級：${v.label}`);
                            }}
                            className={`py-2 rounded-xl border text-xs ${data.certificateDetails?.degree === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600">證明編號</label>
                        <input
                          type="text"
                          aria-label="證明字號"
                          placeholder="例：12345678"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                          value={data.certificateDetails?.number}
                          onChange={e => setData({ ...data, certificateDetails: { ...data.certificateDetails!, number: e.target.value } })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600">障礙類別 (ICF)</label>
                        <select
                          aria-label="身心障礙類別 ICF"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                          value={data.certificateDetails?.category}
                          onChange={e => {
                            const label = e.currentTarget.selectedOptions[0]?.textContent || e.target.value;
                            setData({ ...data, certificateDetails: { ...data.certificateDetails!, category: e.target.value } });
                            handleSpeak(`已選擇身心障礙類別：${label}`);
                          }}
                        >
                          <option value="">請選擇障礙類別</option>
                          {ICF_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-sm font-semibold text-slate-600">愛心悠遊卡/博愛卡狀態</label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { label: '未辦理', value: 'none' },
                      { label: '辦理中', value: 'applying' },
                      { label: '已領取', value: 'yes' }
                    ].map(v => (
                      <button
                        key={v.value}
                        type="button"
                        aria-pressed={data.travelCardStatus === v.value}
                        onMouseEnter={() => handleSpeak(v.label)}
                        onClick={() => {
                          setData({ ...data, travelCardStatus: v.value as any });
                          handleSpeak(`已選擇狀態：${v.label}`);
                        }}
                        className={`py-2 rounded-xl border text-sm ${data.travelCardStatus === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500'}`}
                      >
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
                    { key: 'healthMonitoring' },
                    { key: 'pain' },
                    { key: 'rehabStatus' },
                    { key: 'indoorMobility' },
                    { key: 'transfer' },
                    { key: 'transferToilet' },
                    { key: 'outdoorMobility' },
                    { key: 'balance' },
                    { key: 'endurance' },
                    { key: 'chronicControl' }
                  ].map(q => (
                    <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 max-w-md">
                        <button
                          type="button"
                          onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                          aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                          className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                          title="朗讀題目"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                      </div>
                      <ScoreButtons
                        value={(data.physical as any)[q.key]}
                        onChange={v => updateNested('physical', q.key, v)}
                        customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                        autoSpeak={isTTSActive}
                        onSpeak={handleSpeak}
                      />
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
                    { key: 'eating' },
                    { key: 'bathing' },
                    { key: 'toileting' },
                    { key: 'dressing' },
                    { key: 'medication' },
                    { key: 'housework' },
                    { key: 'errands' },
                  ].map(q => (
                    <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 max-w-md">
                        <button
                          type="button"
                          onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                          aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                          className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                          title="朗讀題目"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                      </div>
                      <ScoreButtons
                        value={(data.selfCare as any)[q.key]}
                        onChange={v => updateNested('selfCare', q.key, v)}
                        customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                        autoSpeak={isTTSActive}
                        onSpeak={handleSpeak}
                      />
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
                        { key: 'memory' },
                        { key: 'orientation' },
                        { key: 'judgment' },
                        { key: 'mood' },
                      ].map(q => (
                        <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3 max-w-md">
                            <button
                              type="button"
                              onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                              aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                              className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                              title="朗讀題目"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                          </div>
                          <ScoreButtons
                            value={(data.cognition as any)[q.key]}
                            onChange={v => updateNested('cognition', q.key, v)}
                            customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                            autoSpeak={isTTSActive}
                            onSpeak={handleSpeak}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">2</span>
                      溝通與數位工具
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'expression' },
                        { key: 'comprehension' },
                        { key: 'mobileUse' },
                        { key: 'computerUse' },
                        { key: 'aiUsage' },
                        { key: 'learningAbility' },
                      ].map(q => (
                        <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3 max-w-md">
                            <button
                              type="button"
                              onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                              aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                              className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                              title="朗讀題目"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                          </div>
                          <ScoreButtons
                            value={(data.cognition as any)[q.key]}
                            onChange={v => updateNested('cognition', q.key, v)}
                            customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                            autoSpeak={isTTSActive}
                            onSpeak={handleSpeak}
                          />
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
                          { key: 'skills' },
                          { key: 'intent' },
                          { key: 'capacity' },
                          { key: 'remoteFeasibility' },
                          { key: 'supportNeeds' },
                        ].map(q => (
                          <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3 max-w-md">
                              <button
                                type="button"
                                onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                                aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                                className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                                title="朗讀題目"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                            </div>
                            <ScoreButtons
                              value={(data.economy as any)[q.key]}
                              onChange={v => updateNested('economy', q.key, v)}
                              customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                              autoSpeak={isTTSActive}
                              onSpeak={handleSpeak}
                            />
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center sm:p-8">
                        <p className="text-slate-500 text-sm italic">已為您跳過細節工作評估。若未來有需要，隨時可於報告中重新評估。</p>
                      </div>
                    )}

                    <hr className="border-slate-100" />

                    {[
                      { key: 'economicRole' },
                      { key: 'economicPressure' },
                      { key: 'welfareStatus' },
                    ].map(q => (
                      <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3 max-w-md">
                          <button
                            type="button"
                            onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                            aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                            className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                            title="朗讀題目"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                        </div>
                        <ScoreButtons
                          value={(data.economy as any)[q.key]}
                          onChange={v => updateNested('economy', q.key, v)}
                          customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                          autoSpeak={isTTSActive}
                          onSpeak={handleSpeak}
                        />
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
                    { key: 'cohabitants' },
                    { key: 'caregiverHealth' },
                    { key: 'careHours' },
                    { key: 'familyAttitude' },
                    { key: 'resourceKnowledge' },
                    { key: 'familyConflict' },
                    { key: 'emergencyBackup' },
                  ].map(q => (
                    <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 max-w-md">
                        <button
                          type="button"
                          onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                          aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                          className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                          title="朗讀題目"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                      </div>
                      <ScoreButtons
                        value={(data.family as any)[q.key]}
                        onChange={v => updateNested('family', q.key, v)}
                        customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                        autoSpeak={isTTSActive}
                        onSpeak={handleSpeak}
                      />
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
                    { key: 'socialSupport' },
                    { key: 'communityParticipation' },
                    { key: 'isolation' },
                    { key: 'lifeGoals' },
                    { key: 'selfEfficacy' },
                    { key: 'sleep' },
                    { key: 'emotionalDistress' },
                  ].map(q => (
                    <div key={q.key} className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 group/row sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 max-w-md">
                        <button
                          type="button"
                          onClick={() => handleSpeak(QUESTION_TITLES[q.key])}
                          aria-label={`朗讀題目：${QUESTION_TITLES[q.key]}`}
                          className="mt-0.5 p-2 rounded-xl bg-white border border-brand-100 text-brand-600 hover:text-brand-800 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
                          title="朗讀題目"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium text-slate-700">{QUESTION_TITLES[q.key]}</span>
                      </div>
                      <ScoreButtons
                        value={(data.social as any)[q.key]}
                        onChange={v => updateNested('social', q.key, v)}
                        customAnchors={SCORE_ANCHORS[q.key] || DEFAULT_ABILITY_ANCHORS}
                        autoSpeak={isTTSActive}
                        onSpeak={handleSpeak}
                      />
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
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {HOUSING_TYPES.map(v => (
                        <button
                          key={v.value}
                          type="button"
                          aria-pressed={data.housingType === v.value}
                          onMouseEnter={() => handleSpeak(v.label)}
                          onClick={() => {
                            setData({ ...data, housingType: v.value as any });
                            handleSpeak(`已選擇住家型態：${v.label}`);
                          }}
                          className={`py-2 px-3 rounded-xl border text-sm text-left transition-all ${data.housingType === v.value ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold' : 'border-slate-200 text-slate-500 hover:border-brand-200'}`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 space-y-3">
                    <label className="text-sm font-bold text-brand-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpeak(QUESTION_TITLES.overallBarrier)}
                        aria-label={`朗讀題目：${QUESTION_TITLES.overallBarrier}`}
                        className="p-1 rounded-lg bg-white/70 border border-brand-200 text-brand-400 hover:text-brand-600 transition-all"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                      {QUESTION_TITLES.overallBarrier}
                    </label>
                    <ScoreButtons
                      value={data.accessibility.overallBarrier}
                      onChange={v => updateNested('accessibility', 'overallBarrier', v)}
                      customAnchors={SCORE_ANCHORS.overallBarrier}
                      autoSpeak={isTTSActive}
                      onSpeak={handleSpeak}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">居家無障礙 (室內空間)</label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                          <button
                            key={q.key}
                            type="button"
                            aria-pressed={Boolean((data.accessibility as any)[q.key])}
                            onMouseEnter={() => handleSpeak(q.label + ((data.accessibility as any)[q.key] ? '：已勾選' : '：未勾選'))}
                            onClick={() => {
                              const newVal = !(data.accessibility as any)[q.key];
                              updateNested('accessibility', q.key, newVal);
                              handleSpeak(`${q.label}：${newVal ? '已選取' : '已取消'}`);
                            }}
                            className={`py-2 px-3 rounded-xl border text-left text-sm flex items-center justify-between transition-all ${(data.accessibility as any)[q.key] ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold' : 'border-slate-200 text-slate-500 hover:border-brand-200 hover:bg-brand-50/30'}`}
                          >
                            {q.label}
                            {(data.accessibility as any)[q.key] && <Star className="w-4 h-4 fill-brand-500 text-brand-500" />}
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
                            type="button"
                            aria-pressed={Boolean((data.accessibility as any)[q.key])}
                            onMouseEnter={() => handleSpeak(q.label + ((data.accessibility as any)[q.key] ? '：已勾選' : '：未勾選'))}
                            onClick={() => {
                              const newVal = !(data.accessibility as any)[q.key];
                              updateNested('accessibility', q.key, newVal);
                              handleSpeak(`${q.label}：${newVal ? '已選取' : '已取消'}`);
                            }}
                            className={`py-2 px-3 rounded-xl border text-left text-sm flex items-center justify-between transition-all ${(data.accessibility as any)[q.key]
                              ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                              : 'border-slate-200 text-slate-500 hover:border-brand-200 hover:bg-brand-50/30'
                              }`}
                          >
                            {q.label}
                            {(data.accessibility as any)[q.key] && (
                              q.warning ? <Info className="w-4 h-4 text-brand-500" /> : <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-white/70 rounded-2xl border border-slate-100">
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
                          <button
                            key={v.value}
                            type="button"
                            aria-pressed={data.transportation.mobilityAid === v.value}
                            onMouseEnter={() => handleSpeak(v.label)}
                            onClick={() => {
                              updateNested('transportation', 'mobilityAid', v.value);
                              handleSpeak(`已選擇輔具：${v.label}`);
                            }}
                            className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${data.transportation.mobilityAid === v.value ? 'bg-brand-500 border-brand-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-500 hover:border-brand-300'}`}
                          >
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
                        <button
                          key={m.key}
                          type="button"
                          aria-pressed={Boolean((data.transportation as any)[m.key])}
                          onMouseEnter={() => handleSpeak(m.label + ((data.transportation as any)[m.key] ? '：已選取' : '：未選取'))}
                          onClick={() => {
                            const newVal = !(data.transportation as any)[m.key];
                            updateNested('transportation', m.key, newVal);
                            handleSpeak(`${m.label}：${newVal ? '已選取' : '已取消'}`);
                          }}
                          className={`py-2 px-3 rounded-xl border text-center text-xs transition-all ${(data.transportation as any)[m.key] ? 'bg-brand-500 border-brand-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-500 hover:border-brand-300'}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">{QUESTION_TITLES.transportationScore}</label>
                      <ScoreButtons
                        value={data.transportation.score}
                        onChange={v => updateNested('transportation', 'score', v)}
                        customAnchors={SCORE_ANCHORS.transportationScore}
                        autoSpeak={isTTSActive}
                        onSpeak={handleSpeak}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-12 sm:flex-row sm:justify-between">
            {step > 1 ? (
              <button onClick={prev} className="flex w-full items-center justify-center gap-2 px-6 py-3 font-bold text-slate-500 transition-colors hover:text-slate-700 sm:w-auto sm:justify-start">
                <ChevronLeft className="w-5 h-5" /> 上一步
              </button>
            ) : <div />}

              <button onClick={step === totalSteps ? () => onComplete(data) : next} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 sm:w-auto sm:px-8">
              {step === totalSteps ? '生成深度整合報告' : '下一步'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
