const fs = require('fs');

// 1. Edit CekDataView to change loader icon
let content1 = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');
content1 = content1.replace(
  '<Loader2 className="w-4 h-4 text-amber-500 animate-spin" />',
  '<Clock className="w-4 h-4 text-amber-500" />'
);
content1 = content1.replace(
  "import { ArrowLeft, FileDown, FileSpreadsheet, Share2, ChevronDown, BookOpen, Repeat, Image as ImageIcon, Edit, Loader2, CheckCircle, XCircle } from 'lucide-react';",
  "import { ArrowLeft, FileDown, FileSpreadsheet, Share2, ChevronDown, BookOpen, Repeat, Image as ImageIcon, Edit, Clock, CheckCircle, XCircle } from 'lucide-react';"
);
fs.writeFileSync('src/components/CekDataView.tsx', content1);


// 2. Edit MenuView to change loader icon
let content2 = fs.readFileSync('src/components/MenuView.tsx', 'utf8');
content2 = content2.replace(
  '<Loader className="w-5 h-5 text-amber-500 animate-spin mt-0.5 shrink-0" />',
  '<Clock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />'
);
content2 = content2.replace(
  "LogOut, ChevronDown, ChevronRight, X, Loader\n} from 'lucide-react';",
  "LogOut, ChevronDown, ChevronRight, X, Clock\n} from 'lucide-react';"
);
fs.writeFileSync('src/components/MenuView.tsx', content2);

console.log('Fixed Icons');
