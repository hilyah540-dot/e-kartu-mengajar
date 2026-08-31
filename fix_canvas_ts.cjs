const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

let replaced = code.replace(
    "const element = document.getElementById('area-cetak-kartu');",
    "const element = document.getElementById('area-cetak-kartu') as HTMLElement;"
);

// We need to make sure we cast to HTMLElement for inline style modification
fs.writeFileSync('src/components/CekDataView.tsx', replaced);
console.log("Fixed TS issues in Canvas block");
