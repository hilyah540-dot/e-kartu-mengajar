const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const replacementInput = `<input 
              type="text"
              list="manual-teacher-list"
              placeholder="Ketik Nama Guru..."
              value={filterNama}
              readOnly={user.role === 'user'}
              onChange={(e) => handleCheckAccessName(e.target.value)}
              className="border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2 bg-slate-50 focus:bg-white"
            />
            <datalist id="manual-teacher-list">
              {TEACHER_LIST.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>`;

code = code.replace(/<input\s+type="text"\s+placeholder="Ketik Nama Guru\.\.\."\s+value=\{filterNama\}\s+readOnly=\{user\.role === 'user'\}\s+onChange=\{\(e\) => handleCheckAccessName\(e\.target\.value\)\}\s+className="border border-slate-300 p-2\.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2 bg-slate-50 focus:bg-white"\s+\/>/, replacementInput);

const replacementButton = `<button 
              onClick={() => {
                if (filterNama && !TEACHER_LIST.includes(filterNama)) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Nama guru belum lengkap atau tidak sesuai.',
                    confirmButtonColor: '#10b981'
                  });
                  return;
                }
                applyFilter(filterNama, filterStart, filterEnd);
              }}
              className="md:col-span-4 bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Kalkulasi Cepat
            </button>`;

code = code.replace(/<button\s+onClick=\{\(\) => applyFilter\(filterNama, filterStart, filterEnd\)\}\s+className="md:col-span-4 bg-slate-800 hover:bg-slate-900 text-white p-2\.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"\s*>\s*Kalkulasi Cepat\s*<\/button>/, replacementButton);

fs.writeFileSync('src/components/DashboardView.tsx', code);
