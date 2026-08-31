const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Fix the missing div at the beginning of the return
content = content.replace(
  '<div className="p-4 md:p-6 max-w-5xl mx-auto pb-12 animate-fade-in">\n        <button ',
  '<div className="p-4 md:p-6 max-w-5xl mx-auto pb-12 animate-fade-in">\n      <div className="flex items-center mb-6">\n        <button '
);

fs.writeFileSync('src/components/DashboardView.tsx', content);
