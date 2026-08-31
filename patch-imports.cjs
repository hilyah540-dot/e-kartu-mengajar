const fs = require('fs');
const path = 'src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { ArrowLeft, Search, Calendar, FileText, PlusCircle, Home, RefreshCw } from 'lucide-react';",
  "import { ArrowLeft, Search, Calendar, FileText, PlusCircle, Home, RefreshCw, Loader } from 'lucide-react';"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Imports patched');
