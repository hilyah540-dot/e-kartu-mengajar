const fs = require('fs');
const path = 'src/components/MenuView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { LogOut, LayoutDashboard, FileText, Upload, HelpCircle, User as UserIcon, Settings, Calendar, RefreshCw } from 'lucide-react';",
  "import { LogOut, LayoutDashboard, FileText, Upload, HelpCircle, User as UserIcon, Settings, Calendar, RefreshCw, Loader } from 'lucide-react';\nimport { getPendingRequestsForUser } from '../lib/editRequests';"
);

content = content.replace(
  "return (\n    <div className=\"max-w-xl mx-auto px-4 py-4 space-y-4\">",
  "const pendingRequests = getPendingRequestsForUser(user.teacherName);\n\n  return (\n    <div className=\"max-w-xl mx-auto px-4 py-4 space-y-4\">\n      {pendingRequests.length > 0 && (\n        <div className=\"bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in\">\n          <Loader className=\"w-5 h-5 text-amber-500 animate-spin mt-0.5 shrink-0\" />\n          <div>\n            <h4 className=\"font-bold text-sm\">Perubahan data sedang diproses</h4>\n            <p className=\"text-xs mt-1\">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. (Jika disetujui, notif ini akan hilang otomatis).</p>\n          </div>\n        </div>\n      )}"
);

fs.writeFileSync(path, content, 'utf8');
console.log('MenuView patched');
