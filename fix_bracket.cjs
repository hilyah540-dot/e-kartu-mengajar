const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

const target = `<p className="text-[10px] text-amber-700 mt-1 font-semibold">* Keterangan pengganti wajib diisi jika ada Jam Pengganti</p>
            </div>
            
              <button`;

const replacement = `<p className="text-[10px] text-amber-700 mt-1 font-semibold">* Keterangan pengganti wajib diisi jika ada Jam Pengganti</p>
            </div>
            )}
            
              <button`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/FormView.tsx', code);
    console.log("Fixed bracket successfully");
} else {
    console.log("Target still not found!");
}
