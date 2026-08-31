const fs = require('fs');

// --- 1. MenuView.tsx ---
let menuCode = fs.readFileSync('src/components/MenuView.tsx', 'utf8');

menuCode = menuCode.replace(
  "export function MenuView({ user, onNavigate, onLogout, devAlert, globalData }: MenuViewProps) {",
  "export function MenuView({ user, onNavigate, onLogout, devAlert, globalData }: MenuViewProps) {\n  const isSpecialUser = user.username === 'yvt11' || user.username === 'bgs10';"
);

menuCode = menuCode.replace(
  '<span className="font-bold text-sm text-slate-800 text-center">Kartu Mengajar</span>',
  '<span className="font-bold text-sm text-slate-800 text-center">{isSpecialUser ? \'Kartu Kehadiran\' : \'Kartu Mengajar\'}</span>'
);

fs.writeFileSync('src/components/MenuView.tsx', menuCode);
console.log("Updated MenuView");

// --- 2. DashboardView.tsx ---
let dashCode = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

dashCode = dashCode.replace(
  "const [stats, setStats] = useState({",
  "const isSpecialUser = user.username === 'yvt11' || user.username === 'bgs10';\n\n  const [stats, setStats] = useState({"
);

const programBreakdown = `        {/* Program Breakdown */}
        <div className="text-xs bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
          <p className="font-bold text-emerald-900 border-b border-emerald-200/80 pb-2">Distribusi Jam per Program / Jenjang:</p>
          <ul className="grid grid-cols-3 gap-3 text-center">
            <li onClick={() => showDetail('ulya')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Ulya">
              <span className="text-slate-500 font-semibold">Ulya</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mUlya + stats.pUlya}</strong> Jam
            </li>
            <li onClick={() => showDetail('wustho')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Wustho">
              <span className="text-slate-500 font-semibold">Wustho</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mWus + stats.pWus}</strong> Jam
            </li>
            <li onClick={() => showDetail('td')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Tadribud Du'at">
              <span className="text-slate-500 font-semibold">Tadribud Du'at</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mTd + stats.pTd}</strong> Jam
            </li>
          </ul>
        </div>`;

const programBreakdownReplacement = `        {/* Program Breakdown */}
        {!isSpecialUser && (
        <div className="text-xs bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
          <p className="font-bold text-emerald-900 border-b border-emerald-200/80 pb-2">Distribusi Jam per Program / Jenjang:</p>
          <ul className="grid grid-cols-3 gap-3 text-center">
            <li onClick={() => showDetail('ulya')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Ulya">
              <span className="text-slate-500 font-semibold">Ulya</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mUlya + stats.pUlya}</strong> Jam
            </li>
            <li onClick={() => showDetail('wustho')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Wustho">
              <span className="text-slate-500 font-semibold">Wustho</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mWus + stats.pWus}</strong> Jam
            </li>
            <li onClick={() => showDetail('td')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Tadribud Du'at">
              <span className="text-slate-500 font-semibold">Tadribud Du'at</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mTd + stats.pTd}</strong> Jam
            </li>
          </ul>
        </div>
        )}`;

dashCode = dashCode.replace(programBreakdown, programBreakdownReplacement);
dashCode = dashCode.replace(
  '<PlusCircle className="w-5 h-5" /> Isi Kartu Mengajar',
  '<PlusCircle className="w-5 h-5" /> {isSpecialUser ? \'Isi Kartu Kehadiran\' : \'Isi Kartu Mengajar\'}'
);

fs.writeFileSync('src/components/DashboardView.tsx', dashCode);
console.log("Updated DashboardView");

// --- 3. FormView.tsx ---
let formCode = fs.readFileSync('src/components/FormView.tsx', 'utf8');

formCode = formCode.replace(
  '<h2 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-1">\n          Formulir Kartu Mengajar\n        </h2>',
  '<h2 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-1">\n          {isSpecialUser ? \'Formulir Kartu Kehadiran\' : \'Formulir Kartu Mengajar\'}\n        </h2>'
);

formCode = formCode.replace(
  '<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">\n            Nama Guru\n          </label>',
  '<label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">\n            {isSpecialUser ? \'Nama Tata Usaha\' : \'Nama Guru\'}\n          </label>'
);

formCode = formCode.replace(
  '<option value="">-- Pilih Nama Guru --</option>',
  '<option value="">{isSpecialUser ? \'-- Pilih Nama Tata Usaha --\' : \'-- Pilih Nama Guru --\'}</option>'
);

fs.writeFileSync('src/components/FormView.tsx', formCode);
console.log("Updated FormView");

