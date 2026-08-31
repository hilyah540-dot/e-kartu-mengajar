const fs = require('fs');
let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

code = code.replace(/const tableWrapper = element\.querySelector\('\.overflow-x-auto\.pb-4'\);/g, "const tableWrapper = element.querySelector('.overflow-x-auto.pb-4') as HTMLElement;");

fs.writeFileSync('src/components/CekDataView.tsx', code);
console.log("Fixed tableWrapper TS");
