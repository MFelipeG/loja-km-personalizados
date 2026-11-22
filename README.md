# KM Personalizados - Loja Oficial & Estúdio Web-to-Print

Site oficial e ateliê digital da **KM Personalizados**, especializado em **Bótons Ímãs Quadrados de Fotos** de alta qualidade, com arquitetura modular preparada para expansão de novos produtos personalizados.

![KM Personalizados Banner](public/assets/banner-km.jpg)

## ✨ Principais Funcionalidades

### 1. 🛡️ Segurança & Arquitetura (CSP & Proteção)
- **Content Security Policy (CSP)** rígida nos cabeçalhos HTTP e meta tags.
- Cabeçalhos de segurança avançados: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
- Validação estrita de uploads (apenas `image/jpeg`, `image/png`, `image/webp`), sanitização de nomes de arquivos e proteção contra XSS nos formulários.
- **Fricção Zero:** Clientes compram e avaliam sem exigência de login ou cadastro.
- **Área Administrativa Segura (`/admin`):** Protegida por senha/usuário criptografados com `bcrypt` e tokens de sessão.

### 2. 🧲 Estúdio de Mockup 3D Interativo (Tecnologia 2 Camadas)
- **Upload Múltiplo:** Envio simultâneo de várias fotos pelo celular ou computador.
- **Verificador Automático de Qualidade:**
  - 🟢 **Selo Verde (Qualidade Excelente):** Resolução recomendada (>= 600px).
  - 🟡 **Selo Amarelo (Resolução Baixa):** Alerta discreto sobre possível perda de nitidez na impressão.
- **Composição em Duas Camadas:**
  - **Camada Externa (6,1 cm x 6,1 cm / 61 mm):** Preenchida com a foto em desfoque suave (*blur*), cobrindo toda a borda de dobra na prensa manual sem faixas brancas.
  - **Camada Frontal Segura (5,0 cm x 5,0 cm / 50 mm):** Centralizada e 100% nítida, preservando rostos e momentos sem perda de detalhes durante a dobra.
- **Simulador Realista 3D:** Efeito tátil de relevo magnético, brilho de laminação e inclinação interativa (*tilt*) em um mural/geladeira.
- **Barra de Progresso Dinâmica:** Informa quantas unidades faltam para fechar o próximo kit promocional (ex: 6, 12 ou 24 unidades).

### 3. 📄 Motor de Impressão Automática A4 (Substituto do Canva)
- **Cálculo Matemático Exato a 300 DPI:**
  - Folha A4: **210 mm x 297 mm** (2480 px x 3508 px a 300 DPI).
  - Bloco de cada bóton: **61 mm x 61 mm** (720 px x 720 px a 300 DPI) com fundo borrado e arte frontal de 50 mm centralizada.
  - Grade otimizada: **12 unidades por folha A4** (3 colunas x 4 linhas = 183 mm x 244 mm ocupados).
  - Centralização milimétrica e **marcas de corte (cruzetas e ticks)** para alinhamento rápido com régua ou guilhotina.
  - Suporte automático a múltiplas páginas para pedidos maiores que 12 unidades.
- **Ações no Painel Admin:**
  - 👁️ Visualizar Folha A4
  - 🖼️ Baixar PNG em 300 DPI Real
  - 📑 Baixar PDF pronto para gráfica
  - 🖨️ Imprimir Direto (com `@media print` em escala 100%).

### 4. 🚚 Cálculo de Frete via Google Sheets & Fechamento WhatsApp
- **Integração CSV:** Campo no painel `/admin` para inserir o link do CSV publicado do Google Sheets.
- **Consulta em Tempo Real:** Cálculo por CEP ou Cidade/Bairro.
- **Código Único `#BOT-XXXX`:**
  - O pedido e as imagens em alta resolução são gravados no servidor vinculados ao código do pedido antes de abrir o WhatsApp.
  - Mensagem profissional pré-preenchida no WhatsApp (`wa.me`) com código, quantidade, subtotal, frete calculado e valor total.
- **Rastreio Simples Sem Login:** Aba *"Acompanhar Pedido"* onde o cliente digita `#BOT-XXXX` e visualiza o status e as fotos do pedido.

### 5. ⭐ Depoimentos & Prova Social
- Seção *"Quem Já Recebeu e Amou"* com nota média, depoimentos e fotos reais de clientes.
- Envio direto de avaliações com fotos pelo cliente, entrando com status pendente para moderação no painel administrativo.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- npm

### Instalação
```bash
git clone https://github.com/MFelipeG/loja-km-personalizados.git
cd loja-km-personalizados
npm install
```

### Modo de Desenvolvimento
Para rodar o servidor backend e o Vite em paralelo:
```bash
# Terminal 1: Iniciar servidor backend (API & Uploads)
npm run server

# Terminal 2: Iniciar frontend Vite
npm run dev
```

Acesse no navegador: `http://localhost:5173`

### Build para Produção & Execução
```bash
npm run build
npm start
```

Acesse em produção: `http://localhost:5000`

---

## 🔒 Acesso Administrativo
- URL: Acesse pelo ícone de cadeado no cabeçalho ou adicione `#admin` na URL do site.
- **Usuário padrão:** `admin`
- **Senha padrão:** `admin123` (pode ser alterada na aba Configurações do painel).

---

## 📱 Redes Sociais Oficiais
- **Instagram:** [@km_personalisado](https://www.instagram.com/km_personalisado?jplx=NzlqdWsxdXljcWw=)
- **TikTok:** [@km_personalizado](https://www.tiktok.com/@km_personalizado?_r=1&_t=ZG-9Bcw9tWOna4)
