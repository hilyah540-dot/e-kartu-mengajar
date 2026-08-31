const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

// Add isSpecialUser
code = code.replace(
  "const [isLain, setIsLain] = useState(false);",
  "const [isLain, setIsLain] = useState(false);\n\n  const isSpecialUser = user.username === 'yvt11' || user.username === 'bgs10';"
);

// Wrap Jam Mengajar
code = code.replace(
  "{/* Jam Mengajar */}\n            <div className=\"bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3\">",
  "{/* Jam Mengajar */}\n            {!isSpecialUser && (\n              <div className=\"bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3\">"
);

code = code.replace(
  "              <button \n                type=\"button\" \n                onClick={() => handleAddRow('mengajar')}\n                className=\"text-xs text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1 pt-1\"\n              >\n                <Plus className=\"w-3.5 h-3.5\" /> Tambah Jam Mengajar\n              </button>\n            </div>",
  "              <button \n                type=\"button\" \n                onClick={() => handleAddRow('mengajar')}\n                className=\"text-xs text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1 pt-1\"\n              >\n                <Plus className=\"w-3.5 h-3.5\" /> Tambah Jam Mengajar\n              </button>\n            </div>\n            )}"
);

// Wrap Jam Pengganti
code = code.replace(
  "{/* Jam Pengganti */}\n            <div className=\"bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3\">",
  "{/* Jam Pengganti */}\n            {!isSpecialUser && (\n              <div className=\"bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3\">"
);

code = code.replace(
  "              <button \n                type=\"button\" \n                onClick={() => handleAddRow('pengganti')}\n                className=\"text-xs text-amber-700 font-bold hover:text-amber-900 flex items-center gap-1 pt-1\"\n              >\n                <Plus className=\"w-3.5 h-3.5\" /> Tambah Jam Pengganti\n              </button>\n            </div>\n          </div>\n        )}",
  "              <button \n                type=\"button\" \n                onClick={() => handleAddRow('pengganti')}\n                className=\"text-xs text-amber-700 font-bold hover:text-amber-900 flex items-center gap-1 pt-1\"\n              >\n                <Plus className=\"w-3.5 h-3.5\" /> Tambah Jam Pengganti\n              </button>\n            </div>\n            )}\n          </div>\n        )}"
);

fs.writeFileSync('src/components/FormView.tsx', code);
console.log("Updated FormView.tsx");
