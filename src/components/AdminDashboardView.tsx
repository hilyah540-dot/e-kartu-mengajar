import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TEACHER_LIST, OFFICIAL_LOGO_URL, formatTanggalIndo } from '../constants';
import { RecordRow } from '../types';
import { ArrowLeft, Filter, FileDown, FileSpreadsheet, Crown, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { EditRequestsAdminPanel } from './EditRequestsAdminPanel';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AdminDashboardViewProps {
  globalData: RecordRow[];
  onBack: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
}

export function AdminDashboardView({ globalData, onBack, onRefresh, isLoading, isRefreshing }: AdminDashboardViewProps) {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const todayFormatted = `${y}-${m}-${d}`;

  const [selectedNama, setSelectedNama] = useState('');
  const [startStr, setStartStr] = useState(`${y}-${m}-01`);
  const [endStr, setEndStr] = useState(`${y}-${m}-${d}`);

  const [appliedFilters, setAppliedFilters] = useState({
    nama: '',
    start: `${y}-${m}-01`,
    end: `${y}-${m}-${d}`
  });

  const handleApplyFilter = () => {
    setAppliedFilters({
      nama: selectedNama,
      start: startStr,
      end: endStr
    });
  };

  // Process data for dashboard metrics
  const processed = useMemo(() => {
    const filterNama = appliedFilters.nama;
    const startDate = appliedFilters.start ? new Date(appliedFilters.start).getTime() : 0;
    const endDate = appliedFilters.end ? new Date(appliedFilters.end).getTime() + 86400000 : Infinity;

    const sevenDaysAgo = today.getTime() - (7 * 86400000);
    const startOfMonthTime = new Date(`${y}-${m}-01`).getTime();

    let tdHadir = 0, tdSakit = 0, tdIzin = 0, tdAlpa = 0;
    let jamMingguan = 0, jamBulanan = 0;
    let jamUlya = 0, jamWustho = 0, jamTD = 0;
    const absenceMap: Record<string, { sakit: number; izin: number; alpa: number; details: { tanggal: string; keterangan: string }[] }> = {};
    const todayFilledTeachers = new Set<string>();

    // 7 Days Labels
    const chartDates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      let dTarget = new Date(today.getTime() - (i * 86400000));
      chartDates.push(`${String(dTarget.getDate()).padStart(2, '0')}/${String(dTarget.getMonth() + 1).padStart(2, '0')}`);
    }
    const chartHadir = [0, 0, 0, 0, 0, 0, 0];
    const chartAbsen = [0, 0, 0, 0, 0, 0, 0];
    const chartHadirNames: string[][] = [[], [], [], [], [], [], []];
    const chartAbsenNames: string[][] = [[], [], [], [], [], [], []];

    globalData.forEach(row => {
      if (!row.Tanggal || !row.Nama_Guru) return;
      if (filterNama && row.Nama_Guru !== filterNama) return;

      const rDateObj = new Date(row.Tanggal);
      const rowDateTime = rDateObj.getTime();
      const ry = rDateObj.getFullYear();
      const rm = String(rDateObj.getMonth() + 1).padStart(2, '0');
      const rd = String(rDateObj.getDate()).padStart(2, '0');
      const rowFormatted = `${ry}-${rm}-${rd}`;

      // Today's attendance
      if (rowFormatted === todayFormatted) {
        todayFilledTeachers.add(row.Nama_Guru);
        if (row.Presensi === 'Hadir') tdHadir++;
        else if (row.Presensi === 'Tidak Hadir') {
          const ket = row.Keterangan || '';
          if (ket === 'Sakit') tdSakit++;
          else if (ket === 'Izin' || ket.includes('Dinas')) tdIzin++;
          else tdAlpa++;
        }
      }

      const totalJamReal = (Number(row.Mengajar_Ulya) || 0) + (Number(row.Mengajar_Wustho) || 0) + (Number(row.Mengajar_Tadribud) || 0) +
                         (Number(row.Pengganti_Ulya) || 0) + (Number(row.Pengganti_Wustho) || 0) + (Number(row.Pengganti_Tadribud) || 0);

      if (rowDateTime >= sevenDaysAgo && rowDateTime <= today.getTime() + 86400000) {
        jamMingguan += totalJamReal;
      }
      if (rowDateTime >= startOfMonthTime && rowDateTime <= today.getTime() + 86400000) {
        jamBulanan += totalJamReal;
      }

      let dayDiff = Math.floor((today.getTime() - rowDateTime) / 86400000);
      if (dayDiff >= 0 && dayDiff <= 6) {
        let indexChart = 6 - dayDiff;
        if (row.Presensi === 'Hadir') {
          chartHadir[indexChart]++;
          chartHadirNames[indexChart].push(row.Nama_Guru);
        } else if (row.Presensi === 'Tidak Hadir') {
          chartAbsen[indexChart]++;
          chartAbsenNames[indexChart].push(`${row.Nama_Guru} (${row.Keterangan || 'Alpa'})`);
        }
      }

      // Inside filter period
      if (rowDateTime >= startDate && rowDateTime <= endDate) {
        // Calculate detailed hours per program
        jamUlya += (Number(row.Mengajar_Ulya) || 0) + (Number(row.Pengganti_Ulya) || 0);
        jamWustho += (Number(row.Mengajar_Wustho) || 0) + (Number(row.Pengganti_Wustho) || 0);
        jamTD += (Number(row.Mengajar_Tadribud) || 0) + (Number(row.Pengganti_Tadribud) || 0);

        // Absence Table
        if (row.Presensi === 'Tidak Hadir') {
          if (!absenceMap[row.Nama_Guru]) {
            absenceMap[row.Nama_Guru] = { sakit: 0, izin: 0, alpa: 0, details: [] };
          }
          const ket = row.Keterangan || 'Alpa';
          if (ket === 'Sakit') absenceMap[row.Nama_Guru].sakit++;
          else if (ket === 'Izin' || ket.includes('Dinas')) absenceMap[row.Nama_Guru].izin++;
          else absenceMap[row.Nama_Guru].alpa++;
          
          absenceMap[row.Nama_Guru].details.push({ tanggal: rowFormatted, keterangan: ket });
        }
      }
    });

    const totalToday = tdHadir + tdSakit + tdIzin + tdAlpa;
    const teachersNotFilledToday = TEACHER_LIST.filter(t => !todayFilledTeachers.has(t));

    return {
      tdHadir, tdSakit, tdIzin, tdAlpa, totalToday,
      jamMingguan, jamBulanan, jamUlya, jamWustho, jamTD,
      chartDates, chartHadir, chartAbsen,
      chartHadirNames, chartAbsenNames,
      absenceMap, teachersNotFilledToday
    };
  }, [globalData, appliedFilters, todayFormatted, today, y, m]);

  const chartData = {
    labels: processed.chartDates,
    datasets: [
      {
        label: 'Hadir',
        data: processed.chartHadir,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: 'Tidak Hadir',
        data: processed.chartAbsen,
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const dateLabel = processed.chartDates[index];
        
        let title = '';
        let names: string[] = [];
        
        if (datasetIndex === 0) {
          title = `Guru Hadir (${dateLabel})`;
          names = processed.chartHadirNames[index];
        } else {
          title = `Guru Tidak Hadir (${dateLabel})`;
          names = processed.chartAbsenNames[index];
        }
        
        if (names.length === 0) {
          Swal.fire({
            icon: 'info',
            title,
            text: 'Tidak ada data guru untuk kategori ini.'
          });
        } else {
          Swal.fire({
            title,
            html: `<div class="max-h-60 overflow-y-auto text-left text-sm space-y-1 mt-2 p-2 border rounded bg-slate-50">` + 
                  names.map((n, i) => `<div><b>${i+1}.</b> ${n}</div>`).join('') + 
                  `</div>`,
            confirmButtonColor: '#10b981'
          });
        }
      }
    }
  };

  const downloadPDF = () => {
    Swal.fire({
      title: 'Menyiapkan PDF...',
      text: 'Mengonversi Laporan Evaluasi...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const element = document.getElementById('area-cetak-admin');
    if (!element) return;

    const opt = {
      margin: 0.3,
      filename: `Laporan_Evaluasi_Guru.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          const removeModernColors = (cssText: string): string => {
            if (!cssText) return '';
            let result = '';
            let i = 0;
            while (i < cssText.length) {
              if (cssText.startsWith('oklch(', i) || cssText.startsWith('oklab(', i) || cssText.startsWith('color-mix(', i)) {
                let depth = 0;
                let foundEnd = false;
                for (let j = i; j < cssText.length; j++) {
                  if (cssText[j] === '(') depth++;
                  if (cssText[j] === ')') {
                    depth--;
                    if (depth === 0) {
                      result += '#10b981'; // Fallback color
                      i = j + 1;
                      foundEnd = true;
                      break;
                    }
                  }
                }
                if (!foundEnd) {
                  result += cssText[i];
                  i++;
                }
              } else {
                result += cssText[i];
                i++;
              }
            }
            return result;
          };

          // 1. Extract all CSS rules from document stylesheets & style elements
          let combinedCssText = '';
          Array.from(document.styleSheets).forEach((sheet) => {
            try {
              const rules = sheet.cssRules || sheet.rules;
              if (rules) {
                Array.from(rules).forEach((rule) => {
                  combinedCssText += rule.cssText + '\n';
                });
              }
            } catch (e) {
              // Ignore cross-origin stylesheet access limits
            }
          });

          const origStyles = document.querySelectorAll('style');
          origStyles.forEach((s) => {
            if (s.textContent) {
              combinedCssText += s.textContent + '\n';
            }
          });

          // 2. Sanitize all modern CSS colors (oklch/oklab/color-mix) in the combined CSS
          const sanitizedCssText = removeModernColors(combinedCssText);

          // 3. Remove existing stylesheet tags in cloned document and insert single clean style tag
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach((s) => s.remove());

          const cleanStyleTag = clonedDoc.createElement('style');
          cleanStyleTag.textContent = sanitizedCssText;
          clonedDoc.head.appendChild(cleanStyleTag);

          // 4. Sanitize any inline style attributes
          const styledEls = clonedDoc.querySelectorAll('[style]');
          styledEls.forEach((el) => {
            const styleAttr = el.getAttribute('style');
            if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab') || styleAttr.includes('color-mix'))) {
              el.setAttribute('style', removeModernColors(styleAttr));
            }
          });

          // 5. Inline logo image to Data URL to avoid canvas CORS image loading bugs
          const origLogo = document.querySelector('#area-cetak-admin img') as HTMLImageElement;
          const clonedLogo = clonedDoc.querySelector('#area-cetak-admin img') as HTMLImageElement;
          if (origLogo && clonedLogo && origLogo.complete && origLogo.naturalWidth > 0) {
            try {
              const c = document.createElement('canvas');
              c.width = origLogo.naturalWidth;
              c.height = origLogo.naturalHeight;
              const ctx = c.getContext('2d');
              if (ctx) {
                ctx.drawImage(origLogo, 0, 0);
                clonedLogo.src = c.toDataURL('image/png');
              }
            } catch (e) {
              console.log('Logo image inlining skipped:', e);
            }
          }
        }
      },
      jsPDF: { unit: 'in' as const, format: 'a4', orientation: 'landscape' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      Swal.close();
    }).catch(() => {
      Swal.fire('Error', 'Gagal memproses PDF', 'error');
    });
  };

  const downloadExcel = () => {
    const absenceEntries = Object.entries(processed.absenceMap);
    if (absenceEntries.length === 0) {
      Swal.fire('Data Kosong', 'Tidak ada data ketidakhadiran untuk diekspor.', 'warning');
      return;
    }

    const wsData: any[][] = [
      ['Laporan Rekap Ketidakhadiran Guru'],
      [`Guru: ${appliedFilters.nama || 'Semua Guru'}`],
      [`Periode: ${appliedFilters.start} s/d ${appliedFilters.end}`],
      [],
      ['No', 'Nama Guru', 'Sakit (Hari)', 'Izin/DL (Hari)', 'Tanpa Keterangan (Hari)', 'Total Absen']
    ];

    (Object.entries(processed.absenceMap) as [string, { sakit: number; izin: number; alpa: number }][]).forEach(([nama, counts], idx) => {
      const totalAbsen = counts.sakit + counts.izin + counts.alpa;
      wsData.push([
        idx + 1,
        nama,
        counts.sakit,
        counts.izin,
        counts.alpa,
        `${totalAbsen} Hari`
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap_Absen");

    XLSX.writeFile(wb, `Laporan_Ketidakhadiran_Guru.xlsx`);
  };

  const pct = (val: number) => {
    return processed.totalToday > 0 ? Math.round((val / processed.totalToday) * 100) + '%' : '0%';
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-indigo-700 hover:text-indigo-900 mr-4 font-bold p-2 bg-white rounded-xl shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" /> Dashboard Evaluasi (Admin)
          </h2>
          <p className="text-xs text-slate-500">Monitoring Kehadiran & Kinerja Mengajar Seluruh Guru</p>
        </div>
        <button 
          onClick={() => {
            if (onRefresh && !isRefreshing) {
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
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-xs border border-indigo-200 ml-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
          <span className="hidden md:inline">{isRefreshing ? 'Memuat...' : 'Refresh Data'}</span>
        </button>
      </div>

      <EditRequestsAdminPanel />

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="bg-slate-200 h-24 rounded-2xl w-full"></div>
          <div className="bg-slate-200 h-64 rounded-2xl w-full"></div>
          <div className="bg-slate-200 h-64 rounded-2xl w-full"></div>
        </div>
      ) : (
        <>
          {/* Filter Controls */}
      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm mb-6 border border-slate-200">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filter Analisis
        </h3>
        <div className="flex flex-col md:flex-row gap-3">
          <select 
            value={selectedNama}
            onChange={(e) => setSelectedNama(e.target.value)}
            className="border border-slate-300 p-2.5 rounded-xl text-xs md:text-sm font-medium text-slate-800 flex-1 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          >
            <option value="">-- Semua Guru --</option>
            {TEACHER_LIST.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input 
            type="date"
            value={startStr}
            onChange={(e) => setStartStr(e.target.value)}
            className="border border-slate-300 p-2.5 rounded-xl text-xs text-slate-700 flex-1 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />

          <input 
            type="date"
            value={endStr}
            onChange={(e) => setEndStr(e.target.value)}
            className="border border-slate-300 p-2.5 rounded-xl text-xs text-slate-700 flex-1 outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />

          <button 
            onClick={handleApplyFilter}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Terapkan Filter
          </button>
        </div>
      </div>

      {/* Printable Report Box */}
      <div id="area-cetak-admin" className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-t-8 border-indigo-600 relative overflow-x-auto space-y-6 border border-slate-200">
        <div className="text-center border-b border-slate-200 pb-4">
          <img 
            src={OFFICIAL_LOGO_URL} 
            alt="Logo" referrerPolicy="no-referrer" 
            className="w-12 h-12 mx-auto mb-2 object-contain"
            
            
          />
          <h3 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">Laporan Evaluasi Mengajar</h3>
          <p className="text-xs md:text-sm font-bold text-indigo-700 mt-1">
            {appliedFilters.nama ? `Guru: ${appliedFilters.nama}` : 'Guru: Semua Guru'}
          </p>
          <p className="text-xs font-medium text-slate-600">
            {appliedFilters.start && appliedFilters.end 
              ? `Periode: ${formatTanggalIndo(appliedFilters.start)} s/d ${formatTanggalIndo(appliedFilters.end)}` 
              : 'Periode: Semua Waktu'}
          </p>
        </div>

        {/* 2 Top Metric Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Attendance Stats */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
            <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Kehadiran Hari Ini
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100">
                <p className="text-[10px] font-bold text-slate-500">HADIR</p>
                <p className="text-2xl font-extrabold text-emerald-600">{processed.tdHadir}</p>
                <p className="text-[10px] font-semibold text-slate-400">{pct(processed.tdHadir)}</p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
                <p className="text-[10px] font-bold text-slate-500">IZIN / DL</p>
                <p className="text-2xl font-extrabold text-blue-600">{processed.tdIzin}</p>
                <p className="text-[10px] font-semibold text-slate-400">{pct(processed.tdIzin)}</p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-sm border border-amber-100">
                <p className="text-[10px] font-bold text-slate-500">SAKIT</p>
                <p className="text-2xl font-extrabold text-amber-500">{processed.tdSakit}</p>
                <p className="text-[10px] font-semibold text-slate-400">{pct(processed.tdSakit)}</p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-sm border border-red-100">
                <p className="text-[10px] font-bold text-slate-500">ALPA / TK</p>
                <p className="text-2xl font-extrabold text-red-600">{processed.tdAlpa}</p>
                <p className="text-[10px] font-semibold text-slate-400">{pct(processed.tdAlpa)}</p>
              </div>
            </div>
          </div>

          {/* Realized Hours */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
            <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Total Realisasi Jam Mengajar (Sesuai Filter)
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center h-[calc(100%-2.5rem)]">
              <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col justify-center items-center border border-indigo-100">
                <p className="text-[10px] font-bold text-slate-500 mb-1">ULYA</p>
                <p className="text-2xl font-extrabold text-indigo-600">{processed.jamUlya} <span className="text-[10px] font-normal text-slate-500">Jam</span></p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col justify-center items-center border border-teal-100">
                <p className="text-[10px] font-bold text-slate-500 mb-1">WUSTHO</p>
                <p className="text-2xl font-extrabold text-teal-600">{processed.jamWustho} <span className="text-[10px] font-normal text-slate-500">Jam</span></p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-sm flex flex-col justify-center items-center border border-purple-100">
                <p className="text-[10px] font-bold text-slate-500 mb-1">PROGRAM TD</p>
                <p className="text-2xl font-extrabold text-purple-600">{processed.jamTD} <span className="text-[10px] font-normal text-slate-500">Jam</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart.js Bar Chart */}
        <div className="border border-slate-200 rounded-2xl p-4 md:p-5 bg-white shadow-sm">
          <h4 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2 text-xs uppercase tracking-wider">
            Grafik Kedisiplinan & Tren Kehadiran (7 Hari Terakhir)
          </h4>
          <div className="relative w-full h-64 md:h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Absence Table */}
        <div className="overflow-x-auto pb-4">
          <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2 text-xs uppercase tracking-wider">
            Rekap Ketidakhadiran Guru (Sesuai Filter)
          </h4>
          <table className="w-full text-xs text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-indigo-600 text-white uppercase text-[11px] tracking-wider">
                <th className="p-3 border border-indigo-700 text-center">No</th>
                <th className="p-3 border border-indigo-700">Nama Guru</th>
                <th className="p-3 border border-indigo-700 text-center">Sakit</th>
                <th className="p-3 border border-indigo-700 text-center">Izin / Dinas Luar</th>
                <th className="p-3 border border-indigo-700 text-center">Tanpa Keterangan</th>
                <th className="p-3 border border-indigo-700 text-center">Total Absen</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(processed.absenceMap).length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 italic text-slate-500 border p-3">
                    Alhamdulillah, tidak ada data ketidakhadiran pada periode ini.
                  </td>
                </tr>
              ) : (
                (Object.entries(processed.absenceMap) as [string, { sakit: number; izin: number; alpa: number; details: { tanggal: string; keterangan: string }[] }][]).map(([nama, counts], idx) => {
                  const totalAbsen = counts.sakit + counts.izin + counts.alpa;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-3 border border-slate-200 text-center font-bold">{idx + 1}</td>
                      <td className="p-3 border border-slate-200 font-bold text-slate-800">{nama}</td>
                      <td className="p-3 border border-slate-200 text-center font-semibold text-amber-600">{counts.sakit} Hari</td>
                      <td className="p-3 border border-slate-200 text-center font-semibold text-blue-600">{counts.izin} Hari</td>
                      <td className="p-3 border border-slate-200 text-center font-semibold text-red-600">{counts.alpa} Hari</td>
                      <td className="p-3 border border-slate-200 text-center font-extrabold text-slate-900">
                        <button 
                          onClick={() => {
                            if (counts.details.length === 0) return;
                            const detailsHtml = counts.details.map(d => 
                              `<div class="mb-2 p-2 bg-slate-50 border border-slate-200 rounded text-left">
                                <div class="text-xs font-bold text-slate-500">${d.tanggal}</div>
                                <div class="text-sm text-slate-800 mt-1">${d.keterangan || 'Tanpa Keterangan'}</div>
                              </div>`
                            ).join('');
                            Swal.fire({
                              title: `Detail Ketidakhadiran`,
                              html: `<div class="mb-4 text-sm font-bold text-emerald-700">${nama}</div>${detailsHtml}`,
                              confirmButtonColor: '#10b981',
                              confirmButtonText: 'Tutup'
                            });
                          }}
                          className="hover:text-emerald-600 hover:underline cursor-pointer active:scale-95 transition-all inline-block px-2 py-1 bg-slate-100 rounded-md border border-slate-200"
                          title="Klik untuk melihat detail"
                        >
                          {totalAbsen} Hari
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Not Filled Today Table */}
        <div className="mt-8">
          <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-200 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" /> Guru Belum Mengisi Presensi Hari Ini
          </h4>
          <div className="bg-rose-50 rounded-xl border border-rose-100 p-4">
            {processed.teachersNotFilledToday.length === 0 ? (
              <p className="text-sm font-semibold text-emerald-600 text-center py-4">Alhamdulillah, seluruh guru telah mengisi presensi hari ini.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {processed.teachersNotFilledToday.map((nama, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-rose-200 text-sm font-bold text-slate-800 shadow-sm flex items-center gap-3">
                     <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs">{idx + 1}</span>
                     {nama}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button 
          onClick={downloadPDF}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2 text-xs md:text-sm"
        >
          <FileDown className="w-5 h-5" /> Cetak Laporan (PDF)
        </button>

        <button 
          onClick={downloadExcel}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2 text-xs md:text-sm"
        >
          <FileSpreadsheet className="w-5 h-5" /> Cetak Data (Excel)
        </button>
      </div>
      </>
      )}
    </div>
  );
}
