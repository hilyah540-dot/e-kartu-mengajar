import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { toCanvas, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { RecordRow } from '../types';
import { OFFICIAL_LOGO_URL, formatTanggalIndo } from '../constants';
import { ArrowLeft, FileDown, FileSpreadsheet, Share2, ChevronDown, BookOpen, Repeat, Image as ImageIcon, Edit, Clock, CheckCircle, XCircle , Download, UserCheck, UserX, Timer, Trophy} from 'lucide-react';
import { EditRequest, submitEditRequest, listenToTeacherAllRequests } from '../lib/editRequests';
import { EditDataModal } from './EditDataModal';

interface CekDataViewProps {
  rows: RecordRow[];
  teacherName: string;
  periodeText: string;
  onBack: () => void;
}

export function CekDataView({ rows, teacherName, periodeText, onBack }: CekDataViewProps) {
  const [displayLimit, setDisplayLimit] = useState(30);
  const [isExporting, setIsExporting] = useState(false);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  const [editingRow, setEditingRow] = useState<RecordRow | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    if (teacherName) {
      unsubscribe = listenToTeacherAllRequests(teacherName, setEditRequests);
    }
    return () => unsubscribe && unsubscribe();
  }, [teacherName]);

  const handleSaveEdit = async (req: Omit<EditRequest, 'id' | 'createdAt' | 'status'>) => {
    try {
      await submitEditRequest(req);
      setEditingRow(null);
      Swal.fire({
        icon: 'success',
        title: 'Terkirim',
        text: 'Perubahan data terkirim ke Admin.',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      Swal.fire('Error', 'Gagal mengirim pengajuan.', 'error');
    }
  };


  // Compute breakdown
  let jmUlya = 0, jmWus = 0, jmTd = 0;
  let jpUlya = 0, jpWus = 0, jpTd = 0;
  let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalAlfa = 0, totalDinas = 0, totalTidakHadir = 0;
  let totalLembur = 0, totalEskul = 0;

  rows.forEach(r => {
    if (r.Presensi === 'Hadir') {
      totalHadir++;
    } else if (r.Presensi === 'Tidak Hadir') {
      totalTidakHadir++;
      const ket = (r.Keterangan || '').toLowerCase();
      if (ket.includes('izin')) totalIzin++;
      else if (ket.includes('sakit')) totalSakit++;
      else if (ket.includes('tanpa keterangan') || ket.includes('alfa')) totalAlfa++;
      else if (ket.includes('dinas')) totalDinas++;
    }

    jmUlya += Number(r.Mengajar_Ulya) || 0;
    jmWus += Number(r.Mengajar_Wustho) || 0;
    jmTd += Number(r.Mengajar_Tadribud) || 0;

    jpUlya += Number(r.Pengganti_Ulya) || 0;
    jpWus += Number(r.Pengganti_Wustho) || 0;
    jpTd += Number(r.Pengganti_Tadribud) || 0;
    totalLembur += Number(r.Jam_Lembur) || 0;
    totalEskul += Number(r.Jml_Pertemuan_Eskul) || 0;
  });

  const displayedRows = isExporting ? rows : rows.slice(0, displayLimit);
  const cleanFileName = (teacherName || 'Guru').replace(/\s+/g, '_');

  const generateCardCanvas = async () => {
    setIsExporting(true);
    // Allow React to re-render all rows into DOM
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const element = document.getElementById('area-cetak-kartu') as HTMLElement;
      const htmlElement = element;
      if (!element) {
        throw new Error('Area cetak kartu tidak ditemukan');
      }

      // Hide the show-more button temporarily
      const btnContainer = element.querySelector('.show-more-container') as HTMLElement;
      if (btnContainer) btnContainer.style.display = 'none';

      // Fix for Mobile/Android: Expand element completely before capture
      const originalWidth = htmlElement.style.width;
      const originalMaxWidth = htmlElement.style.maxWidth;
      
      // Temporarily override Tailwind overflow classes by setting inline styles
      htmlElement.style.width = '1000px';
      htmlElement.style.maxWidth = '1000px';
      
      // Find inner scrollable wrappers and expand them
      const tableWrapper = element.querySelector('.overflow-x-auto.pb-4') as HTMLElement;
      const originalTableWrapperOverflow = tableWrapper ? (tableWrapper as HTMLElement).style.overflowX : '';
      if (tableWrapper) {
        (tableWrapper as HTMLElement).style.overflowX = 'visible';
      }

      // Short delay to let browser re-layout
      await new Promise(r => setTimeout(r, 100));

      const canvas = await toCanvas(htmlElement, {
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
      htmlElement.style.width = originalWidth;
      htmlElement.style.maxWidth = originalMaxWidth;
      if (tableWrapper) {
        (tableWrapper as HTMLElement).style.overflowX = originalTableWrapperOverflow;
      }
      if (btnContainer) btnContainer.style.display = '';
      
      setIsExporting(false);
      return canvas;
    } catch (error) {
      setIsExporting(false);
      console.error("Canvas generation error", error);
      throw error;
    }
  };

  const downloadPDF = async () => {
    Swal.fire({
      title: 'Menyiapkan PDF...',
      text: 'Mengonversi kartu ke dokumen PDF...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const canvas = await generateCardCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 8; // 8mm margin
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      const pageHeight = pdfHeight - margin * 2;

      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = margin - (contentHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Kartu_Mengajar_${cleanFileName}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Ekspor PDF',
        text: 'File PDF Kartu Mengajar telah berhasil diunduh.',
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      console.error('Error exporting PDF:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Ekspor PDF',
        text: 'Terjadi kendala saat memproses PDF. Silakan coba kembali.',
        confirmButtonColor: '#10b981'
      });
    }
  };

  const downloadImage = async (type: 'jpg' | 'png' = 'jpg') => {
    Swal.fire({
      title: 'Menyiapkan Gambar...',
      text: 'Mengonversi kartu ke gambar...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const canvas = await generateCardCanvas();
      const mimeType = type === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const link = document.createElement('a');
      link.download = `Kartu_Mengajar_${cleanFileName}.${type}`;
      link.href = dataUrl;
      link.click();

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Mengunduh Gambar',
        text: `Gambar kartu mengajar format ${type.toUpperCase()} telah terunduh.`,
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      console.error('Error exporting image:', err);
      Swal.fire('Error', 'Gagal memproses gambar kartu mengajar.', 'error');
    }
  };

  const downloadExcel = () => {
    if (rows.length === 0) {
      Swal.fire('Data Kosong', 'Tidak ada data untuk diekspor ke Excel.', 'warning');
      return;
    }

    const wsData: any[][] = [
      ['No', 'Tanggal', 'Kehadiran', 'Jam Mengajar', 'Jam Pengganti', 'Kegiatan Tambahan']
    ];

    rows.forEach((row, idx) => {
      let mengajar = (row.Mengajar_Ulya ? `Ulya:${row.Mengajar_Ulya} ` : '') + 
                     (row.Mengajar_Wustho ? `Wustho:${row.Mengajar_Wustho} ` : '') + 
                     (row.Mengajar_Tadribud ? `TD:${row.Mengajar_Tadribud}` : '');

      let pengganti = (row.Pengganti_Ulya ? `Ulya:${row.Pengganti_Ulya} ` : '') + 
                      (row.Pengganti_Wustho ? `Wustho:${row.Pengganti_Wustho} ` : '') + 
                      (row.Pengganti_Tadribud ? `TD:${row.Pengganti_Tadribud}` : '');

      let arrTambahan = [];
      if (row.Jam_Lembur && row.Jam_Lembur !== 0) arrTambahan.push(`Lembur (${row.Jam_Lembur}j)`);
      if (row.Jml_Pertemuan_Eskul && row.Jml_Pertemuan_Eskul !== 0) arrTambahan.push(`Eskul ${row.Jenis_Eskul || ''} (${row.Jml_Pertemuan_Eskul}x)`);
      if (row.Lain_Lain) arrTambahan.push(`Lain-Lain`);

      wsData.push([
        idx + 1,
        formatTanggalIndo(row.Tanggal),
        row.Presensi,
        mengajar || '-',
        pengganti || '-',
        arrTambahan.join(', ') || '-'
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap_Mengajar");

    XLSX.writeFile(wb, `Data_Mengajar_${cleanFileName}.xlsx`);
  };

  const shareWAOptions = async () => {
    const { value: format } = await Swal.fire({
      title: 'Pilih Format Bagikan WA',
      input: 'select',
      inputOptions: {
        'text': 'Teks Ringkasan Saja',
        'image': 'Gambar Kartu (JPG / PNG)',
        'pdf': 'File Dokumen PDF'
      },
      inputPlaceholder: 'Pilih format...',
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
    });

    if (format === 'text') {
      const total = jmUlya + jmWus + jmTd + jpUlya + jpWus + jpTd;
      let text = `*LAPORAN REKAP GURU*\nPonpes Al-Madina Prabumulih\n\n👤 *Nama:* ${teacherName}\n📅 *Periode:* ${periodeText}\n\n✅ *Total Kehadiran:* ${totalHadir} Hari\n❌ *Ketidakhadiran:* ${totalTidakHadir} Hari (I:${totalIzin}, S:${totalSakit}, A:${totalAlfa})\n⏱️ *Total Jam Keseluruhan:* ${total} Jam\n⏳ *Total Lembur:* ${totalLembur} Jam\n🏆 *Total Eskul:* ${totalEskul} Pertemuan\n\nData digenerate secara otomatis melalui E-Administrasi Ponpes Al-Madina.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (format === 'image') {
      const total = jmUlya + jmWus + jmTd + jpUlya + jpWus + jpTd;
      let text = `*LAPORAN REKAP GURU*\nPonpes Al-Madina Prabumulih\n\n👤 *Nama:* ${teacherName}\n📅 *Periode:* ${periodeText}\n\n✅ *Total Kehadiran:* ${totalHadir} Hari\n❌ *Ketidakhadiran:* ${totalTidakHadir} Hari (I:${totalIzin}, S:${totalSakit}, A:${totalAlfa})\n⏱️ *Total Jam Keseluruhan:* ${total} Jam\n⏳ *Total Lembur:* ${totalLembur} Jam\n🏆 *Total Eskul:* ${totalEskul} Pertemuan\n\nBerikut terlampir gambar Kartu Mengajar.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      await downloadImage('jpg');
    } else if (format === 'pdf') {
      downloadPDF();
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-emerald-700 hover:text-emerald-900 mr-4 font-bold p-2 bg-white rounded-xl shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-1">
          Tabel Rincian Mengajar
        </h2>
      </div>

      {/* Printable Area */}
      <div id="area-cetak-kartu" className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 overflow-x-auto relative space-y-6">
        <div className="flex items-center justify-center border-b-2 border-slate-800 pb-4">
          <img 
            src={OFFICIAL_LOGO_URL} 
            alt="Logo" referrerPolicy="no-referrer" 
            className="w-16 h-16 mr-4 object-contain"
            
            crossOrigin="anonymous"
          />
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">KARTU MENGAJAR GURU</h2>
            <p className="text-xs md:text-sm font-semibold text-slate-600">Pondok Pesantren Al-Madina Prabumulih</p>
          </div>
        </div>

        <table className="text-xs md:text-sm font-semibold text-left">
          <tbody>
            <tr>
              <td className="pr-4 py-1 text-slate-600">Nama Guru</td>
              <td>:</td>
              <td className="pl-2 font-bold text-emerald-800 uppercase">{teacherName}</td>
            </tr>
            <tr>
              <td className="pr-4 py-1 text-slate-600">Periode</td>
              <td>:</td>
              <td className="pl-2 font-semibold text-slate-700">{periodeText}</td>
            </tr>
          </tbody>
        </table>
        {/* Table Rincian */}
        <div className="overflow-x-auto pb-4">
          <table className="table-rincian w-full text-xs text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="uppercase text-[11px] tracking-wider text-white">
              <th style={{ backgroundColor: '#059669' }} className="p-3 border border-emerald-700 text-center w-[6%]">No</th>
              <th style={{ backgroundColor: '#059669' }} className="p-3 border border-emerald-700 w-[18%]">Tanggal</th>
              <th style={{ backgroundColor: '#059669' }} className="p-3 border border-emerald-700 w-[25%]">Detail Jam Mengajar</th>
              <th style={{ backgroundColor: '#059669' }} className="p-3 border border-emerald-700 w-[25%]">Jam Pengganti</th>
              <th style={{ backgroundColor: '#059669' }} className="p-3 border border-emerald-700 w-[26%]">Kegiatan Tambahan</th>
              {!isExporting && teacherName && <th style={{ backgroundColor: '#059669' }} className="p-3 border border-emerald-700 text-center w-[8%]">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {displayedRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 italic text-slate-500 border p-3">
                  Tidak ada data rincian mengajar di rentang tanggal ini.
                </td>
              </tr>
            ) : (
              displayedRows.map((row, idx) => {
                let arrM = [];
                if (row.Mengajar_Ulya) arrM.push(`Ulya: ${row.Mengajar_Ulya}`);
                if (row.Mengajar_Wustho) arrM.push(`Wustho: ${row.Mengajar_Wustho}`);
                if (row.Mengajar_Tadribud) arrM.push(`TD: ${row.Mengajar_Tadribud}`);

                let arrP = [];
                if (row.Pengganti_Ulya) arrP.push(`Ulya: ${row.Pengganti_Ulya}`);
                if (row.Pengganti_Wustho) arrP.push(`Wustho: ${row.Pengganti_Wustho}`);
                if (row.Pengganti_Tadribud) arrP.push(`TD: ${row.Pengganti_Tadribud}`);
                if (arrP.length > 0 && row.Keterangan_Pengganti) arrP.push(`Ket: ${row.Keterangan_Pengganti}`);

                let arrT = [];
                if (row.Jam_Lembur && row.Jam_Lembur !== 0) arrT.push(`Lembur (${row.Jam_Lembur}j)`);
                if (row.Jml_Pertemuan_Eskul && row.Jml_Pertemuan_Eskul !== 0) arrT.push(`Eskul ${row.Jenis_Eskul || ''} (${row.Jml_Pertemuan_Eskul}x)`);
                if (row.Lain_Lain) arrT.push(`Lain-Lain`);

                return (
                  <tr key={idx}>
                    <td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 text-center font-bold text-slate-600">{idx + 1}</td>
                    <td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 font-semibold text-slate-800 whitespace-nowrap">
                      {formatTanggalIndo(row.Tanggal)}
                    </td>
                    <td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 font-medium leading-relaxed">
                      {arrM.length > 0 ? arrM.map((m, i) => <div key={i}>{m}</div>) : '-'}
                    </td>
                    <td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 font-medium leading-relaxed text-amber-800">
                      {arrP.length > 0 ? arrP.map((p, i) => <div key={i}>{p}</div>) : '-'}
                    </td>
                    <td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 font-medium leading-relaxed text-indigo-800">
                      {arrT.length > 0 ? arrT.map((t, i) => <div key={i}>{t}</div>) : '-'}
                    </td>
                    {!isExporting && teacherName && (
                      <td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 text-center">
                        {(() => {
                          const request = editRequests.find(r => r.tanggal === row.Tanggal);
                          if (!request) {
                            return (
                              <button 
                                onClick={() => setEditingRow(row)}
                                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Data"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            );
                          } else if (request.status === 'pending') {
                            return (
                              <div className="flex flex-col items-center gap-1" title="Sedang Proses">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <span className="text-[9px] text-amber-600 font-bold leading-tight">Proses</span>
                              </div>
                            );
                          } else if (request.status === 'approved') {
                            return (
                              <div className="flex flex-col items-center gap-1" title="Perubahan Berhasil">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-[9px] text-emerald-600 font-bold leading-tight">Disetujui</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex flex-col items-center gap-1" title="Perubahan Ditolak">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-[9px] text-red-600 font-bold leading-tight">Ditolak</span>
                              </div>
                            );
                          }
                        })()}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>

        {displayLimit < rows.length && !isExporting && (
          <div className="show-more-container text-center pt-2">
            <button
              onClick={() => setDisplayLimit(displayLimit + 30)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-2.5 rounded-full font-bold text-xs transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Tampilkan Lebih Banyak ({rows.length - displayLimit} data lagi)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* Rekap Kehadiran & Jam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t-2 border-slate-100">
          
          {/* Kehadiran Card */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
              <UserCheck className="w-24 h-24 text-blue-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100 text-blue-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Kehadiran
                </h3>
              </div>
              <span className="bg-blue-600 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalHadir} Hari
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-blue-700 block uppercase tracking-wider mb-1">Total Hadir Mengajar</span>
              <span className="text-3xl font-black text-slate-800">{totalHadir}</span>
            </div>
          </div>

          {/* Ketidakhadiran Card */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 -rotate-12">
              <UserX className="w-24 h-24 text-rose-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-rose-100 text-rose-600">
                  <UserX className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Ketidakhadiran
                </h3>
              </div>
              <span className="bg-rose-500 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalTidakHadir} Hari
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 block uppercase tracking-wider mb-1">Izin</span>
                <span className="text-2xl font-black text-slate-800">{totalIzin}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 block uppercase tracking-wider mb-1">Sakit</span>
                <span className="text-2xl font-black text-slate-800">{totalSakit}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 block uppercase tracking-wider mb-1">Alfa</span>
                <span className="text-2xl font-black text-slate-800">{totalAlfa}</span>
              </div>
            </div>
          </div>

          {/* Jam Mengajar (JM) Card */}
          {/* Jam Mengajar (JM) Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
              <BookOpen className="w-24 h-24 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-emerald-100 text-emerald-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Mengajar (JM)
                </h3>
              </div>
              <span className="bg-emerald-600 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {jmUlya + jmWus + jmTd} Jam
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block uppercase tracking-wider mb-1">Ulya</span>
                <span className="text-2xl font-black text-slate-800">{jmUlya}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block uppercase tracking-wider mb-1">Wustho</span>
                <span className="text-2xl font-black text-slate-800">{jmWus}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block uppercase tracking-wider mb-1">Tadribud</span>
                <span className="text-2xl font-black text-slate-800">{jmTd}</span>
              </div>
            </div>
          </div>

          {/* Jam Pengganti (JP) Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 -rotate-12">
              <Repeat className="w-24 h-24 text-amber-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-amber-100 text-amber-600">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Pengganti (JP)
                </h3>
              </div>
              <span className="bg-amber-500 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {jpUlya + jpWus + jpTd} Jam
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 block uppercase tracking-wider mb-1">Ulya</span>
                <span className="text-2xl font-black text-slate-800">{jpUlya}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 block uppercase tracking-wider mb-1">Wustho</span>
                <span className="text-2xl font-black text-slate-800">{jpWus}</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-amber-100 rounded-xl p-3 text-center shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 block uppercase tracking-wider mb-1">Tadribud</span>
                <span className="text-2xl font-black text-slate-800">{jpTd}</span>
              </div>
            </div>
          </div>
        {/* Kegiatan Tambahan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t-2 border-slate-100">
          
          {/* Jam Lembur Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
              <Timer className="w-24 h-24 text-indigo-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-indigo-100 text-indigo-600">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Lembur
                </h3>
              </div>
              <span className="bg-indigo-600 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalLembur} Jam
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-indigo-700 block uppercase tracking-wider mb-1">Total Jam Lembur</span>
              <span className="text-3xl font-black text-slate-800">{totalLembur}</span>
              
            </div>
          </div>

          {/* Ekstrakurikuler Card */}
          <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 -rotate-12">
              <Trophy className="w-24 h-24 text-fuchsia-600" />
            </div>
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-fuchsia-100 text-fuchsia-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 tracking-tight uppercase text-sm">
                  Total Ekstrakurikuler
                </h3>
              </div>
              <span className="bg-fuchsia-500 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-sm">
                {totalEskul} Pertemuan
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-fuchsia-100 rounded-xl p-3 text-center shadow-sm relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-fuchsia-700 block uppercase tracking-wider mb-1">Total Pertemuan Eskul</span>
              <span className="text-3xl font-black text-slate-800">{totalEskul}</span>
              
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* Action Buttons at the Bottom */}
      <div className="flex flex-wrap gap-3 mt-6 justify-end">
        <button 
          onClick={() => downloadImage('jpg')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2.5 transition-all active:scale-[0.98]"
        >
          <Download className="w-5 h-5" /> Download
        </button>
        <button 
          onClick={shareWAOptions}
          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2.5 transition-all active:scale-[0.98]"
        >
          <Share2 className="w-5 h-5" /> Share
        </button>
      </div>

      {editingRow && (
        <EditDataModal
          row={editingRow}
          teacherName={teacherName}
          onClose={() => setEditingRow(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

