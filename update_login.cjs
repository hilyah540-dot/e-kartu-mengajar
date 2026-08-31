const fs = require('fs');

let code = fs.readFileSync('src/components/LoginView.tsx', 'utf8');

const target1 = `        <div className="mb-8 flex justify-center">
          <div className="bg-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Logo" referrerPolicy="no-referrer"
              className="w-20 h-20 object-contain drop-shadow-sm"
            />
          </div>
        </div>`;

const rep1 = `        <div className="mb-8 flex justify-center">
          <img 
            src={OFFICIAL_LOGO_URL} 
            alt="Logo" referrerPolicy="no-referrer"
            className="w-24 h-24 object-contain drop-shadow-md"
          />
        </div>`;

const target2 = `            <div className="bg-slate-50 border border-emerald-100 p-5 rounded-2xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left flex items-center gap-4 shadow-sm group"
                 onClick={() => processLogin(lastUsername)}>`;

const rep2 = `            <div className="bg-white border-0 shadow-[0_4px_20px_rgb(0,0,0,0.06)] p-5 rounded-2xl cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 text-left flex items-center gap-4 group"
                 onClick={() => processLogin(lastUsername)}>`;

code = code.replace(target1, rep1).replace(target2, rep2);
fs.writeFileSync('src/components/LoginView.tsx', code);
console.log("Updated login successfully");
