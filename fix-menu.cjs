const fs = require('fs');
let content = fs.readFileSync('src/components/MenuView.tsx', 'utf8');

// 1. Add Loader to lucide-react import
content = content.replace(
  'LogOut, ChevronDown, ChevronRight, X\n} from \'lucide-react\';',
  'LogOut, ChevronDown, ChevronRight, X, Loader\n} from \'lucide-react\';'
);

// 2. Add pendingRequests state and effect inside the component
const target = 'export function MenuView({ user, onNavigate, onLogout, devAlert, globalData = [] }: MenuViewProps) {\n';
const replacement = target + `
  const [pendingRequests, setPendingRequests] = useState<EditRequest[]>([]);

  useEffect(() => {
    if (user.role === 'user' && user.teacherName) {
      const unsubscribe = listenToTeacherRequests(user.teacherName, setPendingRequests);
      return () => unsubscribe();
    }
  }, [user]);
`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/MenuView.tsx', content);
console.log('Fixed MenuView.tsx');
