import re

with open('src/components/MenuView.tsx', 'r') as f:
    content = f.read()

# 1. Ganti teks "Asisten Administrasi Mengajar Pintar"
content = content.replace(
    '<p className="text-amber-50 font-medium text-sm mt-1">Asisten Administrasi Mengajar Pintar</p>',
    '<p className="text-amber-50 font-medium text-sm mt-1 text-center">Bikin Perangkat Administrasi Guru jadi lebih Mudah</p>'
)

# 2. Hapus teks "Penting:"
content = content.replace(
    '<p className="font-medium text-slate-800 mb-1">Penting:</p>\n                ',
    ''
)

# 3. Ganti teks "Dengan GeneraGuru..."
content = content.replace(
    '<p className="text-xs text-slate-500">Dengan GeneraGuru, urusan berkas administrasi kelas yang rumit berubah menjadi lebih cepat, rapi, dan praktis.</p>',
    '<p className="text-xs text-slate-500">Semoga dengan bantuan Aplikasi ini, urusan berkas administrasi kelas yang rumit berubah menjadi lebih cepat, rapi, dan praktis.</p>'
)

with open('src/components/MenuView.tsx', 'w') as f:
    f.write(content)
