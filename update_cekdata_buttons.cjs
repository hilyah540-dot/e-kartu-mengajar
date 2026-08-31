const fs = require('fs');
let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// 1. Remove old Action Buttons block
const oldButtonsRegex = /\{\/\* Action Buttons \*\/\}[\s\S]*?<\/div>\s*\{\/\* Printable Area \*\/\}/;
code = code.replace(oldButtonsRegex, '{/* Printable Area */}');

// 2. Add new Action Buttons block at the bottom
const endAreaRegex = /        \)\}\s*<\/div>\s*\{editingRow && \(/;
const newButtons = `        )}
      </div>

      {/* Action Buttons at the Bottom */}
      <div className="flex flex-wrap gap-3 mt-6 justify-end">
        <button 
          onClick={() => downloadImage('jpg')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2.5 transition-all active:scale-[0.98]"
        >
          <Download className="w-5 h-5" /> Unduh Gambar
        </button>
        <button 
          onClick={shareWAOptions}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2.5 transition-all active:scale-[0.98]"
        >
          <Share2 className="w-5 h-5" /> Bagikan ke WA
        </button>
      </div>

      {editingRow && (`

code = code.replace(endAreaRegex, newButtons);

// 3. Make sure 'Download' icon is imported
if (!code.includes('Download,')) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import {$1, Download} from 'lucide-react';");
}

fs.writeFileSync('src/components/CekDataView.tsx', code);
