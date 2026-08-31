const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

let replaced = code.replace(
    "const element = document.getElementById('area-cetak-kartu') as HTMLElement;",
    "const element = document.getElementById('area-cetak-kartu');\n      const htmlElement = element as HTMLElement;"
);

replaced = replaced.replace(/element\.style/g, 'htmlElement.style');
replaced = replaced.replace(/toCanvas\(element,/g, 'toCanvas(htmlElement,');

fs.writeFileSync('src/components/CekDataView.tsx', replaced);
console.log("Fixed TS issues completely");
