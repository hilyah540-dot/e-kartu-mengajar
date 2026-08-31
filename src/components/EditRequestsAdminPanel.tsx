import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { EditRequest, listenToAllPendingRequests, updateRequestStatus } from '../lib/editRequests';

export function EditRequestsAdminPanel() {
  const [requests, setRequests] = useState<EditRequest[]>([]);

  useEffect(() => {
    const unsubscribe = listenToAllPendingRequests(setRequests);
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateRequestStatus(id, 'approved');
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Perubahan Disetujui',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      Swal.fire('Error', 'Gagal menyetujui perubahan.', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateRequestStatus(id, 'rejected');
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Perubahan Dibatalkan',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      Swal.fire('Error', 'Gagal membatalkan perubahan.', 'error');
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 animate-fade-in">
      <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-amber-600" />
        <div>
          <h3 className="font-bold text-amber-800">Pengajuan Perubahan Data Guru</h3>
          <p className="text-xs text-amber-700 mt-0.5">Ada {requests.length} pengajuan perubahan (edit) yang menunggu persetujuan Anda.</p>
        </div>
      </div>
      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {requests.map(req => (
          <div key={req.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">{req.teacherName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {req.requestedData.Tanggal}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b pb-1">Data Lama (Spreadsheet)</p>
                    <ul className="text-xs space-y-1 text-slate-600">
                      <li>Ulya: {req.originalData.Mengajar_Ulya || 0}, Wustho: {req.originalData.Mengajar_Wustho || 0}, TD: {req.originalData.Mengajar_Tadribud || 0}</li>
                      <li>Pengganti Ulya: {req.originalData.Pengganti_Ulya || 0}, Wustho: {req.originalData.Pengganti_Wustho || 0}, TD: {req.originalData.Pengganti_Tadribud || 0}</li>
                      <li>Lembur: {req.originalData.Jam_Lembur || 0}j ({req.originalData.Deskripsi_Lembur || '-'})</li>
                      <li>Eskul: {req.originalData.Jenis_Eskul || '-'} ({req.originalData.Jml_Pertemuan_Eskul || 0}x)</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 shadow-sm relative">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2 border-b border-amber-100 pb-1">Data Baru (Diajukan)</p>
                    <ul className="text-xs space-y-1 text-slate-800 font-medium">
                      <li>Ulya: {req.requestedData.Mengajar_Ulya || 0}, Wustho: {req.requestedData.Mengajar_Wustho || 0}, TD: {req.requestedData.Mengajar_Tadribud || 0}</li>
                      <li>Pengganti Ulya: {req.requestedData.Pengganti_Ulya || 0}, Wustho: {req.requestedData.Pengganti_Wustho || 0}, TD: {req.requestedData.Pengganti_Tadribud || 0}</li>
                      <li>Lembur: {req.requestedData.Jam_Lembur || 0}j ({req.requestedData.Deskripsi_Lembur || '-'})</li>
                      <li>Eskul: {req.requestedData.Jenis_Eskul || '-'} ({req.requestedData.Jml_Pertemuan_Eskul || 0}x)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                <button 
                  onClick={() => req.id && handleApprove(req.id)}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" /> Setujui
                </button>
                <button 
                  onClick={() => req.id && handleReject(req.id)}
                  className="flex-1 md:flex-none bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <XCircle className="w-4 h-4" /> Batalkan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
