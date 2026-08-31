const fs = require('fs');
let content = fs.readFileSync('src/components/MenuView.tsx', 'utf8');

// First remove it from the top
const regexRemove = /      \{pendingRequests\.length > 0 && \([\s\S]*?\}\n/;
content = content.replace(regexRemove, '');

// Then insert it just before the showToast section
const target = '      {/* Activity Notification */}\n      {showToast && (';
const replacement = `      {/* Pending Requests Notification */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in">
          <Loader className="w-5 h-5 text-amber-500 animate-spin mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Perubahan data sedang diproses</h4>
            <p className="text-xs mt-1">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. (Jika disetujui, notif ini akan hilang otomatis).</p>
          </div>
        </div>
      )}

` + target;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/MenuView.tsx', content);
console.log('Fixed MenuView notif placement');
