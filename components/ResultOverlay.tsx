
import React from 'react';
import { motion as m } from 'framer-motion';
import { BoosterType } from '../types';

const motion = m as any;

interface ResultOverlayProps {
  title: string;
  message: string;
  onAction: () => void;
  actionText: string;
  score: number;
  success: boolean;
  stars?: number;
  reward?: BoosterType | null;
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({ title, message, onAction, actionText, score, success, stars = 0, reward }) => {
  const boosterIcons: Record<string, string> = {
    HAMMER: '🔨',
    SHUFFLE: '🔄',
    ROW_CLEAR: '↔️'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg p-4"
    >
      <motion.div
        initial={{ scale: 0.5, y: 100, rotate: -10 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        className="bg-white rounded-[4rem] p-10 max-w-sm w-full text-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden border-8 border-white"
      >
        <div className={`absolute top-0 left-0 right-0 h-4 ${success ? 'bg-gradient-to-r from-yellow-400 to-green-400' : 'bg-gradient-to-r from-red-400 to-orange-400'}`} />
        
        {success && (
          <div className="flex justify-center gap-2 mb-8 mt-4">
            {[1, 2, 3].map((s) => (
              <motion.span
                key={s}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: s <= stars ? 1.4 : 0.8, rotate: 0 }}
                transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 200 }}
                className={`text-6xl drop-shadow-lg ${s <= stars ? 'text-yellow-400' : 'text-slate-100'}`}
              >
                ⭐
              </motion.span>
            ))}
          </div>
        )}

        <h2 className={`text-5xl font-black mb-4 font-bubbly ${success ? 'text-pink-500' : 'text-slate-700'}`}>
          {title}
        </h2>
        <p className="text-slate-600 mb-6 text-xl font-bold italic">
          "{message}"
        </p>

        {success && reward && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1.2 }}
             className="bg-yellow-50 rounded-2xl p-4 mb-6 border-2 border-yellow-200 border-dashed"
           >
              <div className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">Dadi's Gift!</div>
              <div className="flex items-center justify-center gap-3">
                 <span className="text-4xl animate-bounce">{boosterIcons[reward]}</span>
                 <span className="text-xl font-black text-orange-950">1x {reward.replace('_', ' ')}</span>
              </div>
           </motion.div>
        )}
        
        <div className="bg-[#ffeedd] rounded-[3rem] p-6 mb-8 shadow-inner border-4 border-white">
          <div className="text-xs font-black text-pink-500 uppercase tracking-[0.3em] mb-2">Chef Rating</div>
          <div className="text-5xl font-black text-orange-950 font-bubbly tabular-nums drop-shadow-sm">{score.toLocaleString()}</div>
        </div>

        <button
          onClick={onAction}
          className={`w-full py-6 rounded-[3rem] text-3xl font-black text-white shadow-2xl transform transition-all active:scale-90 font-bubbly border-b-8
            ${success ? 'bg-green-500 hover:bg-green-400 border-green-700 shadow-green-200' : 'bg-pink-500 hover:bg-pink-400 border-pink-700 shadow-pink-200'}`}
        >
          {actionText}
        </button>
        
        <div className="mt-8 text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
           {success ? 'Delicious Victory! 🍯' : 'Almost Tasty! 🍛'}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultOverlay;
