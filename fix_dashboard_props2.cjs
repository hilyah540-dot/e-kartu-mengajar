const fs = require('fs');

let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const interfaceRegex = /interface DashboardViewProps \{([\s\S]*?)\}/;
const match = code.match(interfaceRegex);

if (match && !match[0].includes('onNotifClosed?:')) {
    const newProps = match[0].replace(/}$/, '  onNotifClosed?: () => void;\n}');
    code = code.replace(match[0], newProps);
    fs.writeFileSync('src/components/DashboardView.tsx', code);
    console.log("Fixed Props 2");
}

