const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

// Fix missing closing brace for Jam Pengganti
let replacementString = `              <button 
                type="button" 
                onClick={() => handleAddRow('pengganti')}
                className="text-xs text-amber-700 font-bold hover:text-amber-900 flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Jam Pengganti
              </button>
            </div>
            )}
          </div>
        )}`;

code = code.replace(/<button \s*type="button" \s*onClick=\{\(\) => handleAddRow\('pengganti'\)\}\s*className="text-xs text-amber-700 font-bold hover:text-amber-900 flex items-center gap-1 pt-1"\s*>\s*<Plus className="w-3\.5 h-3\.5" \/> Tambah Jam Pengganti\s*<\/button>\s*<\/div>\s*<\/div>\s*\)\}/, replacementString);

fs.writeFileSync('src/components/FormView.tsx', code);
console.log("Fixed missing closing brace");
