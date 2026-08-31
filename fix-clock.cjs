const fs = require('fs');
let content = fs.readFileSync('src/components/MenuView.tsx', 'utf8');

if (!content.includes('Clock\n} from \'lucide-react\'') && !content.includes(', Clock') && !content.includes('Clock } from \'lucide-react\'')) {
  content = content.replace(
    'LogOut, ChevronDown, ChevronRight, X',
    'LogOut, ChevronDown, ChevronRight, X, Clock'
  );
}
fs.writeFileSync('src/components/MenuView.tsx', content);

let content2 = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');
if (!content2.includes(', Clock') && !content2.includes('Clock } from \'lucide-react\'')) {
  content2 = content2.replace(
    'Edit, CheckCircle, XCircle',
    'Edit, Clock, CheckCircle, XCircle'
  );
}
fs.writeFileSync('src/components/CekDataView.tsx', content2);
console.log('Fixed Clock import');
