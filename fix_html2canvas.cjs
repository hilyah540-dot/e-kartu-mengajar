const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

const oldFunc = `  const generateCardCanvas = async () => {
    setIsExporting(true);
    // Allow React to re-render all rows into DOM
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const element = document.getElementById('area-cetak-kartu');
      if (!element) {
        throw new Error('Area cetak kartu tidak ditemukan');
      }

      // Hide the show-more button temporarily
      const btnContainer = element.querySelector('.show-more-container') as HTMLElement;
      if (btnContainer) btnContainer.style.display = 'none';

      const canvas = await toCanvas(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          width: '1000px',
          minWidth: '1000px',
          padding: '32px',
          margin: '0',
        },
      });

      if (btnContainer) btnContainer.style.display = '';
      
      setIsExporting(false);
      return canvas;`;

const newFunc = `  const generateCardCanvas = async () => {
    setIsExporting(true);
    // Allow React to re-render all rows into DOM
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const element = document.getElementById('area-cetak-kartu');
      if (!element) {
        throw new Error('Area cetak kartu tidak ditemukan');
      }

      // Hide the show-more button temporarily
      const btnContainer = element.querySelector('.show-more-container') as HTMLElement;
      if (btnContainer) btnContainer.style.display = 'none';

      // Fix for Mobile/Android: Expand element completely before capture
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      
      // Temporarily override Tailwind overflow classes by setting inline styles
      element.style.width = '1000px';
      element.style.maxWidth = '1000px';
      
      // Find inner scrollable wrappers and expand them
      const tableWrapper = element.querySelector('.overflow-x-auto.pb-4');
      const originalTableWrapperOverflow = tableWrapper ? tableWrapper.style.overflowX : '';
      if (tableWrapper) {
        tableWrapper.style.overflowX = 'visible';
      }

      // Short delay to let browser re-layout
      await new Promise(r => setTimeout(r, 100));

      const canvas = await toCanvas(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 1000, // force canvas width
        style: {
          width: '1000px',
          minWidth: '1000px',
          padding: '32px',
          margin: '0',
        },
      });

      // Restore layout
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      if (tableWrapper) {
        tableWrapper.style.overflowX = originalTableWrapperOverflow;
      }
      if (btnContainer) btnContainer.style.display = '';
      
      setIsExporting(false);
      return canvas;`;

if (code.includes('const canvas = await toCanvas(element, {') && code.includes('const btnContainer = element.querySelector')) {
    // try exact replace or regex
    code = code.replace(oldFunc, newFunc);
    
    // Check if it worked
    if (!code.includes('originalTableWrapperOverflow')) {
        console.error("Replace failed, maybe exact string mismatch");
    } else {
        fs.writeFileSync('src/components/CekDataView.tsx', code);
        console.log("Success replacing");
    }
} else {
    console.error("Could not find targets");
}
