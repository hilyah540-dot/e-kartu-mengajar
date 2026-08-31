import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, X, Download } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface MediaModalProps {
  activeMediaModal: { 
    title: string; 
    src: string; 
    icon: React.ReactNode; 
    type: 'image' | 'pdf';
    fileData?: File | Blob;
  } | null;
  setActiveMediaModal: (val: null) => void;
}

export function MediaModal({ activeMediaModal, setActiveMediaModal }: MediaModalProps) {
  if (!activeMediaModal) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
      onClick={() => setActiveMediaModal(null)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {activeMediaModal.type === 'image' ? (
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur z-10 shrink-0">
                  <h3 className="font-bold text-slate-800 text-base md:text-lg flex items-center truncate max-w-[200px] sm:max-w-xs">
                    {activeMediaModal.icon}
                    <span className="truncate ml-2">{activeMediaModal.title}</span>
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button onClick={() => zoomOut()} className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="Perkecil">
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button onClick={() => resetTransform()} className="hidden sm:block px-2 py-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors text-xs font-semibold" title="Reset Zoom">
                      Reset
                    </button>
                    <button onClick={() => zoomIn()} className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors sm:mr-2" title="Perbesar">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    
                    <a 
                      href={activeMediaModal.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 sm:px-3 py-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors text-xs sm:text-sm font-semibold flex items-center"
                      title="Buka / Unduh di Tab Baru"
                      download={activeMediaModal.title}
                    >
                      <Download className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">Buka/Unduh</span>
                    </a>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button 
                      onClick={() => setActiveMediaModal(null)}
                      className="p-1.5 sm:p-2 hover:bg-red-100 hover:text-red-600 rounded-lg text-slate-500 transition-colors"
                      title="Tutup"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                {/* Modal Body */}
                <div className="flex-1 bg-slate-100 flex overflow-hidden">
                  <div className="relative w-full h-full flex flex-col">
                    <div className="sm:hidden absolute bottom-4 right-4 z-10 flex flex-col gap-2 bg-white/80 backdrop-blur p-2 rounded-xl shadow-lg border border-slate-200">
                        <button onClick={() => zoomIn()} className="p-2 bg-white hover:bg-slate-50 rounded-lg text-slate-700 shadow-sm transition-colors border border-slate-200" title="Perbesar"><ZoomIn className="w-5 h-5" /></button>
                        <button onClick={() => zoomOut()} className="p-2 bg-white hover:bg-slate-50 rounded-lg text-slate-700 shadow-sm transition-colors border border-slate-200" title="Perkecil"><ZoomOut className="w-5 h-5" /></button>
                    </div>
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={activeMediaModal.src} 
                        alt={activeMediaModal.title} 
                        className="max-w-full max-h-full object-contain shadow-md rounded border border-slate-200"
                        style={{ cursor: 'grab' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://placehold.co/800x1200/e2e8f0/475569?text=Gambar+Belum+Diunggah`;
                        }}
                      />
                    </TransformComponent>
                  </div>
                </div>
              </>
            )}
          </TransformWrapper>
        ) : (
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Modal Header for PDF */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur z-10 shrink-0">
                  <h3 className="font-bold text-slate-800 text-base md:text-lg flex items-center truncate max-w-[200px] sm:max-w-xs">
                    {activeMediaModal.icon}
                    <span className="truncate ml-2">{activeMediaModal.title}</span>
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button onClick={() => zoomOut()} className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" title="Perkecil">
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <button onClick={() => resetTransform()} className="hidden sm:block px-2 py-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors text-xs font-semibold" title="Reset Zoom">
                      Reset
                    </button>
                    <button onClick={() => zoomIn()} className="hidden sm:block p-1.5 sm:p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors sm:mr-2" title="Perbesar">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={handleShare}
                      className="px-2 sm:px-3 py-1.5 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-xs sm:text-sm font-semibold flex items-center"
                      title="Bagikan (WhatsApp / Web Share)"
                    >
                      <Share2 className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">Bagikan</span>
                    </button>

                    <a 
                      href={activeMediaModal.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 sm:px-3 py-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors text-xs sm:text-sm font-semibold flex items-center"
                      title="Buka / Unduh di Tab Baru"
                      download={activeMediaModal.title}
                    >
                      <Download className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">Buka/Unduh</span>
                    </a>
                    <div className="w-px h-6 bg-slate-300 mx-1"></div>
                    <button 
                      onClick={() => setActiveMediaModal(null)}
                      className="p-1.5 sm:p-2 hover:bg-red-100 hover:text-red-600 rounded-lg text-slate-500 transition-colors"
                      title="Tutup"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                {/* Modal Body for PDF */}
                <div className="flex-1 bg-slate-100 flex overflow-hidden">
                  <div className="relative w-full h-full flex flex-col">
                    <div className="sm:hidden absolute bottom-4 right-4 z-10 flex flex-col gap-2 bg-white/80 backdrop-blur p-2 rounded-xl shadow-lg border border-slate-200">
                        <button onClick={() => zoomIn()} className="p-2 bg-white hover:bg-slate-50 rounded-lg text-slate-700 shadow-sm transition-colors border border-slate-200" title="Perbesar"><ZoomIn className="w-5 h-5" /></button>
                        <button onClick={() => zoomOut()} className="p-2 bg-white hover:bg-slate-50 rounded-lg text-slate-700 shadow-sm transition-colors border border-slate-200" title="Perkecil"><ZoomOut className="w-5 h-5" /></button>
                    </div>
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Document
                        file={activeMediaModal.fileData || activeMediaModal.src}
                        className="flex justify-center my-4"
                        loading={
                          <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                            <p className="font-semibold text-sm">Memuat PDF...</p>
                          </div>
                        }
                        error={
                          <div className="flex flex-col items-center justify-center p-8 text-red-500 bg-red-50 rounded-lg border border-red-100">
                            <p className="font-semibold text-sm">Gagal memuat PDF.</p>
                            <p className="text-xs mt-1">Gunakan tombol Buka/Unduh di atas.</p>
                          </div>
                        }
                      >
                        <Page 
                          pageNumber={1} 
                          renderTextLayer={false} 
                          renderAnnotationLayer={false}
                          className="shadow-xl bg-white border border-slate-200"
                          width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 800) : 800}
                        />
                      </Document>
                    </TransformComponent>
                  </div>
                </div>
              </>
            )}
          </TransformWrapper>
        )}
      </div>
    </div>
  );
}
