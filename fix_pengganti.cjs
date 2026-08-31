const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

const replacement = `<input
                 type="text"
                 placeholder="Contoh pengisian: Menggantikan Ustadz fulan"
                 value={keteranganPengganti}
                 onChange={(e) => {
                   let val = e.target.value;
                   val = val.replace(/[0-9]/g, '');
                   if (val.length > 30) {
                     Swal.fire({
                       icon: 'warning',
                       title: 'Karakter terlalu panjang',
                       text: 'Maksimal 30 huruf',
                       confirmButtonColor: '#f59e0b',
                       timer: 2000
                     });
                     return;
                   }
                   setKeteranganPengganti(val);
                 }}
                 className="w-full border border-amber-300 p-2.5 rounded-xl bg-white text-xs font-medium placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
               />`;

code = code.replace(
  /<input\s*type="text"\s*placeholder="diisi Menggantikan Ustadz fulan"\s*value=\{keteranganPengganti\}\s*onChange=\{\(e\) => setKeteranganPengganti\(e\.target\.value\)\}\s*className="w-full border border-amber-300 p\.2\.5 rounded-xl bg-white text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"\s*\/>/,
  replacement
);

fs.writeFileSync('src/components/FormView.tsx', code);
console.log("Fixed keterangan pengganti");
