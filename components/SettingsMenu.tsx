
import React from 'react';
import { motion } from 'framer-motion';
import { GameSettings } from '../types.ts';
import { CREATOR_INFO } from '../constants.tsx';

interface SettingsMenuProps {
  settings: GameSettings;
  onUpdate: (settings: GameSettings) => void;
  onReset: () => void;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdate, onReset, onClose }) => {
  const t = (en: string, bn: string) => settings.language === 'BN' ? bn : en;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative border-8 border-orange-50"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-3xl font-black text-orange-950 mb-8 font-bubbly">{t('Settings', 'সেটিংস')}</h2>

        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
          {/* Language Toggle */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
            <span className="font-bold text-slate-800">{t('Language', 'ভাষা')}</span>
            <button 
              onClick={() => onUpdate({ ...settings, language: settings.language === 'EN' ? 'BN' : 'EN' })}
              className="px-4 py-2 bg-white rounded-xl shadow-sm font-black text-orange-600 border border-orange-200"
            >
              {settings.language === 'EN' ? 'English' : 'বাংলা'}
            </button>
          </div>

          {/* Sound Toggles */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t('Music', 'সঙ্গীত')}</span>
                <input 
                  type="checkbox" checked={settings.musicEnabled}
                  onChange={e => onUpdate({ ...settings, musicEnabled: e.target.checked })}
                  className="w-6 h-6 accent-orange-600"
                />
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" value={settings.musicVolume}
                onChange={e => onUpdate({ ...settings, musicVolume: parseFloat(e.target.value) })}
                className="w-full accent-orange-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">{t('SFX', 'শব্দ প্রভাব')}</span>
                <input 
                  type="checkbox" checked={settings.soundEnabled}
                  onChange={e => onUpdate({ ...settings, soundEnabled: e.target.checked })}
                  className="w-6 h-6 accent-orange-600"
                />
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" value={settings.sfxVolume}
                onChange={e => onUpdate({ ...settings, sfxVolume: parseFloat(e.target.value) })}
                className="w-full accent-orange-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <button onClick={onReset} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
            <span>🗑️</span> {t('Reset Progress', 'প্রগতি রিসেট করুন')}
          </button>
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col items-center gap-1 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Desi Feast</div>
            <div className="text-lg font-black text-orange-950 font-bubbly">v1.2.0 - Royal Kitchen</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsMenu;
