const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboardView.tsx', 'utf8');

// 1. Add import
content = content.replace(
  "import { ArrowLeft, Filter, FileDown, FileSpreadsheet, Crown, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';",
  "import { ArrowLeft, Filter, FileDown, FileSpreadsheet, Crown, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';\nimport { EditRequestsAdminPanel } from './EditRequestsAdminPanel';"
);

// 2. Add component rendering right after the title div
content = content.replace(
  '        <div className="flex-1">\n          <h2 className="text-xl md:text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-1 inline-block">\n            Dashboard Evaluasi Admin\n          </h2>\n        </div>\n      </div>\n\n      {/* Filter Options */}',
  '        <div className="flex-1">\n          <h2 className="text-xl md:text-2xl font-bold text-slate-800 border-b-2 border-indigo-500 pb-1 inline-block">\n            Dashboard Evaluasi Admin\n          </h2>\n        </div>\n      </div>\n\n      <EditRequestsAdminPanel />\n\n      {/* Filter Options */}'
);

fs.writeFileSync('src/components/AdminDashboardView.tsx', content);

console.log('Update AdminDashboardView complete');
