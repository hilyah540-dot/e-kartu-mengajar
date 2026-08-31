const fs = require('fs');

const path = 'src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add overflow-x-auto to the container
content = content.replace(
  /'<div class="text-left text-sm max-h-64 overflow-y-auto">'/g,
  /'<div class="text-left text-sm max-h-64 overflow-y-auto overflow-x-auto w-full">'/
);

// Add whitespace-nowrap to the Tanggal, Status, Jam headers and cells where appropriate.
// Let's just make the tables not squish.
// We can add a min-width to the table or whitespace-nowrap to specific cells.

// ulya, wustho, td
content = content.replace(
  /<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1">Tanggal<\/th><th class="py-1">Status<\/th><th class="py-1 text-center">Jam<\/th><th class="py-1">Keterangan<\/th><\/tr><\/thead><tbody>/g,
  '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1 whitespace-nowrap">Tanggal</th><th class="py-1 whitespace-nowrap">Status</th><th class="py-1 text-center whitespace-nowrap">Jam</th><th class="py-1 whitespace-nowrap min-w-[120px]">Keterangan</th></tr></thead><tbody>'
);

content = content.replace(
  /<td class="align-top pr-2 py-1"><span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-\[10px\] font-bold">Mengajar<\/span><\/td>/g,
  '<td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Mengajar</span></td>'
);

content = content.replace(
  /<td class="align-top pr-2 py-1"><span class="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-\[10px\] font-bold">Pengganti<\/span><\/td>/g,
  '<td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Pengganti</span></td>'
);

// Also for Tanggal cell in all those to prevent wrapping if possible, or at least keep it on one line.
content = content.replace(
  /<td class="py-1 align-top pr-2">\$\{tanggalStr\}<\/td>/g,
  '<td class="py-1 align-top pr-2 whitespace-nowrap">${tanggalStr}</td>'
);


// mengajar, pengganti
content = content.replace(
  /<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1">Tanggal<\/th><th class="py-1">Program<\/th><th class="py-1 text-center">Jam<\/th><th class="py-1">Keterangan<\/th><\/tr><\/thead><tbody>/g,
  '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1 whitespace-nowrap">Tanggal</th><th class="py-1 whitespace-nowrap">Program</th><th class="py-1 text-center whitespace-nowrap">Jam</th><th class="py-1 whitespace-nowrap min-w-[120px]">Keterangan</th></tr></thead><tbody>'
);


fs.writeFileSync(path, content, 'utf8');
console.log('done!');
