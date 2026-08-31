const fs = require('fs');
const path = 'src/components/AdminDashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { ArrowLeft, Filter, FileDown, FileSpreadsheet, Crown, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';",
  "import { ArrowLeft, Filter, FileDown, FileSpreadsheet, Crown, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';\nimport { EditRequestsAdminPanel } from './EditRequestsAdminPanel';"
);

// Add to render
content = content.replace(
  "          <div className=\"flex flex-col md:flex-row gap-4 mb-8\">\n            {/* Tampilan Ringkas Toggle */}",
  "          <EditRequestsAdminPanel />\n          <div className=\"flex flex-col md:flex-row gap-4 mb-8\">\n            {/* Tampilan Ringkas Toggle */}"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Admin Dashboard patched');
