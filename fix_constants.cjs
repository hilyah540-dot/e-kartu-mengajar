const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');
const newTeacherList = `export const TEACHER_LIST: string[] = [
  "Hidayatullah",
  "Satrio Wibowo",
  "Rahmat Dipuro",
  "Roni Nuryusmansyah",
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
];`;

code = code.replace(/export const TEACHER_LIST: string\[\] = \[[\s\S]*?\];/, newTeacherList);
fs.writeFileSync('src/constants.ts', code);
