const fs = require('fs');
let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// Remove the specific paragraph tags
code = code.replace(/<p className="text-\[9px\] text-indigo-500\/80 mt-1 font-medium">\*Dari isian formulir mengajar<\/p>/g, '');
code = code.replace(/<p className="text-\[9px\] text-fuchsia-500\/80 mt-1 font-medium">\*Dari isian formulir mengajar<\/p>/g, '');

fs.writeFileSync('src/components/CekDataView.tsx', code);
