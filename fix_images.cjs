const fs = require('fs');
const { execSync } = require('child_process');

try {
  // If sharp is not installed, install it
  execSync('npm install sharp --no-save');
  const sharp = require('sharp');
  
  sharp('public/logo.png')
    .resize(192, 192)
    .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFile('public/logo192.png')
    .then(() => console.log('logo192.png created'));

  sharp('public/logo.png')
    .resize(512, 512)
    .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFile('public/logo512.png')
    .then(() => console.log('logo512.png created'));

} catch(e) {
  console.error(e);
}
