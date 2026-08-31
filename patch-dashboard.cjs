const fs = require('fs');
const path = 'src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(
  "import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';",
  "import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';\nimport { DetailModal } from './DetailModal';\nimport { EditDataModal } from './EditDataModal';\nimport { saveEditRequest, EditRequest, getPendingRequestsForUser } from '../lib/editRequests';"
);

// 2. Add states
content = content.replace(
  "const [autoNama, setAutoNama] = useState(user.role === 'user' ? user.teacherName : '');",
  `const [autoNama, setAutoNama] = useState(user.role === 'user' ? user.teacherName : '');
  const [activeDetailType, setActiveDetailType] = useState<'mengajar' | 'pengganti' | 'lembur' | 'eskul' | 'hadir' | 'tidakHadir' | 'ulya' | 'wustho' | 'td' | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const pendingRequests = getPendingRequestsForUser(user.teacherName);`
);

// 3. Replace showDetail function
const showDetailRegex = /const showDetail = \([\s\S]*?\}\;/;
const newShowDetail = `const showDetail = (type: 'mengajar' | 'pengganti' | 'lembur' | 'eskul' | 'hadir' | 'tidakHadir' | 'ulya' | 'wustho' | 'td') => {
    setActiveDetailType(type);
    setIsDetailModalOpen(true);
  };
  
  const handleEditClick = (row: any) => {
    setEditingRow(row);
    setIsEditModalOpen(true);
  };
  
  const handleSaveEdit = (req: EditRequest) => {
    saveEditRequest(req);
    setIsEditModalOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Terkirim',
      text: 'Perubahan data terkirim ke Admin.',
      confirmButtonColor: '#10b981'
    });
  };`;

content = content.replace(showDetailRegex, newShowDetail);

// 4. Add Notification Banner & Modals to return
const returnRegex = /(<div className="p-4 md:p-6 max-w-5xl mx-auto pb-12 animate-fade-in">)/;
const banner = `
      {pendingRequests.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <Loader className="w-5 h-5 text-amber-500 animate-spin mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Sedang Diproses</h4>
            <p className="text-xs mt-1">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. Mohon menunggu.</p>
          </div>
        </div>
      )}
`;
const modals = `
      <DetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        type={activeDetailType} 
        filteredRows={filteredRows} 
        onEditClick={handleEditClick} 
      />
      <EditDataModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        rowData={editingRow} 
        teacherName={user.teacherName}
        onSave={handleSaveEdit}
      />
`;

content = content.replace(returnRegex, "$1" + banner);
content = content.replace(/(<\/div>\n  \);\n\})/, modals + "$1");

fs.writeFileSync(path, content, 'utf8');
console.log('DashboardView patched');
