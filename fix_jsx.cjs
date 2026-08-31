const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// I will look at the exact end of the file from line 580 to the end.
const lines = code.split('\n');
const errorLineIdx = 613; // line 614 is index 613

// Let's just output lines 600 to 625 so I can see what is really there.
console.log(lines.slice(600, 625).join('\n'));
