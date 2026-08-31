const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// 1. Add Icons
if (!code.includes('UserCheck,')) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, UserCheck, UserX} from 'lucide-react';");
}

// 2. Add Presensi Logic
const calcRegex = /let jmUlya = 0, jmWus = 0, jmTd = 0;\s*let jpUlya = 0, jpWus = 0, jpTd = 0;\s*rows\.forEach\(r => \{/;
const newCalc = `let jmUlya = 0, jmWus = 0, jmTd = 0;
  let jpUlya = 0, jpWus = 0, jpTd = 0;
  let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlfa = 0;

  rows.forEach(r => {
    const p = (r.Presensi || '').toLowerCase();
    if (p.includes('hadir')) totalHadir++;
    else if (p.includes('izin')) totalIzin++;
    else if (p.includes('sakit')) totalSakit++;
    else if (p.includes('alfa') || p.includes('tanpa keterangan')) totalAlfa++;
`;
code = code.replace(calcRegex, newCalc);

// 3. Add UI Cards
const cardsRegex = /\{\/\* Total Jam Mengajar & Jam Pengganti Cards \*\/\}\s*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t-2 border-slate-100">/;

const newCards = `{/* Rekap Kehadiran & Jam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t-2 border-slate-100">
          
          {/* Kehadiran Card */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
              <UserCheck className="w-24 h-24 text-blue-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100 text-blue-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Kehadiran
                </h3>
              </div>
              <span className="bg-blue-600 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalHadir} Hari
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-blue-700 block uppercase tracking-wider mb-1">Total Hadir Mengajar</span>
              <span className="text-3xl font-black text-slate-800">{totalHadir}</span>
            </div>
          </div>

          {/* Ketidakhadiran Card */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 -rotate-12">
              <UserX className="w-24 h-24 text-rose-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-rose-100 text-rose-600">
                  <UserX className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Ketidakhadiran
                </h3>
              </div>
              <span className="bg-rose-500 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalIzin + totalSakit + totalAlfa} Hari
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 block uppercase tracking-wider mb-1">Izin</span>
                <span className="text-2xl font-black text-slate-800">{totalIzin}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 block uppercase tracking-wider mb-1">Sakit</span>
                <span className="text-2xl font-black text-slate-800">{totalSakit}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 block uppercase tracking-wider mb-1">Alfa</span>
                <span className="text-2xl font-black text-slate-800">{totalAlfa}</span>
              </div>
            </div>
          </div>

          {/* Jam Mengajar (JM) Card */}`;

code = code.replace(cardsRegex, newCards);

fs.writeFileSync('src/components/CekDataView.tsx', code);
