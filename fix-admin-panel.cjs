const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboardView.tsx', 'utf8');

content = content.replace(
  "        </button>\n      </div>\n      {isLoading ? (",
  "        </button>\n      </div>\n\n      <EditRequestsAdminPanel />\n\n      {isLoading ? ("
);

fs.writeFileSync('src/components/AdminDashboardView.tsx', content);
console.log('Fixed AdminDashboardView');
