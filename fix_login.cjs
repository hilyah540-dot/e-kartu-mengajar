const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { USER_MAP } from '../constants';
import { User, UserRole } from '../types';
import { OFFICIAL_LOGO_URL } from '../constants';
import { Lock, ArrowRight, UserCircle, Users } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [lastUsername, setLastUsername] = useState('');
  const [lastTeacherName, setLastTeacherName] = useState('');
  const [showManualLogin, setShowManualLogin] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('last_username');
    const savedName = localStorage.getItem('last_teacherName');
    if (savedUser && savedName) {
      setLastUsername(savedUser);
      setLastTeacherName(savedName);
      setUsername(savedUser);
    } else {
      setShowManualLogin(true);
    }
  }, []);

  const processLogin = (userToLogin: string) => {
    const trimmed = userToLogin.trim();
    if (USER_MAP[trimmed]) {
      const teacherName = USER_MAP[trimmed];
      let role: UserRole = 'user';
      if (trimmed === 'admin') {
        role = 'superadmin';
      } else if (['Mudir', 'kaprosw', 'kaprosa'].includes(trimmed)) {
        role = 'admin';
      }
      
      // Simpan untuk sesi berikutnya
      localStorage.setItem('last_username', trimmed);
      localStorage.setItem('last_teacherName', teacherName);

      onLoginSuccess({
        username: trimmed,
        role,
        teacherName
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Username anda belum benar',
        confirmButtonColor: '#10b981'
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    processLogin(username);
  };

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto min-h-[90vh] flex flex-col justify-center">
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-10 text-center relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
        
        <div className="mb-8 flex justify-center">
          <div className="bg-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Logo" referrerPolicy="no-referrer" 
              className="w-20 h-20 object-contain drop-shadow-sm"
            />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">E-Kartu Mengajar</h2>
        <p className="text-sm md:text-base text-slate-500 mb-8 font-medium">Pondok Pesantren Al-Madina</p>

        {lastUsername && !showManualLogin ? (
          <div className="animate-fade-in space-y-4">
            <div className="bg-slate-50 border border-emerald-100 p-5 rounded-2xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left flex items-center gap-4 shadow-sm group"
                 onClick={() => processLogin(lastUsername)}>
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <UserCircle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Lanjutkan Sebagai</p>
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{lastTeacherName}</h3>
                <p className="text-sm text-emerald-600 font-medium">@{lastUsername}</p>
              </div>
              <div className="text-emerald-500">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
            
            <button 
              onClick={() => setShowManualLogin(true)}
              className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" /> Masuk dengan akun lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border-2 border-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:ring-0 focus:border-emerald-500 outline-none font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 text-base md:text-lg transition-all"
                placeholder="Masukkan Username Anda"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-base md:text-lg flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {lastUsername && (
              <button 
                type="button"
                onClick={() => setShowManualLogin(false)}
                className="w-full py-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Batal
              </button>
            )}
          </form>
        )}

        <div className="mt-10 pt-5 border-t border-slate-100 flex flex-col items-center justify-center gap-1">
          <p className="text-[11px] md:text-xs text-slate-400 font-medium">
            Sistem Administrasi & Presensi Guru Terpadu
          </p>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/LoginView.tsx', code);
