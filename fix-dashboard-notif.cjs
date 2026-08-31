const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');
content = content.replace(
  '{pendingRequests.length > 0 && (\\n        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">\\n          <Loader className="w-5 h-5 text-amber-500 animate-spin mt-0.5" />\\n          <div>\\n            <h4 className="font-bold text-sm">Sedang Diproses</h4>\\n            <p className="text-xs mt-1">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. Mohon menunggu.</p>\\n          </div>\\n        </div>\\n      )}',
  ''
);

fs.writeFileSync('src/components/DashboardView.tsx', content);

console.log('Fixed DashboardView notif');
