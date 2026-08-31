const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

const target = `      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil dikirim ke database.',
        timer: 2000,
        showConfirmButton: false
      });`;

const replacement = `      Swal.fire({
        icon: 'success',
        title: 'Data Berhasil Disimpan!',
        html: \`
          <div style="text-align: left; font-size: 14px; line-height: 1.6; margin-top: 10px;">
            <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 12px;">
              <span style="font-size: 20px;">📊</span>
              <div>
                <strong style="color: #0f172a;">Cek Rincian Data</strong><br/>
                <span style="color: #475569;">Untuk memastikan data anda benar silahkan cek pada Ringkasan Statistik (klik untuk melihat rincian data anda)</span>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 20px;">
              <span style="font-size: 20px;">✏️</span>
              <div>
                <strong style="color: #0f172a;">Edit Data</strong><br/>
                <span style="color: #475569;">Untuk melakukan perbaikan data silahkan klik tombol cek & edit data</span>
              </div>
            </div>
            <div style="text-align: center; font-weight: bold; color: #10b981; font-size: 15px;">
              Baarakallahu fiikum
            </div>
          </div>
        \`,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Tutup'
      });`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/FormView.tsx', code);
    console.log("Updated Swal successfully");
} else {
    console.log("Target not found");
}
