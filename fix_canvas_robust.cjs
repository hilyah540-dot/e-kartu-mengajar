const fs = require('fs');

let code = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

const regex = /const canvas = await toCanvas\(element, \{[\s\S]*?\}\);/m;

if (regex.test(code) && !code.includes('originalTableWrapperOverflow')) {
    let replaced = code.replace(
        "const btnContainer = element.querySelector('.show-more-container') as HTMLElement;",
        `const btnContainer = element.querySelector('.show-more-container') as HTMLElement;
      
      // Fix for Mobile/Android: Expand element completely before capture
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      
      // Temporarily override Tailwind overflow classes by setting inline styles
      element.style.width = '1000px';
      element.style.maxWidth = '1000px';
      
      // Find inner scrollable wrappers and expand them
      const tableWrapper = element.querySelector('.overflow-x-auto.pb-4') as HTMLElement;
      const originalTableWrapperOverflow = tableWrapper ? tableWrapper.style.overflowX : '';
      if (tableWrapper) {
        tableWrapper.style.overflowX = 'visible';
      }

      // Short delay to let browser re-layout
      await new Promise(r => setTimeout(r, 100));`
    );
    
    replaced = replaced.replace(
        "if (btnContainer) btnContainer.style.display = '';",
        `// Restore layout
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      if (tableWrapper) {
        tableWrapper.style.overflowX = originalTableWrapperOverflow;
      }
      
      if (btnContainer) btnContainer.style.display = '';`
    );
    
    // Also inject `width: 1000` to toCanvas options
    replaced = replaced.replace(
      "backgroundColor: '#ffffff',",
      "backgroundColor: '#ffffff',\n        width: 1000,"
    );

    fs.writeFileSync('src/components/CekDataView.tsx', replaced);
    console.log("Replaced robustly");
} else {
    console.log("Already replaced or not found");
}

