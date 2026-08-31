const fs = require('fs');

let code = fs.readFileSync('src/components/MenuView.tsx', 'utf8');

code = code.replace(
  "export function MenuView({ user, onNavigate, onLogout, devAlert, globalData = [] }: MenuViewProps) {",
  "export function MenuView({ user, onNavigate, onLogout, devAlert, globalData = [] }: MenuViewProps) {\n  const isSpecialUser = user.username === 'yvt11' || user.username === 'bgs10';"
);

fs.writeFileSync('src/components/MenuView.tsx', code);
console.log("Fixed menu view");
