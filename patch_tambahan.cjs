const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// 1. Update imports for icons (adding Timer for Lembur, Trophy for Eskul)
if (!code.includes('Timer,')) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Timer, Trophy} from 'lucide-react';");
}

// 2. Add variables for Lembur & Eskul
const calcRegex = /let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlfa = 0, totalDinas = 0, totalTidakHadir = 0;/;
const newCalcVars = `let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlfa = 0, totalDinas = 0, totalTidakHadir = 0;
  let totalLembur = 0, totalEskul = 0;`;
code = code.replace(calcRegex, newCalcVars);

// Add the increment logic
const incRegex = /jpTd \+= Number\(r\.Pengganti_Tadribud\) \|\| 0;/;
const newInc = `jpTd += Number(r.Pengganti_Tadribud) || 0;
    totalLembur += Number(r.Jam_Lembur) || 0;
    totalEskul += Number(r.Jml_Pertemuan_Eskul) || 0;`;
code = code.replace(incRegex, newInc);

// 3. Add the UI Cards for Kegiatan Tambahan below the JM & JP Cards
// Let's find the end of JP card.
const jpCardRegex = /\{\/\* Jam Pengganti \(JP\) Card \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Action Buttons at the Bottom \*\/\}/;
const jpCardMatch = code.match(jpCardRegex);

if (jpCardMatch) {
  const replacement = jpCardMatch[0].replace(/<\/div>\s*\{\/\* Action Buttons at the Bottom \*\/\}/, `</div>
        {/* Kegiatan Tambahan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t-2 border-slate-100">
          
          {/* Jam Lembur Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
              <Timer className="w-24 h-24 text-indigo-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-indigo-100 text-indigo-600">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Lembur
                </h3>
              </div>
              <span className="bg-indigo-600 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalLembur} Jam
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-indigo-700 block uppercase tracking-wider mb-1">Total Jam Lembur</span>
              <span className="text-3xl font-black text-slate-800">{totalLembur}</span>
            </div>
          </div>

          {/* Ekstrakurikuler Card */}
          <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 -rotate-12">
              <Trophy className="w-24 h-24 text-fuchsia-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-fuchsia-100 text-fuchsia-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Ekstrakurikuler
                </h3>
              </div>
              <span className="bg-fuchsia-500 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalEskul} Pertemuan
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-fuchsia-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-fuchsia-700 block uppercase tracking-wider mb-1">Total Pertemuan Eskul</span>
              <span className="text-3xl font-black text-slate-800">{totalEskul}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons at the Bottom */}`);

  code = code.replace(jpCardMatch[0], replacement);
}

// 4. Update the WA Share messages to include Lembur and Eskul
const text1Regex = /⏱️ \*Total Jam Keseluruhan:\* \$\{total\} Jam\\n\\nData digenerate/g;
const newText1 = "⏱️ *Total Jam Keseluruhan:* ${total} Jam\\n⏳ *Total Lembur:* ${totalLembur} Jam\\n🏆 *Total Eskul:* ${totalEskul} Pertemuan\\n\\nData digenerate";
code = code.replace(text1Regex, newText1);

const text2Regex = /⏱️ \*Total Jam Keseluruhan:\* \$\{total\} Jam\\n\\nBerikut terlampir/g;
const newText2 = "⏱️ *Total Jam Keseluruhan:* ${total} Jam\\n⏳ *Total Lembur:* ${totalLembur} Jam\\n🏆 *Total Eskul:* ${totalEskul} Pertemuan\\n\\nBerikut terlampir";
code = code.replace(text2Regex, newText2);

fs.writeFileSync('src/components/CekDataView.tsx', code);
