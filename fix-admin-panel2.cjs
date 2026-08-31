const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboardView.tsx', 'utf8');

const regex = /(<span className="hidden md:inline">\{isRefreshing \? 'Memuat\.\.\.' : 'Refresh Data'\}<\/span>\s*<\/button>\s*<\/div>)/;

content = content.replace(
  regex,
  "$1\n\n      <EditRequestsAdminPanel />"
);

fs.writeFileSync('src/components/AdminDashboardView.tsx', content);
console.log('Fixed AdminDashboardView');
