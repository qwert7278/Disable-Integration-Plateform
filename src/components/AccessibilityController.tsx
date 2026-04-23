import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Pause, Play, Square, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { subscribeTTS, stopSpeaking, pauseSpeaking, resumeSpeaking, getTTSState } from '../services/tts';

interface Props {
  isActive: boolean;
  onToggle: () => void;
  currentText?: string;
}

export const AccessibilityController: React.FC<Props> = ({ isActive, onToggle }) => {
  const [ttsState, setTTSState] = useState(getTTSState());
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTTS((state, text) => {
      setTTSState({ state, text });
    });
    return unsubscribe;
  }, []);

  if (!isActive) return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={onToggle}
      className="fixed bottom-8 right-8 w-14 h-14 bg-white text-slate-500 rounded-full shadow-2xl flex items-center justify-center border border-slate-100 hover:text-brand-600 hover:border-brand-200 transition-all z-[100]"
      title="開啟語音輔助"
      aria-label="開啟語音輔助"
    >
      <VolumeX className="w-6 h-6" aria-hidden="true" />
    </motion.button>
  );

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4" role="complementary" aria-label="語音輔助工具">
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6"
            role="dialog"
            aria-label="語音輔助控制面板"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-brand-600" aria-hidden="true" />
                </div>
                <span className="font-bold text-slate-800">語音輔助控制</span>
              </div>
              <button 
                onClick={onToggle}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-2 py-1 rounded-md"
                aria-label="關閉語音輔助模式"
              >
                關閉模式
              </button>
            </div>

            {ttsState.text && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100" aria-live="polite">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquareQuote className="w-3 h-3 text-brand-500" aria-hidden="true" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">正在朗讀</span>
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed line-clamp-3">
                  {ttsState.text}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={stopSpeaking}
                className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
                title="停止"
                aria-label="停止朗讀"
              >
                <Square className="w-5 h-5 fill-current" aria-hidden="true" />
              </button>
              
              {ttsState.state === 'speaking' ? (
                <button
                  onClick={pauseSpeaking}
                  className="w-16 h-16 rounded-3xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 hover:bg-brand-700 transition-all"
                  title="暫停"
                  aria-label="暫停朗讀"
                >
                  <Pause className="w-8 h-8 fill-current" aria-hidden="true" />
                </button>
              ) : (
                <button
                  onClick={resumeSpeaking}
                  className="w-16 h-16 rounded-3xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 hover:bg-brand-700 transition-all"
                  title="繼續"
                  aria-label="繼續朗讀"
                >
                  <Play className="w-8 h-8 fill-current ml-1" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${ttsState.state === 'speaking' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                {ttsState.state === 'speaking' ? '發聲中' : ttsState.state === 'paused' ? '已暫停' : '空閒'}
              </div>
              <span>可用鍵盤操作按鈕</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPanel(!showPanel)}
        aria-expanded={showPanel}
        aria-label={showPanel ? '收合語音控制面板' : '展開語音控制面板'}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          showPanel 
            ? 'bg-slate-800 text-white rotate-180' 
            : 'bg-brand-600 text-white'
        }`}
      >
        {showPanel ? <ChevronRight className="w-6 h-6" aria-hidden="true" /> : <Volume2 className="w-6 h-6" aria-hidden="true" />}
      </motion.button>
    </div>
  );
};
