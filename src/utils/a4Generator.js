import { jsPDF } from 'jspdf';

// Mathematical constants for 300 DPI A4 Print
export const A4_WIDTH_PX = 2480;  // 210mm at 300 DPI
export const A4_HEIGHT_PX = 3508; // 297mm at 300 DPI

export const BLOCK_SIZE_PX = 720; // 61mm x 61mm at 300 DPI
export const SAFE_SIZE_PX = 590;  // 50mm x 50mm at 300 DPI
export const SAFE_OFFSET_PX = Math.round((BLOCK_SIZE_PX - SAFE_SIZE_PX) / 2); // 65px on each side

export const COLS = 3;
export const ROWS = 4;
export const ITEMS_PER_PAGE = COLS * ROWS; // 12 units

export const GRID_WIDTH_PX = COLS * BLOCK_SIZE_PX;   // 2160px (183mm)
export const GRID_HEIGHT_PX = ROWS * BLOCK_SIZE_PX; // 2880px (244mm)

export const MARGIN_X_PX = Math.round((A4_WIDTH_PX - GRID_WIDTH_PX) / 2); // 160px (13.5mm)
export const MARGIN_Y_PX = Math.round((A4_HEIGHT_PX - GRID_HEIGHT_PX) / 2); // 314px (26.6mm)

// Helper to load an image into an HTMLImageElement
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Render a single 61mm x 61mm block at 300 DPI (720x720 px)
 * Layer 1: Blurred full background (61mm)
 * Layer 2: Centered sharp safe area (50mm)
 */
export async function renderMagnetBlock(item, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = BLOCK_SIZE_PX;
  canvas.height = BLOCK_SIZE_PX;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  try {
    const img = await loadImage(item.imageUrl || item.previewUrl || item.src);

    const zoom = item.zoom || 1;
    const panX = item.panX || 0;
    const panY = item.panY || 0;
    const blurAmount = (item.blur || 8) * 2.5; // Scale blur for 300 DPI

    // --- CAMADA 1: Fundo Borrado Total (61mm x 61mm / 720x720px) ---
    ctx.save();
    ctx.filter = `blur(${blurAmount}px)`;
    // Draw slightly scaled up to avoid edge fade from blur filter
    const bleedFactor = 1.08;
    const bW = BLOCK_SIZE_PX * bleedFactor;
    const bH = BLOCK_SIZE_PX * bleedFactor;
    const bOffset = (BLOCK_SIZE_PX - bW) / 2;
    ctx.drawImage(img, bOffset, bOffset, bW, bH);
    ctx.restore();

    // --- CAMADA 2: Frente Nítida Área Útil (50mm x 50mm / 590x590px) ---
    ctx.save();
    // Clip to safe area
    ctx.beginPath();
    // Subtle rounded corners for visualization or exact square
    ctx.rect(SAFE_OFFSET_PX, SAFE_OFFSET_PX, SAFE_SIZE_PX, SAFE_SIZE_PX);
    ctx.clip();

    // Compute aspect-ratio fill for safe area with user zoom & pan
    const imgAspect = img.width / img.height;
    let drawW, drawH;
    if (imgAspect > 1) {
      drawH = SAFE_SIZE_PX * zoom;
      drawW = drawH * imgAspect;
    } else {
      drawW = SAFE_SIZE_PX * zoom;
      drawH = drawW / imgAspect;
    }

    const drawX = SAFE_OFFSET_PX + (SAFE_SIZE_PX - drawW) / 2 + (panX * SAFE_SIZE_PX) / 100;
    const drawY = SAFE_OFFSET_PX + (SAFE_SIZE_PX - drawH) / 2 + (panY * SAFE_SIZE_PX) / 100;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    // Optional: Safe area dashed border line (for preview only, disabled by default in print)
    if (options.showSafeLines) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(SAFE_OFFSET_PX, SAFE_OFFSET_PX, SAFE_SIZE_PX, SAFE_SIZE_PX);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.strokeRect(SAFE_OFFSET_PX - 1, SAFE_OFFSET_PX - 1, SAFE_SIZE_PX + 2, SAFE_SIZE_PX + 2);
      ctx.restore();
    }
  } catch (err) {
    console.error('Error rendering block:', err);
    // Draw placeholder
    ctx.fillStyle = '#EAE1D7';
    ctx.fillRect(0, 0, BLOCK_SIZE_PX, BLOCK_SIZE_PX);
    ctx.fillStyle = '#6F4E37';
    ctx.font = '24px sans-serif';
    ctx.fillText('Erro na imagem', 50, BLOCK_SIZE_PX / 2);
  }

  return canvas;
}

/**
 * Generate full A4 sheet at 300 DPI (2480x3508 px) with 12 units and cutting marks
 */
export async function generateA4Sheet(itemsChunk, pageIndex = 0, totalPages = 1, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = A4_WIDTH_PX;
  canvas.height = A4_HEIGHT_PX;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Fill clean white A4 background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

  // 2. Render and place each block in 3x4 grid
  for (let i = 0; i < itemsChunk.length && i < ITEMS_PER_PAGE; i++) {
    const item = itemsChunk[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);

    const x = MARGIN_X_PX + col * BLOCK_SIZE_PX;
    const y = MARGIN_Y_PX + row * BLOCK_SIZE_PX;

    const blockCanvas = await renderMagnetBlock(item, options);
    ctx.drawImage(blockCanvas, x, y);
  }

  // 3. Draw high-precision cutting / alignment tick marks (Marcas de Corte)
  ctx.save();
  ctx.strokeStyle = '#1E1E1E';
  ctx.lineWidth = 1.5;

  const tickLen = 40; // Length of cutting ticks in pixels
  const tickGap = 8;  // Gap from the image boundary

  // Horizontal cut lines (5 lines: top, 3 inner, bottom)
  for (let r = 0; r <= ROWS; r++) {
    const y = MARGIN_Y_PX + r * BLOCK_SIZE_PX;
    // Left tick
    ctx.beginPath();
    ctx.moveTo(MARGIN_X_PX - tickGap - tickLen, y);
    ctx.lineTo(MARGIN_X_PX - tickGap, y);
    ctx.stroke();

    // Right tick
    ctx.beginPath();
    ctx.moveTo(MARGIN_X_PX + GRID_WIDTH_PX + tickGap, y);
    ctx.lineTo(MARGIN_X_PX + GRID_WIDTH_PX + tickGap + tickLen, y);
    ctx.stroke();
  }

  // Vertical cut lines (4 lines: left, 2 inner, right)
  for (let c = 0; c <= COLS; c++) {
    const x = MARGIN_X_PX + c * BLOCK_SIZE_PX;
    // Top tick
    ctx.beginPath();
    ctx.moveTo(x, MARGIN_Y_PX - tickGap - tickLen);
    ctx.lineTo(x, MARGIN_Y_PX - tickGap);
    ctx.stroke();

    // Bottom tick
    ctx.beginPath();
    ctx.moveTo(x, MARGIN_Y_PX + GRID_HEIGHT_PX + tickGap);
    ctx.lineTo(x, MARGIN_Y_PX + GRID_HEIGHT_PX + tickGap + tickLen);
    ctx.stroke();
  }

  // Interior crosshair ticks for razor-sharp alignment
  for (let r = 1; r < ROWS; r++) {
    for (let c = 1; c < COLS; c++) {
      const x = MARGIN_X_PX + c * BLOCK_SIZE_PX;
      const y = MARGIN_Y_PX + r * BLOCK_SIZE_PX;
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.lineTo(x + 12, y);
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
    }
  }

  // 4. Header & Footer metadata on sheet (outside print grid)
  ctx.fillStyle = '#666666';
  ctx.font = '26px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    `KM Personalizados | Bótons Ímãs 61x61mm (Área Útil 50x50mm) | Pedido: ${options.orderCode || 'N/A'}`,
    MARGIN_X_PX,
    MARGIN_Y_PX - 50
  );

  ctx.textAlign = 'right';
  ctx.fillText(
    `Página ${pageIndex + 1} de ${totalPages} | 300 DPI Real | 12 Unidades/Folha`,
    MARGIN_X_PX + GRID_WIDTH_PX,
    MARGIN_Y_PX - 50
  );

  ctx.restore();

  return canvas;
}

/**
 * Split items into chunks of 12 for multi-page print
 */
export function chunkItemsForA4(items) {
  const chunks = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
    chunks.push(items.slice(i, i + ITEMS_PER_PAGE));
  }
  return chunks.length ? chunks : [[]];
}

/**
 * Download single page as 300 DPI PNG
 */
export async function downloadSheetPNG(itemsChunk, pageIndex, totalPages, orderCode) {
  const canvas = await generateA4Sheet(itemsChunk, pageIndex, totalPages, { orderCode });
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = `Gabarito-A4-${orderCode || 'KM'}-Pagina-${pageIndex + 1}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Download all pages as high-resolution PDF
 */
export async function downloadAllPagesPDF(items, orderCode) {
  const chunks = chunkItemsForA4(items);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  for (let i = 0; i < chunks.length; i++) {
    if (i > 0) pdf.addPage('a4', 'portrait');

    const canvas = await generateA4Sheet(chunks[i], i, chunks.length, { orderCode });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    // A4 dimensions: 210 x 297 mm
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  pdf.save(`Gabarito-A4-${orderCode || 'KM-Personalizados'}.pdf`);
}
