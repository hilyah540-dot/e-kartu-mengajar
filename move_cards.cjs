const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// 1. Remove old cards block
const oldCardsRegex = /\s*\{\/\* Total Jam Mengajar & Jam Pengganti Cards \*\/\}[\s\S]*?(?=\{\/\* Table Rincian \*\/\})/;
code = code.replace(oldCardsRegex, '\n        ');

const newCardsBlock = `
        {/* Total Jam Mengajar & Jam Pengganti Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t-2 border-slate-100">
          {/* Jam Mengajar (JM) Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
              <BookOpen className="w-24 h-24 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-emerald-100 text-emerald-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Mengajar (JM)
                </h3>
              </div>
              <span className="bg-emerald-600 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {jmUlya + jmWus + jmTd} Jam
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block uppercase tracking-wider mb-1">Ulya</span>
                <span className="text-2xl font-black text-slate-800">{jmUlya}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block uppercase tracking-wider mb-1">Wustho</span>
                <span className="text-2xl font-black text-slate-800">{jmWus}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block uppercase tracking-wider mb-1">Tadribud</span>
                <span className="text-2xl font-black text-slate-800">{jmTd}</span>
              </div>
            </div>
          </div>

          {/* Jam Pengganti (JP) Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 -rotate-12">
              <Repeat className="w-24 h-24 text-amber-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-amber-100 text-amber-600">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Pengganti (JP)
                </h3>
              </div>
              <span className="bg-amber-500 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {jpUlya + jpWus + jpTd} Jam
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 block uppercase tracking-wider mb-1">Ulya</span>
                <span className="text-2xl font-black text-slate-800">{jpUlya}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 block uppercase tracking-wider mb-1">Wustho</span>
                <span className="text-2xl font-black text-slate-800">{jpWus}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 block uppercase tracking-wider mb-1">Tadribud</span>
                <span className="text-2xl font-black text-slate-800">{jpTd}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons at the Bottom */}`;

const endAreaRegex = /\s*<\/div>\s*\{\/\* Action Buttons at the Bottom \*\/\}/;
code = code.replace(endAreaRegex, newCardsBlock);

// 3. Rename buttons text
code = code.replace('<Download className="w-5 h-5" /> Unduh Gambar', '<Download className="w-5 h-5" /> Download');
code = code.replace('<Share2 className="w-5 h-5" /> Bagikan ke WA', '<Share2 className="w-5 h-5" /> Share');

fs.writeFileSync('src/components/CekDataView.tsx', code);
