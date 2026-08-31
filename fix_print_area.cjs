const fs = require('fs');
let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

const regex = /<\/div>\s*<\/div>\s*\{\/\* Kegiatan Tambahan Cards \*\/\}/;
code = code.replace(regex, '{/* Kegiatan Tambahan Cards */}');

const endRegex = /\{\/\* Action Buttons at the Bottom \*\/\}/;
code = code.replace(endRegex, `</div>\n      </div>\n      {/* Action Buttons at the Bottom */}`);

fs.writeFileSync('src/components/CekDataView.tsx', code);
