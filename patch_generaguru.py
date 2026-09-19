import re

with open('src/components/MenuView.tsx', 'r') as f:
    content = f.read()

# Add state
content = content.replace("const [subPerangkatOpen, setSubPerangkatOpen] = useState(false);",
                          "const [subPerangkatOpen, setSubPerangkatOpen] = useState(false);\n  const [showGeneraGuru, setShowGeneraGuru] = useState(false);")


# Replace button
perangkat_button = """          <button 
            onClick={() => onNavigate('perangkat')}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-2 border-slate-200 active:scale-95"
          >
            <Star className="w-8 h-8 mb-2 text-amber-400" />
            <span className="font-semibold text-xs md:text-sm text-slate-700 text-center">Perangkat Pembelajaran</span>
          </button>"""

genera_button = """          <button 
            onClick={() => setShowGeneraGuru(true)}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center border-b-2 border-slate-200 active:scale-95"
          >
            <Star className="w-8 h-8 mb-2 text-amber-400" />
            <span className="font-semibold text-xs md:text-sm text-slate-700 text-center">GeneraGuru</span>
          </button>"""

content = content.replace(perangkat_button, genera_button)

# Add modal before closing div
modal_code = """
      {/* GeneraGuru Modal */}
      {showGeneraGuru && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-6 flex flex-col items-center text-white shrink-0">
              <button 
                onClick={() => setShowGeneraGuru(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">GeneraGuru</h3>
              <p className="text-amber-50 font-medium text-sm mt-1">Asisten Administrasi Mengajar Pintar</p>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-600 space-y-5">
              <p className="leading-relaxed">
                <strong className="text-slate-800">GeneraGuru</strong> adalah aplikasi gratis yang dibuat untuk membantu guru & asatidzah membuat seluruh dokumen administrasi mengajar secara otomatis.
              </p>
              
              <p className="leading-relaxed">
                Aplikasi ini hadir sebagai solusi agar guru & asatidzah mendapatkan referensi sehingga tidak perlu lagi menghabiskan waktu berhari-hari hanya untuk mengetik dan menyusun berkas administrasi secara manual.
              </p>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-2">Fasilitas Utama</h4>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Lengkap & Terintegrasi</span>
                    Cukup sekali isi data dasar, sistem langsung membuatkan Pemetaan Materi, Modul Ajar, CP, ATP, Prota, Promes, Soal PH, PTS, PAS.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Sesuai Kurikulum</span>
                    Format dan struktur dokumen sudah disesuaikan dengan standar kurikulum terbaru, sehingga siap digunakan untuk supervisi maupun mengajar harian.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Mudah Disesuaikan</span>
                    Hasil otomatis masih bisa diedit kembali agar sesuai dengan karakter siswa dan kondisi sekolah masing-masing.
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">Hemat Waktu & Tenaga</span>
                    Memangkas beban kerja administratif hingga 80%, sehingga guru bisa lebih fokus pada kegiatan belajar-mengajar di kelas.
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                <p className="font-medium text-slate-800 mb-1">Penting:</p>
                <p className="text-xs text-slate-500">Dengan GeneraGuru, urusan berkas administrasi kelas yang rumit berubah menjadi lebih cepat, rapi, dan praktis.</p>
                <p className="text-[10px] text-slate-400 mt-2 italic">*Disclaimer: Aplikasi saat ini masih proses pengembangan</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0">
              <button
                onClick={() => {
                  Swal.fire({
                    icon: 'info',
                    title: 'Mohon Maaf',
                    text: 'Aplikasi Belum siap diakses.',
                    confirmButtonColor: '#f59e0b'
                  });
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5 fill-white/20" />
                Uji Coba Aplikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

content = content.replace("    </div>\n  );\n}", modal_code)

with open('src/components/MenuView.tsx', 'w') as f:
    f.write(content)
