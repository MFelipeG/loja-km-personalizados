import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'km-personalizados-super-secret-key-2026';

// Ensure data and upload directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(rootDir, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const dbPath = path.join(dataDir, 'db.json');

// Initialize database if not exists
const defaultDb = {
  settings: {
    storeName: 'KM Personalizados',
    whatsapp: '5541999999999', // Default WhatsApp number (editable in Admin)
    instagram: 'https://www.instagram.com/km_personalisado?jplx=NzlqdWsxdXljcWw=',
    tiktok: 'https://www.tiktok.com/@km_personalizado?_r=1&_t=ZG-9Bcw9tWOna4',
    productionDays: 3,
    shippingInfoText: 'Enviamos para todo o Brasil via Correios (PAC/Sedex) ou Motoboy local. Embalagem reforçada anti-impacto para garantir que seus ímãs cheguem impecáveis!',
    careInstructions: 'Limpe apenas com pano seco ou levemente umedecido em água. Não use álcool nem produtos abrasivos. Evite exposição prolongada ao sol intenso.',
    googleSheetsCsvUrl: '',
    kits: [
      { id: 'avulso', name: 'Avulso', units: 1, price: 6.00, originalPrice: 8.00, badge: 'Para experimentar', highlight: false },
      { id: 'kit-6', name: 'Kit 6 Unidades', units: 6, price: 27.00, originalPrice: 36.00, badge: 'Popular', highlight: false },
      { id: 'kit-12', name: 'Kit 12 Unidades (Folha Inteira)', units: 12, price: 48.00, originalPrice: 72.00, badge: 'Mais Vendido ⭐', highlight: true },
      { id: 'kit-24', name: 'Kit 24 Unidades (2 Folhas)', units: 24, price: 89.00, originalPrice: 144.00, badge: 'Melhor Custo-Benefício 🚀', highlight: false }
    ],
    upcomingProducts: [
      { id: 'botons-redondos', title: 'Bótons Redondos Clássicos', description: 'O clássico bóton americano com alfinete de segurança e acabamento espelhado.', icon: 'Circle' },
      { id: 'chaveiros-acrilico', title: 'Chaveiros Acrílicos Foto', description: 'Chaveiros transparentes em acrílico resistente com sua foto frente e verso.', icon: 'Key' },
      { id: 'imas-polaroid', title: 'Ímãs Estilo Polaroid Vintage', description: 'Ímãs retangulares com borda branca retrô e legenda personalizada.', icon: 'Camera' }
    ]
  },
  admin: {
    username: 'admin',
    // Hash for 'admin123'
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  orders: [],
  reviews: [
    {
      id: 'rev-1',
      name: 'Mariana Silva',
      rating: 5,
      comment: 'Ficaram perfeitos na minha geladeira! A qualidade da foto e o brilho do acabamento são surreais. Já vou pedir mais para presentear minha mãe.',
      photoUrl: '/assets/logo-km.jpg',
      status: 'approved',
      createdAt: '2026-11-15T14:20:00Z'
    },
    {
      id: 'rev-2',
      name: 'Carlos Eduardo',
      rating: 5,
      comment: 'Chegou super rápido e muito bem embalado. O ímã tem uma força excelente, não escorrega de jeito nenhum. Recomendo de olhos fechados!',
      photoUrl: null,
      status: 'approved',
      createdAt: '2026-11-18T10:15:00Z'
    },
    {
      id: 'rev-3',
      name: 'Beatriz Santos',
      rating: 5,
      comment: 'Amei a borda borrada! Nenhuma foto cortou rosto ou detalhes importantes. Atendimento pelo WhatsApp nota 1000!',
      photoUrl: null,
      status: 'approved',
      createdAt: '2026-11-20T18:40:00Z'
    }
  ]
};

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
}

function getDb() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return defaultDb;
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Security Middlewares (Strict CSP & Headers)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://docs.google.com", "https://sheets.googleapis.com", "data:", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));
// Serve public assets statically (logo, banner)
app.use('/assets', express.static(path.join(rootDir, 'public', 'assets')));

// Helper to sanitize text (anti-XSS)
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Multer Storage Configuration with strict validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato inválido. Apenas imagens JPEG, PNG e WEBP são permitidas.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Admin Auth Middleware
function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Faça login primeiro.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
}

// ======================== API ROUTES ========================

// 1. Settings (Public Read)
app.get('/api/settings', (req, res) => {
  const db = getDb();
  res.json({
    storeName: db.settings.storeName,
    whatsapp: db.settings.whatsapp,
    instagram: db.settings.instagram,
    tiktok: db.settings.tiktok,
    productionDays: db.settings.productionDays,
    shippingInfoText: db.settings.shippingInfoText,
    careInstructions: db.settings.careInstructions,
    googleSheetsCsvUrl: db.settings.googleSheetsCsvUrl,
    kits: db.settings.kits,
    upcomingProducts: db.settings.upcomingProducts
  });
});

// 2. Settings (Admin Update)
app.put('/api/admin/settings', authAdmin, (req, res) => {
  const db = getDb();
  const {
    whatsapp,
    productionDays,
    shippingInfoText,
    careInstructions,
    googleSheetsCsvUrl,
    kits,
    newPassword
  } = req.body;

  if (whatsapp !== undefined) db.settings.whatsapp = sanitizeText(whatsapp);
  if (productionDays !== undefined) db.settings.productionDays = Number(productionDays) || 3;
  if (shippingInfoText !== undefined) db.settings.shippingInfoText = sanitizeText(shippingInfoText);
  if (careInstructions !== undefined) db.settings.careInstructions = sanitizeText(careInstructions);
  if (googleSheetsCsvUrl !== undefined) db.settings.googleSheetsCsvUrl = googleSheetsCsvUrl.trim();
  if (Array.isArray(kits)) db.settings.kits = kits;

  if (newPassword && newPassword.length >= 6) {
    db.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  }

  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

// 3. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  if (username !== db.admin.username) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
  }

  const isMatch = bcrypt.compareSync(password || '', db.admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
  }

  const token = jwt.sign({ username: db.admin.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, username: db.admin.username });
});

// 4. Admin Verify Session
app.get('/api/admin/me', authAdmin, (req, res) => {
  res.json({ success: true, user: req.adminUser });
});

// 5. Image Upload Endpoint
app.post('/api/upload', upload.array('photos', 50), (req, res) => {
  try {
    const files = req.files || [];
    const urls = files.map(f => `/uploads/${f.filename}`);
    res.json({ success: true, urls });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Orders: Create Order (No login required, generates #BOT-XXXX)
app.post('/api/orders', (req, res) => {
  try {
    const db = getDb();
    const {
      customerName,
      customerPhone,
      kitId,
      kitName,
      quantity,
      subtotal,
      shippingFee,
      shippingType,
      estimatedDays,
      address,
      items // Array of processed photos with crop/blur metadata and image URLs / base64
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Nenhum item adicionado ao pedido.' });
    }

    // Generate unique code #BOT-XXXX
    let code;
    let attempts = 0;
    do {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      code = `#BOT-${randNum}`;
      attempts++;
    } while (db.orders.some(o => o.code === code) && attempts < 100);

    const newOrder = {
      id: `ord_${Date.now()}`,
      code,
      customerName: sanitizeText(customerName) || 'Cliente',
      customerPhone: sanitizeText(customerPhone) || '',
      kitId: kitId || 'personalizado',
      kitName: kitName || `${items.length} Unidades`,
      quantity: Number(quantity) || items.length,
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      shippingType: sanitizeText(shippingType) || 'Entrega',
      estimatedDays: Number(estimatedDays) || db.settings.productionDays || 3,
      total: (Number(subtotal) || 0) + (Number(shippingFee) || 0),
      address: address ? {
        cep: sanitizeText(address.cep),
        street: sanitizeText(address.street),
        number: sanitizeText(address.number),
        neighborhood: sanitizeText(address.neighborhood),
        city: sanitizeText(address.city),
        state: sanitizeText(address.state),
        complement: sanitizeText(address.complement)
      } : null,
      items: items.map((it, idx) => ({
        index: idx + 1,
        imageUrl: it.imageUrl || it.url || it.src,
        previewUrl: it.previewUrl || it.imageUrl || it.url,
        zoom: it.zoom || 1,
        panX: it.panX || 0,
        panY: it.panY || 0,
        blur: it.blur || 8,
        resolution: it.resolution || null,
        qualityBadge: it.qualityBadge || 'good'
      })),
      status: 'Pendente', // Pendente, Em Produção, Pronto, Enviado, Concluído
      statusHistory: [
        { status: 'Pendente', date: new Date().toISOString(), note: 'Pedido criado no site' }
      ],
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    saveDb(db);

    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Erro ao registrar pedido.' });
  }
});

// 7. Orders: Track Order by Code (Public)
app.get('/api/orders/:code', (req, res) => {
  const rawCode = req.params.code.trim();
  const cleanCode = rawCode.startsWith('#') ? rawCode : `#${rawCode}`;
  const db = getDb();

  const order = db.orders.find(o => o.code.toUpperCase() === cleanCode.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado. Verifique o código digitado.' });
  }

  // Return public safe view of order
  res.json({
    code: order.code,
    customerName: order.customerName,
    kitName: order.kitName,
    quantity: order.quantity,
    status: order.status,
    statusHistory: order.statusHistory,
    total: order.total,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    createdAt: order.createdAt,
    itemsCount: order.items.length,
    items: order.items.map(it => ({
      previewUrl: it.previewUrl || it.imageUrl,
      qualityBadge: it.qualityBadge
    }))
  });
});

// 8. Orders: Admin List & Search
app.get('/api/admin/orders', authAdmin, (req, res) => {
  const db = getDb();
  res.json(db.orders);
});

// 9. Orders: Admin Update Status
app.patch('/api/admin/orders/:code/status', authAdmin, (req, res) => {
  const { status, note } = req.body;
  const db = getDb();
  const order = db.orders.find(o => o.code.toUpperCase() === req.params.code.toUpperCase());

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  const validStatuses = ['Pendente', 'Em Produção', 'Pronto', 'Enviado', 'Concluído', 'Cancelado'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  order.status = status;
  order.statusHistory.push({
    status,
    date: new Date().toISOString(),
    note: sanitizeText(note) || `Status alterado para ${status}`
  });

  saveDb(db);
  res.json({ success: true, order });
});

// 10. Orders: Admin Delete Order
app.delete('/api/admin/orders/:code', authAdmin, (req, res) => {
  const db = getDb();
  const initialLen = db.orders.length;
  db.orders = db.orders.filter(o => o.code.toUpperCase() !== req.params.code.toUpperCase());

  if (db.orders.length === initialLen) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  saveDb(db);
  res.json({ success: true });
});

// 11. Reviews: Submit Review (Public, enters as pending)
app.post('/api/reviews', upload.single('photo'), (req, res) => {
  try {
    const db = getDb();
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Preencha nome, avaliação e seu comentário.' });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newReview = {
      id: `rev_${Date.now()}`,
      name: sanitizeText(name),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: sanitizeText(comment),
      photoUrl,
      status: 'pending', // Moderation required
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newReview);
    saveDb(db);

    res.json({
      success: true,
      message: 'Obrigado por sua avaliação! Ela será publicada após a aprovação da nossa equipe.'
    });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ error: 'Erro ao enviar avaliação.' });
  }
});

// 12. Reviews: Public Approved Reviews
app.get('/api/reviews', (req, res) => {
  const db = getDb();
  const approved = db.reviews.filter(r => r.status === 'approved');
  res.json(approved);
});

// 13. Reviews: Admin List All (Pending + Approved)
app.get('/api/admin/reviews', authAdmin, (req, res) => {
  const db = getDb();
  res.json(db.reviews);
});

// 14. Reviews: Admin Moderate Review
app.patch('/api/admin/reviews/:id/status', authAdmin, (req, res) => {
  const { status } = req.body;
  const db = getDb();
  const review = db.reviews.find(r => r.id === req.params.id);

  if (!review) {
    return res.status(404).json({ error: 'Avaliação não encontrada.' });
  }

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }

  review.status = status;
  saveDb(db);
  res.json({ success: true, review });
});

// 15. Reviews: Admin Delete Review
app.delete('/api/admin/reviews/:id', authAdmin, (req, res) => {
  const db = getDb();
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

// 16. Google Sheets Shipping Proxy & Fallback
app.get('/api/shipping/calculate', async (req, res) => {
  const { cep, city, neighborhood } = req.query;
  const db = getDb();
  const sheetUrl = db.settings.googleSheetsCsvUrl;

  try {
    if (sheetUrl && sheetUrl.startsWith('http')) {
      // Fetch CSV from published Google Sheets link
      const response = await fetch(sheetUrl);
      if (response.ok) {
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const rows = parsed.data || [];

        // Match by CEP prefix or City/Neighborhood
        const cleanCep = (cep || '').replace(/\D/g, '');
        let matched = null;

        for (const row of rows) {
          const rowCep = String(row.cep || row.CEP || '').replace(/\D/g, '');
          const rowCity = String(row.cidade || row.Cidade || '').toLowerCase().trim();
          const rowNeigh = String(row.bairro || row.Bairro || '').toLowerCase().trim();

          if (cleanCep && rowCep && cleanCep.startsWith(rowCep.substring(0, 5))) {
            matched = row;
            break;
          }

          if (city && rowCity && city.toLowerCase().trim().includes(rowCity)) {
            if (!neighborhood || !rowNeigh || neighborhood.toLowerCase().trim().includes(rowNeigh)) {
              matched = row;
              break;
            }
          }
        }

        if (matched) {
          const fee = parseFloat(String(matched.valor || matched.preco || matched.taxa || matched.Frete || '0').replace(',', '.'));
          const days = parseInt(matched.prazo || matched.dias || '3', 10);
          return res.json({
            found: true,
            fee: isNaN(fee) ? 15.00 : fee,
            days: isNaN(days) ? 3 : days,
            source: 'sheets',
            region: matched.regiao || matched.cidade || matched.bairro || 'Local'
          });
        }
      }
    }
  } catch (err) {
    console.warn('Google Sheets fetch warning:', err.message);
  }

  // Graceful fallback calculator if Google Sheets is not configured or query not found
  const cleanCep = (cep || '').replace(/\D/g, '');
  let fee = 14.90;
  let days = 4;
  let region = 'Envio Padrão';

  if (cleanCep.length === 8) {
    const firstDigit = cleanCep[0];
    if (firstDigit === '8' || firstDigit === '9') {
      // Sul
      fee = 12.90;
      days = 3;
      region = 'Região Sul (Expresso)';
    } else if (firstDigit === '0' || firstDigit === '1' || firstDigit === '2' || firstDigit === '3') {
      // SP/RJ/MG
      fee = 16.50;
      days = 5;
      region = 'Sudeste';
    } else {
      fee = 22.00;
      days = 7;
      region = 'Nacional';
    }
  }

  res.json({
    found: true,
    fee,
    days,
    source: sheetUrl ? 'fallback' : 'default',
    region
  });
});

// Production fallback: serve built client
const distPath = path.join(rootDir, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`✨ Servidor KM Personalizados rodando na porta ${PORT}`);
});
