const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Fix 'mengajar' || 'pengganti'
code = code.replace(
  /const ket = row\.Keterangan || '-';\s+if \(ulya > 0 \|\| wus > 0 \|\| td > 0\) \{/g,
  `const ket = (isMengajar ? row.Keterangan : row.Keterangan_Pengganti) || '-';
        if (ulya > 0 || wus > 0 || td > 0) {`
);

// Fix 'ulya' || 'wustho' || 'td'
const ulyaBlockOld = `        const ket = row.Keterangan || '-';
        if (m > 0 || p > 0) {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          if (m > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Mengajar</span></td><td class="align-top text-center py-1 font-bold text-emerald-600">' + m + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ket + '</td></tr>';
          if (p > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Pengganti</span></td><td class="align-top text-center py-1 font-bold text-emerald-600">' + p + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ket + '</td></tr>';
        }`;

const ulyaBlockNew = `        const ketM = row.Keterangan || '-';
        const ketP = row.Keterangan_Pengganti || '-';
        if (m > 0 || p > 0) {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          if (m > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Mengajar</span></td><td class="align-top text-center py-1 font-bold text-emerald-600">' + m + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ketM + '</td></tr>';
          if (p > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Pengganti</span></td><td class="align-top text-center py-1 font-bold text-emerald-600">' + p + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ketP + '</td></tr>';
        }`;

code = code.replace(ulyaBlockOld, ulyaBlockNew);

fs.writeFileSync('src/components/DashboardView.tsx', code);
