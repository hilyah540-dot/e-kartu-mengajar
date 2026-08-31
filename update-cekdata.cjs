const fs = require('fs');

let content = fs.readFileSync('src/components/CekDataView.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { ArrowLeft, FileDown, FileSpreadsheet, Share2, ChevronDown, BookOpen, Repeat, Image as ImageIcon } from 'lucide-react';",
  "import { ArrowLeft, FileDown, FileSpreadsheet, Share2, ChevronDown, BookOpen, Repeat, Image as ImageIcon, Edit, Loader2, CheckCircle, XCircle } from 'lucide-react';\nimport { EditRequest, submitEditRequest, listenToTeacherAllRequests } from '../lib/editRequests';\nimport { EditDataModal } from './EditDataModal';"
);

// 2. Add React useEffect to import
content = content.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';"
);

// 3. Add states inside component
const stateRegex = /  const \[isExporting, setIsExporting\] = useState\(false\);/;
const statesToAdd = `  const [isExporting, setIsExporting] = useState(false);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  const [editingRow, setEditingRow] = useState<RecordRow | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    if (teacherName) {
      unsubscribe = listenToTeacherAllRequests(teacherName, setEditRequests);
    }
    return () => unsubscribe && unsubscribe();
  }, [teacherName]);

  const handleSaveEdit = async (req: Omit<EditRequest, 'id' | 'createdAt' | 'status'>) => {
    try {
      await submitEditRequest(req);
      setEditingRow(null);
      Swal.fire({
        icon: 'success',
        title: 'Terkirim',
        text: 'Perubahan data terkirim ke Admin.',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      Swal.fire('Error', 'Gagal mengirim pengajuan.', 'error');
    }
  };
`;
content = content.replace(stateRegex, statesToAdd);

// 4. Update the table header
content = content.replace(
  '<th style={{ backgroundColor: \'#059669\' }} className="p-3 border border-emerald-700 w-[26%]">Kegiatan Tambahan</th>\n            </tr>',
  '<th style={{ backgroundColor: \'#059669\' }} className="p-3 border border-emerald-700 w-[26%]">Kegiatan Tambahan</th>\n              {!isExporting && teacherName && <th style={{ backgroundColor: \'#059669\' }} className="p-3 border border-emerald-700 text-center w-[8%]">Aksi</th>}\n            </tr>'
);

// 5. Update the table row
const rowRenderRegex = /<td style={{ backgroundColor: idx % 2 === 0 \? '#ffffff' : '#f8fafc' }} className="p-2\.5 border border-slate-200 font-medium leading-relaxed text-indigo-800">\s*\{arrT\.length > 0 \? arrT\.map\(\(t, i\) => <div key=\{i\}>\{t\}<\/div>\) : '-'\}\s*<\/td>\s*<\/tr>/m;

const rowRenderReplacement = `<td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 font-medium leading-relaxed text-indigo-800">
                      {arrT.length > 0 ? arrT.map((t, i) => <div key={i}>{t}</div>) : '-'}
                    </td>
                    {!isExporting && teacherName && (
                      <td style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }} className="p-2.5 border border-slate-200 text-center">
                        {(() => {
                          const request = editRequests.find(r => r.tanggal === row.Tanggal);
                          if (!request) {
                            return (
                              <button 
                                onClick={() => setEditingRow(row)}
                                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Edit Data"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            );
                          } else if (request.status === 'pending') {
                            return (
                              <div className="flex flex-col items-center gap-1" title="Sedang Proses">
                                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                <span className="text-[9px] text-amber-600 font-bold leading-tight">Proses</span>
                              </div>
                            );
                          } else if (request.status === 'approved') {
                            return (
                              <div className="flex flex-col items-center gap-1" title="Perubahan Berhasil">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-[9px] text-emerald-600 font-bold leading-tight">Disetujui</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex flex-col items-center gap-1" title="Perubahan Ditolak">
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-[9px] text-red-600 font-bold leading-tight">Ditolak</span>
                              </div>
                            );
                          }
                        })()}
                      </td>
                    )}
                  </tr>`;

content = content.replace(rowRenderRegex, rowRenderReplacement);

// 6. Add EditDataModal component before the final closing div
content = content.replace(
  '    </div>\n  );\n}',
  '    </div>\n      {editingRow && (\n        <EditDataModal\n          row={editingRow}\n          teacherName={teacherName}\n          onClose={() => setEditingRow(null)}\n          onSave={handleSaveEdit}\n        />\n      )}\n  );\n}'
);

fs.writeFileSync('src/components/CekDataView.tsx', content);

console.log('Update CekDataView complete');
