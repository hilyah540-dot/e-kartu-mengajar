const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// The error is because there are remaining 'element.style' calls in CekDataView.tsx
code = code.replace(/const element = document.getElementById\('area-cetak-kartu'\);[\s\n]*const htmlElement = element as HTMLElement;/g, "const element = document.getElementById('area-cetak-kartu') as HTMLElement;\n      const htmlElement = element;");

code = code.replace(/element\.style/g, 'htmlElement.style');

fs.writeFileSync('src/components/CekDataView.tsx', code);
console.log("Fixed element style issues");
