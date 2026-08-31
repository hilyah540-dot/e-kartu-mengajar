const fs = require('fs');
let text = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

text = text.replace('      </>\n      )}', '      </>\n      )}\n');
fs.writeFileSync('src/components/DashboardView.tsx', text);
