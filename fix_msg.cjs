const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

code = code.replace(/text: 'Nama guru belum lengkap atau tidak sesuai\.',/g, "text: 'nama guru belum lengkap',");

fs.writeFileSync('src/components/DashboardView.tsx', code);
