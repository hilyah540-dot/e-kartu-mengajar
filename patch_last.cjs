const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { TEACHER_LIST, formatTanggalLengkap } from '../constants';",
  "import { TEACHER_LIST, formatTanggalLengkap } from '../constants';\nimport { DetailModal } from './DetailModal';\nimport { EditDataModal } from './EditDataModal';\nimport { saveEditRequest, EditRequest, getPendingRequestsForUser } from '../lib/editRequests';\nimport { Loader } from 'lucide-react';"
);

// 2. Add states
content = content.replace(
  "const [periodeText, setPeriodeText] = useState('-');",
  `const [periodeText, setPeriodeText] = useState('-');
  const [activeDetailType, setActiveDetailType] = useState<'mengajar' | 'pengganti' | 'lembur' | 'eskul' | 'hadir' | 'tidakHadir' | 'ulya' | 'wustho' | 'td' | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const pendingRequests = getPendingRequestsForUser(user.teacherName);`
);

// 3. Modals and banner
const returnRegex = /(<div className="p-4 md:p-6 max-w-5xl mx-auto pb-12 animate-fade-in">)/;
const banner = `      {pendingRequests.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <Loader className="w-5 h-5 text-amber-500 animate-spin mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Sedang Diproses</h4>
            <p className="text-xs mt-1">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. Mohon menunggu.</p>
          </div>
        </div>
      )}`;
const modals = `
      {isDetailModalOpen && (
        <DetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          type={activeDetailType} 
          filteredRows={filteredRows} 
          onEditClick={(row) => { setEditingRow(row); setIsEditModalOpen(true); }} 
        />
      )}
      {isEditModalOpen && (
        <EditDataModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          rowData={editingRow} 
          teacherName={user.teacherName}
          onSave={(req) => {
            saveEditRequest(req);
            setIsEditModalOpen(false);
            Swal.fire({
              icon: 'success',
              title: 'Terkirim',
              text: 'Perubahan data terkirim ke Admin.',
              confirmButtonColor: '#10b981'
            });
          }}
        />
      )}
`;

content = content.replace(returnRegex, "$1\n" + banner);
content = content.replace(/(<\/div>\n  \);\n\})/, modals + "$1");

fs.writeFileSync('src/components/DashboardView.tsx', content);
