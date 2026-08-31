const fs = require('fs');
let content = fs.readFileSync('src/components/EditDataModal.tsx', 'utf8');

if (!content.includes("import Swal")) {
  content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport Swal from 'sweetalert2';");
}

const submitReplacement = `  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if data is exactly the same as original
    const isSame = 
      tanggal === (row.Tanggal || '') &&
      mUlya === (Number(row.Mengajar_Ulya) || 0) &&
      mWustho === (Number(row.Mengajar_Wustho) || 0) &&
      mTd === (Number(row.Mengajar_Tadribud) || 0) &&
      pUlya === (Number(row.Pengganti_Ulya) || 0) &&
      pWustho === (Number(row.Pengganti_Wustho) || 0) &&
      pTd === (Number(row.Pengganti_Tadribud) || 0) &&
      lembur === (Number(row.Jam_Lembur) || 0) &&
      deskLembur === (row.Deskripsi_Lembur || '') &&
      eskul === (row.Jenis_Eskul || '') &&
      jmlEskul === (Number(row.Jml_Pertemuan_Eskul) || 0);

    if (isSame) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Berubah',
        text: 'Maaf data yang Anda ajukan sama dengan data sebelumnya, silahkan perbaiki terlebih dahulu.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    onSave({`;

content = content.replace(`  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    onSave({`, submitReplacement);

fs.writeFileSync('src/components/EditDataModal.tsx', content);
console.log('EditDataModal updated');
