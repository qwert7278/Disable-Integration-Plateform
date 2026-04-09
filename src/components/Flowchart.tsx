import React from 'react';
import { motion } from 'motion/react';
import { Activity, Home, Briefcase, Heart, ArrowRight } from 'lucide-react';

const stages = [
  { id: 'medical', name: '醫療期', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'home', name: '家庭支持', icon: Home, color: 'text-brand-500', bg: 'bg-brand-50' },
  { id: 'optimization', name: '生活優化', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'career', name: '職業重建', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
];

export const Flowchart = () => {
  return (
    <div className="py-12 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[800px] px-4">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className={`w-16 h-16 rounded-2xl ${stage.bg} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
                <stage.icon className={`w-8 h-8 ${stage.color}`} />
              </div>
              <span className="font-semibold text-slate-700">{stage.name}</span>
            </motion.div>
            {index < stages.length - 1 && (
              <div className="flex-1 h-px bg-slate-200 mx-4 relative">
                <ArrowRight className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-300" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
