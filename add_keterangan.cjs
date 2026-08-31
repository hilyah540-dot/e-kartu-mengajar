const fs = require('fs');
let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

const lemburBlock = `<div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-indigo-700 block uppercase tracking-wider mb-1">Total Jam Lembur</span>
              <span className="text-3xl font-black text-slate-800">{totalLembur}</span>
            </div>`;
const newLemburBlock = `<div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-indigo-700 block uppercase tracking-wider mb-1">Total Jam Lembur</span>
              <span className="text-3xl font-black text-slate-800">{totalLembur}</span>
              <p className="text-[9px] text-indigo-500/80 mt-1 font-medium">*Dari isian formulir mengajar</p>
            </div>`;

const eskulBlock = `<div className="bg-white/80 backdrop-blur-sm border border-fuchsia-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-fuchsia-700 block uppercase tracking-wider mb-1">Total Pertemuan Eskul</span>
              <span className="text-3xl font-black text-slate-800">{totalEskul}</span>
            </div>`;
const newEskulBlock = `<div className="bg-white/80 backdrop-blur-sm border border-fuchsia-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-fuchsia-700 block uppercase tracking-wider mb-1">Total Pertemuan Eskul</span>
              <span className="text-3xl font-black text-slate-800">{totalEskul}</span>
              <p className="text-[9px] text-fuchsia-500/80 mt-1 font-medium">*Dari isian formulir mengajar</p>
            </div>`;

code = code.replace(lemburBlock, newLemburBlock);
code = code.replace(eskulBlock, newEskulBlock);

fs.writeFileSync('src/components/CekDataView.tsx', code);
