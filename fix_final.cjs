const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');
content = content.replace("import { DetailModal } from './DetailModal';\n", "");
content = content.replace("import { EditDataModal } from './EditDataModal';\n", "");
content = content.replace("import { saveEditRequest, EditRequest, getPendingRequestsForUser } from '../lib/editRequests';\n", "");
content = content.replace("import { Loader } from 'lucide-react';\n", "");

const statesToRemove = `  const [activeDetailType, setActiveDetailType] = useState<'mengajar' | 'pengganti' | 'lembur' | 'eskul' | 'hadir' | 'tidakHadir' | 'ulya' | 'wustho' | 'td' | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const pendingRequests = getPendingRequestsForUser(user.teacherName);`;
content = content.replace(statesToRemove, "");

const bannerToRemove = `      {pendingRequests.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <Loader className="w-5 h-5 text-amber-500 animate-spin mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Sedang Diproses</h4>
            <p className="text-xs mt-1">Perubahan data isian kartu mengajar Anda sedang diproses oleh admin. Mohon menunggu.</p>
          </div>
        </div>
      )}`;
content = content.replace(bannerToRemove, "");

const modalsToRemove = `      {isDetailModalOpen && (
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
      )}`;
content = content.replace(modalsToRemove, "");

fs.writeFileSync('src/components/DashboardView.tsx', content);
