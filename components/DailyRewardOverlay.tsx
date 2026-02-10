
import React from 'react';
import { motion as m } from 'framer-motion';
import { BoosterType } from '../types';

const motion = m as any;

interface DailyRewardOverlayProps {
  streak: number;
  onClaim: (booster: BoosterType, amount: number) => void;
}

const DailyRewardOverlay: React.FC<DailyRewardOverlayProps> = ({ streak, onClaim }) => {
  const getReward = (): { type: BoosterType, amount: number, icon: string, name: string } => {
    if (streak % 5 === 0) return { type: 'ROW_CLEAR', amount: 1, icon: '↔️', name: 'Row Clear' };
    if (streak % 3 === 0) return { type: 'SHUFFLE', amount: 1, icon: '🔄', name: 'Shuffle' };
    return { type: 'HAMMER', amount: 1, icon: '🔨', name: 'Hammer' };
  };

  const reward = getReward();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[4rem] p-10 max-w-sm w-full text-center shadow-2xl relative border-8 border-orange-100"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center text-5xl border-8 border-white shadow-xl">
          🎁
        </div>

        <h2 className="text-4xl font-black text-orange-950 mb-2 mt-4 font-bubbly">Daily Bonus!</h2>
        <div className="bg-orange-50 inline-block px-4 py-1 rounded-full text-orange-600 font-bold text-sm mb-6">
          {streak} Day Streak 🔥
        </div>

        <p className="text-slate-600 mb-8 font-medium">
          Dadi made something special for you! Claim your daily gift to help you in the kitchen.
        </p>

        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="bg-orange-50 rounded-3xl p-8 mb-8 border-2 border-orange-200 shadow-inner"
        >
          <div className="text-7xl mb-4">{reward.icon}</div>
          <div className="text-2xl font-black text-orange-950 font-bubbly">1x {reward.name}</div>
        </motion.div>

        <button
          onClick={() => onClaim(reward.type, reward.amount)}
          className="w-full py-6 bg-orange-600 text-white rounded-[2rem] text-2xl font-black shadow-xl border-b-8 border-orange-800 hover:bg-orange-500 active:scale-95 transition-all font-bubbly"
        >
          CLAIM REWARD
        </button>
        
        <p className="mt-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Come back tomorrow for more!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DailyRewardOverlay;
