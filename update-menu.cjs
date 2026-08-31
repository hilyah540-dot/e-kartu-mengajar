const fs = require('fs');

let content = fs.readFileSync('src/components/MenuView.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { \n  Crown,",
  "import { listenToTeacherRequests, EditRequest } from '../lib/editRequests';\nimport { \n  Crown,"
);
content = content.replace(
  "LogOut, ChevronDown, ChevronRight, X\n} from 'lucide-react';",
  "LogOut, ChevronDown, ChevronRight, X, Loader\n} from 'lucide-react';"
);

// 2. Add state and effect
const hookLocation = /export function MenuView\(\{ user, onNavigate, onLogout, devAlert \}: MenuViewProps\) \{\n/;
const hookToAdd = `export function MenuView({ user, onNavigate, onLogout, devAlert }: MenuViewProps) {
  const [pendingRequests, setPendingRequests] = useState<EditRequest[]>([]);

  useEffect(() => {
    if (user.role === 'user' && user.teacherName) {
      const unsubscribe = listenToTeacherRequests(user.teacherName, setPendingRequests);
      return () => unsubscribe();
    }
  }, [user]);

`;
content = content.replace(hookLocation, hookToAdd);

// 3. Add notification banner
const returnLocation = /  return \(\n    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">/;
const bannerToAdd = `  return (
    <div className="max-w-xl mx-auto px-4 py-4 space-y-4">
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in">
          <Loader className="w-5 h-5 text-amber-500 animate-spin mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Perubahan data sedang diproses</h4>
            <p className="text-xs mt-1">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. (Jika disetujui, notif ini akan hilang otomatis).</p>
          </div>
        </div>
      )}
`;
content = content.replace(returnLocation, bannerToAdd);

fs.writeFileSync('src/components/MenuView.tsx', content);

console.log('Update MenuView complete');
