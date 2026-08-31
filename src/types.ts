export type ViewMode = 
  | 'splash' 
  | 'login' 
  | 'menu' 
  | 'form' 
  | 'dashboard' 
  | 'cek-data' 
  | 'admin-dashboard'
  | 'pusat-informasi'
  | 'arsip'
  | 'perangkat';

export type UserRole = 'superadmin' | 'admin' | 'user';

export interface User {
  username: string;
  role: UserRole;
  teacherName: string;
}

export interface TeachingRow {
  kat: string;
  jml: number;
}

export interface RecordRow {
  Nama_Guru: string;
  Tanggal: string;
  Presensi: string;
  Keterangan?: string;
  Jenjang?: string;
  Jam_Masuk?: string;
  Jam_Keluar?: string;
  Mengajar_Ulya?: number;
  Mengajar_Wustho?: number;
  Mengajar_Tadribud?: number;
  Pengganti_Ulya?: number;
  Pengganti_Wustho?: number;
  Pengganti_Tadribud?: number;
  Keterangan_Pengganti?: string;
  Deskripsi_Lembur?: string;
  Jam_Lembur?: number;
  Jenis_Eskul?: string;
  Jml_Pertemuan_Eskul?: number;
  Is_SPMB?: boolean;
  Lain_Lain?: boolean | string;
}

export interface SubmitPayload {
  nama_guru: string;
  tanggal: string;
  jenjang: string;
  presensi: string;
  keterangan: string;
  jam_masuk: string;
  jam_keluar: string;
  deskripsi_lembur: string;
  jam_lembur: number;
  jenis_eskul: string;
  jml_pertemuan_eskul: number;
  is_spmb: boolean;
  is_lain: boolean;
  m_ulya: number;
  m_wustho: number;
  m_td: number;
  p_ulya: number;
  p_wustho: number;
  p_td: number;
  keterangan_pengganti: string;
}
