
import React from 'react';
import { motion as m } from 'framer-motion';

const motion = m as any;

interface TutorialOverlayProps {
  onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 max-w-sm w-full text-center shadow-2xl relative"
      >
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 border-4 border-yellow-400">👵</div>
        <h2 className="text-3xl font-black text-orange-950 mb-4">Arey Beta!</h2>
        <p className="text-slate-600 mb-8 font-medium leading-relaxed">
          Welcome to my kitchen! Just <span className="text-orange-600 font-bold">swap two items</span> to make a match of <span className="text-orange-600 font-bold">three or more</span>.
          <br/><br/>
          Match 4 or 5 to create <span className="text-red-500 font-bold">Spicy Power-ups!</span>
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-5 bg-orange-600 text-white rounded-[2rem] text-xl font-black shadow-lg shadow-orange-100 hover:bg-orange-500 active:scale-95 transition-all"
        >
          I'm Ready, Dadi!
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TutorialOverlay;
