const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

code = code.replace(
  "keterangan_pengganti: keteranganPengganti.trim() || '-'",
  "keterangan_pengganti: hasPengganti ? (keteranganPengganti.trim() || '-') : '-'"
);

fs.writeFileSync('src/components/FormView.tsx', code);
console.log("Updated FormView payload");
