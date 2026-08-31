const fs = require('fs');
let content = fs.readFileSync('src/components/MenuView.tsx', 'utf8');

// Ensure Loader is imported if it isn't already
if (!content.includes('Loader\n} from \'lucide-react\'') && !content.includes('Loader } from \'lucide-react\'') && !content.includes(', Loader,')) {
  content = content.replace(
    'LogOut, ChevronDown, ChevronRight, X',
    'LogOut, ChevronDown, ChevronRight, X, Loader'
  );
}

fs.writeFileSync('src/components/MenuView.tsx', content);
console.log('Fixed Loader import');
