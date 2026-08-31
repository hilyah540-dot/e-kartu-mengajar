const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const regex = /      Swal\.fire\(\{\s*icon: 'info',\s*title: 'Cek Rincian Data',\s*text: 'Silahkan klik tombol "Cek & Rincian Data" di bawah ini untuk memastikan isian Anda sudah benar.',\s*confirmButtonText: 'Siap',\s*confirmButtonColor: '#10b981'\s*\}\);/g;

const newSwal = `      Swal.fire({
        icon: 'success',
        title: 'Data Berhasil Disimpan',
        html: \`
          <div class="text-left text-sm space-y-4 mt-2 font-sans">
            <div class="flex items-start gap-3">
              <div class="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold mt-0.5">1</div>
              <div>
                <strong class="text-slate-800 block mb-0.5 text-base">Cek Rincian Data</strong>
                <span class="text-slate-600 leading-relaxed">Untuk memastikan data anda benar silahkan cek pada Ringkasan Statistik (klik untuk melihat rincian data anda).</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-bold mt-0.5">2</div>
              <div>
                <strong class="text-slate-800 block mb-0.5 text-base">Edit Data</strong>
                <span class="text-slate-600 leading-relaxed">Untuk melakukan perbaikan data silahkan klik tombol <b>Cek & Edit Data</b>.</span>
              </div>
            </div>
            <div class="text-center pt-3 pb-1 text-emerald-700 font-medium italic border-t border-slate-100 mt-4">
              Baarakallahu fiikum
            </div>
          </div>
        \`,
        confirmButtonText: 'Siap, Paham',
        confirmButtonColor: '#10b981'
      });`;

content = content.replace(regex, newSwal);
fs.writeFileSync('src/components/DashboardView.tsx', content);

console.log('Notif updated via regex3');
