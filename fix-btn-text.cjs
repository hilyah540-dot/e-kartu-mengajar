const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

content = content.replace(
  '<FileText className="w-5 h-5" /> Cek & Rincian Data',
  '<FileText className="w-5 h-5" /> Cek & Edit Data'
);

fs.writeFileSync('src/components/DashboardView.tsx', content);
console.log('Button text updated');
