import React from 'react';
import { OFFICIAL_LOGO_URL } from '../constants';
import { motion } from 'motion/react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/50 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-8">
          <img 
            src={OFFICIAL_LOGO_URL} 
            alt="Logo Al-Madina" referrerPolicy="no-referrer" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-xl"
          />
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-extrabold text-center text-slate-800 tracking-wide leading-tight"
        >
          E-Administrasi
          <span className="block text-emerald-600 mt-2 text-xl md:text-2xl font-bold">Ponpes Al-Madina Prabumulih</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="text-[10px] md:text-xs text-slate-500 mt-4 font-bold tracking-[0.2em] uppercase"
        >
          Sistem Presensi & Administrasi Guru
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex flex-col items-center"
        >
          <div className="w-8 h-8 border-[3px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
