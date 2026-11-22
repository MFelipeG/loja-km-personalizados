import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Sparkles,
  Scissors
} from 'lucide-react';
import {
  generateA4Sheet,
  chunkItemsForA4,
  downloadSheetPNG,
  downloadAllPagesPDF,
  A4_WIDTH_PX,
  A4_HEIGHT_PX
} from '../utils/a4Generator';

export default function A4PrintModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [loadingCanvas, setLoadingCanvas] = useState(true);
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [showSafeGuide, setShowSafeGuide] = useState(false);

  const chunks = chunkItemsForA4(order.items || []);
  const totalPages = chunks.length;
  const currentChunk = chunks[activePageIndex] || [];

  // Generate canvas preview whenever active page or guide toggle changes
  useEffect(() => {
    let isMounted = true;
    async function renderPreview() {
      setLoadingCanvas(true);
      try {
        const canvas = await generateA4Sheet(
          currentChunk,
          activePageIndex,
          totalPages,
          {
            orderCode: order.code,
            showSafeLines: showSafeGuide
          }
        );
        if (isMounted) {
          setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.85));
        }
      } catch (err) {
        console.error('Error generating preview:', err);
      } finally {
        if (isMounted) setLoadingCanvas(false);
      }
    }

    renderPreview();
    return () => { isMounted = false; };
  }, [activePageIndex, showSafeGuide, order]);

  // Download high-resolution PNG (300 DPI) for current page
  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      await downloadSheetPNG(currentChunk, activePageIndex, totalPages, order.code);
    } catch (err) {
      alert('Erro ao gerar imagem PNG: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // Download all pages as single PDF (300 DPI)
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadAllPagesPDF(order.items || [], order.code);
    } catch (err) {
      alert('Erro ao gerar PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // Direct print using browser print dialog with @media print CSS
  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <>
      {/* Visual Modal Dialog */}
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden flex flex-col max-h-[95vh]">
          
          {/* Header */}
          <div className="px-6 py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand text-atelier-50 flex items-center justify-center shadow-xs">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-dark flex items-center gap-2">
                  <span>Gabarito A4 Automático (Substituto do Canva)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-bold">
                    300 DPI
                  </span>
                </h3>
                <p className="text-xs text-atelier-500">
                  Pedido {order.code} • {order.items?.length || 0} unidades • 12 fotos por folha A4 (61x61mm)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="px-6 py-3 bg-atelier-100/70 border-b border-atelier-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                disabled={activePageIndex === 0}
                onClick={() => setActivePageIndex((p) => p - 1)}
                className="p-1.5 rounded-lg bg-white border border-atelier-300 disabled:opacity-40 hover:bg-atelier-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-atelier-800">
                Folha {activePageIndex + 1} de {totalPages}
              </span>
              <button
                disabled={activePageIndex >= totalPages - 1}
                onClick={() => setActivePageIndex((p) => p + 1)}
                className="p-1.5 rounded-lg bg-white border border-atelier-300 disabled:opacity-40 hover:bg-atelier-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Guide Toggle */}
            <button
              onClick={() => setShowSafeGuide(!showSafeGuide)}
              className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors ${
                showSafeGuide
                  ? 'bg-brand/10 text-brand border-brand/20'
                  : 'bg-white text-atelier-700 border-atelier-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSafeGuide ? 'Guias 5,0cm Ativas' : 'Mostrar Linhas 5,0cm'}</span>
            </button>

            {/* Print & Download Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPNG}
                disabled={downloading || loadingCanvas}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-atelier-50 text-atelier-800 font-bold border border-atelier-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Baixar esta folha como imagem PNG em 300 DPI (2480x3508px)"
              >
                <ImageIcon className="w-4 h-4 text-brand" />
                <span>Baixar PNG</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-atelier-50 text-atelier-800 font-bold border border-atelier-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Baixar todas as páginas em um único arquivo PDF pronto para gráfica"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Baixar PDF</span>
              </button>

              <button
                onClick={handleDirectPrint}
                className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-dark text-atelier-50 font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Imprimir direto na sua impressora na escala exata de 100%"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Direto</span>
              </button>
            </div>
          </div>

          {/* Canvas A4 Sheet Preview Display */}
          <div className="p-4 sm:p-6 bg-atelier-200/50 overflow-y-auto flex items-center justify-center min-h-[480px]">
            {loadingCanvas ? (
              <div className="text-center space-y-2">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-atelier-600 font-semibold">
                  Renderizando folha em 300 DPI com fundo borrado...
                </p>
              </div>
            ) : previewDataUrl ? (
              <div className="relative bg-white shadow-2xl rounded border border-atelier-300 max-w-[500px] w-full aspect-[210/297] overflow-hidden">
                <img
                  src={previewDataUrl}
                  alt={`Gabarito A4 Página ${activePageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <p className="text-xs text-atelier-500">Falha ao gerar visualização.</p>
            )}
          </div>

          {/* Footer Specifications Info */}
          <div className="px-6 py-3 bg-white border-t border-atelier-200 flex flex-wrap items-center justify-between text-[11px] text-atelier-500 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-brand" />
                <span>Marcas de corte inclusas nas bordas e cruzamentos</span>
              </span>
              <span>•</span>
              <span>Bloco: 61x61mm | Área Frontal: 50x50mm</span>
            </div>
            <span className="font-mono">
              Resolução: 2480 x 3508 px (A4 Padrão Internacional)
            </span>
          </div>

        </div>
      </div>

      {/* Hidden Container exclusively visible during @media print */}
      <div className="print-only-container hidden">
        {chunks.map((chunk, pageIdx) => (
          <div key={pageIdx} className="print-page">
            <PrintPageRenderer
              chunk={chunk}
              pageIndex={pageIdx}
              totalPages={chunks.length}
              orderCode={order.code}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Subcomponent to asynchronously paint A4 canvas for @media print
function PrintPageRenderer({ chunk, pageIndex, totalPages, orderCode }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    async function draw() {
      const canvas = await generateA4Sheet(chunk, pageIndex, totalPages, { orderCode });
      setDataUrl(canvas.toDataURL('image/jpeg', 0.98));
    }
    draw();
  }, [chunk, pageIndex, totalPages, orderCode]);

  if (!dataUrl) return null;
  return (
    <img
      src={dataUrl}
      alt="Folha A4 Impressão"
      style={{ width: '210mm', height: '297mm', display: 'block' }}
    />
  );
}
