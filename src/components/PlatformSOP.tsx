import React from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Cpu, FileText, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: '1. 深度評估',
    desc: '填寫 6 大維度問卷，包含病況、能力、環境與經濟狀況。',
    icon: ClipboardCheck,
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100'
  },
  {
    title: '2. 智能判讀',
    desc: '系統自動對接中央與地方資源，判斷最適生活路徑。',
    icon: Cpu,
    color: 'bg-brand-50 text-brand-600',
    border: 'border-brand-100'
  },
  {
    title: '3. 執行導航',
    desc: '產出個人化整合報告，包含各項申請的 SOP 與文件清單。',
    icon: FileText,
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100'
  }
];

export const PlatformSOP = () => {
  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800">平台運作流程 (SOP)</h2>
        <p className="text-slate-500 mt-2">簡單三步驟，打通繁雜的資源申請環節</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-12 z-0" />
        
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <div className={`w-20 h-20 rounded-3xl ${step.color} ${step.border} border-2 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-white`}>
              <step.icon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">
              {step.desc}
            </p>
            
            {index < steps.length - 1 && (
              <div className="md:hidden my-6">
                <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
