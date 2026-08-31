const fs = require('fs');
let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

const oldText1 = 'let text = `*LAPORAN REKAP MENGAJAR GURU*\\nPonpes Al-Madina Prabumulih\\n\\n👤 *Nama:* ${teacherName}\\n📅 *Periode:* ${periodeText}\\n⏱️ *Total Jam Keseluruhan:* ${total} Jam\\n\\nData ini digenerate secara otomatis melalui E-Administrasi Ponpes Al-Madina.`;';
const newText1 = 'let text = `*LAPORAN REKAP GURU*\\nPonpes Al-Madina Prabumulih\\n\\n👤 *Nama:* ${teacherName}\\n📅 *Periode:* ${periodeText}\\n\\n✅ *Total Kehadiran:* ${totalHadir} Hari\\n❌ *Ketidakhadiran:* ${totalIzin + totalSakit + totalAlfa} Hari (I:${totalIzin}, S:${totalSakit}, A:${totalAlfa})\\n⏱️ *Total Jam Keseluruhan:* ${total} Jam\\n\\nData digenerate secara otomatis melalui E-Administrasi Ponpes Al-Madina.`;';

const oldText2 = 'let text = `*LAPORAN REKAP MENGAJAR GURU*\\nPonpes Al-Madina Prabumulih\\n\\n👤 *Nama:* ${teacherName}\\n📅 *Periode:* ${periodeText}\\n⏱️ *Total Jam Keseluruhan:* ${total} Jam\\n\\nBerikut terlampir gambar Kartu Mengajar.`;';
const newText2 = 'let text = `*LAPORAN REKAP GURU*\\nPonpes Al-Madina Prabumulih\\n\\n👤 *Nama:* ${teacherName}\\n📅 *Periode:* ${periodeText}\\n\\n✅ *Total Kehadiran:* ${totalHadir} Hari\\n❌ *Ketidakhadiran:* ${totalIzin + totalSakit + totalAlfa} Hari (I:${totalIzin}, S:${totalSakit}, A:${totalAlfa})\\n⏱️ *Total Jam Keseluruhan:* ${total} Jam\\n\\nBerikut terlampir gambar Kartu Mengajar.`;';

code = code.replace(oldText1, newText1);
code = code.replace(oldText2, newText2);

fs.writeFileSync('src/components/CekDataView.tsx', code);
