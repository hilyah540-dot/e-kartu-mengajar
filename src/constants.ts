export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzdNjpmO9uK7phwvoU1dNSHnuGAeb-rKbq_tg3I8KM67Q_KHaTUGxlcJTEnssvJc6151w/exec';
// Import removed
export const OFFICIAL_LOGO_URL = '/logo.png';
export const USER_MAP: Record<string, string> = {
  "Mudir": "Hidayatullah",
  "kaprosw": "Satrio Wibowo",      
  "kaprosa": "Rahmat Dipuro",      
  "arw02": "Arif Wicaksono",
  "slt03": "Sulistiono",
  "fdl04": "Muhammad Fadll",
  "fdr05": "Muchammad Firdaus",
  "mhsa19": "Muhammad Hapsendra",
  "rtg07": "Ridho Tegar Pratama",
  "MJ7": "Tsabit Abu Najjah",
  "ang09": "Anggara Pratodi",
  "bgs10": "Bagus Kurniawan",
  "yvt11": "Yuviter Pradeska",
  "Aji12": "Aji Saputro",        
  "Cholis13": "M. Nurcholis Saputra",
  "Jef14": "Jefy Mahendra",
  "Tim15": "M. Timbun",
  "Rizki": "Rizki Saputra",
  "Vega": "Vega Ilyasa",
  "Robby": "Muhammad Robby Putra",
  "Fauzan": "Kgs. Muhammad Fauzan",
  "harbudi": "Harbudi",
  "Rizky": "Rizky juni",
  "Shayyiban": "Shayyiban Naafian",
  "habil": "Abdurrahman Rafiq",
  "admin": "Administrator" 
};
export const TEACHER_LIST: string[] = [
  "Hidayatullah",
  "Satrio Wibowo",
  "Rahmat Dipuro",
  "Arif Wicaksono",
  "Sulistiono",
  "Muhammad Fadll",
  "Muchammad Firdaus",
  "Muhammad Hapsendra",
  "Ridho Tegar Pratama",
  "Tsabit Abu Najjah",
  "Anggara Pratodi",
  "Bagus Kurniawan",
  "Yuviter Pradeska",
  "Aji Saputro",
  "M. Nurcholis Saputra",
  "Jefy Mahendra",
  "M. Timbun",
  "Rizki Saputra",
  "Vega Ilyasa",
  "Muhammad Robby Putra",
  "Kgs. Muhammad Fauzan",
  "Harbudi",
  "Rizky juni",
  "Shayyiban Naafian",
  "Abdurrahman Rafiq"
];
export const MONTH_NAMES_IND = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${MONTH_NAMES_IND[d.getMonth()]} ${d.getFullYear()}`;
}

export const HARI_IND = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const FULL_MONTH_NAMES_IND = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function formatTanggalLengkap(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const hari = HARI_IND[d.getDay()];
  const tanggal = d.getDate();
  const bulan = FULL_MONTH_NAMES_IND[d.getMonth()];
  return `${hari}, ${tanggal} ${bulan} ${d.getFullYear()}`;
}
