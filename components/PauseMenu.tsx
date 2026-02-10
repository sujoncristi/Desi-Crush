
import React from 'react';
import { motion as m } from 'framer-motion';

const motion = m as any;

interface PauseMenuProps {
  onContinue: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onSettings: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onContinue, onRestart, onQuit, onSettings }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/50 backdrop-blur-md p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl"
      >
        <h2 className="text-4xl font-black text-orange-950 mb-8 font-bubbly">Game Paused</h2>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={onContinue}
            className="w-full py-5 bg-pink-500 text-white rounded-[2rem] text-2xl font-black shadow-xl border-b-8 border-pink-700 active:scale-95 transition-all font-bubbly"
          >
            RESUME
          </button>
          
          <button
            onClick={onRestart}
            className="w-full py-4 bg-orange-100 text-orange-950 rounded-[2rem] text-xl font-black border-b-4 border-orange-200 active:scale-95 transition-all"
          >
            RESTART
          </button>

          <button
            onClick={onSettings}
            className="w-full py-4 bg-yellow-100 text-orange-950 rounded-[2rem] text-xl font-black border-b-4 border-yellow-200 active:scale-95 transition-all"
          >
            SETTINGS
          </button>
          
          <button
            onClick={onQuit}
            className="w-full py-4 bg-slate-100 text-slate-500 rounded-[2rem] text-xl font-black active:scale-95 transition-all"
          >
            QUIT TO MENU
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PauseMenu;
