const fs = require('fs');
let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// Replace the 3 closing divs before Action Buttons with 2 closing divs.
code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Action Buttons at the Bottom \*\/\}/, `</div>
        </div>
      {/* Action Buttons at the Bottom */}`);

fs.writeFileSync('src/components/CekDataView.tsx', code);
