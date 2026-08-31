const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// There might be another place where `tableWrapper` or `element` is still typed as Element
// Let's just blindly force any .style that's causing issues by casting to HTMLElement inline

code = code.replace(/const originalTableWrapperOverflow = tableWrapper \? tableWrapper\.style\.overflowX : '';/g, "const originalTableWrapperOverflow = tableWrapper ? (tableWrapper as HTMLElement).style.overflowX : '';");
code = code.replace(/tableWrapper\.style\.overflowX = 'visible';/g, "(tableWrapper as HTMLElement).style.overflowX = 'visible';");
code = code.replace(/tableWrapper\.style\.overflowX = originalTableWrapperOverflow;/g, "(tableWrapper as HTMLElement).style.overflowX = originalTableWrapperOverflow;");

fs.writeFileSync('src/components/CekDataView.tsx', code);
console.log("Fixed deep tableWrapper styles");
