import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { User, ViewMode, RecordRow } from '../types';
import { OFFICIAL_LOGO_URL, formatTanggalIndo } from '../constants';
import { listenToTeacherRequests, EditRequest } from '../lib/editRequests';
import { 
  Crown, FileEdit, BarChart3, BookOpen, Calendar, Star, 
  Users, MessageCircle, Bell, User as UserIcon, School, 
  LogOut, ChevronDown, ChevronRight, X, Clock, Loader} from 'lucide-react';

interface MenuViewProps {
  user: User;
  onNavigate: (view: ViewMode) => void;
  onLogout: () => void;
  devAlert: () => void;
  globalData?: RecordRow[];
}

const getTeacherTitle = (name: string): string => {
  const titles: Record<string, string> = {
    'Hidayatullah': 'Pimpinan Pondok Pesantren',
    'Rahmat Dipuro': 'Kepala Program SPM Ulya',
    'Arif Wicaksono': 'Wakil Program TD',
    'Sulistiono': 'Guru Diniyah',
    'Muhammad Fadll': 'Guru Diniyah',
    'Muchammad Firdaus': 'Guru Umum',
    'Satrio Wibowo': 'Kepala Program SPS Wustho',
    'Aji Saputro': 'Wakil Kepala Program SW',
    'M. Nurcholis Saputra': 'Guru Diniyah',
    'Muhammad Hapsendra': 'Guru Diniyah',
    'Ridho Tegar Pratama': 'Guru Diniyah',
    'Tsabit Abu Najjah': 'Guru Diniyah',
    'Anggara Pratodi': 'Guru Diniyah',
    'Bagus Kurniawan': 'Tata Usaha',
    'Yuviter Pradeska': 'Tata Usaha',
    'Jefy Mahendra': 'Wali Asrama',
    'M. Timbun': 'Pengampu Hafalan',
    'Rizki Saputra': 'Wakil Kepala SPM Ulya',
    'Vega Ilyasa': 'Guru Diniyah',
    'Muhammad Robby Putra': 'Guru Diniyah',
    'Kgs. Muhammad Fauzan': 'Guru Diniyah',
    'Harbudi': 'Guru Umum',
    'Rizky juni': 'Guru Diniyah',
    'Shayyiban Naafian': 'Guru Diniyah',
    'Abdurrahman Rafiq': 'Wali Asrama'
  };

  return titles[name] || 'Guru';
};

const getDisplayName = (name: string): string => {
  const ustadzNames = [
    'Hidayatullah',
    'Rahmat Dipuro',
    'Arif Wicaksono',
    'Sulistiono',
    'Muhammad Fadll',
    'Muchammad Firdaus',
    'Satrio Wibowo',
    'Aji Saputro',
    'M. Nurcholis Saputra',
    'Muhammad Hapsendra',
    'Ridho Tegar Pratama',
    'Tsabit Abu Najjah',
    'Anggara Pratodi',
    'Jefy Mahendra',
    'Rizki Saputra',
    'Vega Ilyasa',
    'Muhammad Robby Putra',
    'Kgs. Muhammad Fauzan'
  ];
  if (ustadzNames.includes(name)) {
    return `Ustadz ${name}`;
  }
  return name;
};

export function MenuView({ user, onNavigate, onLogout, devAlert, globalData = [] }: MenuViewProps) {
  const isSpecialUser = user.username === 'yvt11' || user.username === 'bgs10';

  const [pendingRequests, setPendingRequests] = useState<EditRequest[]>([]);

  useEffect(() => {
    if (user.role === 'user' && user.teacherName) {
      const unsubscribe = listenToTeacherRequests(user.teacherName, setPendingRequests);
      return () => unsubscribe();
    }
  }, [user]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subFasilitasOpen, setSubFasilitasOpen] = useState(false);
  const [subPerangkatOpen, setSubPerangkatOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load avatar from localStorage
    const savedAvatar = localStorage.getItem(`avatar_${user.teacherName}`);
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, [user.teacherName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showToast, setShowToast] = useState(false);
  const [lastFillDate, setLastFillDate] = useState<string>('');
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (globalData && globalData.length > 0 && !toastShownRef.current) {
      const userRecords = globalData.filter(r => r.Nama_Guru === user.teacherName);
      if (userRecords.length > 0) {
        // Get the most recent date by sorting
        const sorted = [...userRecords].sort((a, b) => new Date(b.Tanggal).getTime() - new Date(a.Tanggal).getTime());
        const lastRecord = sorted[0];
        
        if (lastRecord.Tanggal) {
          const d = new Date(lastRecord.Tanggal);
          const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          const dayName = days[d.getDay()];
          const formattedDate = formatTanggalIndo(lastRecord.Tanggal);
          
          setLastFillDate(`${dayName}, ${formattedDate}`);
          setShowToast(true);
          toastShownRef.current = true;
          
          const timer = setTimeout(() => {
            setShowToast(false);
          }, 10000);
          return () => clearTimeout(timer);
        }
      }
      // Even if no records, mark as checked so it doesn't keep running
      toastShownRef.current = true;
    }
  }, [globalData, user.teacherName]);

  const handleLogoutConfirm = () => {
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari akun ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    });
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem(`avatar_${user.teacherName}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedback = () => {
    Swal.fire({
      title: 'Kotak Saran & Masukan',
      html: `
        <div class="text-left">
          <p class="text-sm text-slate-600 mb-4">Saran dan masukan Anda sangat berarti bagi pengembangan aplikasi ini.</p>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Pesan / Saran</label>
            <textarea id="feedback-message" rows="4" class="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-emerald-500 focus:ring-0 outline-none text-sm" placeholder="Tuliskan saran atau masukan Anda di sini..."></textarea>
          </div>
          <div class="mb-2">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Kirim Melalui:</label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" id="btn-email" class="flex flex-col items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-colors font-semibold text-sm">
                <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Email
              </button>
              <button type="button" id="btn-wa" class="flex flex-col items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-3 rounded-xl transition-colors font-semibold text-sm">
                <svg class="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-lg font-bold text-slate-800'
      },
      didOpen: () => {
        const messageInput = document.getElementById('feedback-message') as HTMLTextAreaElement;
        const btnEmail = document.getElementById('btn-email');
        const btnWa = document.getElementById('btn-wa');
        
        btnEmail?.addEventListener('click', () => {
          const message = messageInput.value.trim();
          if (!message) {
            Swal.showValidationMessage('Silakan isi pesan terlebih dahulu');
            return;
          }
          const subject = encodeURIComponent('Saran dan Masukan - E-Kartu Mengajar');
          const body = encodeURIComponent(`Assalamu'alaikum,\n\nNama: ${user.teacherName}\n\nPesan:\n${message}`);
          window.location.href = `mailto:almadina.program.sa@gmail.com?subject=${subject}&body=${body}`;
          Swal.close();
        });

        btnWa?.addEventListener('click', () => {
          const message = messageInput.value.trim();
          if (!message) {
            Swal.showValidationMessage('Silakan isi pesan terlebih dahulu');
            return;
          }
          const text = encodeURIComponent(`Assalamu'alaikum,\n\nSaya ${user.teacherName}\n\n*Saran/Masukan:*\n${message}`);
          window.open(`https://wa.me/6285273216532?text=${text}`, '_blank');
          Swal.close();
        });
      }
    });
  };

  const showNotificationInfo = () => {
    Swal.fire({
      title: 'Pengingat Bersama',
      html: `
        <div class="text-left text-sm mt-2 mb-4 text-slate-700 font-medium">
          Bismillah, Izin mengingatkan Asatidzah Semua :
        </div>
        <div class="text-left space-y-4 text-sm">
          <div class="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-lg shadow-sm">
            <strong class="text-emerald-800 block mb-1 flex items-center"><span class="text-lg mr-2">📝</span> Isi Rutin</strong>
            <span class="text-slate-600 leading-relaxed block">Mohon isi secara berkala setiap hari agar tidak terlupa dan pengisian data menumpuk.</span>
          </div>
          <div class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg shadow-sm">
            <strong class="text-amber-800 block mb-1 flex items-center"><span class="text-lg mr-2">📅</span> Presensi Kehadiran</strong>
            <span class="text-slate-600 leading-relaxed block">Jika tidak hadir, mohon tetap isi presensi. Pilih 'Tidak Hadir' dan Pilih keterangan. (kecuali hari ahad)</span>
          </div>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg shadow-sm">
            <strong class="text-blue-800 block mb-1 flex items-center"><span class="text-lg mr-2">🔍</span> Cek Ulang</strong>
            <span class="text-slate-600 leading-relaxed block">Pastikan jumlah jam & jenjang mengajar sudah benar sebelum klik tombol KIRIM.</span>
          </div>
          <div class="bg-purple-50 border-l-4 border-purple-500 p-3 rounded-r-lg shadow-sm">
            <strong class="text-purple-800 block mb-1 flex items-center"><span class="text-lg mr-2">📊</span> Lihat Riwayat</strong>
            <span class="text-slate-600 leading-relaxed block">Cek isian sebelumnya via tombol Rincian Data di menu Ringkasan Statistik.</span>
          </div>
          <div class="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg shadow-sm">
            <strong class="text-rose-800 block mb-1 flex items-center"><span class="text-lg mr-2">🎧</span> Bantuan</strong>
            <span class="text-slate-600 leading-relaxed block">Jika ada kendala atau salah input, silahkan hubungi Admin untuk perbaikan data.</span>
          </div>
        </div>
        <div class="text-center text-sm mt-5 mb-1 text-slate-700 italic">
          Jazakumullahu Khoiron Atas perhatian dan kerjasamanya, Semoga Allah Mudahkan.
        </div>
      `,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#10b981',
      customClass: {
        popup: 'rounded-2xl',
        title: 'text-xl font-extrabold text-slate-800 border-b pb-3',
        htmlContainer: '!m-0 !p-2'
      }
    });
  };


  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">


      {/* Sleek & Compact Ahlan wa Sahlan Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 rounded-2xl shadow-md flex justify-between items-center relative border border-emerald-600/30 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={handleAvatarClick}
            className="bg-white/10 p-1.5 rounded-xl backdrop-blur-sm border border-white/20 shrink-0 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 overflow-hidden"
            title="Klik untuk mengubah foto profil"
          >
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-11 h-11 object-cover rounded-lg"
              />
            ) : (
              <UserIcon className="w-11 h-11 p-2 text-emerald-100" />
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-200">Ahlan wa Sahlan,</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-amber-300 font-bold border border-amber-300/30 uppercase tracking-wider shrink-0">
                {user.role}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white leading-tight mt-0.5 line-clamp-2 break-words">
              {getDisplayName(user.teacherName)}
            </h2>
            <p className="text-[11px] text-emerald-200 font-medium mt-0.5 line-clamp-2 break-words">
              {getTeacherTitle(user.teacherName)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Button */}
          <button 
            onClick={showNotificationInfo}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95"
            title="Info Pengisian e-Kartu"
          >
            <Bell className="w-5 h-5 text-amber-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-emerald-800 animate-pulse"></span>
          </button>

          {/* Profile Logo Dropdown Wrapper */}
          <div className="relative" ref={dropdownRef}>
            <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none ring-2 ring-emerald-400/50 hover:ring-amber-300 rounded-full transition-all active:scale-95"
            title="Menu Profil & Fasilitas"
          >
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Logo" referrerPolicy="no-referrer" 
              className="w-11 h-11 object-contain bg-white rounded-full p-1 shadow-md hover:border-emerald-300 border border-emerald-200 transition-all"
              
              
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl z-[100] text-slate-800 border border-emerald-100 text-xs md:text-sm overflow-hidden flex flex-col animate-fade-in">
              <button 
                onClick={() => { devAlert(); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-emerald-50 font-bold border-b border-slate-100 flex items-center transition-colors text-slate-700"
              >
                <UserIcon className="w-4 h-4 mr-3 text-emerald-600" /> Profil Guru
              </button>

              {/* Fasilitas */}
              <div>
                <button 
                  onClick={() => setSubFasilitasOpen(!subFasilitasOpen)}
                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 font-bold border-b border-slate-100 flex justify-between items-center transition-colors text-slate-700"
                >
                  <div className="flex items-center">
                    <School className="w-4 h-4 mr-3 text-amber-500" /> Fasilitas
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${subFasilitasOpen ? 'rotate-180' : ''}`} />
                </button>

                {subFasilitasOpen && (
                  <div className="bg-slate-50 flex flex-col w-full border-b border-slate-100">
                    <button 
                      onClick={() => { devAlert(); setDropdownOpen(false); }}
                      className="w-full text-left pl-10 pr-4 py-2.5 hover:bg-emerald-100 text-slate-700 border-b border-slate-200/50 text-xs font-semibold"
                    >
                      Administrasi Guru
                    </button>
                    
                    <a 
                      href="https://drive.google.com/drive/folders/1oe5rYQUOfsw-qR9fVMsMEtXYe0a0yStf?usp=sharing" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full text-left pl-10 pr-4 py-2.5 hover:bg-emerald-100 text-slate-700 border-b border-slate-200/50 text-xs font-semibold block"
                    >
                      Bank Soal (Google Drive)
                    </a>

                    <a 
                      href="https://drive.google.com/drive/folders/1mYMiHlFLVrRoHGZdSr9Fnt9sX1Fa02wS?usp=sharing" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full text-left pl-10 pr-4 py-2.5 hover:bg-emerald-100 text-slate-700 border-b border-slate-200/50 text-xs font-semibold block"
                    >
                      Bank Soal (guru SW)
                    </a>

                    {/* Perangkat Ajar */}
                    <div>
                      <button 
                        onClick={() => setSubPerangkatOpen(!subPerangkatOpen)}
                        className="w-full text-left pl-10 pr-4 py-2.5 hover:bg-emerald-100 text-slate-700 text-xs font-semibold flex justify-between items-center"
                      >
                        <span>Perangkat Ajar</span>
                        <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${subPerangkatOpen ? 'rotate-90' : ''}`} />
                      </button>

                      {subPerangkatOpen && (
                        <div className="bg-slate-100 flex flex-col w-full border-t border-slate-200">
                          <button onClick={devAlert} className="w-full text-left pl-14 pr-4 py-2 hover:bg-emerald-200 text-[11px] text-slate-600 border-b border-slate-200/50">Kalender Pendidikan & RPE</button>
                          <button onClick={devAlert} className="w-full text-left pl-14 pr-4 py-2 hover:bg-emerald-200 text-[11px] text-slate-600 border-b border-slate-200/50">Promes/Prosem</button>
                          <button onClick={devAlert} className="w-full text-left pl-14 pr-4 py-2 hover:bg-emerald-200 text-[11px] text-slate-600 border-b border-slate-200/50">Alur Tujuan Pembelajaran</button>
                          <button onClick={devAlert} className="w-full text-left pl-14 pr-4 py-2 hover:bg-emerald-200 text-[11px] text-slate-600 border-b border-slate-200/50">Modul Ajar</button>
                          <button onClick={devAlert} className="w-full text-left pl-14 pr-4 py-2 hover:bg-emerald-200 text-[11px] text-slate-600 border-b border-slate-200/50">Jurnal</button>
                          <button onClick={devAlert} className="w-full text-left pl-14 pr-4 py-2 hover:bg-emerald-200 text-[11px] text-slate-600 border-b border-slate-200/50">Instrumen Penilaian</button>
                          <button onClick={devAlert} className="w-full text-left pl-14 pr-4 py-2 hover:bg-emerald-200 text-[11px] text-slate-600 border-b border-slate-200/50">Kitab Pegangan Guru</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleLogoutConfirm}
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-bold flex items-center transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" /> Logout
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Pending Requests Notification */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in">
          <Clock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Perubahan data sedang diproses</h4>
            <p className="text-xs mt-1">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. (Jika disetujui, notif ini akan hilang otomatis).</p>
          </div>
        </div>
      )}

      {/* Activity Notification */}
      {showToast && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4 sm:p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-50 p-3 rounded-full border border-emerald-100 shrink-0">
            <Calendar className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="text-sm font-bold text-slate-800">Aktivitas Terakhir</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Anda terakhir mengisi E-Kartu Mengajar pada:<br/>
              <span className="font-bold text-emerald-700 block mt-1">{lastFillDate}</span>
            </p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors -mr-2 -mt-2 focus:outline-none shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Grid Options */}
      <div className="space-y-4">
        {/* Superadmin / Admin Dashboard Button */}
        {(user.role === 'superadmin' || user.role === 'admin') && (
          <button 
            onClick={() => onNavigate('admin-dashboard')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col items-center border-b-4 border-indigo-800 active:scale-95"
          >
            <Crown className="w-8 h-8 mb-1.5 text-amber-300" />
            <span className="font-extrabold text-sm tracking-wide uppercase">Dashboard Evaluasi Admin</span>
          </button>
        )}

        {/* 2-Column Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('form')}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-4 border-emerald-500 hover:border-emerald-600 active:scale-95"
          >
            <FileEdit className="w-8 h-8 mb-2 text-emerald-600" />
            <span className="font-bold text-sm text-slate-800 text-center">{isSpecialUser ? 'Kartu Kehadiran' : 'Kartu Mengajar'}</span>
          </button>

          <button 
            onClick={() => onNavigate('dashboard')}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-4 border-amber-400 hover:border-amber-500 active:scale-95"
          >
            <BarChart3 className="w-8 h-8 mb-2 text-amber-500" />
            <span className="font-bold text-sm text-slate-800 text-center">Dashboard Rekap</span>
          </button>

          <button 
            onClick={devAlert}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-2 border-slate-200 opacity-80 active:scale-95"
          >
            <BookOpen className="w-8 h-8 mb-2 text-indigo-500" />
            <span className="font-semibold text-xs md:text-sm text-slate-700 text-center">Jurnal Mengajar</span>
          </button>

          <button 
            onClick={() => onNavigate('pusat-informasi')}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-2 border-slate-200 opacity-80 active:scale-95"
          >
            <Calendar className="w-8 h-8 mb-2 text-sky-500" />
            <span className="font-semibold text-xs md:text-sm text-slate-700 text-center">Pusat Informasi</span>
          </button>

          <button 
            onClick={() => onNavigate('perangkat')}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-2 border-slate-200 active:scale-95"
          >
            <Star className="w-8 h-8 mb-2 text-amber-400" />
            <span className="font-semibold text-xs md:text-sm text-slate-700 text-center">Perangkat Pembelajaran</span>
          </button>

          <button 
            onClick={() => onNavigate('arsip')}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-2 border-slate-200 active:scale-95"
          >
            <Users className="w-8 h-8 mb-2 text-teal-500" />
            <span className="font-semibold text-xs md:text-sm text-slate-700 text-center">Arsip</span>
          </button>

          {/* Kotak Saran Button */}
          <button 
            onClick={handleFeedback}
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center border-b-4 border-emerald-500 col-span-2 gap-2 mt-2 hover:bg-emerald-50/50"
          >
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-sm text-emerald-800">Kotak Saran & Masukan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
