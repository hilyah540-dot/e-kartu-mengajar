import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, FileText, Users, Clock, ChevronDown, ChevronRight, 
  BookOpen, Download, Moon, Shield, Book, GraduationCap, BarChart2, Star, CheckCircle, FileCheck, PieChart,
  ZoomIn, ZoomOut, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MediaModal } from './MediaModal';

interface PusatInformasiViewProps {
  onBack: () => void;
}

const DataBlock = ({ title, data, total }: { title: string, data: {label: string, value: string | number}[], total: number | string }) => (
  <div className="mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm mx-4">
    <div className="font-bold text-sm text-slate-800 mb-2 border-b border-slate-100 pb-1.5">{title}</div>
    <ul className="text-xs text-slate-600 space-y-1.5 mb-3">
      {data.map((item, i) => (
        <li key={i} className="flex justify-between">
          <span>{item.label}</span>
          <span className="font-semibold text-slate-800">{item.value}</span>
        </li>
      ))}
    </ul>
    <div className="flex justify-between items-center text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
      <span>Total Akhir</span>
      <span>{total}</span>
    </div>
  </div>
);

const ChartBlock = ({ data, title }: { data: any[], title: string }) => (
  <div className="mb-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm mx-4">
    <div className="font-bold text-sm text-slate-800 mb-4 border-b border-slate-100 pb-1.5">{title}</div>
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey="jumlah" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const dataSA = [
  { name: '24/25', jumlah: 49 },
  { name: '25/26', jumlah: 59 },
  { name: '26/27', jumlah: 61 },
];

const dataSW = [
  { name: '24/25', jumlah: 84 },
  { name: '25/26', jumlah: 114 },
  { name: '26/27', jumlah: 139 },
];

const dataTD = [
  { name: '24/25', jumlah: 23 },
  { name: '25/26', jumlah: 21 },
  { name: '26/27', jumlah: 25 },
];

export function PusatInformasiView({ onBack }: PusatInformasiViewProps) {
  const [openJadwal, setOpenJadwal] = useState(false);
  const [openJadwalApel, setOpenJadwalApel] = useState(false);
  const [openJadwalPelajaran, setOpenJadwalPelajaran] = useState(false);
  
  const [activeMediaModal, setActiveMediaModal] = useState<{title: string, src: string, icon: React.ReactNode, type: 'image' | 'pdf'} | null>(null);

  const [openDataSantri, setOpenDataSantri] = useState(false);
  const [openSantriSA, setOpenSantriSA] = useState(false);
  const [openSantriSARekap, setOpenSantriSARekap] = useState(false);
  const [openSantriSAGrafik, setOpenSantriSAGrafik] = useState(false);
  
  const [openSantriSW, setOpenSantriSW] = useState(false);
  const [openSantriSWRekap, setOpenSantriSWRekap] = useState(false);
  const [openSantriSWGrafik, setOpenSantriSWGrafik] = useState(false);
  
  const [openSantriTD, setOpenSantriTD] = useState(false);
  const [openSantriTDRekap, setOpenSantriTDRekap] = useState(false);
  const [openSantriTDGrafik, setOpenSantriTDGrafik] = useState(false);

  const [openDataGuru, setOpenDataGuru] = useState(false);
  const [openAgenda, setOpenAgenda] = useState(false);

  const handleDevAlert = (featureName: string) => {
    Swal.fire({
      icon: 'info',
      title: 'Informasi',
      text: `${featureName} belum tersedia untuk saat ini.`,
      confirmButtonColor: '#10b981'
    });
  };

  const handleOpenMedia = (title: string, src: string, icon: React.ReactNode, type: 'image' | 'pdf' = 'image') => {
    setActiveMediaModal({ title, src, icon, type });
  };

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto pb-12 animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-emerald-700 hover:text-emerald-900 mr-4 font-bold p-2 bg-white rounded-xl shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 border-b-2 border-emerald-500 pb-1">
          Pusat Informasi
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* 1. Jadwal */}
        <div className="border-b border-slate-100">
          <button 
            onClick={() => setOpenJadwal(!openJadwal)}
            className="w-full text-left px-4 py-4 hover:bg-slate-50 font-bold flex justify-between items-center transition-colors text-slate-700"
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-sky-500" /> Jadwal
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openJadwal ? 'rotate-180' : ''}`} />
          </button>
          
          {openJadwal && (
            <div className="bg-slate-50 flex flex-col w-full pb-2">
              <button 
                onClick={() => handleOpenMedia('Jadwal Piket Malam', '/jadwal_piket.jpg', <Moon className="w-5 h-5 mr-2 text-indigo-500" />)}
                className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center"
              >
                <Moon className="w-4 h-4 mr-3 text-indigo-400" /> Jadwal Piket
              </button>
              
              {/* Jadwal Apel */}
              <div>
                <button 
                  onClick={() => setOpenJadwalApel(!openJadwalApel)}
                  className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-3 text-emerald-500" /> Jadwal Apel
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openJadwalApel ? 'rotate-90' : ''}`} />
                </button>
                {openJadwalApel && (
                  <div className="bg-slate-100 flex flex-col w-full border-b border-slate-200/50">
                    <button onClick={() => handleOpenMedia('Jadwal Apel - Guru SA', '/jadwal_apel_sa.jpeg', <Shield className="w-5 h-5 mr-2 text-emerald-500" />)} className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-600 border-b border-slate-200/50 font-medium flex items-center">
                       <GraduationCap className="w-3.5 h-3.5 mr-2 text-slate-400" /> Guru SA
                    </button>
                    <button onClick={() => handleOpenMedia('Jadwal Apel - Guru SW', '/jadwal_apel_sw-1.jpg', <Shield className="w-5 h-5 mr-2 text-emerald-500" />)} className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-600 font-medium flex items-center">
                       <GraduationCap className="w-3.5 h-3.5 mr-2 text-slate-400" /> Guru SW
                    </button>
                  </div>
                )}
              </div>

              {/* Jadwal Pelajaran */}
              <div>
                <button 
                  onClick={() => setOpenJadwalPelajaran(!openJadwalPelajaran)}
                  className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Book className="w-4 h-4 mr-3 text-amber-500" /> Jadwal Pelajaran
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openJadwalPelajaran ? 'rotate-90' : ''}`} />
                </button>
                {openJadwalPelajaran && (
                  <div className="bg-slate-100 flex flex-col w-full border-b border-slate-200/50">
                    <button onClick={() => handleOpenMedia('Jadwal Pelajaran - Guru SA', '/jadwal_pelajaran_sa.pdf', <Book className="w-5 h-5 mr-2 text-amber-500" />, 'pdf')} className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-600 border-b border-slate-200/50 font-medium flex items-center">
                      <GraduationCap className="w-3.5 h-3.5 mr-2 text-slate-400" /> Guru SA
                    </button>
                    <button onClick={() => handleOpenMedia('Jadwal Pelajaran - Guru SW', '/jadwal_pelajaran_sw.pdf', <Book className="w-5 h-5 mr-2 text-amber-500" />, 'pdf')} className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-600 font-medium flex items-center">
                      <GraduationCap className="w-3.5 h-3.5 mr-2 text-slate-400" /> Guru SW
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Kalender Akademik */}
        <div className="border-b border-slate-100">
          <button 
            onClick={() => handleOpenMedia('Kalender Akademik', '/kalender_akademik.jpeg', <Calendar className="w-5 h-5 mr-2 text-emerald-500" />)}
            className="w-full text-left px-4 py-4 hover:bg-slate-50 font-bold flex justify-between items-center transition-colors text-slate-700"
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-emerald-500" /> Kalender Akademik
            </div>
          </button>
        </div>

        {/* 3. Data Santri */}
        <div className="border-b border-slate-100">
          <button 
            onClick={() => setOpenDataSantri(!openDataSantri)}
            className="w-full text-left px-4 py-4 hover:bg-slate-50 font-bold flex justify-between items-center transition-colors text-slate-700"
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3 text-amber-500" /> Data Santri
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDataSantri ? 'rotate-180' : ''}`} />
          </button>
          
          {openDataSantri && (
            <div className="bg-slate-50 flex flex-col w-full pb-2">
              <a 
                href="https://drive.google.com/drive/folders/15HSb6WPVaPr-taPSr9F5LSV2SsTyBBsc?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-emerald-700 border-b border-slate-200/50 text-sm font-semibold flex items-center"
              >
                <Download className="w-4 h-4 mr-3 text-emerald-600" /> Download Data Santri
              </a>

              {/* Data Santri SA */}
              <div>
                <button 
                  onClick={() => setOpenSantriSA(!openSantriSA)}
                  className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-sky-500" /> Data santri SA
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriSA ? 'rotate-90' : ''}`} />
                </button>
                {openSantriSA && (
                  <div className="bg-slate-100 flex flex-col w-full border-b border-slate-200/50">
                    <button 
                      onClick={() => setOpenSantriSARekap(!openSantriSARekap)}
                      className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-700 border-b border-slate-200/50 font-bold flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <BarChart2 className="w-3.5 h-3.5 mr-2 text-slate-500" /> Rekap Data Santri
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriSARekap ? 'rotate-180' : ''}`} />
                    </button>
                    {openSantriSARekap && (
                      <div className="pt-3 pb-2 bg-slate-50/50 border-b border-slate-200/50">
                        <div className="px-5 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Santri Tiga Tahun Terakhir:</div>
                        <DataBlock 
                          title="Tahun Ajaran 2024/2025" 
                          data={[{label: "Kelas X", value: 27}, {label: "Kelas XI", value: 22}]} 
                          total={49} 
                        />
                        <DataBlock 
                          title="Tahun Ajaran 2025/2026" 
                          data={[{label: "Kelas X", value: 18}, {label: "Kelas XI", value: 22}, {label: "Kelas XII", value: 18}]} 
                          total={59} 
                        />
                        <DataBlock 
                          title="Tahun Ajaran 2026/2027" 
                          data={[{label: "Kelas X", value: 26}, {label: "Kelas XI", value: 12}, {label: "Kelas XII", value: 23}]} 
                          total={61} 
                        />
                      </div>
                    )}
                    <button 
                      onClick={() => setOpenSantriSAGrafik(!openSantriSAGrafik)}
                      className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-700 border-b border-slate-200/50 font-bold flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <PieChart className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Grafik Data Santri
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriSAGrafik ? 'rotate-180' : ''}`} />
                    </button>
                    {openSantriSAGrafik && (
                      <div className="pt-3 pb-2 bg-slate-50/50 border-b border-slate-200/50">
                        <ChartBlock data={dataSA} title="Grafik Jumlah Santri Tiga Tahun Terakhir" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Data Santri SW */}
              <div>
                <button 
                  onClick={() => setOpenSantriSW(!openSantriSW)}
                  className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-emerald-500" /> Data santri SW
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriSW ? 'rotate-90' : ''}`} />
                </button>
                {openSantriSW && (
                  <div className="bg-slate-100 flex flex-col w-full border-b border-slate-200/50">
                    <button 
                      onClick={() => setOpenSantriSWRekap(!openSantriSWRekap)}
                      className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-700 border-b border-slate-200/50 font-bold flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <BarChart2 className="w-3.5 h-3.5 mr-2 text-slate-500" /> Rekap Data Santri
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriSWRekap ? 'rotate-180' : ''}`} />
                    </button>
                    {openSantriSWRekap && (
                      <div className="pt-3 pb-2 bg-slate-50/50 border-b border-slate-200/50">
                        <div className="px-5 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Santri Tiga Tahun Terakhir:</div>
                        <DataBlock 
                          title="1. Tahun Ajaran 2024/2025" 
                          data={[{label: "Kelas VII", value: 31}, {label: "Kelas VIII", value: 31}, {label: "Kelas IX", value: 22}]} 
                          total={84} 
                        />
                        <DataBlock 
                          title="2. Tahun Ajaran 2025/2026" 
                          data={[{label: "Kelas VII", value: 56}, {label: "Kelas VIII", value: 29}, {label: "Kelas IX", value: 29}]} 
                          total={114} 
                        />
                        <DataBlock 
                          title="3. Tahun Ajaran 2026/2027" 
                          data={[{label: "Kelas VII", value: 56}, {label: "Kelas VIII", value: 54}, {label: "Kelas IX", value: 29}]} 
                          total={139} 
                        />
                      </div>
                    )}
                    <button 
                      onClick={() => setOpenSantriSWGrafik(!openSantriSWGrafik)}
                      className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-700 border-b border-slate-200/50 font-bold flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <PieChart className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Grafik Data Santri
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriSWGrafik ? 'rotate-180' : ''}`} />
                    </button>
                    {openSantriSWGrafik && (
                      <div className="pt-3 pb-2 bg-slate-50/50 border-b border-slate-200/50">
                        <ChartBlock data={dataSW} title="Grafik Jumlah Santri Tiga Tahun Terakhir" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Data Santri TD */}
              <div>
                <button 
                  onClick={() => setOpenSantriTD(!openSantriTD)}
                  className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-amber-500" /> Data santri Tadribud Duat
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriTD ? 'rotate-90' : ''}`} />
                </button>
                {openSantriTD && (
                  <div className="bg-slate-100 flex flex-col w-full border-b border-slate-200/50">
                    <button 
                      onClick={() => setOpenSantriTDRekap(!openSantriTDRekap)}
                      className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-700 border-b border-slate-200/50 font-bold flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <BarChart2 className="w-3.5 h-3.5 mr-2 text-slate-500" /> Rekap Data Santri
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriTDRekap ? 'rotate-180' : ''}`} />
                    </button>
                    {openSantriTDRekap && (
                      <div className="pt-3 pb-2 bg-slate-50/50 border-b border-slate-200/50">
                        <div className="px-5 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Santri Tiga Tahun Terakhir:</div>
                        <DataBlock 
                          title="1. Tahun Ajaran 2024/2025" 
                          data={[{label: "TD/MA-1", value: 17}, {label: "TD/MA-2 & 3", value: 6}]} 
                          total={23} 
                        />
                        <DataBlock 
                          title="2. Tahun Ajaran 2025/2026" 
                          data={[{label: "TD/MA-1", value: 11}, {label: "TD/MA-2", value: 6}, {label: "TD/MA-3", value: 4}]} 
                          total={21} 
                        />
                        <DataBlock 
                          title="3. Tahun Ajaran 2026/2027" 
                          data={[{label: "TD/MA-1", value: 11}, {label: "TD/MA-2", value: 10}, {label: "TD/MA-3", value: 4}]} 
                          total={25} 
                        />
                      </div>
                    )}
                    <button 
                      onClick={() => setOpenSantriTDGrafik(!openSantriTDGrafik)}
                      className="w-full text-left pl-16 pr-4 py-2.5 hover:bg-slate-200 text-xs text-slate-700 border-b border-slate-200/50 font-bold flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <PieChart className="w-3.5 h-3.5 mr-2 text-indigo-500" /> Grafik Data Santri
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSantriTDGrafik ? 'rotate-180' : ''}`} />
                    </button>
                    {openSantriTDGrafik && (
                      <div className="pt-3 pb-2 bg-slate-50/50 border-b border-slate-200/50">
                        <ChartBlock data={dataTD} title="Grafik Jumlah Santri Tiga Tahun Terakhir" />
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* 4. Data Guru */}
        <div className="border-b border-slate-100">
          <button 
            onClick={() => setOpenDataGuru(!openDataGuru)}
            className="w-full text-left px-4 py-4 hover:bg-slate-50 font-bold flex justify-between items-center transition-colors text-slate-700"
          >
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-3 text-indigo-500" /> Data Guru
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openDataGuru ? 'rotate-180' : ''}`} />
          </button>
          
          {openDataGuru && (
            <div className="bg-slate-50 flex flex-col w-full pb-2">
              <button onClick={() => handleDevAlert('Data Guru SA')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Users className="w-4 h-4 mr-3 text-sky-400" /> Data Guru SA
              </button>
              <button onClick={() => handleDevAlert('Data Guru SW')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Users className="w-4 h-4 mr-3 text-emerald-400" /> Data Guru SW
              </button>
              <button onClick={() => handleDevAlert('Data Guru TD')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Users className="w-4 h-4 mr-3 text-amber-400" /> Data Guru TD
              </button>
            </div>
          )}
        </div>

        {/* 5. Agenda Terbaru */}
        <div>
          <button 
            onClick={() => setOpenAgenda(!openAgenda)}
            className="w-full text-left px-4 py-4 hover:bg-slate-50 font-bold flex justify-between items-center transition-colors text-slate-700"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3 text-teal-500" /> Agenda Terbaru
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openAgenda ? 'rotate-180' : ''}`} />
          </button>
          
          {openAgenda && (
            <div className="bg-slate-50 flex flex-col w-full pb-2">
              <button onClick={() => handleOpenMedia('Agenda Salafiyah Ulya 2026/2027', '/agenda_SA.jpeg', <Calendar className="w-5 h-5 text-indigo-500" />, 'image')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-indigo-500" /> Agenda Salafiyah Ulya 2026/2027
              </button>
              <button onClick={() => handleOpenMedia('Agenda Salafiyah Wustho 2026/2027', '/agenda_SW.jpeg', <Calendar className="w-5 h-5 text-emerald-500" />, 'image')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-emerald-500" /> Agenda Salafiyah Wustho 2026/2027
              </button>

              <button onClick={() => handleOpenMedia('SPMB 2027/2028', '/Brosur_SPMB.pdf', <Star className="w-5 h-5 mr-2 text-amber-400" />, 'pdf')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <Star className="w-4 h-4 mr-3 text-amber-400" /> SPMB 2027/2028
              </button>
              <button onClick={() => handleDevAlert('PTS')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-3 text-sky-500" /> PTS
              </button>
              <button onClick={() => handleDevAlert('PAS')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 border-b border-slate-200/50 text-sm font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-3 text-indigo-500" /> PAS
              </button>
              <button onClick={() => handleDevAlert('Ujian Akhir Nasional')} className="w-full text-left pl-12 pr-4 py-3 hover:bg-slate-100 text-slate-700 text-sm font-semibold flex items-center">
                <FileCheck className="w-4 h-4 mr-3 text-emerald-500" /> Ujian Akhir Nasional
              </button>
            </div>
          )}
        </div>

      </div>

      <MediaModal activeMediaModal={activeMediaModal} setActiveMediaModal={setActiveMediaModal} />
    </div>
  );
}
