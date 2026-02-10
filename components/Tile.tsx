
import React from 'react';
import { motion as m } from 'framer-motion';
import { TileData, SpecialEffect } from '../types';
import { FOOD_ITEMS } from '../constants';

const motion = m as any;

interface TileProps {
  tile: TileData | null;
  onClick: () => void;
  isSelected: boolean;
  isHinted?: boolean;
}

const Tile: React.FC<TileProps> = ({ tile, onClick, isSelected, isHinted }) => {
  if (!tile) return null;

  const food = FOOD_ITEMS[tile.type];
  const isColorBomb = tile.special === SpecialEffect.COLOR_BOMB;
  const isStripedH = tile.special === SpecialEffect.STRIPED_H;
  const isStripedV = tile.special === SpecialEffect.STRIPED_V;
  const isWrapped = tile.special === SpecialEffect.WRAPPED;

  return (
    <motion.div
      layout
      initial={{ y: -400, opacity: 0, scale: 0.5 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        scale: isSelected ? 1.1 : 1,
        rotate: isSelected ? [0, -3, 3, 0] : 0 
      }}
      exit={{ scale: 1.5, opacity: 0, filter: 'brightness(2)' }}
      transition={{ 
        y: { type: "spring", stiffness: 400, damping: 25, mass: 1 },
        rotate: { repeat: Infinity, duration: 0.4 },
        scale: { type: "spring", stiffness: 500, damping: 15 }
      }}
      onClick={onClick}
      className={`relative w-full h-full flex items-center justify-center cursor-pointer rounded-[1.2rem] shadow-[0_6px_0_rgba(0,0,0,0.15),inset_0_-4px_0_rgba(0,0,0,0.1)] transition-shadow
        ${isSelected ? 'z-50 ring-4 ring-white shadow-2xl' : 'z-10'}
        ${isHinted ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
        ${isColorBomb ? 'bg-gradient-to-br from-indigo-500 via-pink-500 to-yellow-400' : ''}`}
      style={{ backgroundColor: isColorBomb ? undefined : food.color }}
    >
      {/* 3D Glossy "Candy" Effect */}
      <div className="absolute top-1 left-1.5 w-[70%] h-1/3 bg-white/40 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-1/4 h-1/4 bg-black/10 rounded-full pointer-events-none" />

      {/* Special Power-up Visuals */}
      {isStripedH && (
        <div className="absolute inset-0 flex flex-col justify-around py-1.5 opacity-60">
           <div className="h-1 bg-white/90" /><div className="h-1 bg-white/90" /><div className="h-1 bg-white/90" />
        </div>
      )}
      {isStripedV && (
        <div className="absolute inset-0 flex justify-around px-1.5 opacity-60">
           <div className="w-1 bg-white/90" /><div className="w-1 bg-white/90" /><div className="w-1 bg-white/90" />
        </div>
      )}
      {isWrapped && (
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute -inset-1.5 border-[5px] border-white/40 rounded-[1.5rem] border-dotted" 
        />
      )}
      {tile.special !== SpecialEffect.NONE && (
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-white/20 rounded-[1.2rem]"
        />
      )}

      {/* Food Icon */}
      <div className={`text-2xl md:text-3xl lg:text-4xl select-none filter drop-shadow-[0_2px_1px_rgba(0,0,0,0.4)] ${isColorBomb ? 'scale-125 animate-bounce' : ''}`}>
        {isColorBomb ? '🍯' : food.icon}
      </div>

      {isSelected && (
        <motion.div 
          layoutId="glow" 
          className="absolute -inset-2 bg-white/30 rounded-[1.5rem] blur-md z-[-1]" 
        />
      )}
    </motion.div>
  );
};

export default Tile;
