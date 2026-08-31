const fs = require('fs');

let code = fs.readFileSync('src/components/FormView.tsx', 'utf8');

// 1. Initial State: useState<TeachingRow[]>([{ kat: '', jml: 0 }]) -> useState<TeachingRow[]>([])
code = code.replace(
  "const [penggantiRows, setPenggantiRows] = useState<TeachingRow[]>([{ kat: '', jml: 0 }]);",
  "const [penggantiRows, setPenggantiRows] = useState<TeachingRow[]>([]);"
);

// 2. The trash button condition: penggantiRows.length > 1 -> true (always show trash if row exists)
code = code.replace(
  "{penggantiRows.length > 1 && (",
  "{penggantiRows.length > 0 && ("
);

// 3. Conditional rendering for Keterangan Pengganti
const ketTarget = `            {/* Keterangan Pengganti */}
            <div className="pt-2">`;

const ketReplacement = `            {/* Keterangan Pengganti */}
            {penggantiRows.length > 0 && (
            <div className="pt-2">`;

const ketEndTarget = `               <p className="text-[10px] text-amber-700 mt-1 font-semibold">* Keterangan pengganti wajib diisi jika ada Jam Pengganti</p>
            </div>
            
            <button`;

const ketEndReplacement = `               <p className="text-[10px] text-amber-700 mt-1 font-semibold">* Keterangan pengganti wajib diisi jika ada Jam Pengganti</p>
            </div>
            )}
            
            <button`;

code = code.replace(ketTarget, ketReplacement);
code = code.replace(ketEndTarget, ketEndReplacement);

fs.writeFileSync('src/components/FormView.tsx', code);
console.log("Updated FormView for pengganti rules");
