
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameState, TileData, SpecialEffect, BoosterType, GameSettings } from './types.ts';
import { GRID_SIZE, FOOD_CONFIG, LEVELS } from './constants.tsx';
import { initBoard, findMatches, applyGravity, createTile, shuffleBoard } from './gameLogic.ts';
import { getAiHint } from './utils/ai.ts';
import Tile from './components/Tile.tsx';
import SettingsMenu from './components/SettingsMenu.tsx';
import ResultOverlay from './components/ResultOverlay.tsx';
import TutorialOverlay from './components/TutorialOverlay.tsx';
import PauseMenu from './components/PauseMenu.tsx';
import DailyRewardOverlay from './components/DailyRewardOverlay.tsx';
import { playPop, playSwap, playSpecial, playWin, playLose, startBackgroundMusic, stopBackgroundMusic, setMusicVolume, setSfxVolume } from './utils/sounds.ts';

const PRAISE = ["Darun!", "Shabash!", "Khub Bhalo!", "Fatafati!", "Chomokdar!", "Wah Beta!", "Boss Style!"];
const PRAISE_BN = ["দারুণ!", "শাবাশ!", "খুব ভালো!", "ফাটাফাটি!", "চমকদার!", "ওয়াহ বেটা!", "বস স্টাইল!"];

const App: React.FC = () => {
  const [screen, setScreen] = useState<'MENU' | 'LEVELS' | 'GAME' | 'RESULT'>('MENU');
  const [showSettings, setShowSettings] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [comboCount, setComboCount] = useState(0);

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('desi_feast_save');
    const defaultSettings: GameSettings = {
      soundEnabled: true,
      musicEnabled: true,
      sfxVolume: 0.5,
      musicVolume: 0.3,
      language: 'EN'
    };
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, isAnimating: false, board: [], activeBooster: null, showTutorial: parsed.showTutorial ?? true };
    }
    
    return {
      currentLevel: 1,
      score: 0,
      movesLeft: 30,
      board: [],
      isAnimating: false,
      unlockedLevels: 1,
      collected: {},
      boosters: { HAMMER: 2, SHUFFLE: 2, BOMB: 1, ROW_CLEAR: 1 },
      activeBooster: null,
      streak: 0,
      lastClaimDate: null,
      showTutorial: true,
      settings: defaultSettings
    };
  });
  
  const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);
  const [hint, setHint] = useState<{ r1: number, c1: number, r2: number, c2: number, msg: string } | null>(null);
  const [praiseText, setPraiseText] = useState<string | null>(null);

  useEffect(() => {
    const { board, isAnimating, activeBooster, ...toSave } = gameState;
    localStorage.setItem('desi_feast_save', JSON.stringify(toSave));
  }, [gameState]);

  useEffect(() => {
    setMusicVolume(gameState.settings.musicVolume);
    setSfxVolume(gameState.settings.sfxVolume);
    if (gameState.settings.musicEnabled) startBackgroundMusic();
    else stopBackgroundMusic();

    const today = new Date().toDateString();
    if (gameState.lastClaimDate !== today) {
      setShowDaily(true);
    }
  }, [gameState.settings]);

  const startLevel = (id: number) => {
    const level = LEVELS.find(l => l.id === id) || LEVELS[0];
    setGameState(prev => ({
      ...prev,
      currentLevel: id,
      score: 0,
      movesLeft: level.moves,
      board: initBoard(),
      isAnimating: false,
      activeBooster: null
    }));
    setScreen('GAME');
    setSelected(null);
    setHint(null);
  };

  const processMatches = async (board: (TileData | null)[][], combo: number = 0) => {
    const { indices, specials } = findMatches(board);
    if (indices.length === 0) {
      setGameState(prev => ({ ...prev, isAnimating: false, board }));
      setComboCount(0);
      return;
    }

    setGameState(prev => ({ ...prev, isAnimating: true }));
    setComboCount(combo + 1);

    if (combo > 0) {
      const list = gameState.settings.language === 'BN' ? PRAISE_BN : PRAISE;
      setPraiseText(list[Math.min(combo, list.length - 1)]);
      setTimeout(() => setPraiseText(null), 1000);
    }

    playPop();
    const newBoard = board.map(row => [...row]);
    indices.forEach(({ r, c }) => { newBoard[r][c] = null; });
    specials.forEach(({ r, c, effect, type }) => { newBoard[r][c] = createTile(type, effect); });

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      score: prev.score + (indices.length * 20 * (combo + 1))
    }));

    await new Promise(r => setTimeout(r, 400));
    const gravitationBoard = applyGravity(newBoard);
    setGameState(prev => ({ ...prev, board: gravitationBoard }));
    await new Promise(r => setTimeout(r, 400));

    return processMatches(gravitationBoard, combo + 1);
  };

  const handleBoosterAction = (r: number, c: number) => {
    const booster = gameState.activeBooster;
    if (!booster) return;

    const newBoard = gameState.board.map(row => [...row]);
    playSpecial();

    if (booster === 'HAMMER') newBoard[r][c] = null;
    else if (booster === 'BOMB') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) newBoard[nr][nc] = null;
        }
      }
    } else if (booster === 'ROW_CLEAR') {
      for (let i = 0; i < GRID_SIZE; i++) newBoard[r][i] = null;
    }

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      activeBooster: null,
      boosters: { ...prev.boosters, [booster]: prev.boosters[booster] - 1 }
    }));
    processMatches(newBoard);
  };

  const handleSwap = async (r1: number, c1: number, r2: number, c2: number) => {
    const board = gameState.board.map(row => [...row]);
    const t1 = board[r1][c1];
    const t2 = board[r2][c2];
    
    board[r1][c1] = t2;
    board[r2][c2] = t1;
    
    setGameState(prev => ({ ...prev, board, movesLeft: prev.movesLeft - 1 }));
    playSwap();
    setHint(null);

    const { indices } = findMatches(board);
    if (indices.length > 0) {
      processMatches(board);
    } else {
      await new Promise(r => setTimeout(r, 300));
      const revert = board.map(row => [...row]);
      revert[r1][c1] = t1;
      revert[r2][c2] = t2;
      setGameState(prev => ({ ...prev, board: revert }));
    }
  };

  const claimDaily = (type: BoosterType, amount: number) => {
    setGameState(prev => ({
      ...prev,
      boosters: { ...prev.boosters, [type]: prev.boosters[type] + amount },
      lastClaimDate: new Date().toDateString(),
      streak: prev.streak + 1
    }));
    setShowDaily(false);
  };

  const t = (en: string, bn: string) => gameState.settings.language === 'BN' ? bn : en;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto relative px-4 overflow-hidden bg-royal">
      <AnimatePresence mode="wait">
        {screen === 'MENU' && (
          <motion.div key="menu" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center w-full">
            <div className="mb-8">
               <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-9xl mb-4 drop-shadow-2xl">👩‍🍳</motion.div>
               <h1 className="text-7xl font-black text-orange-950 font-bubbly drop-shadow-xl -mb-2">Desi Feast</h1>
               <div className="text-pink-600 font-black tracking-widest text-sm uppercase">{t('The Royal Kitchen', 'রাজকীয় পাকঘর')}</div>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => setScreen('LEVELS')} className="py-6 bg-pink-500 text-white rounded-[2.5rem] text-3xl font-black border-b-8 border-pink-700 shadow-2xl active:scale-95 transition-all font-bubbly">
                {t('START COOKING', 'রান্না শুরু করুন')}
              </button>
              <button onClick={() => setShowSettings(true)} className="py-4 bg-white text-orange-900 rounded-[2rem] text-xl font-black shadow-lg active:scale-95 border-b-4 border-slate-100">
                {t('SETTINGS', 'সেটিংস')}
              </button>
            </div>
            <div className="mt-12 opacity-40 text-[10px] font-bold text-orange-900 uppercase tracking-widest">
               Authentic Flavors since v1.2.0
            </div>
          </motion.div>
        )}

        {screen === 'LEVELS' && (
          <motion.div key="levels" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100 }} className="w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-black text-orange-950 font-bubbly">{t('Recipe Book', 'রেসিপি বুক')}</h2>
              <button onClick={() => setScreen('MENU')} className="text-3xl p-2 bg-white rounded-full shadow-md">🏠</button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
              {LEVELS.map(l => {
                const isLocked = l.id > gameState.unlockedLevels;
                return (
                  <button 
                    key={l.id} 
                    disabled={isLocked}
                    onClick={() => startLevel(l.id)}
                    className={`w-full p-6 rounded-[2rem] shadow-lg border-b-4 flex items-center gap-6 transition-all relative overflow-hidden
                      ${isLocked ? 'bg-slate-100 text-slate-400 grayscale' : 'bg-white text-orange-900 border-orange-100 active:scale-[0.98]'}`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black
                      ${isLocked ? 'bg-slate-200' : 'bg-pink-100 text-pink-500'}`}>
                      {isLocked ? '🔒' : l.id}
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-xs font-black uppercase tracking-widest opacity-60">Level {l.id}</div>
                      <div className="text-xl font-black">{t(l.recipeName, l.recipeName)}</div>
                    </div>
                    {!isLocked && <div className="text-yellow-400 text-2xl">⭐⭐⭐</div>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {screen === 'GAME' && (
          <motion.div key="game" className="w-full h-full flex flex-col py-4">
            <div className="flex justify-between items-center mb-4 bg-white/90 p-4 rounded-3xl shadow-md border-2 border-white">
              <div className="flex gap-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-pink-500">{t('Goal', 'লক্ষ্য')}</span>
                    <span className="text-2xl font-black text-orange-900 font-bubbly">{LEVELS.find(l => l.id === gameState.currentLevel)?.target}</span>
                 </div>
                 <div className="w-px bg-slate-100 h-8 self-center" />
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-slate-400">{t('Score', 'স্কোর')}</span>
                    <span className="text-2xl font-black text-orange-900 font-bubbly">{gameState.score}</span>
                 </div>
              </div>
              <div className="bg-pink-500 px-6 py-2 rounded-2xl border-b-4 border-pink-700">
                <span className="text-2xl font-black text-white font-bubbly">{gameState.movesLeft}</span>
                <span className="ml-1 text-xs font-bold text-white/80">{t('Moves', 'চাল')}</span>
              </div>
              <button onClick={() => setIsPaused(true)} className="text-3xl">⏸️</button>
            </div>

            {/* Dadi's Interaction Zone */}
            <div className="flex items-center gap-4 mb-4 bg-orange-50/80 p-3 rounded-2xl border border-orange-100">
               <motion.div animate={{ scale: comboCount > 2 ? [1, 1.2, 1] : 1 }} className="text-5xl drop-shadow-md">👵</motion.div>
               <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm relative flex-1 min-h-[40px] flex items-center">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-white rotate-45" />
                  <p className="text-xs font-bold text-slate-700 italic">
                    {comboCount > 3 ? t("Oma! You are cooking fire, beta!", "ওমা! তুমি তো আগুন জ্বালাচ্ছো বেটা!") : 
                     gameState.movesLeft < 5 ? t("Be careful, the pot is getting hot!", "সাবধান, কড়াই গরম হয়ে যাচ্ছে!") : 
                     t("Just a few more, my chef!", "আর কয়েকটা চাল দাও তো দেখি!")}
                  </p>
               </div>
            </div>

            <div className={`relative aspect-square bg-[#ffebd6] rounded-[2.5rem] p-3 shadow-inner border-8 border-white overflow-hidden ${gameState.activeBooster ? 'ring-8 ring-pink-500/30' : ''}`}>
              <div className="grid grid-cols-8 grid-rows-8 gap-1.5 h-full w-full">
                {gameState.board.map((row, r) => row.map((tile, c) => (
                  <Tile 
                    key={tile?.id || `empty-${r}-${c}`}
                    tile={tile}
                    isSelected={selected?.r === r && selected?.c === c}
                    isHinted={hint && ((hint.r1 === r && hint.c1 === c) || (hint.r2 === r && hint.c2 === c))}
                    onClick={() => {
                      if (gameState.isAnimating) return;
                      if (gameState.activeBooster) return handleBoosterAction(r, c);
                      if (selected) {
                        if (Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1) {
                          handleSwap(selected.r, selected.c, r, c);
                          setSelected(null);
                        } else setSelected({ r, c });
                      } else setSelected({ r, c });
                    }}
                  />
                )))}
              </div>
              
              <AnimatePresence>
                {praiseText && (
                  <motion.div initial={{ scale: 0, opacity: 0, y: 50 }} animate={{ scale: 1.5, opacity: 1, y: -50 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
                    <span className="text-5xl font-black text-pink-500 font-bubbly drop-shadow-[0_4px_0_white]">{praiseText}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Booster Bar */}
            <div className="mt-6 grid grid-cols-5 gap-2">
              {(['HAMMER', 'SHUFFLE', 'BOMB', 'ROW_CLEAR'] as BoosterType[]).map(type => (
                <button 
                  key={type} 
                  onClick={() => {
                    if (gameState.boosters[type] <= 0) return;
                    if (type === 'SHUFFLE') {
                      const nb = shuffleBoard(gameState.board);
                      setGameState(p => ({ ...p, board: nb, boosters: { ...p.boosters, SHUFFLE: p.boosters.SHUFFLE - 1 }}));
                      processMatches(nb);
                    } else setGameState(p => ({ ...p, activeBooster: p.activeBooster === type ? null : type }));
                  }}
                  className={`relative flex flex-col items-center justify-center h-16 rounded-2xl border-b-4 transition-all
                    ${gameState.activeBooster === type ? 'bg-pink-500 text-white border-pink-700 scale-110 z-50 shadow-2xl' : 'bg-white text-slate-700 border-slate-100 shadow-md'}`}
                >
                  <span className="text-2xl">{type === 'HAMMER' ? '🔨' : type === 'SHUFFLE' ? '🔄' : type === 'BOMB' ? '💣' : '↔️'}</span>
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {gameState.boosters[type]}
                  </span>
                </button>
              ))}
              <button 
                onClick={async () => {
                   const h = await getAiHint(gameState.board);
                   if (h) setHint(h);
                }} 
                className="bg-white rounded-2xl shadow-md border-b-4 border-slate-100 flex items-center justify-center text-3xl"
              >
                👵
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsMenu 
            settings={gameState.settings} 
            onUpdate={s => setGameState(p => ({ ...p, settings: s }))}
            onClose={() => setShowSettings(false)}
            onReset={() => { localStorage.removeItem('desi_feast_save'); window.location.reload(); }}
          />
        )}
        {isPaused && (
           <PauseMenu 
             onContinue={() => setIsPaused(false)}
             onRestart={() => { setIsPaused(false); startLevel(gameState.currentLevel); }}
             onQuit={() => { setIsPaused(false); setScreen('MENU'); }}
             onSettings={() => setShowSettings(true)}
           />
        )}
        {gameState.showTutorial && screen === 'GAME' && (
           <TutorialOverlay onClose={() => setGameState(p => ({ ...p, showTutorial: false }))} />
        )}
        {showDaily && (
           <DailyRewardOverlay streak={gameState.streak + 1} onClaim={claimDaily} />
        )}
        {screen === 'RESULT' && (
          <ResultOverlay 
            title={gameState.score >= LEVELS.find(l => l.id === gameState.currentLevel)!.target ? t('Victory!', 'বিজয়!') : t('Oh No!', 'হায় হায়!')}
            message={gameState.score >= LEVELS.find(l => l.id === gameState.currentLevel)!.target ? t('The recipe is perfect!', 'রান্না একদম নিখুঁত হয়েছে!') : t('Beta, the rice is burnt!', 'বেটা, ভাত তো পুড়ে গেল!')}
            score={gameState.score}
            success={gameState.score >= LEVELS.find(l => l.id === gameState.currentLevel)!.target}
            stars={gameState.score > LEVELS.find(l => l.id === gameState.currentLevel)!.target * 1.5 ? 3 : 2}
            onAction={() => setScreen('LEVELS')}
            actionText={t('BACK TO KITCHEN', 'রান্নাঘরে ফিরুন')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
