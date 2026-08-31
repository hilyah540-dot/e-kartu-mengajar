const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// The old buggy calculation was:
/*
  let jmUlya = 0, jmWus = 0, jmTd = 0;
  let jpUlya = 0, jpWus = 0, jpTd = 0;
  let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlfa = 0;

  rows.forEach(r => {
    const p = (r.Presensi || '').toLowerCase();
    if (p.includes('hadir')) totalHadir++;
    else if (p.includes('izin')) totalIzin++;
    else if (p.includes('sakit')) totalSakit++;
    else if (p.includes('alfa') || p.includes('tanpa keterangan')) totalAlfa++;
    
    jmUlya += Number(r.Mengajar_Ulya) || 0;
*/

// I need to replace it.
const regexCalc = /let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlfa = 0;\s+rows\.forEach\(r => \{\s+const p = \(r\.Presensi \|\| ''\)\.toLowerCase\(\);\s+if \(p\.includes\('hadir'\)\) totalHadir\+\+;\s+else if \(p\.includes\('izin'\)\) totalIzin\+\+;\s+else if \(p\.includes\('sakit'\)\) totalSakit\+\+;\s+else if \(p\.includes\('alfa'\) \|\| p\.includes\('tanpa keterangan'\)\) totalAlfa\+\+;/m;

const newCalc = `let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlfa = 0, totalDinas = 0, totalTidakHadir = 0;

  rows.forEach(r => {
    if (r.Presensi === 'Hadir') {
      totalHadir++;
    } else if (r.Presensi === 'Tidak Hadir') {
      totalTidakHadir++;
      const ket = (r.Keterangan || '').toLowerCase();
      if (ket.includes('izin')) totalIzin++;
      else if (ket.includes('sakit')) totalSakit++;
      else if (ket.includes('tanpa keterangan') || ket.includes('alfa')) totalAlfa++;
      else if (ket.includes('dinas')) totalDinas++;
    }`;

code = code.replace(regexCalc, newCalc);

// 2. Also fix the Ketidakhadiran card total:
code = code.replace(
  /\{totalIzin \+ totalSakit \+ totalAlfa\} Hari/g,
  '{totalTidakHadir} Hari'
);

// 3. Fix the WA Share text variables
code = code.replace(
  /❌ \*Ketidakhadiran:\* \$\{totalIzin \+ totalSakit \+ totalAlfa\} Hari \(I:\$\{totalIzin\}, S:\$\{totalSakit\}, A:\$\{totalAlfa\}\)/g,
  '❌ *Ketidakhadiran:* ${totalTidakHadir} Hari (I:${totalIzin}, S:${totalSakit}, A:${totalAlfa}, DL:${totalDinas})'
);

fs.writeFileSync('src/components/CekDataView.tsx', code);
