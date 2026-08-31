const { execSync } = require('child_process');
try {
  execSync('git config --global user.email "bot@example.com"');
  execSync('git config --global user.name "Bot"');
  execSync('git commit -m "Init"');
  console.log("Committed.");
} catch(e) { console.error(e.message); }
