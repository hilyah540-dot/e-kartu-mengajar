import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, FileText, File, Trash2, CheckCircle2, AlertCircle, Eye, Share2, Download, Folder, FolderOpen, FolderPlus, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { get, set } from 'idb-keyval';
import { MediaModal } from './MediaModal';

interface DocumentUploadViewProps {
  title: string;
  onBack: () => void;
}

interface FolderData {
  id: string;
  name: string;
  createdAt: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  fileData?: File | Blob; 
  folderId?: string | null;
}

export function DocumentUploadView({ title, onBack }: DocumentUploadViewProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<{title: string, src: string, icon: React.ReactNode, type: 'image' | 'pdf', fileData?: File | Blob} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const fileKey = `elmadina_docs_v2_${title.replace(/\s+/g, '_').toLowerCase()}`;
      const folderKey = `elmadina_folders_v2_${title.replace(/\s+/g, '_').toLowerCase()}`;
      
      try {
        const storedFiles = await get(fileKey);
        if (storedFiles && Array.isArray(storedFiles)) {
          setFiles(storedFiles);
        }
        
        const storedFolders = await get(folderKey);
        if (storedFolders && Array.isArray(storedFolders)) {
          setFolders(storedFolders);
        }
      } catch (e) {
        console.error("Gagal memuat data dari IndexedDB", e);
      }
    };
    loadData();
  }, [title]);

  const saveFiles = async (newFiles: UploadedFile[]) => {
    const key = `elmadina_docs_v2_${title.replace(/\s+/g, '_').toLowerCase()}`;
    try {
      await set(key, newFiles);
      setFiles(newFiles);
    } catch (e) {
      console.error("Gagal menyimpan file ke IndexedDB", e);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: 'Terjadi kesalahan saat menyimpan dokumen. Ruang penyimpanan mungkin penuh.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const saveFolders = async (newFolders: FolderData[]) => {
    const key = `elmadina_folders_v2_${title.replace(/\s+/g, '_').toLowerCase()}`;
    try {
      await set(key, newFolders);
      setFolders(newFolders);
    } catch (e) {
      console.error("Gagal menyimpan folder ke IndexedDB", e);
    }
  };

  const handleCreateFolder = async () => {
    const { value: folderName } = await Swal.fire({
      title: 'Buat Folder Baru',
      input: 'text',
      inputPlaceholder: 'Nama Folder',
      showCancelButton: true,
      confirmButtonText: 'Buat',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Nama folder tidak boleh kosong!';
        }
      }
    });
    
    if (folderName) {
      const newFolder: FolderData = {
        id: Date.now().toString(),
        name: folderName.trim(),
        createdAt: new Date().toISOString()
      };
      await saveFolders([newFolder, ...folders]);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Folder "${newFolder.name}" berhasil dibuat.`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validation: Check size (max 1MB)
      if (selectedFile.size > 1 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: 'Ukuran maksimal file adalah 1MB.',
          confirmButtonColor: '#ef4444'
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      // Validasi PDF dan Gambar
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const validExtensions = /\.(pdf|jpg|jpeg|png)$/i;
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(validExtensions)) {
        Swal.fire({
          icon: 'error',
          title: 'Format Tidak Sesuai',
          text: 'Hanya file PDF, JPG, dan PNG yang diperbolehkan.',
          confirmButtonColor: '#ef4444'
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setIsUploading(true);
      
      // Simulate network delay for UX
      setTimeout(async () => {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type || (selectedFile.name.match(/\.(jpg|jpeg|png)$/i) ? 'image/jpeg' : 'application/pdf'),
          uploadDate: new Date().toISOString(),
          fileData: selectedFile,
          folderId: currentFolderId
        };
        
        const updatedFiles = [newFile, ...files];
        await saveFiles(updatedFiles);
        setIsUploading(false);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Dokumen berhasil diunggah.',
          confirmButtonColor: '#10b981',
          timer: 2000,
          showConfirmButton: false
        });
      }, 1500); 
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Dokumen?',
      text: 'Dokumen ini akan dihapus permanen dari memori.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const newFiles = files.filter(f => f.id !== id);
        saveFiles(newFiles);
      }
    });
  };

  const handleDeleteFolder = (id: string, name: string) => {
    Swal.fire({
      title: 'Hapus Folder?',
      text: `Folder "${name}" beserta semua dokumen di dalamnya akan dihapus permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus Folder',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        const newFolders = folders.filter(f => f.id !== id);
        const newFiles = files.filter(f => f.folderId !== id);
        
        saveFolders(newFolders);
        saveFiles(newFiles);
        
        if (currentFolderId === id) {
          setCurrentFolderId(null);
        }
      }
    });
  };
  
  const handleView = (file: UploadedFile) => {
    if (!file.fileData) {
      Swal.fire('File tidak ditemukan', 'Dokumen ini sepertinya dari sesi lama dan isinya tidak tersimpan.', 'error');
      return;
    }
    
    let url = '';
    try {
      url = URL.createObjectURL(file.fileData);
    } catch(e) {
      console.error("Gagal membuat URL", e);
    }
    
    const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png)$/i);

    setActiveMediaModal({
      title: file.name,
      src: url,
      icon: isImage ? <File className="w-5 h-5 mr-2 text-blue-500" /> : <FileText className="w-5 h-5 mr-2 text-red-500" />,
      type: isImage ? 'image' : 'pdf',
      fileData: file.fileData
    });
  };
  
  const handleDownload = (file: UploadedFile) => {
    if (!file.fileData) return;
    const url = URL.createObjectURL(file.fileData);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleShare = async (file: UploadedFile) => {
    if (!file.fileData) return;
    
    // Check if Web Share API is available and supports sharing files
    if (navigator.canShare && navigator.canShare({ files: [file.fileData as globalThis.File] })) {
      try {
        await navigator.share({
          title: file.name,
          text: `Bagikan dokumen: ${file.name}`,
          files: [file.fileData as globalThis.File]
        });
      } catch (error) {
        console.error("Gagal membagikan:", error);
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Fitur Tidak Didukung',
        text: 'Perangkat atau browser Anda tidak mendukung pembagian file secara langsung ke WhatsApp. Silakan unduh dokumen terlebih dahulu, lalu kirimkan secara manual melalui WhatsApp.',
        confirmButtonColor: '#10b981'
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const displayedFiles = files.filter(f => f.folderId === currentFolderId || (!f.folderId && currentFolderId === null));
  const currentFolderName = currentFolderId ? folders.find(f => f.id === currentFolderId)?.name : null;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-12 animate-fade-in relative z-10">
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="text-emerald-700 hover:text-emerald-900 mr-4 font-bold p-2 bg-white rounded-xl shadow-sm hover:shadow transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 border-b-2 border-emerald-500 pb-1">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Area */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-800">Unggah Dokumen Baru</h3>
              <p className="text-xs text-slate-500 mt-1">Format PDF, JPG, PNG (Max 1MB)</p>
            </div>
            
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
                accept="application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <button 
                disabled={isUploading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Pilih File
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Sesuai kebijakan, dokumen maksimal <strong>1MB</strong> yang diizinkan untuk diunggah pada menu {title} ini. Dokumen akan diunggah ke folder yang sedang dibuka.
              </p>
            </div>
          </div>
        </div>

        {/* Files & Folders List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px]">
            
            {/* Breadcrumb & Create Folder */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm sm:text-base truncate">
                <button 
                  onClick={() => setCurrentFolderId(null)} 
                  className="flex items-center hover:text-emerald-600 shrink-0"
                >
                  <FolderOpen className={`w-5 h-5 mr-1.5 ${currentFolderId ? 'text-slate-400' : 'text-emerald-600'}`} />
                  <span className={`font-bold ${currentFolderId ? 'text-slate-500' : 'text-slate-800'}`}>Semua Folder</span>
                </button>
                {currentFolderId && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold text-emerald-700 truncate">{currentFolderName || 'Folder'}</span>
                  </>
                )}
              </div>
              
              <button 
                onClick={handleCreateFolder}
                className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-100 transition-colors shrink-0 border border-emerald-100"
              >
                <FolderPlus className="w-4 h-4" /> Folder Baru
              </button>
            </div>
            
            {/* Folder List (Only show at root) */}
            {currentFolderId === null && folders.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Daftar Folder</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {folders.map(folder => (
                    <div 
                      key={folder.id} 
                      onClick={() => setCurrentFolderId(folder.id)}
                      className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-emerald-200 transition-all shadow-sm cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mr-3 group-hover:bg-amber-100 transition-colors">
                        <Folder className="w-5 h-5 text-amber-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-bold text-slate-800 truncate" title={folder.name}>{folder.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {files.filter(f => f.folderId === folder.id).length} Item
                        </p>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id, folder.name); }}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Hapus Folder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* File List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                {currentFolderId ? `Dokumen di ${currentFolderName}` : 'Dokumen Tanpa Folder'} ({displayedFiles.length})
              </h4>
              
              {displayedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                  <File className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="font-bold text-slate-500 mb-1">Belum Ada Dokumen</p>
                  <p className="text-xs text-slate-400 max-w-[200px]">
                    {currentFolderId 
                      ? 'Folder ini masih kosong. Silakan unggah dokumen baru.' 
                      : 'Mulai buat folder atau unggah dokumen.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedFiles.map(file => (
                    <div key={file.id} className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm gap-3 sm:gap-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-3 ${file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png)$/i) ? 'bg-blue-50' : 'bg-red-50'}`}>
                          {file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png)$/i) ? (
                            <File className="w-5 h-5 text-blue-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-bold text-slate-800 truncate" title={file.name}>{file.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {formatSize(file.size)}</span>
                            <span>{formatDate(file.uploadDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button 
                          onClick={() => handleView(file)}
                          className="p-1.5 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Lihat File"
                        >
                          <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Lihat</span>
                        </button>
                        
                        <button 
                          onClick={() => handleShare(file)}
                          className="p-1.5 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                          title="Bagikan ke WhatsApp"
                        >
                          <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Bagikan</span>
                        </button>
                        
                        <button 
                          onClick={() => handleDownload(file)}
                          className="p-1.5 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Unduh File"
                        >
                          <Download className="w-4 h-4" /> <span className="hidden lg:inline">Unduh</span>
                        </button>

                        <div className="w-px h-6 bg-slate-200 mx-1"></div>

                        <button 
                          onClick={() => handleDelete(file.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
        
      </div>

      <MediaModal activeMediaModal={activeMediaModal} setActiveMediaModal={setActiveMediaModal} />
    </div>
  );
}
