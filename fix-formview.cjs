const fs = require('fs');
let content = fs.readFileSync('src/components/FormView.tsx', 'utf8');

// 1. Add state
content = content.replace(
  "const [keteranganDinas, setKeteranganDinas] = useState('');",
  "const [keteranganDinas, setKeteranganDinas] = useState('');\n  const [keteranganPengganti, setKeteranganPengganti] = useState('');"
);

// 2. Add validation in handleSubmit
const handleSubmitRegex = /const confirmResult = await Swal\.fire\(\{/;
const validationCode = `
    const hasPengganti = penggantiRows.some(row => row.kat && row.jml > 0);
    if (hasPengganti && !keteranganPengganti.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Keterangan Wajib Diisi',
        text: 'Anda telah mengisi Jam Pengganti, silakan isi Form Keterangan (Menggantikan siapa).',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    const confirmResult = await Swal.fire({`;
content = content.replace(handleSubmitRegex, validationCode);

// 3. Add to payload
content = content.replace(
  "p_td\n    };",
  "p_td,\n      keterangan_pengganti: keteranganPengganti.trim() || '-'\n    };"
);

// 4. Add to newRecord
content = content.replace(
  "Pengganti_Tadribud: p_td,",
  "Pengganti_Tadribud: p_td,\n      Keterangan_Pengganti: keteranganPengganti.trim() || '-',"
);

// 5. Render input field
const renderTarget = /<button \n                type="button" \n                onClick=\{\(\) => handleAddRow\('pengganti'\)\}/;
const renderCode = `            {/* Keterangan Pengganti */}
            <div className="pt-2">
               <input
                 type="text"
                 placeholder="diisi Menggantikan Ustadz fulan"
                 value={keteranganPengganti}
                 onChange={(e) => setKeteranganPengganti(e.target.value)}
                 className="w-full border border-amber-300 p-2.5 rounded-xl bg-white text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
               />
               <p className="text-[10px] text-amber-700 mt-1 font-semibold">* Keterangan pengganti wajib diisi jika ada Jam Pengganti</p>
            </div>

            <button 
                type="button" 
                onClick={() => handleAddRow('pengganti')}`;
content = content.replace(renderTarget, renderCode);

fs.writeFileSync('src/components/FormView.tsx', content);
console.log('FormView updated');
