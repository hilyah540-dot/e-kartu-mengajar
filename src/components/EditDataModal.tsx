import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';
import { RecordRow } from '../types';
import { EditRequest } from '../lib/editRequests';

interface EditDataModalProps {
  row: RecordRow;
  teacherName: string;
  onClose: () => void;
  onSave: (req: Omit<EditRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export function EditDataModal({ row, teacherName, onClose, onSave }: EditDataModalProps) {
  const [tanggal, setTanggal] = useState(row.Tanggal || '');
  
  // Mengajar
  const [mUlya, setMUlya] = useState<number>(Number(row.Mengajar_Ulya) || 0);
  const [mWustho, setMWustho] = useState<number>(Number(row.Mengajar_Wustho) || 0);
  const [mTd, setMTd] = useState<number>(Number(row.Mengajar_Tadribud) || 0);
  
  // Pengganti
  const [pUlya, setPUlya] = useState<number>(Number(row.Pengganti_Ulya) || 0);
  const [pWustho, setPWustho] = useState<number>(Number(row.Pengganti_Wustho) || 0);
  const [pTd, setPTd] = useState<number>(Number(row.Pengganti_Tadribud) || 0);
  
  // Tambahan
  const [lembur, setLembur] = useState<number>(Number(row.Jam_Lembur) || 0);
  const [deskLembur, setDeskLembur] = useState(row.Deskripsi_Lembur || '');
  const [eskul, setEskul] = useState(row.Jenis_Eskul || '');
  const [jmlEskul, setJmlEskul] = useState<number>(Number(row.Jml_Pertemuan_Eskul) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if data is exactly the same as original
    const isSame = 
      tanggal === (row.Tanggal || '') &&
      mUlya === (Number(row.Mengajar_Ulya) || 0) &&
      mWustho === (Number(row.Mengajar_Wustho) || 0) &&
      mTd === (Number(row.Mengajar_Tadribud) || 0) &&
      pUlya === (Number(row.Pengganti_Ulya) || 0) &&
      pWustho === (Number(row.Pengganti_Wustho) || 0) &&
      pTd === (Number(row.Pengganti_Tadribud) || 0) &&
      lembur === (Number(row.Jam_Lembur) || 0) &&
      deskLembur === (row.Deskripsi_Lembur || '') &&
      eskul === (row.Jenis_Eskul || '') &&
      jmlEskul === (Number(row.Jml_Pertemuan_Eskul) || 0);

    if (isSame) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Berubah',
        text: 'Maaf data yang Anda ajukan sama dengan data sebelumnya, silahkan perbaiki terlebih dahulu.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    onSave({
      teacherName,
      tanggal: row.Tanggal, // The original date as identifier
      originalData: row,
      requestedData: {
        Tanggal: tanggal,
        Mengajar_Ulya: mUlya,
        Mengajar_Wustho: mWustho,
        Mengajar_Tadribud: mTd,
        Pengganti_Ulya: pUlya,
        Pengganti_Wustho: pWustho,
        Pengganti_Tadribud: pTd,
        Jam_Lembur: lembur,
        Deskripsi_Lembur: deskLembur,
        Jenis_Eskul: eskul,
        Jml_Pertemuan_Eskul: jmlEskul
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-emerald-600 p-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold">Ajukan Perubahan Data</h3>
          <button onClick={onClose} className="hover:bg-emerald-700 p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
            <input 
              type="date" 
              value={tanggal} 
              onChange={e => setTanggal(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
              required
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-emerald-700 mb-3 text-sm border-b border-slate-200 pb-1">Jam Mengajar</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Ulya</label>
                <input type="number" min="0" value={mUlya} onChange={e => setMUlya(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Wustho</label>
                <input type="number" min="0" value={mWustho} onChange={e => setMWustho(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">TD</label>
                <input type="number" min="0" value={mTd} onChange={e => setMTd(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <h4 className="font-bold text-amber-700 mb-3 text-sm border-b border-amber-200 pb-1">Jam Pengganti</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-amber-800 mb-1">Ulya</label>
                <input type="number" min="0" value={pUlya} onChange={e => setPUlya(Number(e.target.value))} className="w-full border border-amber-300 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-amber-800 mb-1">Wustho</label>
                <input type="number" min="0" value={pWustho} onChange={e => setPWustho(Number(e.target.value))} className="w-full border border-amber-300 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-amber-800 mb-1">TD</label>
                <input type="number" min="0" value={pTd} onChange={e => setPTd(Number(e.target.value))} className="w-full border border-amber-300 rounded-lg p-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <h4 className="font-bold text-indigo-700 mb-3 text-sm border-b border-indigo-200 pb-1">Kegiatan Tambahan</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-indigo-800 mb-1">Lembur (Jam)</label>
                <input type="number" min="0" value={lembur} onChange={e => setLembur(Number(e.target.value))} className="w-full border border-indigo-300 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-indigo-800 mb-1">Deskripsi Lembur</label>
                <input type="text" value={deskLembur} onChange={e => setDeskLembur(e.target.value)} className="w-full border border-indigo-300 rounded-lg p-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-indigo-800 mb-1">Eskul</label>
                <input type="text" value={eskul} onChange={e => setEskul(e.target.value)} className="w-full border border-indigo-300 rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-indigo-800 mb-1">Jml Pertemuan</label>
                <input type="number" min="0" value={jmlEskul} onChange={e => setJmlEskul(Number(e.target.value))} className="w-full border border-indigo-300 rounded-lg p-2 text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
