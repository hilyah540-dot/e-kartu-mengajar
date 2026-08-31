const fs = require('fs');
const content = `import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Search, FileText, PlusCircle, Home, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { RecordRow, User } from '../types';
import { TEACHER_LIST, formatTanggalLengkap } from '../constants';

interface DashboardViewProps {
  user: User;
  onBackMenu: () => void;
  onNavigateForm: () => void;
  globalData: RecordRow[];
  isLoading: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenCekData: (rows: RecordRow[], teacherName: string, periode: string) => void;
}

export function DashboardView({ user, onBackMenu, onNavigateForm, globalData, isLoading, onRefresh, isRefreshing, onOpenCekData }: DashboardViewProps) {
  const [filterNama, setFilterNama] = useState(user.role === 'user' ? user.teacherName : '');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  
  const [autoNama, setAutoNama] = useState(user.role === 'user' ? user.teacherName : '');
  const [periodeText, setPeriodeText] = useState('-');

  const [filteredRows, setFilteredRows] = useState<RecordRow[]>([]);
  const [stats, setStats] = useState({
    hadir: 0, tidakHadir: 0,
    mUlya: 0, mWus: 0, mTd: 0,
    pUlya: 0, pWus: 0, pTd: 0,
    lembur: 0, eskul: 0
  });

  const applyFilter = (nama: string, start: string, end: string) => {
    let result = [...globalData];
    
    if (nama) {
      result = result.filter(r => (r.Nama_Guru || '').toLowerCase() === nama.toLowerCase());
    }
    
    if (start) {
      const s = new Date(start).getTime();
      result = result.filter(r => {
        if (!r.Tanggal) return false;
        const t = new Date(r.Tanggal).getTime();
        return t >= s;
      });
    }
    
    if (end) {
      const e = new Date(end).getTime();
      result = result.filter(r => {
        if (!r.Tanggal) return false;
        const t = new Date(r.Tanggal).getTime();
        return t <= e;
      });
    }
    
    setFilteredRows(result);
    if (start && end) {
      setPeriodeText(formatTanggalLengkap(start) + ' s.d. ' + formatTanggalLengkap(end));
    } else {
      setPeriodeText('Semua Waktu');
    }

    let hadir = 0, tidakHadir = 0, mUlya = 0, mWus = 0, mTd = 0;
    let pUlya = 0, pWus = 0, pTd = 0, lembur = 0, eskul = 0;

    result.forEach(row => {
      if (row.Presensi === 'Hadir') hadir++;
      if (row.Presensi === 'Tidak Hadir') tidakHadir++;
      mUlya += Number(row.Mengajar_Ulya) || 0;
      mWus += Number(row.Mengajar_Wustho) || 0;
      mTd += Number(row.Mengajar_Tadribud) || 0;
      pUlya += Number(row.Pengganti_Ulya) || 0;
      pWus += Number(row.Pengganti_Wustho) || 0;
      pTd += Number(row.Pengganti_Tadribud) || 0;
      lembur += Number(row.Jam_Lembur) || 0;
      eskul += Number(row.Jml_Pertemuan_Eskul) || 0;
    });

    setStats({
      hadir, tidakHadir, mUlya, mWus, mTd, pUlya, pWus, pTd, lembur, eskul
    });
  };

  useEffect(() => {
    applyFilter(filterNama, filterStart, filterEnd);
  }, [globalData]);

  const handleAutoRekap = () => {
    if (!autoNama) {
      Swal.fire('Perhatian', 'Silakan pilih nama guru terlebih dahulu.', 'warning');
      return;
    }
    
    const today = new Date();
    let y = today.getFullYear();
    let m = today.getMonth();
    const startDate = new Date(y, m - 1, 26);
    const endDate = new Date(y, m, 25);
    
    const formatYMD = (date: Date) => {
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return \`\${date.getFullYear()}-\${month}-\${day}\`;
    };

    const startStr = formatYMD(startDate);
    const endStr = formatYMD(endDate);

    setFilterNama(autoNama);
    setFilterStart(startStr);
    setFilterEnd(endStr);
    applyFilter(autoNama, startStr, endStr);
  };

  const handleCheckAccessName = (val: string) => {
    if (user.role === 'user' && val.toLowerCase() !== user.teacherName.toLowerCase()) {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Afwan, sepertinya pilihan antum salah',
        confirmButtonColor: '#10b981'
      });
      setFilterNama(user.teacherName);
    } else {
      setFilterNama(val);
    }
  };

  const totalMengajar = stats.mUlya + stats.mWus + stats.mTd;
  const totalPengganti = stats.pUlya + stats.pWus + stats.pTd;
  const totalAkhir = totalMengajar + totalPengganti;

  const showDetail = (type: 'mengajar' | 'pengganti' | 'lembur' | 'eskul' | 'hadir' | 'tidakHadir' | 'ulya' | 'wustho' | 'td') => {
    let htmlContent = '<div class="text-left text-sm max-h-64 overflow-y-auto overflow-x-auto w-full">';
    let hasData = false;

    if (type === 'hadir') {
      htmlContent += '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1">Tanggal</th><th class="py-1">Jam Masuk</th><th class="py-1">Jam Keluar</th></tr></thead><tbody>';
      filteredRows.forEach(row => {
        if (row.Presensi === 'Hadir') {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1">' + (row.Jam_Masuk || '-') + '</td><td class="align-top pr-2 py-1">' + (row.Jam_Keluar || '-') + '</td></tr>';
        }
      });
      htmlContent += '</tbody></table>';
    } else if (type === 'tidakHadir') {
      htmlContent += '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1">Tanggal</th><th class="py-1">Keterangan</th></tr></thead><tbody>';
      filteredRows.forEach(row => {
        if (row.Presensi === 'Tidak Hadir') {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1">' + (row.Keterangan || '-') + '</td></tr>';
        }
      });
      htmlContent += '</tbody></table>';
    } else if (type === 'mengajar' || type === 'pengganti') {
      const isMengajar = type === 'mengajar';
      htmlContent += '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1 whitespace-nowrap">Tanggal</th><th class="py-1 whitespace-nowrap">Program</th><th class="py-1 text-center whitespace-nowrap">Jam</th><th class="py-1 whitespace-nowrap min-w-[120px]">Keterangan</th></tr></thead><tbody>';
      filteredRows.forEach(row => {
        const ulya = isMengajar ? Number(row.Mengajar_Ulya) || 0 : Number(row.Pengganti_Ulya) || 0;
        const wus = isMengajar ? Number(row.Mengajar_Wustho) || 0 : Number(row.Pengganti_Wustho) || 0;
        const td = isMengajar ? Number(row.Mengajar_Tadribud) || 0 : Number(row.Pengganti_Tadribud) || 0;
        const ket = (isMengajar ? row.Keterangan : row.Keterangan_Pengganti) || '-';
        if (ulya > 0 || wus > 0 || td > 0) {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          if (ulya > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1">Ulya</td><td class="align-top text-center py-1 font-bold text-emerald-600">' + ulya + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ket + '</td></tr>';
          if (wus > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1">Wustho</td><td class="align-top text-center py-1 font-bold text-emerald-600">' + wus + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ket + '</td></tr>';
          if (td > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1">Tadribud Du\\'at</td><td class="align-top text-center py-1 font-bold text-emerald-600">' + td + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ket + '</td></tr>';
        }
      });
      htmlContent += '</tbody></table>';
    } else if (type === 'ulya' || type === 'wustho' || type === 'td') {
      const progName = type === 'ulya' ? 'Ulya' : type === 'wustho' ? 'Wustho' : "Tadribud Du\\'at";
      htmlContent += '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1 whitespace-nowrap">Tanggal</th><th class="py-1 whitespace-nowrap">Status</th><th class="py-1 text-center whitespace-nowrap">Jam</th><th class="py-1 whitespace-nowrap min-w-[120px]">Keterangan</th></tr></thead><tbody>';
      filteredRows.forEach(row => {
        let m = 0, p = 0;
        if (type === 'ulya') { m = Number(row.Mengajar_Ulya) || 0; p = Number(row.Pengganti_Ulya) || 0; }
        else if (type === 'wustho') { m = Number(row.Mengajar_Wustho) || 0; p = Number(row.Pengganti_Wustho) || 0; }
        else { m = Number(row.Mengajar_Tadribud) || 0; p = Number(row.Pengganti_Tadribud) || 0; }
        const ketM = row.Keterangan || '-';
        const ketP = row.Keterangan_Pengganti || '-';
        if (m > 0 || p > 0) {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          if (m > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Mengajar</span></td><td class="align-top text-center py-1 font-bold text-emerald-600">' + m + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ketM + '</td></tr>';
          if (p > 0) htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1 whitespace-nowrap"><span class="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold inline-block">Pengganti</span></td><td class="align-top text-center py-1 font-bold text-emerald-600">' + p + '</td><td class="align-top pr-2 py-1 text-[10px]">' + ketP + '</td></tr>';
        }
      });
      htmlContent += '</tbody></table>';
    } else if (type === 'lembur') {
      htmlContent += '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1">Tanggal</th><th class="py-1">Deskripsi</th><th class="py-1 text-center">Jam</th></tr></thead><tbody>';
      filteredRows.forEach(row => {
        const lembur = Number(row.Jam_Lembur) || 0;
        if (lembur > 0) {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1">' + (row.Deskripsi_Lembur || '-') + '</td><td class="align-top text-center py-1 font-bold text-emerald-600">' + lembur + '</td></tr>';
        }
      });
      htmlContent += '</tbody></table>';
    } else if (type === 'eskul') {
      htmlContent += '<table class="w-full text-xs md:text-sm text-slate-700"><thead><tr class="border-b"><th class="py-1">Tanggal</th><th class="py-1">Jenis Eskul</th><th class="py-1 text-center">Pertemuan</th></tr></thead><tbody>';
      filteredRows.forEach(row => {
        const eskul = Number(row.Jml_Pertemuan_Eskul) || 0;
        if (eskul > 0) {
          hasData = true;
          const tanggalStr = row.Tanggal ? formatTanggalLengkap(row.Tanggal) : '-';
          htmlContent += '<tr class="border-b border-slate-100"><td class="py-1 align-top pr-2 whitespace-nowrap">' + tanggalStr + '</td><td class="align-top pr-2 py-1">' + (row.Jenis_Eskul || '-') + '</td><td class="align-top text-center py-1 font-bold text-emerald-600">' + eskul + '</td></tr>';
        }
      });
      htmlContent += '</tbody></table>';
    }

    if (!hasData) {
      htmlContent = '<div class="p-6 text-center text-slate-500 font-medium">Tidak ada data untuk rincian ini.</div>';
    } else {
      htmlContent += '</div>';
    }

    let title = '';
    if (type === 'hadir') title = 'Rincian Kehadiran';
    if (type === 'tidakHadir') title = 'Rincian Ketidakhadiran';
    if (type === 'ulya') title = 'Rincian Mengajar Ulya';
    if (type === 'wustho') title = 'Rincian Mengajar Wustho';
    if (type === 'td') title = "Rincian Mengajar Tadribud Du\\'at";
    if (type === 'mengajar') title = 'Rincian Jam Mengajar';
    if (type === 'pengganti') title = 'Rincian Jam Pengganti';
    if (type === 'lembur') title = 'Rincian Jam Lembur';
    if (type === 'eskul') title = 'Rincian Kegiatan Eskul';

    Swal.fire({
      title: title,
      html: htmlContent,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Tutup',
      width: '600px'
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBackMenu}
          className="text-emerald-700 hover:text-emerald-900 mr-4 font-bold p-2 bg-white rounded-xl shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-1 inline-block">
            Dashboard Rekapitulasi Guru
          </h2>
        </div>
        
        {onRefresh && (
          <button 
            onClick={() => {
              if (onRefresh && !isRefreshing) {
                // Show a small toast to inform user it's running in background
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'info',
                  title: 'Proses sinkronisasi data terbaru...',
                  showConfirmButton: false,
                  timer: 3000,
                  customClass: {
                    popup: 'colored-toast'
                  }
                });
                onRefresh();
              }
            }}
            disabled={isRefreshing}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-2.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-xs border border-emerald-200 ml-2 disabled:opacity-50"
          >
            <RefreshCw className={\`w-4 h-4 \${isRefreshing ? 'animate-spin' : ''}\`} /> 
            <span className="hidden md:inline">{isRefreshing ? 'Memuat...' : 'Refresh Data'}</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="bg-slate-200 h-24 rounded-2xl w-full"></div>
          <div className="bg-slate-200 h-64 rounded-2xl w-full"></div>
          <div className="bg-slate-200 h-64 rounded-2xl w-full"></div>
        </div>
      ) : (
        <>
      {/* Filter Options */}
      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm mb-6 border border-slate-200 space-y-4">
        {/* Manual Search */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <Search className="w-3.5 h-3.5 text-emerald-600" /> Pencarian Manual:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input 
              type="text"
              list="manual-teacher-list"
              placeholder="Ketik Nama Guru..."
              value={filterNama}
              readOnly={user.role === 'user'}
              onChange={(e) => handleCheckAccessName(e.target.value)}
              className="border border-slate-300 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2 bg-slate-50 focus:bg-white"
            />
            <datalist id="manual-teacher-list">
              {TEACHER_LIST.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <input 
              type="date" 
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
              className="border border-slate-300 p-2.5 rounded-xl text-xs text-slate-700 bg-slate-50"
            />
            <input 
              type="date" 
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
              className="border border-slate-300 p-2.5 rounded-xl text-xs text-slate-700 bg-slate-50"
            />
            <button 
              onClick={() => {
                if (filterNama && !TEACHER_LIST.includes(filterNama)) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'nama guru belum lengkap',
                    confirmButtonColor: '#10b981'
                  });
                  return;
                }
                applyFilter(filterNama, filterStart, filterEnd);
              }}
              className="md:col-span-4 bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Kalkulasi Cepat
            </button>
          </div>
        </div>

        {/* Auto Rekap */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Rekap Otomatis (Tgl 26 Bulan Lalu - Tgl 25 Bulan Ini):
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <select 
              value={autoNama}
              onChange={(e) => {
                if (user.role === 'user' && e.target.value !== user.teacherName) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Afwan, sepertinya pilihan antum salah',
                    confirmButtonColor: '#10b981'
                  });
                  setAutoNama(user.teacherName);
                } else {
                  setAutoNama(e.target.value);
                }
              }}
              className="border border-slate-300 p-2.5 rounded-xl text-xs md:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 flex-1 bg-slate-50"
            >
              <option value="">-- Pilih Nama Guru --</option>
              {TEACHER_LIST.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <button 
              onClick={handleAutoRekap}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Tampilkan Ringkasan
            </button>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-8 border-emerald-600 relative space-y-6 border border-slate-200">
        <div className="text-center border-b border-slate-200 pb-4">
          <h3 className="text-xl font-extrabold uppercase tracking-wide text-slate-800">Ringkasan Statistik</h3>
          <table className="w-full md:w-3/4 mx-auto text-left text-xs md:text-sm mt-3 max-w-md">
            <tbody>
              <tr>
                <td className="font-bold w-32 py-1 text-slate-600">Nama Guru</td>
                <td className="w-4">:</td>
                <td className="font-extrabold text-emerald-700 uppercase">
                  {filterNama ? filterNama : 'SEMUA GURU'}
                </td>
              </tr>
              <tr>
                <td className="font-bold py-1 text-slate-600">Periode Filter</td>
                <td>:</td>
                <td className="font-semibold text-slate-700">{periodeText}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 7 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
          <div 
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center cursor-pointer hover:bg-slate-100 hover:border-emerald-300 transition-colors"
            onClick={() => showDetail('hadir')}
            title="Klik untuk melihat rincian kehadiran"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hadir</p>
            <p className="text-xl md:text-2xl font-bold text-emerald-600 mt-1">{stats.hadir} <span className="text-xs font-normal">Hari</span></p>
          </div>
          
          <div 
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center cursor-pointer hover:bg-slate-100 hover:border-red-300 transition-colors"
            onClick={() => showDetail('tidakHadir')}
            title="Klik untuk melihat rincian ketidakhadiran"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tdk Hadir</p>
            <p className="text-xl md:text-2xl font-bold text-red-500 mt-1">{stats.tidakHadir} <span className="text-xs font-normal">Hari</span></p>
          </div>

          <div 
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center cursor-pointer hover:bg-slate-100 hover:border-emerald-300 transition-colors"
            onClick={() => showDetail('mengajar')}
            title="Klik untuk melihat rincian"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mengajar</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">{totalMengajar} <span className="text-xs font-normal">Jam</span></p>
          </div>

          <div 
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center cursor-pointer hover:bg-slate-100 hover:border-emerald-300 transition-colors"
            onClick={() => showDetail('pengganti')}
            title="Klik untuk melihat rincian"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pengganti</p>
            <p className="text-xl md:text-2xl font-bold text-amber-500 mt-1">{totalPengganti} <span className="text-xs font-normal">Jam</span></p>
          </div>

          <div 
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center cursor-pointer hover:bg-slate-100 hover:border-emerald-300 transition-colors"
            onClick={() => showDetail('lembur')}
            title="Klik untuk melihat rincian"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lembur</p>
            <p className="text-xl md:text-2xl font-bold text-indigo-600 mt-1">{stats.lembur} <span className="text-xs font-normal">Jam</span></p>
          </div>

          <div 
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center cursor-pointer hover:bg-slate-100 hover:border-emerald-300 transition-colors"
            onClick={() => showDetail('eskul')}
            title="Klik untuk melihat rincian"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Eskul</p>
            <p className="text-xl md:text-2xl font-bold text-purple-600 mt-1">{stats.eskul} <span className="text-xs font-normal">Prtm</span></p>
          </div>

          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl text-white shadow-md flex flex-col justify-center col-span-2 md:col-span-1">
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">TOTAL MENGAJAR</p>
            <p className="text-2xl font-extrabold mt-1">{totalAkhir} <span className="text-xs font-normal">Jam</span></p>
          </div>
        </div>

        {/* Program Breakdown */}
        <div className="text-xs bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
          <p className="font-bold text-emerald-900 border-b border-emerald-200/80 pb-2">Distribusi Jam per Program / Jenjang:</p>
          <ul className="grid grid-cols-3 gap-3 text-center">
            <li onClick={() => showDetail('ulya')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Ulya">
              <span className="text-slate-500 font-semibold">Ulya</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mUlya + stats.pUlya}</strong> Jam
            </li>
            <li onClick={() => showDetail('wustho')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Wustho">
              <span className="text-slate-500 font-semibold">Wustho</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mWus + stats.pWus}</strong> Jam
            </li>
            <li onClick={() => showDetail('td')} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors" title="Klik untuk melihat rincian Tadribud Du'at">
              <span className="text-slate-500 font-semibold">Tadribud Du'at</span><br />
              <strong className="text-base md:text-lg text-emerald-700">{stats.mTd + stats.pTd}</strong> Jam
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <button 
          onClick={() => onOpenCekData(filteredRows, filterNama || 'Semua Guru', periodeText)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2 text-sm"
        >
          <FileText className="w-5 h-5" /> Cek & Edit Data
        </button>
        <button 
          onClick={onNavigateForm}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2 text-sm"
        >
          <PlusCircle className="w-5 h-5" /> Isi Kartu Mengajar
        </button>
        <button 
          onClick={onBackMenu}
          className="flex-1 border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 bg-white p-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2 text-sm"
        >
          <Home className="w-5 h-5" /> Kembali ke Menu Utama
        </button>
      </div>
      </>
      )}
          
    </div>
  );
}
`;
fs.writeFileSync('src/components/DashboardView.tsx', content);
