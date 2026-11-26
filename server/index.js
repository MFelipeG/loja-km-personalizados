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
const JWT_SECRET = process.env.JWT_SECRET || 'km-personalizados-portugal-secret-2026';

// Ensure data and upload directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(rootDir, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const dbPath = path.join(dataDir, 'db.json');

// Initial database configuration focused on Portugal (€, CTT shipping, etc.)
const defaultDb = {
  settings: {
    storeName: 'KM Personalizados',
    domain: 'kmpersonalisados.art',
    siteUrl: 'https://kmpersonalisados.art',
    country: 'Portugal',
    currency: '€',
    whatsapp: '351965639401', // Official WhatsApp Portugal
    email: 'kmpersonalisados@gmail.com',
    instagram: 'https://www.instagram.com/km_personalisado?jplx=NzlqdWsxdXljcWw=',
    tiktok: 'https://www.tiktok.com/@km_personalizado?_r=1&_t=ZG-9Bcw9tWOna4',
    facebook: 'https://www.facebook.com/share/1CyF72n4wS/',
    productionDays: 2,
    shippingInfoText: 'Envios para todo Portugal Continental e Ilhas via CTT Correio Verde ou CTT Registado com rastreio, ou levantamento em cacifo InPost 24h. Embalagem reforçada anti-impacto para máxima proteção.',
    careInstructions: 'Limpe apenas com um pano macio e seco. Não utilize álcool ou produtos químicos abrasivos. Evite exposição direta e prolongada ao sol intenso.',
    googleSheetsCsvUrl: 'https://docs.google.com/spreadsheets/d/1e4iCyvMsLaz2zGzrW0mqcosvbHDLmhwdpnbuXzeoSxo/export?format=csv',
    kits: [
      {
        id: 'minimo-2',
        name: 'Pedido Mínimo (2 Bótons)',
        units: 2,
        price: 11.00,
        unitPrice: 5.50,
        originalPrice: 13.00,
        badge: 'Pedido Mínimo',
        highlight: false,
        description: 'Mínimo de 2 unidades por encomenda (5,50 € cada). Ideal para experimentar a qualidade do ateliê.'
      },
      {
        id: 'promo-inauguracao',
        name: 'Promoção de Inauguração (5 + 1 Grátis)',
        units: 6,
        chargeUnits: 5,
        price: 25.00,
        unitPrice: 4.17,
        originalPrice: 33.00,
        badge: '🎉 1 DE BRINDE (Mais Pedido)',
        highlight: true,
        description: 'Pague 5 unidades (25,00 €) e LEVE 1 DE BRINDE! Total de 6 bótons ímãs quadrados (limite de 1 combo por cliente/pedido).'
      },
      {
        id: 'kit-eventos',
        name: 'Kit Eventos (Mínimo 25 un.)',
        units: 25,
        price: 112.50,
        unitPrice: 4.50,
        originalPrice: 137.50,
        badge: 'FESTAS & LEMBRANCINHAS',
        highlight: false,
        description: 'Preços especiais por quantidade a partir de 25 unidades para aniversários, casamentos e empresas.'
      }
    ],
    shippingMethods: [
      { id: 'ctt-verde', name: 'CTT Correio Verde (Almofadada)', fee: 2.70, days: 2, desc: 'Económico e rápido para Portugal Continental e Ilhas' },
      { id: 'ctt-registado', name: 'CTT Correio Registado (Com Rastreio)', fee: 3.20, days: 1, desc: 'Entrega segura em mão com código de rastreio oficial CTT' },
      { id: 'inpost-locker', name: 'InPost (Cacifo Automático 24h)', fee: 3.85, days: 3, desc: 'Levantamento cómodo a qualquer hora num cacifo perto de si' },
      { id: 'levantamento-local', name: 'Levantamento em Mãos', fee: 0.00, days: 1, desc: 'Grátis - Combinar entrega local diretamente no WhatsApp' }
    ],
    upcomingProducts: [
      { id: 'botons-redondos', title: 'Bótons Redondos Clássicos', description: 'O clássico bóton americano com alfinete de segurança e acabamento espelhado.', icon: 'Circle' },
      { id: 'chaveiros-acrilico', title: 'Chaveiros Acrílicos com Foto', description: 'Chaveiros transparentes em acrílico resistente com a sua foto frente e verso.', icon: 'Key' },
      { id: 'imas-polaroid', title: 'Ímãs Estilo Polaroid Vintage', description: 'Ímãs retangulares com borda branca retrô e legenda personalizada.', icon: 'Camera' }
    ]
  },
  admin: {
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  orders: [],
  reviews: [
    {
      id: 'rev-1',
      name: 'Joana Ferreira',
      rating: 5,
      comment: 'Ficaram espetaculares no nosso frigorífico! As cores são super vivas e a borda borrada fica super profissional, não cortou nada das fotos dos meus filhos.',
      photoUrl: '/assets/sample-family.jpg',
      status: 'approved',
      createdAt: '2026-11-18T14:20:00Z'
    },
    {
      id: 'rev-2',
      name: 'Tiago Mendes',
      rating: 5,
      comment: 'Aproveitei a promoção de inauguração de 5+1 de brinde. Chegou rápido via CTT Registado e muito bem embalado com plástico bolha. Recomendo!',
      photoUrl: '/assets/sample-couple.jpg',
      status: 'approved',
      createdAt: '2026-11-20T10:15:00Z'
    },
    {
      id: 'rev-3',
      name: 'Inês Albuquerque',
      rating: 5,
      comment: 'O ímã tem uma força excelente, não desliza no frigorífico de forma alguma. O atendimento no WhatsApp foi cinco estrelas!',
      photoUrl: '/assets/sample-pet.jpg',
      status: 'approved',
      createdAt: '2026-11-21T18:40:00Z'
    }
  ]
};

// Reset/Update db.json if needed with Portugal defaults
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
} else {
  try {
    const existing = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    existing.settings = { ...defaultDb.settings, ...existing.settings };
    existing.settings.whatsapp = '351965639401';
    existing.settings.email = 'kmpersonalisados@gmail.com';
    existing.settings.currency = '€';
    existing.settings.googleSheetsCsvUrl = defaultDb.settings.googleSheetsCsvUrl;
    existing.settings.kits = defaultDb.settings.kits;
    existing.settings.shippingMethods = defaultDb.settings.shippingMethods;
    fs.writeFileSync(dbPath, JSON.stringify(existing, null, 2), 'utf-8');
  } catch {}
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
      scriptSrc: ["'self'", "'unsafe-inline'", "https:", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "https://images.unsplash.com", "https://kmpersonalisados.art", "https://*.google-analytics.com", "https://*.googletagmanager.com"],
      connectSrc: ["'self'", "https://kmpersonalisados.art", "https://docs.google.com", "https://sheets.googleapis.com", "https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.googletagmanager.com", "data:", "blob:"],
      frameSrc: ["'self'", "https://www.googletagmanager.com"],
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
// Serve public assets statically (logo, banner, sample photos)
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
    country: db.settings.country || 'Portugal',
    currency: db.settings.currency || '€',
    whatsapp: db.settings.whatsapp || '351965639401',
    email: db.settings.email || 'kmpersonalisados@gmail.com',
    instagram: db.settings.instagram,
    tiktok: db.settings.tiktok,
    facebook: db.settings.facebook,
    domain: db.settings.domain,
    siteUrl: db.settings.siteUrl,
    productionDays: db.settings.productionDays,
    shippingInfoText: db.settings.shippingInfoText,
    careInstructions: db.settings.careInstructions,
    googleSheetsCsvUrl: db.settings.googleSheetsCsvUrl,
    googleAnalyticsId: db.settings.googleAnalyticsId || 'GTM-NLJPFJV8',
    kits: db.settings.kits,
    shippingMethods: db.settings.shippingMethods,
    upcomingProducts: db.settings.upcomingProducts
  });
});

// 2. Settings (Admin Update)
app.put('/api/admin/settings', authAdmin, (req, res) => {
  const db = getDb();
  const {
    whatsapp,
    email,
    instagram,
    tiktok,
    facebook,
    productionDays,
    shippingInfoText,
    careInstructions,
    googleSheetsCsvUrl,
    googleAnalyticsId,
    kits,
    shippingMethods,
    newUsername,
    newPassword
  } = req.body;

  if (whatsapp !== undefined) db.settings.whatsapp = sanitizeText(whatsapp);
  if (email !== undefined) db.settings.email = sanitizeText(email);
  if (instagram !== undefined) db.settings.instagram = instagram.trim();
  if (tiktok !== undefined) db.settings.tiktok = tiktok.trim();
  if (facebook !== undefined) db.settings.facebook = facebook.trim();
  if (productionDays !== undefined) db.settings.productionDays = Number(productionDays) || 2;
  if (shippingInfoText !== undefined) db.settings.shippingInfoText = sanitizeText(shippingInfoText);
  if (careInstructions !== undefined) db.settings.careInstructions = sanitizeText(careInstructions);
  if (googleSheetsCsvUrl !== undefined) db.settings.googleSheetsCsvUrl = googleSheetsCsvUrl.trim();
  if (googleAnalyticsId !== undefined) db.settings.googleAnalyticsId = googleAnalyticsId.trim();
  if (Array.isArray(kits)) db.settings.kits = kits;
  if (Array.isArray(shippingMethods)) db.settings.shippingMethods = shippingMethods;

  if (newUsername && newUsername.trim()) {
    db.admin.username = sanitizeText(newUsername);
  }
  if (newPassword && newPassword.length >= 6) {
    db.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  }

  saveDb(db);
  res.json({ success: true, settings: db.settings, adminUser: db.admin.username });
});

// 3. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  if (username !== db.admin.username) {
    return res.status(401).json({ error: 'Utilizador ou palavra-passe incorretos.' });
  }

  const isMatch = bcrypt.compareSync(password || '', db.admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Utilizador ou palavra-passe incorretos.' });
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
      items
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
      kitName: kitName || `${items.length} Bótons Ímãs`,
      quantity: Number(quantity) || items.length,
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      shippingType: sanitizeText(shippingType) || 'CTT Correio Verde',
      estimatedDays: Number(estimatedDays) || db.settings.productionDays || 2,
      total: (Number(subtotal) || 0) + (Number(shippingFee) || 0),
      currency: '€',
      address: address ? {
        postalCode: sanitizeText(address.postalCode || address.cep),
        street: sanitizeText(address.street),
        number: sanitizeText(address.number),
        concelho: sanitizeText(address.concelho || address.neighborhood),
        district: sanitizeText(address.district || address.city),
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
      status: 'Pendente',
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
    res.status(500).json({ error: 'Erro ao registar encomenda.' });
  }
});

// 7. Orders: Track Order by Code (Public)
app.get('/api/orders/:code', (req, res) => {
  const rawCode = req.params.code.trim();
  const cleanCode = rawCode.startsWith('#') ? rawCode : `#${rawCode}`;
  const db = getDb();

  const order = db.orders.find(o => o.code.toUpperCase() === cleanCode.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Encomenda não encontrada. Verifique o código digitado.' });
  }

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
    currency: '€',
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
    return res.status(404).json({ error: 'Encomenda não encontrada.' });
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
    return res.status(404).json({ error: 'Encomenda não encontrada.' });
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
      return res.status(400).json({ error: 'Preencha o seu nome, classificação e comentário.' });
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newReview = {
      id: `rev_${Date.now()}`,
      name: sanitizeText(name),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: sanitizeText(comment),
      photoUrl,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newReview);
    saveDb(db);

    res.json({
      success: true,
      message: 'Obrigado pela sua avaliação! Ela será publicada após validação da nossa equipa.'
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

// 16. Portugal CTT & Google Sheets Shipping Calculator
app.get('/api/shipping/calculate', async (req, res) => {
  const { postalCode, methodId } = req.query;
  const db = getDb();
  const methods = db.settings.shippingMethods || [];

  // Default method if none chosen: CTT Correio Verde (2,70 €)
  let chosenMethod = methods.find(m => m.id === methodId) || methods[0];

  res.json({
    found: true,
    currency: '€',
    fee: chosenMethod.fee,
    days: chosenMethod.days,
    methodName: chosenMethod.name,
    desc: chosenMethod.desc,
    availableMethods: methods
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
  console.log(`✨ Servidor KM Personalizados Portugal rodando na porta ${PORT}`);
});
