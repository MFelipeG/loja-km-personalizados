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
  Scissors,
  Sun
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
  // Default brightness compensation: +15% (standard photo print compensation)
  const [brightness, setBrightness] = useState(15);

  const chunks = chunkItemsForA4(order.items || []);
  const totalPages = chunks.length;
  const currentChunk = chunks[activePageIndex] || [];

  // Generate canvas preview whenever active page, brightness or guide toggle changes
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
            customerName: order.customerName,
            showSafeLines: showSafeGuide,
            brightness: brightness
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
  }, [activePageIndex, showSafeGuide, brightness, order]);

  // Download high-resolution PNG (300 DPI) for current page
  const handleDownloadPNG = async () => {
    setDownloading(true);
    try {
      await downloadSheetPNG(currentChunk, activePageIndex, totalPages, order.code, {
        customerName: order.customerName,
        brightness
      });
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
      await downloadAllPagesPDF(order.items || [], order.code, {
        customerName: order.customerName,
        brightness
      });
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
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-1 sm:p-4 overflow-y-auto no-print">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[95vh]">
          
          {/* Header com Nome da Pessoa e Número do Pedido */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand text-atelier-50 flex items-center justify-center shadow-xs shrink-0">
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-sm sm:text-lg text-brand-dark flex flex-wrap items-center gap-1.5 sm:gap-2 leading-tight">
                  <span className="truncate">{order.customerName ? `${order.customerName} • Pedido ${order.code}` : `Pedido ${order.code}`}</span>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-bold">
                    300 DPI
                  </span>
                  {brightness > 0 && (
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-sans font-bold flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-600" />
                      <span>+{brightness}%</span>
                    </span>
                  )}
                </h3>
                <p className="text-[11px] sm:text-xs text-atelier-500 truncate">
                  Cliente: <strong className="text-brand-dark">{order.customerName || 'Não especificado'}</strong> • Pedido <strong>{order.code}</strong> • {order.items?.length || 0} fotos
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-200/60 rounded-full transition-colors cursor-pointer shrink-0"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Brilho de Impressão (Compensação Anti-Escurecimento) */}
          <div className="px-3 sm:px-6 py-2.5 bg-amber-50/80 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Brilho de Impressão:</span>
              </div>
              
              {/* Presets de Brilho */}
              <div className="inline-flex rounded-xl p-1 bg-white border border-amber-200 shadow-2xs gap-1">
                {[
                  { label: '0% (Original)', val: 0 },
                  { label: '+10%', val: 10 },
                  { label: '+15% (Recomendado)', val: 15 },
                  { label: '+20%', val: 20 },
                  { label: '+30% (Mais Claro)', val: 30 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setBrightness(preset.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      brightness === preset.val
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-atelier-700 hover:bg-amber-100/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider de Ajuste Fino */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-amber-800 font-medium">Ajuste fino:</span>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-24 sm:w-28 accent-amber-600 cursor-pointer"
                title="Ajuste o brilho de 0% até +40%"
              />
              <span className="font-mono font-bold text-amber-900 min-w-8">
                +{brightness}%
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-atelier-100/70 border-b border-atelier-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                disabled={activePageIndex === 0}
                onClick={() => setActivePageIndex((p) => p - 1)}
                className="p-1.5 rounded-lg bg-white border border-atelier-300 disabled:opacity-40 hover:bg-atelier-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-atelier-800 text-[11px] sm:text-xs">
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
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors text-[11px] sm:text-xs ${
                showSafeGuide
                  ? 'bg-brand/10 text-brand border-brand/20'
                  : 'bg-white text-atelier-700 border-atelier-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showSafeGuide ? 'Guias 5cm' : 'Linhas 5cm'}</span>
            </button>

            {/* Print & Download Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto pt-1 sm:pt-0">
              <button
                onClick={handleDownloadPNG}
                disabled={downloading || loadingCanvas}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-2 rounded-xl bg-white hover:bg-atelier-50 text-atelier-800 font-bold border border-atelier-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                title="Baixar esta folha como imagem PNG em 300 DPI"
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand" />
                <span>PNG</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-2 rounded-xl bg-white hover:bg-atelier-50 text-atelier-800 font-bold border border-atelier-300 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                title="Baixar todas as páginas em um único arquivo PDF pronto para gráfica"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
                <span>PDF</span>
              </button>

              <button
                onClick={handleDirectPrint}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl bg-brand hover:bg-brand-dark text-atelier-50 font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
                title="Imprimir direto na sua impressora na escala exata de 100%"
              >
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>

          {/* Canvas A4 Sheet Preview Display */}
          <div className="p-2 sm:p-6 bg-atelier-200/50 overflow-y-auto flex items-center justify-center min-h-[320px] sm:min-h-[480px]">
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
              customerName={order.customerName}
              brightness={brightness}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// Subcomponent to asynchronously paint A4 canvas for @media print
function PrintPageRenderer({ chunk, pageIndex, totalPages, orderCode, customerName, brightness }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    async function draw() {
      const canvas = await generateA4Sheet(chunk, pageIndex, totalPages, {
        orderCode,
        customerName,
        brightness
      });
      setDataUrl(canvas.toDataURL('image/jpeg', 0.98));
    }
    draw();
  }, [chunk, pageIndex, totalPages, orderCode, customerName, brightness]);

  if (!dataUrl) return null;
  return (
    <img
      src={dataUrl}
      alt="Folha A4 Impressão"
      style={{ width: '210mm', height: '297mm', display: 'block' }}
    />
  );
}
