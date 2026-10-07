const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { marked } = require('marked');
const initSqlJs = require('sql.js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isVercel = process.env.VERCEL === '1';
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const UPLOAD_DIR = path.join(ROOT_DIR, 'uploads');
const DB_PATH = path.join(DATA_DIR, 'portfolio.sqlite');
const PHOTO_PATH = path.join(ROOT_DIR, 'assets', 'WhatsApp Image 2026-09-30 at 17.56.40.jpeg');

if (!isVercel) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const projectData = {
  riftkv: {
    slug: 'riftkv',
    name: 'RiftKV',
    tagline: 'A Redis-inspired key-value store in Go built around protocol parsing, storage logic, and concurrency.',
    stack: ['Go', 'TCP', 'RESP', 'Concurrency', 'Distributed Systems'],
    github: 'https://github.com/utkarshbhola/RiftKV',
    live: null,
    overview: 'RiftKV is a backend systems project designed to make the internals of a key-value store tangible: protocol handling, memory management, concurrent access, and TTL behavior. It was built to understand how a small but reliable data service works at a lower level than a typical application project.',
    architecture: 'The project uses a lightweight TCP listener to accept client connections, parses RESP-formatted commands, and routes each command to an in-memory store. The server deals with key creation, deletion, existence checks, expiration, and command responses while keeping access predictable under concurrency.',
    details: 'The interesting work here is in the boundary between the network layer and the data layer: parsing command frames, handling client requests cleanly, and making sure state is consistent under multiple concurrent readers and writers. The store uses a mutex-based guard for access control and a background expiration routine to clean stale keys without interfering with normal command execution.',
    challenges: 'The main challenge was learning how a small system still needs to be robust under concurrent access and time-based invalidation. Making command handling predictable while cleaning expired entries in the background required careful attention to correctness and how state changes propagate throughout the store.',
    lessons: 'This project reinforced the value of clear system boundaries, careful command validation, and incremental complexity. It also made the trade-offs around synchronization and expiration much more concrete than they are in application code alone.'
  },
  herald: {
    slug: 'herald',
    name: 'Herald',
    tagline: 'A backend/infrastructure project focused on event-driven notifications and clear operational flows.',
    stack: ['Backend', 'Infrastructure', 'APIs', 'Distributed Systems'],
    github: 'https://github.com/utkarshbhola/Herald',
    live: null,
    overview: 'Herald is one of the infrastructure-oriented projects in this portfolio. It focuses on how notifications and event-driven workflows can be structured in a way that is operationally clear and easy to reason about.',
    architecture: 'The project centers around a backend flow for creating, routing, and tracking notification events. The design emphasizes explicit message flow, service boundaries, and clear processing responsibilities so the system stays manageable as it grows.',
    details: 'The engineering value in Herald comes from the way it structures communication between services and the operational lifecycle of messages. It moves beyond “send a notification” into the underlying thinking around reliable delivery, event handling, and maintainable backend patterns.',
    challenges: 'The main challenge was balancing flexibility with operational clarity. A notification system can quickly become a blur of edge cases, so keeping the architecture disciplined mattered more than adding more features early.',
    lessons: 'This project reinforced how backend design often depends less on novelty and more on making the actual data flow and failure modes understandable to the team.'
  },
  skald: {
    slug: 'skald',
    name: 'Skald',
    tagline: 'A backend/infrastructure system centered on workflow orchestration, processing, and reliable service interactions.',
    stack: ['Backend', 'Systems', 'APIs', 'Infrastructure'],
    github: 'https://github.com/utkarshbhola/Skald',
    live: null,
    overview: 'Skald is another infrastructure-focused project designed around structured processing and reliable system interaction. It reflects the kind of backend work that matters when multiple moving parts need to remain understandable and resilient.',
    architecture: 'The project uses explicit backend flows to move work through stages, process inputs in a controlled way, and keep service interactions measurable and manageable. The architecture is oriented around clean boundaries, which makes it easier to debug and extend as requirements evolve.',
    details: 'Skald is a useful example of backend engineering where the real challenge is not the flashiest feature but the stability of the interaction model. The implementation aims to keep pipeline logic coherent and avoid making system complexity hidden in one large surface area.',
    challenges: 'The primary difficulty was managing complexity without collapsing into brittle coupling. The goal was to make each layer responsible for a clear job while keeping the cross-service flow understandable and maintainable.',
    lessons: 'The project strengthened my understanding of how infrastructure work often lives in the discipline of boundaries, orchestration, and observability rather than in the underlying language itself.'
  },
  webhook: {
    slug: 'webhook',
    name: 'Webhook',
    tagline: 'A secure webhook ingestion service built around verification, storage, and operational clarity.',
    stack: ['Python', 'FastAPI', 'Webhooks', 'REST', 'Backend'],
    github: 'https://github.com/utkarshbhola/Webhook-Ingestion-Analytics-Service',
    live: null,
    overview: 'Webhook is a backend project focused on receiving third-party events safely and processing them in a structured way. It was built to think through the practical concerns of webhook ingestion: verification, idempotency, and operational safety.',
    architecture: 'The service receives HTTP requests, validates the payload, verifies signatures, and records the event in a way that supports later inspection and processing. The design keeps the ingestion path separate from downstream processing so there is a clear, testable boundary between receiving and acting on events.',
    details: 'The important engineering decisions in this project were around security and reliability. Verifying payload integrity, handling replay risk, and making the webhook intake pipeline observable are all fundamental concerns in real event-driven systems.',
    challenges: 'The hardest part was making the intake process safe without making it fragile. A webhook system can fail in subtle ways if verification or deduplication are handled poorly, so correctness and auditing matter as much as throughput.',
    lessons: 'This project sharpened my thinking around event-driven architecture and how much care is required when third-party systems push data into your environment.'
  }
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const sqlInit = async () => {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(path.dirname(require.resolve('sql.js')), file)
  });
  let db;
  if (fs.existsSync(DB_PATH)) {
    const binary = fs.readFileSync(DB_PATH);
    db = new SQL.Database(binary);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      author TEXT DEFAULT 'Utkarsh Bhola',
      tags TEXT DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      featured INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON posts(status, published_at DESC);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);`);
  if (!isVercel) saveDb(db);
  return db;
};

const saveDb = (db) => {
  if (isVercel) {
    throw new Error('SQLite file persistence is unavailable on Vercel. Configure durable storage before enabling CMS writes.');
  }
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

let db;
async function bootstrapDatabase() {
  db = await sqlInit();
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-please';
const SESSION_SECRET = process.env.SESSION_SECRET || 'portfolio-session-secret';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET)) {
  throw new Error('Production requires ADMIN_USERNAME, ADMIN_PASSWORD, and SESSION_SECRET environment variables.');
}

if (isProduction && (ADMIN_PASSWORD.length < 12 || SESSION_SECRET.length < 32)) {
  throw new Error('Production ADMIN_PASSWORD must be at least 12 characters and SESSION_SECRET at least 32 characters.');
}

const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 12);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/assets', express.static(path.join(ROOT_DIR, 'assets')));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: isProduction }
}));

const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  }
  return res.redirect('/admin/login');
};

const requireLocalStorage = (req, res, next) => {
  if (isVercel) {
    return res.status(503).send('CMS changes and cover uploads require durable storage, which is not configured for this deployment.');
  }
  return next();
};

const slugify = (value = '') => {
  const text = String(value).toLowerCase().trim();
  const slug = text.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || 'untitled-post';
};

const parseTags = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map((tag) => String(tag).trim()).filter(Boolean);
  return String(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const stringifyTags = (tags) => JSON.stringify(parseTags(tags));

const formatDate = (value) => {
  if (!value) return 'Not published';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getReadingTime = (content = '') => {
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

const renderMarkdown = (content = '') => {
  const html = marked.parse(String(content || ''));
  return html;
};

const queryAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params && params.length) {
    stmt.bind(params);
  }

  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }

  stmt.free();
  return rows;
};

const queryOne = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params && params.length) {
    stmt.bind(params);
  }

  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
};

const executeWrite = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params && params.length) {
    stmt.bind(params);
  }
  stmt.step();
  stmt.free();
};

const getPostRow = (id) => {
  return queryOne('SELECT * FROM posts WHERE id = ?', [id]);
};

const getPublicPosts = () => {
  return queryAll(`SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC, created_at DESC`).map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]')
  }));
};

const getFeaturedPost = () => {
  const row = queryOne(`SELECT * FROM posts WHERE status = 'published' AND featured = 1 ORDER BY published_at DESC LIMIT 1`);
  if (!row) return getPublicPosts()[0] || null;
  return { ...row, tags: JSON.parse(row.tags || '[]') };
};

const getPostBySlug = (slug, includeDraft = false) => {
  const sql = includeDraft
    ? 'SELECT * FROM posts WHERE slug = ?'
    : 'SELECT * FROM posts WHERE slug = ? AND status = ?';
  const row = queryOne(sql, includeDraft ? [slug] : [slug, 'published']);
  return row ? { ...row, tags: JSON.parse(row.tags || '[]') } : null;
};

const renderAdminLayout = (title, content) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { --bg: #0b1220; --panel: #101b2c; --panel-strong:#16253d; --border: rgba(148,163,184,.2); --text:#e5eefb; --muted:#a5b4cf; --primary:#8da6ff; --danger:#f87171; --success:#4ade80; --shadow: 0 20px 45px rgba(2,6,23,.3);} 
      * { box-sizing:border-box; } body { margin:0; font-family:Inter,Segoe UI,sans-serif; background:linear-gradient(180deg,#0b1220,#111827); color:var(--text); } a { color:inherit; text-decoration:none; } .wrap { max-width:1200px; margin:0 auto; padding:32px 20px 80px; } .topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; } .brand { font-size:1.2rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; } .nav { display:flex; gap:14px; align-items:center; flex-wrap:wrap; } .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 16px; border-radius:10px; border:1px solid var(--border); background:var(--panel); color:var(--text); cursor:pointer; } .btn.primary { background:var(--primary); color:#0b1220; border-color:var(--primary); font-weight:700; } .btn.danger { background:rgba(248,113,113,.12); border-color:rgba(248,113,113,.35); color:#fecaca; } .table { width:100%; border-collapse:collapse; overflow:hidden; border:1px solid var(--border); background:var(--panel); border-radius:18px; } .table th, .table td { text-align:left; padding:14px 16px; border-bottom:1px solid var(--border); } .table th { color:var(--muted); font-size:.8rem; letter-spacing:.08em; text-transform:uppercase; } .pill { display:inline-flex; padding:6px 10px; border-radius:999px; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; } .draft { background:rgba(245,158,11,.12); color:#fbbf24; border:1px solid rgba(245,158,11,.35);} .published { background:rgba(74,222,128,.12); color:#86efac; border:1px solid rgba(74,222,128,.35);} .form-card { background:var(--panel); border:1px solid var(--border); border-radius:18px; padding:20px; box-shadow:var(--shadow);} .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; } label { display:block; margin-bottom:18px; color:var(--muted); font-size:.82rem; letter-spacing:.04em; text-transform:uppercase; } input, textarea, select { width:100%; background:#0d1729; border:1px solid var(--border); border-radius:10px; padding:12px 14px; color:var(--text); font:inherit; } textarea { min-height:200px; resize:vertical; } .actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:20px; } .flash { padding:12px 16px; border-radius:12px; border:1px solid var(--border); background:rgba(141,166,255,.08); color:var(--muted); margin-bottom:20px; } .muted { color:var(--muted); } .stack { display:flex; flex-direction:column; gap:16px; } @media (max-width:760px) { .grid { grid-template-columns:1fr; } .topbar { align-items:flex-start; flex-direction:column; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      ${content}
    </div>
  </body>
</html>
`;

const renderBlogPage = (posts) => {
  const featured = posts.find((p) => p.featured) || posts[0];
  const recent = posts.filter((post) => post.id !== (featured ? featured.id : -1)).slice(0, 6);
  const tags = [...new Set(posts.flatMap((post) => post.tags || []))];
  const html = `
    <div class="page-shell">
      <header class="site-header">
        <div class="inner">
          <a class="brand" href="/"><span>Utkarsh</span> Bhola</a>
          <nav class="site-nav" aria-label="Main navigation">
            <a class="nav-link" href="/">Home</a>
            <a class="nav-link" href="/about">About</a>
            <a class="nav-link" href="/projects">Projects</a>
            <a class="nav-link active" href="/blog">Blog</a>
            <a class="nav-link" href="/contact">Contact</a>
          </nav>
        </div>
      </header>
      <main class="page-shell" style="padding-top:34px;">
        <section class="section-shell">
          <div class="eyebrow">Writing</div>
          <h1 style="font-size: clamp(2.4rem, 4vw, 4rem); margin-bottom: 12px;">Engineering notes and product thinking.</h1>
          <p class="lead">Short writing on backend systems, AI workflows, and the trade-offs behind real product work.</p>
        </section>
        ${featured ? `
        <section class="section-shell">
          <article class="blog-card" style="overflow:hidden; border-radius:24px; border:1px solid var(--line); background:var(--panel); box-shadow:var(--shadow);">
            <div class="card-content">
              <div class="blog-meta">
                <span>${formatDate(featured.published_at)}</span>
                <span>${getReadingTime(featured.content)} min read</span>
              </div>
              <h2 style="margin-top:8px; font-size: clamp(1.7rem, 3vw, 3rem);">${escapeHtml(featured.title)}</h2>
              <p>${escapeHtml(featured.description || '')}</p>
              <div class="project-meta">${(featured.tags || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}</div>
              <div style="margin-top:16px;"><a class="button" href="/blog/${escapeHtml(featured.slug)}">Read article</a></div>
            </div>
          </article>
        </section>
        ` : ''}
        <section class="section-shell">
          <div class="blog-controls">
            <div class="filter-row">${tags.map((tag) => `<span class="filter-chip">${escapeHtml(tag)}</span>`).join('')}</div>
          </div>
          <div class="blog-grid">
            ${recent.map((post) => `
              <article class="blog-card">
                <div class="card-content">
                  <div class="blog-meta">
                    <span>${formatDate(post.published_at)}</span>
                    <span>${getReadingTime(post.content)} min read</span>
                  </div>
                  <h3>${escapeHtml(post.title)}</h3>
                  <p>${escapeHtml(post.description || '')}</p>
                  <div class="project-meta">${(post.tags || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}</div>
                  <a class="card-link" href="/blog/${escapeHtml(post.slug)}">Read article</a>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </main>
    </div>
  `;
  return `<!DOCTYPE html><html lang="en"><head>...`;
};

const renderHomePage = () => {
  const projectCards = Object.values(projectData).map((project, index) => `
    <article class="project-card ${index < 2 ? 'featured' : ''}">
      <div class="card-content">
        <div class="card-header">
          <h3>${escapeHtml(project.name)}</h3>
          <span class="meta-pill">Systems</span>
        </div>
        <p>${escapeHtml(project.tagline)}</p>
        <div class="project-meta">${project.stack.map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join('')}</div>
        <div class="project-links">
          ${project.github && project.github !== '#' ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer">Repo</a>` : ''}
        </div>
      </div>
    </article>
  `).join('');

  const posts = getPublicPosts().slice(0, 3);
  const blogCards = posts.map((post) => `
    <article class="blog-card">
      <div class="card-content">
        <div class="blog-meta"><span>${formatDate(post.published_at)}</span><span>${getReadingTime(post.content)} min read</span></div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.description || '')}</p>
        <div class="project-meta">${(post.tags || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}</div>
        <a class="card-link" href="/blog/${escapeHtml(post.slug)}">Read article</a>
      </div>
    </article>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Software engineer building distributed systems, AI products, and backend infrastructure." />
      <meta property="og:title" content="Utkarsh Bhola | Software Engineer" />
      <meta property="og:description" content="Software engineer building distributed systems, AI products, and backend infrastructure." />
      <link rel="canonical" href="/" />
      <title>Utkarsh Bhola | Software Engineer</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body data-page="home">
      <header class="site-header">
        <div class="inner">
          <a class="brand" href="/"><span>Utkarsh</span> Bhola</a>
          <nav class="site-nav" aria-label="Main navigation">
            <a class="nav-link active" href="/">Home</a>
            <a class="nav-link" href="/about">About</a>
            <a class="nav-link" href="/projects">Projects</a>
            <a class="nav-link" href="/blog">Blog</a>
            <a class="nav-link" href="/contact">Contact</a>
          </nav>
          <button id="theme-toggle" class="theme-toggle" type="button">Dark mode</button>
        </div>
      </header>
      <div class="page-shell">
        <main>
          <section class="hero" id="home">
            <div class="hero-copy">
              <div class="eyebrow">Available for product and engineering work</div>
              <h1>Hello, I’m <span class="title-highlight">Utkarsh Bhola</span>.</h1>
              <div class="hero-role">Software Engineer building distributed systems, AI applications, and products.</div>
              <p class="lead">I design and ship backend systems, AI-powered products, and developer tooling with a strong emphasis on reliability, clarity, and practical impact.</p>
              <div class="hero-actions">
                <a class="button" href="/projects">View projects</a>
                <a class="button-secondary" href="/blog">Read the blog</a>
              </div>
              <div class="social-links">
                <a class="social-link" href="https://github.com/utkarshbhola" target="_blank" rel="noreferrer">GitHub</a>
                <a class="social-link" href="https://www.linkedin.com/in/utkarsh-bhola-639081172/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a class="social-link" href="mailto:utkarsh.bhola31@gmail.com">Email</a>
              </div>
            </div>
            <div class="terminal-shell" aria-label="Software engineering terminal illustration">
              <div class="terminal-header"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
              <div class="terminal-body">
                <div class="terminal-line"><span class="terminal-prompt">$</span> engineer --focus="backend, ai, systems"</div>
                <div class="terminal-line"><span class="terminal-prompt">$</span> ship --reliably --measure --iterate</div>
                <div class="terminal-line">&nbsp;</div>
                <div class="terminal-line">building: distributed systems</div>
                <div class="terminal-line">building: llm products</div>
                <div class="terminal-line">building: product-grade tooling</div>
                <div class="terminal-line">&nbsp;</div>
                <div class="terminal-line"><span class="terminal-prompt">$</span> status --ready <span class="cursor"></span></div>
              </div>
            </div>
          </section>

          <section class="section-shell" id="about">
            <div class="eyebrow">About</div>
            <div class="section-grid">
              <div class="profile-card">
                <img src="/assets/WhatsApp Image 2026-09-30 at 17.56.40.jpeg" alt="Utkarsh Bhola portrait" style="width:100%; height:100%; object-fit:cover; border-radius:18px; display:block;" />
              </div>
              <div>
                <h2>Building systems that work in the real world.</h2>
                <p>I am a software engineer with a systems-first mindset. My work sits at the intersection of backend engineering, AI product development, and product building, with a focus on shipping reliable systems that people can trust.</p>
                <p>I started in competitive programming and Python before moving into backend, distributed systems, and LLM-driven application building. I enjoy working on the full stack of engineering: architecture, implementation, debugging, and iteration.</p>
                <p>Today I am focused on backend systems, AI applications, and practical engineering work that bridges product needs with technical depth.</p>
              </div>
            </div>
          </section>

          <section class="section-shell" id="skills">
            <div class="eyebrow">Technical skills</div>
            <div class="skill-groups">
              <div class="skill-group"><h3>Languages</h3><div class="skill-list"><span class="skill-pill">Python</span><span class="skill-pill">C++</span><span class="skill-pill">Go</span><span class="skill-pill">Java</span><span class="skill-pill">JavaScript</span><span class="skill-pill">TypeScript</span><span class="skill-pill">SQL</span></div></div>
              <div class="skill-group"><h3>Backend</h3><div class="skill-list"><span class="skill-pill">FastAPI</span><span class="skill-pill">Node.js</span><span class="skill-pill">PostgreSQL</span><span class="skill-pill">Redis</span><span class="skill-pill">Kafka</span><span class="skill-pill">REST APIs</span><span class="skill-pill">Distributed Systems</span></div></div>
              <div class="skill-group"><h3>Cloud</h3><div class="skill-list"><span class="skill-pill">AWS</span><span class="skill-pill">Azure</span><span class="skill-pill">Docker</span><span class="skill-pill">Kubernetes</span><span class="skill-pill">Supabase</span><span class="skill-pill">CI/CD</span></div></div>
              <div class="skill-group"><h3>AI</h3><div class="skill-list"><span class="skill-pill">RAG</span><span class="skill-pill">LLM Applications</span><span class="skill-pill">Vector Databases</span><span class="skill-pill">LangChain</span><span class="skill-pill">Prompt Design</span><span class="skill-pill">AI Product Workflows</span></div></div>
              <div class="skill-group"><h3>Frontend</h3><div class="skill-list"><span class="skill-pill">React</span><span class="skill-pill">Next.js</span><span class="skill-pill">Tailwind</span><span class="skill-pill">TypeScript</span><span class="skill-pill">Responsive UI</span></div></div>
            </div>
          </section>

          <section class="section-shell" id="projects">
            <div class="eyebrow">Selected projects</div>
            <div class="projects-grid">
              ${projectCards}
            </div>
          </section>

          <section class="section-shell" id="experience">
            <div class="eyebrow">Experience</div>
            <div class="timeline">
              <div class="timeline-item"><div class="timeline-card"><div class="timeline-meta">2026</div><h3>Airbus</h3><p><strong>Software Engineering Intern</strong></p><p>Built a RAG-based system to reduce tier-1 support tickets and improve operational efficiency for support workflows.</p><div class="project-meta"><span class="meta-pill">Python</span><span class="meta-pill">RAG</span><span class="meta-pill">LLM</span><span class="meta-pill">Support Automation</span></div></div></div>
              <div class="timeline-item"><div class="timeline-card"><div class="timeline-meta">2025</div><h3>Atlan</h3><p><strong>Freelance Writer</strong></p><p>Wrote technical articles on data governance and data engineering topics, translating complex material into clear, practical explanations.</p><div class="project-meta"><span class="meta-pill">Writing</span><span class="meta-pill">Data Governance</span><span class="meta-pill">Technical Content</span></div></div></div>
              <div class="timeline-item"><div class="timeline-card"><div class="timeline-meta">2024</div><h3>Queue Busters</h3><p><strong>Intern</strong></p><p>Built backend and billing-related functionality using FastAPI and Django to support customer workflows and operational tooling.</p><div class="project-meta"><span class="meta-pill">FastAPI</span><span class="meta-pill">Django</span><span class="meta-pill">Billing</span><span class="meta-pill">Backend</span></div></div></div>
            </div>
          </section>

          <section class="section-shell" id="blog-preview">
            <div class="eyebrow">Writing</div>
            <div class="blog-grid">${blogCards || '<p>No published posts yet.</p>'}</div>
          </section>

          <section class="section-shell" id="contact">
            <div class="eyebrow">Contact</div>
            <div class="contact-grid">
              <article class="contact-card"><div><div class="eyebrow" style="margin-bottom:8px;">Email</div><strong>hello@utkarshbhola.dev</strong></div><a href="mailto:hello@utkarshbhola.dev">Reach out</a></article>
              <article class="contact-card"><div><div class="eyebrow" style="margin-bottom:8px;">LinkedIn</div><strong>Professional profile</strong></div><a href="#">Reach out</a></article>
              <article class="contact-card"><div><div class="eyebrow" style="margin-bottom:8px;">GitHub</div><strong>Code and projects</strong></div><a href="#">Reach out</a></article>
            </div>
          </section>
        </main>
        <footer class="site-footer">
          <div class="footer-inner"><div><strong>Utkarsh Bhola</strong><div>Software engineer building systems, AI products, and backend platforms.</div></div><div class="footer-links"><a href="/">Home</a><a href="/about">About</a><a href="/projects">Projects</a><a href="/blog">Blog</a><a href="/contact">Contact</a></div></div>
        </footer>
      </div>
      <script src="/script.js"></script>
    </body>
  </html>
  `;
};

const renderProjectPage = (project) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(project.name)} | Utkarsh Bhola</title>
      <meta name="description" content="${escapeHtml(project.tagline)}" />
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <header class="site-header">
        <div class="inner">
          <a class="brand" href="/"><span>Utkarsh</span> Bhola</a>
          <nav class="site-nav" aria-label="Main navigation">
            <a class="nav-link" href="/">Home</a>
            <a class="nav-link" href="/about">About</a>
            <a class="nav-link active" href="/projects">Projects</a>
            <a class="nav-link" href="/blog">Blog</a>
            <a class="nav-link" href="/contact">Contact</a>
          </nav>
        </div>
      </header>
      <div class="page-shell" style="padding-top:28px;">
        <main>
          <section class="section-shell">
            <div class="eyebrow">Case study</div>
            <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 12px;">${escapeHtml(project.name)}</h1>
            <p class="lead">${escapeHtml(project.tagline)}</p>
            <div class="project-meta">${project.stack.map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join('')}</div>
            <div class="hero-actions" style="margin-top:18px;">
              ${project.github && project.github !== '#' ? `<a class="button" href="${escapeHtml(project.github)}" target="_blank" rel="noreferrer">GitHub</a>` : ''}
              ${project.live ? `<a class="button-secondary" href="${escapeHtml(project.live)}" target="_blank" rel="noreferrer">Live demo</a>` : ''}
              <a class="button-ghost" href="/projects">Back to projects</a>
            </div>
          </section>

          <section class="section-shell">
            <div class="eyebrow">Overview</div>
            <p>${escapeHtml(project.overview)}</p>
          </section>

          <section class="section-shell">
            <div class="eyebrow">Architecture</div>
            <p>${escapeHtml(project.architecture)}</p>
          </section>

          <section class="section-shell">
            <div class="eyebrow">Technical details</div>
            <p>${escapeHtml(project.details)}</p>
          </section>

          <section class="section-shell">
            <div class="eyebrow">Challenges</div>
            <p>${escapeHtml(project.challenges)}</p>
          </section>

          <section class="section-shell">
            <div class="eyebrow">What I learned</div>
            <p>${escapeHtml(project.lessons)}</p>
          </section>
        </main>
      </div>
    </body>
  </html>
`;

const renderAboutPage = () => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="About Utkarsh Bhola, a software engineer focused on backend systems, AI products, and product engineering." />
      <title>About | Utkarsh Bhola</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <header class="site-header"><div class="inner"><a class="brand" href="/"><span>Utkarsh</span> Bhola</a><nav class="site-nav" aria-label="Main navigation"><a class="nav-link" href="/">Home</a><a class="nav-link active" href="/about">About</a><a class="nav-link" href="/projects">Projects</a><a class="nav-link" href="/blog">Blog</a><a class="nav-link" href="/contact">Contact</a></nav></div></header>
      <div class="page-shell">
        <main>
          <section class="section-shell">
            <div class="section-grid">
              <div class="profile-card"><img src="/assets/WhatsApp Image 2026-09-30 at 17.56.40.jpeg" alt="Utkarsh Bhola portrait" style="width:100%; object-fit:cover; border-radius:18px; display:block;" /></div>
              <div>
                <div class="eyebrow">About</div>
                <h1 style="font-size: clamp(2.5rem, 5vw, 4rem);">I build practical systems, not decorative prototypes.</h1>
                <p>I am a software engineer interested in backend systems, product engineering, and AI tooling. My work is grounded in the parts of engineering that decide whether a system can actually be trusted in the real world.</p>
                <p>I like the details that matter after the first demo: architecture clarity, API design, failure handling, debugging, and iteration. I care about systems that are understandable, maintainable, and useful.</p>
                <p>My current focus is on backend engineering, distributed systems, AI applications, and the product work that sits around them.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </body>
  </html>
`;

const renderContactPage = () => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Contact Utkarsh Bhola." />
      <title>Contact | Utkarsh Bhola</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <header class="site-header"><div class="inner"><a class="brand" href="/"><span>Utkarsh</span> Bhola</a><nav class="site-nav" aria-label="Main navigation"><a class="nav-link" href="/">Home</a><a class="nav-link" href="/about">About</a><a class="nav-link" href="/projects">Projects</a><a class="nav-link" href="/blog">Blog</a><a class="nav-link active" href="/contact">Contact</a></nav></div></header>
      <div class="page-shell"><main><section class="section-shell"><div class="eyebrow">Contact</div><div class="contact-grid"><article class="contact-card"><div><div class="eyebrow" style="margin-bottom:8px;">Email</div><strong>hello@utkarshbhola.dev</strong></div><a href="mailto:hello@utkarshbhola.dev">Reach out</a></article><article class="contact-card"><div><div class="eyebrow" style="margin-bottom:8px;">LinkedIn</div><strong>Professional profile</strong></div><a href="#">Reach out</a></article><article class="contact-card"><div><div class="eyebrow" style="margin-bottom:8px;">GitHub</div><strong>Code and projects</strong></div><a href="#">Reach out</a></article></div></section></main></div>
    </body>
  </html>
`;

const renderProjectsPage = () => {
  const projectCards = Object.values(projectData).map((project) => `
    <article class="project-card">
      <div class="card-content">
        <div class="card-header">
          <h3>${escapeHtml(project.name)}</h3>
        </div>
        <p>${escapeHtml(project.tagline)}</p>
        <div class="project-meta">${project.stack.map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join('')}</div>
        <div class="project-links">
          ${project.github && project.github !== '#' ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer">Repo</a>` : ''}
        </div>
      </div>
    </article>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Selected engineering projects by Utkarsh Bhola." />
      <title>Projects | Utkarsh Bhola</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <header class="site-header"><div class="inner"><a class="brand" href="/"><span>Utkarsh</span> Bhola</a><nav class="site-nav" aria-label="Main navigation"><a class="nav-link" href="/">Home</a><a class="nav-link" href="/about">About</a><a class="nav-link active" href="/projects">Projects</a><a class="nav-link" href="/blog">Blog</a><a class="nav-link" href="/contact">Contact</a></nav></div></header>
      <div class="page-shell"><main><section class="section-shell"><div class="eyebrow">Projects</div><h1 style="font-size: clamp(2.4rem, 5vw, 4rem);">RiftKV · Herald · Skald · Webhook</h1><div class="projects-grid">${projectCards}</div></section></main></div>
    </body>
  </html>
  `;
};

const renderBlogDetail = (post) => {
  const toc = Array.from(String(post.content || '').matchAll(/^#{1,3}\s+(.*)$/gm)).map((match) => ({
    level: match[0].match(/^#+/)[0].length,
    text: match[1].trim()
  }));
  const content = renderMarkdown(post.content || '');
  const related = getPublicPosts().filter((item) => item.id !== post.id).slice(0, 2);

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(post.title)} | Utkarsh Bhola</title>
      <meta name="description" content="${escapeHtml(post.description || '')}" />
      <meta property="og:title" content="${escapeHtml(post.title)} | Utkarsh Bhola" />
      <meta property="og:description" content="${escapeHtml(post.description || '')}" />
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <header class="site-header"><div class="inner"><a class="brand" href="/"><span>Utkarsh</span> Bhola</a><nav class="site-nav" aria-label="Main navigation"><a class="nav-link" href="/">Home</a><a class="nav-link" href="/about">About</a><a class="nav-link" href="/projects">Projects</a><a class="nav-link active" href="/blog">Blog</a><a class="nav-link" href="/contact">Contact</a></nav></div></header>
      <div class="page-shell">
        <main>
          <section class="article-shell">
            <header class="article-header">
              <div class="eyebrow">Article</div>
              <h1>${escapeHtml(post.title)}</h1>
              <div class="reading-meta"><span>${formatDate(post.published_at)}</span><span>${getReadingTime(post.content)} min read</span>${(post.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
            </header>
            <div class="article-layout">
              <aside class="article-toc"><h3>Table of contents</h3>${toc.length ? toc.map((entry) => `<a href="#${escapeHtml(slugify(entry.text))}">${escapeHtml(entry.text)}</a>`).join('') : '<p>No headings yet.</p>'}</aside>
              <article class="article-body">${content}</article>
            </div>
            <div class="related-posts">${related.map((item) => `<article class="blog-card"><div class="card-content"><div class="blog-meta"><span>${formatDate(item.published_at)}</span><span>${getReadingTime(item.content)} min read</span></div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || '')}</p><a class="card-link" href="/blog/${escapeHtml(item.slug)}">Read more</a></div></article>`).join('')}</div>
          </section>
        </main>
      </div>
      <script>
        const headings = document.querySelectorAll('.article-body h1, .article-body h2, .article-body h3');
        headings.forEach((heading) => {
          const id = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
          heading.id = id;
        });
        document.querySelectorAll('.article-body pre code').forEach((code) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'copy-code';
          button.textContent = 'Copy code';
          button.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(code.textContent); button.textContent = 'Copied'; setTimeout(() => button.textContent = 'Copy code', 1200); }
            catch (error) { button.textContent = 'Copy failed'; }
          });
          code.parentElement.parentElement.insertBefore(button, code.parentElement);
        });
      </script>
    </body>
  </html>
`;
};

const renderBlogIndex = () => {
  const posts = getPublicPosts();
  const featured = posts[0] || null;
  const more = posts.slice(1);
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Engineering notes by Utkarsh Bhola." />
      <title>Blog | Utkarsh Bhola</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <header class="site-header"><div class="inner"><a class="brand" href="/"><span>Utkarsh</span> Bhola</a><nav class="site-nav" aria-label="Main navigation"><a class="nav-link" href="/">Home</a><a class="nav-link" href="/about">About</a><a class="nav-link" href="/projects">Projects</a><a class="nav-link active" href="/blog">Blog</a><a class="nav-link" href="/contact">Contact</a></nav></div></header>
      <div class="page-shell"><main><section class="section-shell"><div class="eyebrow">Writing</div><h1 style="font-size: clamp(2.4rem, 4vw, 4rem);">Engineering notes and product thinking.</h1><p class="lead">Short writing on backend systems, AI workflows, and real product engineering.</p></section>${featured ? `<section class="section-shell"><article class="blog-card"><div class="card-content"><div class="blog-meta"><span>${formatDate(featured.published_at)}</span><span>${getReadingTime(featured.content)} min read</span></div><h2>${escapeHtml(featured.title)}</h2><p>${escapeHtml(featured.description || '')}</p><div class="project-meta">${(featured.tags || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}</div><a class="card-link" href="/blog/${escapeHtml(featured.slug)}">Read article</a></div></article></section>` : ''}<section class="section-shell"><div class="blog-grid">${more.map((post) => `<article class="blog-card"><div class="card-content"><div class="blog-meta"><span>${formatDate(post.published_at)}</span><span>${getReadingTime(post.content)} min read</span></div><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.description || '')}</p><div class="project-meta">${(post.tags || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}</div><a class="card-link" href="/blog/${escapeHtml(post.slug)}">Read article</a></div></article>`).join('') || '<p>No published posts yet.</p>'}</div></section></main></div>
    </body>
  </html>
`;
};

const renderAdminLogin = (message = '') => renderAdminLayout('Admin login', `
  <div class="topbar">
    <div class="brand">Portfolio admin</div>
  </div>
  ${message ? `<div class="flash">${escapeHtml(message)}</div>` : ''}
  <div class="form-card" style="max-width:520px; margin:0 auto;">
    <h2>Sign in</h2>
    <form method="post" action="/admin/login">
      <label>Username<input name="username" value="${escapeHtml(ADMIN_USERNAME)}" required /></label>
      <label>Password<input type="password" name="password" required /></label>
      <div class="actions"><button class="btn primary" type="submit">Continue</button></div>
    </form>
  </div>
`);

const renderAdminDashboard = (posts) => renderAdminLayout('Blog dashboard', `
  <div class="topbar">
    <div class="brand">Blog</div>
    <div class="nav">
      <a class="btn" href="/admin/blog/new">+ New Post</a>
      <form method="post" action="/admin/logout"><button class="btn danger" type="submit">Log out</button></form>
    </div>
  </div>
  <div class="form-card">
    <table class="table">
      <thead>
        <tr><th>Title</th><th>Status</th><th>Updated</th><th>Tags</th><th>Actions</th></tr>
      </thead>
      <tbody>
        ${posts.length ? posts.map((post) => `
          <tr>
            <td>${escapeHtml(post.title)}</td>
            <td><span class="pill ${post.status === 'published' ? 'published' : 'draft'}">${escapeHtml(post.status)}</span></td>
            <td>${escapeHtml(formatDate(post.updated_at))}</td>
            <td>${(JSON.parse(post.tags || '[]')).map((tag) => escapeHtml(tag)).join(', ') || '—'}</td>
            <td><div class="actions"><a class="btn" href="/admin/blog/${post.id}/edit">Edit</a><form method="post" action="/admin/blog/${post.id}/delete" style="display:inline;" onsubmit="return confirm('Delete this post?');"><button class="btn danger" type="submit">Delete</button></form></div></td>
          </tr>
        `).join('') : '<tr><td colspan="5">No posts yet.</td></tr>'}
      </tbody>
    </table>
  </div>
`);

const renderAdminEditor = (post = null, error = '') => {
  const isEdit = !!post;
  const formAction = isEdit ? `/admin/blog/${post.id}/edit` : '/admin/blog/new';
  const coverValue = post?.cover_image || '';
  const titleValue = post?.title || '';
  const slugValue = post?.slug || '';
  const descriptionValue = post?.description || '';
  const contentValue = post?.content || '';
  const tagsValue = (post?.tags || []).join(', ');
  const authorValue = post?.author || 'Utkarsh Bhola';
  const status = post?.status || 'draft';
  const featuredChecked = post?.featured ? 'checked' : '';

  return renderAdminLayout(isEdit ? 'Edit post' : 'New post', `
    <div class="topbar">
      <div class="brand">${isEdit ? 'Edit post' : 'New post'}</div>
      <div class="nav"><a class="btn" href="/admin/blog">Back to dashboard</a></div>
    </div>
    ${error ? `<div class="flash">${escapeHtml(error)}</div>` : ''}
    <form method="post" action="${formAction}" enctype="multipart/form-data">
      <div class="grid">
        <div class="stack form-card">
          <label>Title<input name="title" value="${escapeHtml(titleValue)}" required /></label>
          <label>Slug<input name="slug" value="${escapeHtml(slugValue)}" placeholder="my-post-slug" required /></label>
          <label>Description<textarea name="description" rows="4">${escapeHtml(descriptionValue)}</textarea></label>
          <label>Author<input name="author" value="${escapeHtml(authorValue)}" /></label>
          <label>Cover image<input type="file" name="cover" accept="image/*" /></label>
          ${coverValue ? `<div class="muted">Current image: ${escapeHtml(coverValue)}</div>` : ''}
        </div>
        <div class="stack form-card">
          <label>Tags<input name="tags" value="${escapeHtml(tagsValue)}" placeholder="backend, ai, systems" /></label>
          <label>Published date<input type="date" name="published_at" value="${post && post.published_at ? new Date(post.published_at).toISOString().slice(0, 10) : ''}" /></label>
          <label>Status<select name="status"><option value="draft" ${status === 'draft' ? 'selected' : ''}>Draft</option><option value="published" ${status === 'published' ? 'selected' : ''}>Published</option></select></label>
          <label><input type="checkbox" name="featured" ${featuredChecked} /> Featured post</label>
        </div>
      </div>
      <div class="form-card" style="margin-top:24px;">
        <label>Content<textarea name="content" required>${escapeHtml(contentValue)}</textarea></label>
      </div>
      <div class="actions">
        <button class="btn primary" type="submit" name="action" value="save">Save</button>
        <button class="btn" type="submit" name="action" value="publish">Publish</button>
        <a class="btn" href="/admin/blog">Cancel</a>
      </div>
    </form>
  `);
};

const adminPostsQuery = () => queryAll('SELECT * FROM posts ORDER BY updated_at DESC, created_at DESC');

const savePostRecord = (payload) => {
  const normalized = {
    title: payload.title || 'Untitled post',
    slug: payload.slug || slugify(payload.title),
    description: payload.description || '',
    content: payload.content || '',
    author: payload.author || 'Utkarsh Bhola',
    tags: stringifyTags(payload.tags),
    status: payload.status === 'published' ? 'published' : 'draft',
    featured: payload.featured ? 1 : 0,
    cover_image: payload.cover_image || '',
    published_at: payload.published_at || null,
    updated_at: new Date().toISOString()
  };

  if (!normalized.published_at && normalized.status === 'published') {
    normalized.published_at = new Date().toISOString();
  }

  return normalized;
};

app.get('/', (req, res) => { res.send(renderHomePage()); });
app.get('/about', (req, res) => { res.send(renderAboutPage()); });
app.get('/projects', (req, res) => { res.send(renderProjectsPage()); });
app.get('/projects/:slug', (req, res) => {
  const project = projectData[req.params.slug];
  if (!project) return res.status(404).send('Project not found');
  res.send(renderProjectPage(project));
});
app.get('/contact', (req, res) => { res.send(renderContactPage()); });

app.get('/blog', (req, res) => {
  res.send(renderBlogIndex());
});

app.get('/blog/:slug', (req, res) => {
  const post = getPostBySlug(req.params.slug, false);
  if (!post) return res.status(404).send('Post not found');
  res.send(renderBlogDetail(post));
});

app.get('/admin/login', (req, res) => {
  res.send(renderAdminLogin(req.query.error || ''));
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const isValid = username === ADMIN_USERNAME && typeof password === 'string' && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return res.redirect('/admin/login?error=' + encodeURIComponent('Invalid username or password.'));
  }
  req.session.authenticated = true;
  res.redirect('/admin/blog');
});

app.post('/admin/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

app.get('/admin', requireAuth, (req, res) => res.redirect('/admin/blog'));
app.get('/admin/blog', requireAuth, (req, res) => {
  res.send(renderAdminDashboard(adminPostsQuery()));
});

app.get('/admin/blog/new', requireAuth, (req, res) => {
  res.send(renderAdminEditor());
});

app.post('/admin/blog/new', requireAuth, requireLocalStorage, upload.single('cover'), (req, res) => {
  const { title, slug, description, content, author, tags, status, featured, action, published_at } = req.body;
  const safeSlug = slugify(slug || title);
  const existing = queryOne('SELECT id FROM posts WHERE slug = ?', [safeSlug]);
  if (existing) {
    return res.send(renderAdminEditor(null, 'That slug is already in use. Choose a unique one.'));
  }
  const payload = savePostRecord({
    title,
    slug: safeSlug,
    description,
    content,
    author,
    tags: parseTags(tags),
    status: action === 'publish' ? 'published' : (status || 'draft'),
    featured: !!featured,
    cover_image: req.file ? `/uploads/${req.file.filename}` : '',
    published_at: published_at || null
  });

  executeWrite(
    `INSERT INTO posts (title, slug, description, content, cover_image, author, tags, status, featured, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [payload.title, payload.slug, payload.description, payload.content, payload.cover_image, payload.author, payload.tags, payload.status, payload.featured, payload.published_at, new Date().toISOString(), payload.updated_at]
  );
  saveDb(db);
  res.redirect('/admin/blog');
});

app.get('/admin/blog/:id/edit', requireAuth, (req, res) => {
  const post = getPostRow(req.params.id);
  if (!post) return res.status(404).send('Post not found');
  post.tags = JSON.parse(post.tags || '[]');
  res.send(renderAdminEditor(post));
});

app.post('/admin/blog/:id/edit', requireAuth, requireLocalStorage, upload.single('cover'), (req, res) => {
  const post = getPostRow(req.params.id);
  if (!post) return res.status(404).send('Post not found');

  const { title, slug, description, content, author, tags, status, featured, action, published_at } = req.body;
  const nextSlug = slugify(slug || title);
  const payload = savePostRecord({
    title,
    slug: nextSlug,
    description,
    content,
    author,
    tags: parseTags(tags),
    status: action === 'publish' ? 'published' : (status || post.status),
    featured: !!featured,
    cover_image: req.file ? `/uploads/${req.file.filename}` : (post.cover_image || ''),
    published_at: published_at || post.published_at || null
  });

  executeWrite(
    `UPDATE posts SET title = ?, slug = ?, description = ?, content = ?, cover_image = ?, author = ?, tags = ?, status = ?, featured = ?, published_at = ?, updated_at = ? WHERE id = ?`,
    [payload.title, payload.slug, payload.description, payload.content, payload.cover_image, payload.author, payload.tags, payload.status, payload.featured, payload.published_at, payload.updated_at, req.params.id]
  );
  saveDb(db);
  res.redirect('/admin/blog');
});

app.post('/admin/blog/:id/delete', requireAuth, requireLocalStorage, (req, res) => {
  executeWrite('DELETE FROM posts WHERE id = ?', [req.params.id]);
  saveDb(db);
  res.redirect('/admin/blog');
});

app.use(express.static(ROOT_DIR));

app.use((req, res) => {
  res.status(404).send('Page not found');
});

bootstrapDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Portfolio server running on http://localhost:${PORT}`);
    if (!isProduction && ADMIN_PASSWORD === 'change-me-please') {
      console.warn('Using the development admin password. Set ADMIN_USERNAME and ADMIN_PASSWORD before deployment.');
    }
  });
}).catch((error) => {
  console.error('Failed to initialize SQLite database:', error);
  process.exit(1);
});
