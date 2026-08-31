const sharp = require('sharp');
(async () => {
  await sharp('public/logo.png')
    .resize(192, 192)
    .flatten({ background: '#ffffff' })
    .toFile('public/logo192.png');
  console.log('logo192 done');
  await sharp('public/logo.png')
    .resize(512, 512)
    .flatten({ background: '#ffffff' })
    .toFile('public/logo512.png');
  console.log('logo512 done');
})();
