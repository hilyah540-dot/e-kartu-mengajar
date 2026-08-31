import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { TEACHER_LIST, GAS_URL } from '../constants';
import { RecordRow, TeachingRow, User } from '../types';
import { ArrowLeft, Send, Plus, Trash2, BookOpen, Repeat, Star, CheckSquare } from 'lucide-react';

interface FormViewProps {
  user: User;
  globalData: RecordRow[];
  onDataAdded: (newRow: RecordRow) => void;
  onBack: () => void;
  onSuccessNavigateDashboard: () => void;
  isLoading?: boolean;
}

const getDefaultsForTeacher = (name: string) => {
  const defaults: Record<string, { jenjang: string, mengajarKat: string }> = {
    'Hidayatullah': { jenjang: "Tadribud Du'at", mengajarKat: 'Tadribud' },
    'Rahmat Dipuro': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Arif Wicaksono': { jenjang: "Tadribud Du'at", mengajarKat: 'Tadribud' },
    'Sulistiono': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Muhammad Fadll': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Muchammad Firdaus': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Satrio Wibowo': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Aji Saputro': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'M. Nurcholis Saputra': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Muhammad Hapsendra': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Ridho Tegar Pratama': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Tsabit Abu Najjah': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Anggara Pratodi': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Bagus Kurniawan': { jenjang: 'Wustho', mengajarKat: 'Ulya' },
    'Yuviter Pradeska': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Jefy Mahendra': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'M. Timbun': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Rizki Saputra': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Vega Ilyasa': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Muhammad Robby Putra': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Kgs. Muhammad Fauzan': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Harbudi': { jenjang: 'Wustho', mengajarKat: 'Wustho' },
    'Rizky juni': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Shayyiban Naafian': { jenjang: 'Ulya', mengajarKat: 'Ulya' },
    'Abdurrahman Rafiq': { jenjang: 'Wustho', mengajarKat: 'Wustho' }
  };
  
  return defaults[name] || { jenjang: '', mengajarKat: 'Ulya' };
};

export function FormView({ user, globalData, onDataAdded, onBack, onSuccessNavigateDashboard, isLoading }: FormViewProps) {
  const initialDefaults = getDefaultsForTeacher(user.teacherName || '');
  const [namaGuru, setNamaGuru] = useState(user.teacherName || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [jenjang, setJenjang] = useState(initialDefaults.jenjang);
  const [presensi, setPresensi] = useState<'Hadir' | 'Tidak Hadir'>('Hadir');
  const [keterangan, setKeterangan] = useState('-');
  const [keteranganDinas, setKeteranganDinas] = useState('');
  const [keteranganPengganti, setKeteranganPengganti] = useState('');

  const [jamMasuk, setJamMasuk] = useState('07:00');
  const [jamKeluar, setJamKeluar] = useState('13:00');

  // Rows for teaching & replacement
  const [mengajarRows, setMengajarRows] = useState<TeachingRow[]>([{ kat: initialDefaults.mengajarKat, jml: 0 }]);
  const [penggantiRows, setPenggantiRows] = useState<TeachingRow[]>([]);

  // Extra activities
  const [statusKegiatan, setStatusKegiatan] = useState<'tidak ada' | 'ada'>('tidak ada');
  const [isLembur, setIsLembur] = useState(false);
  const [isEskul, setIsEskul] = useState(false);
  const [isLain, setIsLain] = useState(false);

  const isSpecialUser = user.username === 'yvt11' || user.username === 'bgs10';

  const [deskripsiLembur, setDeskripsiLembur] = useState('');
  const [jamLembur, setJamLembur] = useState<number | ''>('');
  const [jenisEskul, setJenisEskul] = useState('');
  const [jmlPertemuanEskul, setJmlPertemuanEskul] = useState<number | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check teacher selection permission
  const handleTeacherChange = (val: string) => {
    if (val && val !== user.teacherName && user.role === 'user') {
      Swal.fire({
        icon: 'warning',
        title: 'Perhatian',
        text: 'Afwan, sepertinya pilihan antum salah',
        confirmButtonColor: '#10b981'
      });
      setNamaGuru(user.teacherName);
    } else {
      setNamaGuru(val);
      const newDefaults = getDefaultsForTeacher(val);
      setJenjang(newDefaults.jenjang);
      // Reset mengajarRows to match the default category for the newly selected teacher
      setMengajarRows([{ kat: newDefaults.mengajarKat, jml: 0 }]);
    }
  };

  const checkMaxHours = (val: number, callback: (v: number) => void) => {
    if (val > 20) {
      Swal.fire({
        icon: 'error',
        title: 'Perhatian',
        text: 'Afwan, gagal entri data (maksimal 20 jam)',
        confirmButtonColor: '#10b981'
      });
      callback(0);
    } else {
      callback(val);
    }
  };

  const handleAddRow = (type: 'mengajar' | 'pengganti') => {
    if (type === 'mengajar') {
      setMengajarRows([...mengajarRows, { kat: 'Ulya', jml: 0 }]);
    } else {
      setPenggantiRows([...penggantiRows, { kat: '', jml: 0 }]);
    }
  };

  const handleRemoveRow = (type: 'mengajar' | 'pengganti', idx: number) => {
    if (type === 'mengajar') {
      setMengajarRows(mengajarRows.filter((_, i) => i !== idx));
    } else {
      setPenggantiRows(penggantiRows.filter((_, i) => i !== idx));
    }
  };

  // Visibility logic for detailed attendance section
  const isDetailHidden = presensi === 'Tidak Hadir' && ['Sakit', 'Izin', 'Tanpa Keterangan'].includes(keterangan);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check duplicate entry for the same date
    const alreadyExists = globalData.some(row => {
      if (row.Nama_Guru === namaGuru && row.Tanggal) {
        const d = new Date(row.Tanggal);
        const rDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return rDate === tanggal || row.Tanggal.substring(0, 10) === tanggal;
      }
      return false;
    });

    if (alreadyExists) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Sudah Diisi',
        text: 'Data sudah diisi pada tanggal tersebut, silahkan hubungi admin untuk perubahan data.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    
    const hasPengganti = penggantiRows.some(row => row.kat && row.jml > 0);
    if (hasPengganti && !keteranganPengganti.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Keterangan Wajib Diisi',
        text: 'Anda telah mengisi Jam Pengganti, silakan isi Form Keterangan (Menggantikan siapa).',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Kirim Data?',
      text: 'Apakah Anda yakin data yang diisi sudah benar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Kirim!',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    setIsSubmitting(true);

    let ketValue = keterangan;
    if (keterangan === 'Dinas Luar') {
      ketValue = keteranganDinas ? `Dinas Luar - ${keteranganDinas}` : 'Dinas Luar';
    }

    let m_ulya = 0, m_wustho = 0, m_td = 0;
    let p_ulya = 0, p_wustho = 0, p_td = 0;

    if (!isDetailHidden) {
      mengajarRows.forEach(r => {
        if (r.kat === 'Ulya') m_ulya += Number(r.jml) || 0;
        if (r.kat === 'Wustho') m_wustho += Number(r.jml) || 0;
        if (r.kat === 'Tadribud') m_td += Number(r.jml) || 0;
      });

      penggantiRows.forEach(r => {
        if (r.kat === 'Ulya') p_ulya += Number(r.jml) || 0;
        if (r.kat === 'Wustho') p_wustho += Number(r.jml) || 0;
        if (r.kat === 'Tadribud') p_td += Number(r.jml) || 0;
      });
    }

    let d_lembur = '-', j_lembur = 0, j_eskul = '-', p_eskul = 0;
    if (statusKegiatan === 'ada') {
      if (isLembur) {
        d_lembur = deskripsiLembur || '-';
        j_lembur = Number(jamLembur) || 0;
      }
      if (isEskul) {
        j_eskul = jenisEskul || '-';
        p_eskul = Number(jmlPertemuanEskul) || 0;
      }
    }

    const payload = {
      nama_guru: namaGuru,
      tanggal,
      jenjang,
      presensi,
      keterangan: ketValue || '-',
      jam_masuk: !isDetailHidden ? (jamMasuk || '-') : '-',
      jam_keluar: !isDetailHidden ? (jamKeluar || '-') : '-',
      deskripsi_lembur: d_lembur,
      jam_lembur: j_lembur,
      jenis_eskul: j_eskul,
      jml_pertemuan_eskul: p_eskul,
      is_spmb: false,
      is_lain: isLain,
      m_ulya,
      m_wustho,
      m_td,
      p_ulya,
      p_wustho,
      p_td,
      keterangan_pengganti: hasPengganti ? (keteranganPengganti.trim() || '-') : '-'
    };

    const newRecord: RecordRow = {
      Nama_Guru: namaGuru,
      Tanggal: tanggal,
      Presensi: presensi,
      Keterangan: ketValue,
      Mengajar_Ulya: m_ulya,
      Mengajar_Wustho: m_wustho,
      Mengajar_Tadribud: m_td,
      Pengganti_Ulya: p_ulya,
      Pengganti_Wustho: p_wustho,
      Pengganti_Tadribud: p_td,
      Keterangan_Pengganti: keteranganPengganti.trim() || '-',
      Deskripsi_Lembur: d_lembur,
      Jam_Lembur: j_lembur,
      Jenis_Eskul: j_eskul,
      Jml_Pertemuan_Eskul: p_eskul,
      Lain_Lain: isLain
    };

    onDataAdded(newRecord);

    try {
      await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.log('GAS endpoint request sent');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      Swal.fire({
        icon: 'success',
        title: 'Data Berhasil Disimpan!',
        html: `
          <div style="text-align: left; font-size: 14px; line-height: 1.6; margin-top: 10px;">
            <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 12px;">
              <span style="font-size: 20px;">📊</span>
              <div>
                <strong style="color: #0f172a;">Cek Rincian Data</strong><br/>
                <span style="color: #475569;">Untuk memastikan data anda benar silahkan cek pada Ringkasan Statistik (klik untuk melihat rincian data anda)</span>
              </div>
            </div>
            <div style="display: flex; align-items: start; gap: 8px; margin-bottom: 20px;">
              <span style="font-size: 20px;">✏️</span>
              <div>
                <strong style="color: #0f172a;">Edit Data</strong><br/>
                <span style="color: #475569;">Untuk melakukan perbaikan data silahkan klik tombol cek & edit data</span>
              </div>
            </div>
            <div style="text-align: center; font-weight: bold; color: #10b981; font-size: 15px;">
              Baarakallahu fiikum
            </div>
          </div>
        `,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Tutup'
      });

      onSuccessNavigateDashboard();
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-emerald-700 hover:text-emerald-900 mr-4 font-bold p-2 bg-white rounded-xl shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 border-b-2 border-amber-400 pb-1">
          {isSpecialUser ? 'Formulir Kartu Kehadiran' : 'Formulir Kartu Mengajar'}
        </h2>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6 bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          <div className="bg-slate-200 h-10 w-full rounded-xl"></div>
          <div className="bg-slate-200 h-10 w-full rounded-xl"></div>
          <div className="bg-slate-200 h-24 w-full rounded-xl"></div>
          <div className="bg-slate-200 h-10 w-32 rounded-xl"></div>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-5 md:p-6 space-y-5 border border-slate-100">
        {/* Nama Guru */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {isSpecialUser ? 'Nama Tata Usaha' : 'Nama Guru'}
          </label>
          <select 
            value={namaGuru}
            onChange={(e) => handleTeacherChange(e.target.value)}
            required
            className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold text-sm transition-all"
          >
            <option value="">{isSpecialUser ? '-- Pilih Nama Tata Usaha --' : '-- Pilih Nama Guru --'}</option>
            {TEACHER_LIST.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Date & Jenjang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hari / Tanggal
            </label>
            <input 
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenjang Utama
            </label>
            <select 
              value={jenjang}
              onChange={(e) => setJenjang(e.target.value)}
              required
              className="w-full border border-slate-300 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-sm font-medium"
            >
              <option value="">-- Pilih Jenjang --</option>
              <option value="Ulya">Ulya</option>
              <option value="Wustho">Wustho</option>
              <option value="Tadribud Du'at">Tadribud Du'at</option>
            </select>
          </div>
        </div>

        {/* Presensi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Presensi
          </label>
          <div className="flex gap-6 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-emerald-800">
              <input 
                type="radio" 
                name="presensi" 
                value="Hadir" 
                checked={presensi === 'Hadir'} 
                onChange={() => { setPresensi('Hadir'); setKeterangan('-'); }}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Hadir</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-red-700">
              <input 
                type="radio" 
                name="presensi" 
                value="Tidak Hadir" 
                checked={presensi === 'Tidak Hadir'} 
                onChange={() => setPresensi('Tidak Hadir')}
                className="w-4 h-4 text-red-600 focus:ring-red-500"
              />
              <span>Tidak Hadir</span>
            </label>
          </div>
        </div>

        {/* Keterangan Tidak Hadir */}
        {presensi === 'Tidak Hadir' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
            <label className="block text-xs font-bold text-red-800 uppercase tracking-wider">
              Keterangan Tidak Hadir
            </label>
            <select 
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              required
              className="w-full border border-red-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-red-500 outline-none text-slate-800 text-sm font-medium"
            >
              <option value="-">-- Pilih Keterangan --</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
              <option value="Dinas Luar">Dinas Luar</option>
              <option value="Tanpa Keterangan">Tanpa Keterangan</option>
            </select>

            {keterangan === 'Dinas Luar' && (
              <input 
                type="text"
                value={keteranganDinas}
                onChange={(e) => setKeteranganDinas(e.target.value)}
                placeholder="Misal: Dinas Luar ke Kanwil Kemenag Sumsel"
                className="w-full border border-red-300 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-red-500 outline-none text-slate-800 text-sm"
              />
            )}
          </div>
        )}

        {/* Section Detail Jam (Hidden if Sakit/Izin/Tanpa Keterangan) */}
        {!isDetailHidden && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jam Masuk
                </label>
                <input 
                  type="time" 
                  value={jamMasuk}
                  onChange={(e) => setJamMasuk(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jam Keluar
                </label>
                <input 
                  type="time" 
                  value={jamKeluar}
                  onChange={(e) => setJamKeluar(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-xl bg-slate-50 focus:bg-white text-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Jam Mengajar */}
            {!isSpecialUser && (
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Detail Jam Mengajar
              </h3>

              {mengajarRows.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select 
                    value={row.kat}
                    onChange={(e) => {
                      const updated = [...mengajarRows];
                      updated[idx].kat = e.target.value;
                      setMengajarRows(updated);
                    }}
                    className="w-2/3 border border-slate-300 p-2 rounded-lg bg-white text-xs md:text-sm font-medium"
                  >
                    <option value="Ulya">Ulya</option>
                    <option value="Wustho">Wustho</option>
                    <option value="Tadribud">Tadribud Du'at</option>
                  </select>

                  <input 
                    type="number"
                    min="0"
                    placeholder="Jml Jam"
                    value={row.jml || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      checkMaxHours(val, (checkedVal) => {
                        const updated = [...mengajarRows];
                        updated[idx].jml = checkedVal;
                        setMengajarRows(updated);
                      });
                    }}
                    className="w-1/3 border border-slate-300 p-2 rounded-lg bg-white text-xs md:text-sm"
                  />

                  {mengajarRows.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveRow('mengajar', idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button 
                type="button" 
                onClick={() => handleAddRow('mengajar')}
                className="text-xs text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Jam Mengajar
              </button>
            </div>
            )}

            {/* Jam Pengganti */}
            {!isSpecialUser && (
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
              <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                <Repeat className="w-4 h-4 text-amber-600" /> Jam Pengganti (Opsional)
              </h3>

              {penggantiRows.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select 
                    value={row.kat}
                    onChange={(e) => {
                      const updated = [...penggantiRows];
                      updated[idx].kat = e.target.value;
                      setPenggantiRows(updated);
                    }}
                    className="w-2/3 border border-slate-300 p-2 rounded-lg bg-white text-xs md:text-sm font-medium"
                  >
                    <option value="">-- Pilih Jenjang --</option>
                    <option value="Ulya">Ulya</option>
                    <option value="Wustho">Wustho</option>
                    <option value="Tadribud">Tadribud Du'at</option>
                  </select>

                  <input 
                    type="number"
                    min="0"
                    placeholder="Jml Jam"
                    value={row.jml || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      checkMaxHours(val, (checkedVal) => {
                        const updated = [...penggantiRows];
                        updated[idx].jml = checkedVal;
                        setPenggantiRows(updated);
                      });
                    }}
                    className="w-1/3 border border-slate-300 p-2 rounded-lg bg-white text-xs md:text-sm"
                  />

                  {penggantiRows.length > 0 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveRow('pengganti', idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

                          {/* Keterangan Pengganti */}
            {penggantiRows.length > 0 && (
            <div className="pt-2">
               <input
                 type="text"
                 placeholder="Contoh pengisian: Menggantikan Ustadz fulan"
                 value={keteranganPengganti}
                 onChange={(e) => {
                   let val = e.target.value;
                   val = val.replace(/[0-9]/g, '');
                   if (val.length > 35) {
                     Swal.fire({
                       icon: 'warning',
                       title: 'Karakter terlalu panjang',
                       text: 'Maksimal 35 huruf',
                       confirmButtonColor: '#f59e0b',
                       timer: 2000
                     });
                     return;
                   }
                   setKeteranganPengganti(val);
                 }}
                 className="w-full border border-amber-300 p-2.5 rounded-xl bg-white text-xs font-medium placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
               />
               <p className="text-[10px] text-amber-700 mt-1 font-semibold">* Keterangan pengganti wajib diisi jika ada Jam Pengganti</p>
            </div>

            )}
                          <button 
                type="button" 
                onClick={() => handleAddRow('pengganti')}
                className="text-xs text-amber-700 font-bold hover:text-amber-900 flex items-center gap-1 pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Jam Pengganti
              </button>
            </div>
            )}
          </div>
        )}

        {/* Kegiatan Tambahan */}
        <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-3">
          <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-600" /> Kegiatan Tambahan
          </h3>

          <select 
            value={statusKegiatan}
            onChange={(e) => {
              const val = e.target.value as 'tidak ada' | 'ada';
              setStatusKegiatan(val);
              if (val === 'tidak ada') {
                setIsLembur(false);
                setIsEskul(false);
                setIsLain(false);
              }
            }}
            className="w-full border border-slate-300 p-2.5 rounded-xl bg-white text-sm font-medium"
          >
            <option value="tidak ada">tidak ada</option>
            <option value="ada">ada</option>
          </select>

          {statusKegiatan === 'ada' && (
            <div className="p-3 bg-white border border-indigo-200 rounded-xl space-y-3 animate-fade-in">
              <p className="text-xs font-semibold text-slate-600">Pilih kegiatan (Bisa lebih dari satu):</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isLembur} 
                    onChange={(e) => setIsLembur(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Lembur</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isEskul} 
                    onChange={(e) => setIsEskul(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Eskul</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isLain} 
                    onChange={(e) => setIsLain(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Lain-Lain</span>
                </label>
              </div>

              {/* Lembur Details */}
              {isLembur && (
                <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-900 border-b border-indigo-200 pb-1">Detail Lembur</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Keterangan (Hanya Huruf)</label>
                    <input 
                      type="text" 
                      value={deskripsiLembur}
                      onChange={(e) => setDeskripsiLembur(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                      placeholder="Masukkan keterangan lembur..."
                      className="w-full border border-slate-300 p-2 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Jumlah Jam</label>
                    <input 
                      type="number" 
                      min="1"
                      value={jamLembur}
                      onChange={(e) => setJamLembur(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full border border-slate-300 p-2 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Eskul Details */}
              {isEskul && (
                <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-900 border-b border-indigo-200 pb-1">Detail Eskul</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Nama Eskul</label>
                    <select 
                      value={jenisEskul}
                      onChange={(e) => setJenisEskul(e.target.value)}
                      className="w-full border border-slate-300 p-2 rounded-lg text-xs bg-white"
                    >
                      <option value="">-- Pilih Eskul --</option>
                      <option value="Memanah">Memanah</option>
                      <option value="LDK">LDK</option>
                      <option value="Boxing">Boxing</option>
                      <option value="Muay thai">Muay thai</option>
                      <option value="Basket">Basket</option>
                      <option value="Multimedia">Multimedia</option>
                      <option value="Wirausaha">Wirausaha</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Jumlah Pertemuan</label>
                    <input 
                      type="number" 
                      min="1"
                      value={jmlPertemuanEskul}
                      onChange={(e) => setJmlPertemuanEskul(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full border border-slate-300 p-2 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold p-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 text-base disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sedang Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim Data</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 bg-white font-bold p-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center text-sm"
          >
            Kembali ke Menu Utama
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
