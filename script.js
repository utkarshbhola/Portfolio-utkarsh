const siteData = {
  name: 'Utkarsh Bhola',
  role: 'Software Engineer building distributed systems, AI applications, and products.',
  summary: 'I design and ship backend systems, AI-powered products, and developer tooling with a strong emphasis on reliability, clarity, and practical impact.',
  socials: [
    { label: 'GitHub', href: '#', aria: 'GitHub' },
    { label: 'LinkedIn', href: '#', aria: 'LinkedIn' },
    { label: 'Email', href: 'mailto:hello@utkarshbhola.dev', aria: 'Email' }
  ],
  about: [
    'I am a software engineer with a systems-first mindset. My work sits at the intersection of backend engineering, AI product development, and product building, with a focus on shipping reliable systems that people can trust.',
    'I started in competitive programming and Python before moving into backend, distributed systems, and LLM-driven application building. I enjoy working on the full stack of engineering: architecture, implementation, debugging, and iteration.',
    'Today I am focused on backend systems, AI applications, and practical engineering work that bridges product needs with technical depth.'
  ],
  skills: {
    languages: ['Python', 'C++', 'Go', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
    backend: ['FastAPI', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'REST APIs', 'Distributed Systems'],
    cloud: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Supabase', 'CI/CD'],
    ai: ['RAG', 'LLM Applications', 'Vector Databases', 'LangChain', 'Prompt Design', 'AI Product Workflows'],
    frontend: ['React', 'Next.js', 'Tailwind', 'TypeScript', 'Responsive UI']
  },
  projects: [
    {
      name: 'RiftKV',
      type: 'Featured',
      description: 'A Redis-like key-value store built to explore storage engine design, protocol handling, and the trade-offs behind fast, reliable data access.',
      stack: ['Go', 'Storage Engine', 'Networking', 'Systems Design'],
      problem: 'I wanted to understand what it takes to build a performant in-memory data system from first principles, including protocol, persistence decisions, and operational constraints.',
      outcome: 'The project gave me deeper experience in low-level design, data structure trade-offs, and building a system with a clear interface and predictable behavior.',
      links: [{ label: 'Repository', href: '#' }]
    },
    {
      name: 'Zero Touch / RAG Support Assistant',
      type: 'Featured',
      description: 'A retrieval-augmented support assistant designed to reduce repetitive support load and help teams answer user questions more consistently.',
      stack: ['Python', 'RAG', 'LLM', 'FastAPI', 'Vector Search'],
      problem: 'Support conversations often repeat the same operational guidance and require quick access to historical context.',
      outcome: 'The system focuses on grounded responses, retrieving relevant information before answering, and giving teams a more scalable way to handle repeat issues.',
      links: [{ label: 'Repository', href: '#' }]
    },
    {
      name: 'Unified Micro Payments System',
      type: 'Product',
      description: 'A payment-oriented backend system that brings multiple transaction flows together into a clearer architecture for orchestration and operational visibility.',
      stack: ['Java', 'APIs', 'Backend', 'Payments'],
      problem: 'Multiple payment-related workflows can become hard to manage when they are split across fragmented logic and inconsistent interfaces.',
      outcome: 'The system emphasizes clear service boundaries, reliable processing, and simpler operational handling for a complex domain.',
      links: [{ label: 'Repository', href: '#' }]
    },
    {
      name: 'Flight Booking System',
      type: 'Product',
      description: 'A booking workflow with a backend focused on consistent flows, data integrity, and user-facing reliability.',
      stack: ['JavaScript', 'Backend', 'Database', 'APIs'],
      problem: 'Travel-related systems require careful handling of state transitions, validation, and user expectations across multiple steps.',
      outcome: 'This project sharpened my thinking around workflows, data modeling, and disciplined API design.',
      links: [{ label: 'Repository', href: '#' }]
    },
    {
      name: 'Out-Dare',
      type: 'Product',
      description: 'A product-focused engineering project aimed at creating a clear user experience around a specific action or challenge workflow.',
      stack: ['React', 'Frontend', 'UX', 'Product'],
      problem: 'Designing a polished product experience requires balancing user clarity with technical implementation detail.',
      outcome: 'The project improved my understanding of frontend product work, interaction design, and how technical choices influence usability.',
      links: [{ label: 'Repository', href: '#' }]
    },
    {
      name: 'Tamraaya',
      type: 'Product',
      description: 'A platform project built around practical product thinking, clean backend structure, and user-centered workflow improvements.',
      stack: ['Full Stack', 'Product', 'Backend'],
      problem: 'Real product work depends on the ability to simplify complexity without losing the core operational value.',
      outcome: 'This project reinforced how product clarity and engineering discipline work together in practice.',
      links: [{ label: 'Repository', href: '#' }]
    }
  ],
  experience: [
    {
      company: 'Airbus',
      role: 'Software Engineering Intern',
      period: '2026',
      summary: 'Built a RAG-based system to reduce tier-1 support tickets and improve operational efficiency for support workflows.',
      stack: ['Python', 'RAG', 'LLM', 'Support Automation']
    },
    {
      company: 'Atlan',
      role: 'Freelance Writer',
      period: '2025',
      summary: 'Wrote technical articles on data governance and data engineering topics, translating complex material into clear, practical explanations.',
      stack: ['Writing', 'Data Governance', 'Technical Content']
    },
    {
      company: 'Queue Busters',
      role: 'Intern',
      period: '2024',
      summary: 'Built backend and billing-related functionality using FastAPI and Django to support customer workflows and operational tooling.',
      stack: ['FastAPI', 'Django', 'Billing', 'Backend']
    }
  ],
  building: [
    { icon: 'DS', title: 'Distributed systems', text: 'I like systems with clear boundaries, failure modes, and predictable behavior.' },
    { icon: 'AI', title: 'AI applications', text: 'I build practical AI workflows grounded in retrieval, evaluation, and product relevance.' },
    { icon: 'BE', title: 'Backend engineering', text: 'I care deeply about APIs, data flows, observability, and maintainable architecture.' },
    { icon: 'DT', title: 'Developer tools', text: 'I enjoy building tools that improve speed, confidence, and operational clarity for teams.' }
  ],
  contact: {
    email: 'hello@utkarshbhola.dev',
    linkedin: '#',
    github: '#'
  }
};

const getBasePath = () => (window.location.pathname.includes('/blog') ? '../' : './');

const getNavUrl = (href) => {
  if (href.startsWith('#')) {
    return window.location.pathname.includes('/blog') ? `../index.html${href}` : href;
  }

  if (href === './blog/index.html' && window.location.pathname.includes('/blog')) {
    return './index.html';
  }

  return href;
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const formatDate = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getReadingTime = (content) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 220));
};

const inlineMarkdown = (text = '') => {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
};

const markdownToHtml = (source = '') => {
  const lines = source.replace(/\r/g, '').split('\n');
  let html = '';
  let inCode = false;
  let codeLanguage = '';
  let codeLines = [];
  let inList = false;
  let listItems = [];
  let inQuote = false;
  let quoteLines = [];

  const flushList = () => {
    if (listItems.length) {
      html += `<ul>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`;
      listItems = [];
    }
  };

  const flushQuote = () => {
    if (quoteLines.length) {
      html += `<blockquote>${quoteLines.map((line) => inlineMarkdown(line)).join('<br>')}</blockquote>`;
      quoteLines = [];
    }
  };

  const flushCode = () => {
    if (inCode) {
      const content = codeLines.join('\n');
      html += `<div class="code-block"><button class="copy-code" type="button">Copy code</button><pre><code class="language-${escapeHtml(codeLanguage || 'txt')}">${escapeHtml(content)}</code></pre></div>`;
      codeLines = [];
      codeLanguage = '';
      inCode = false;
    }
  };

  const pushParagraph = (raw) => {
    const text = raw.trim();
    if (!text) return;
    html += `<p>${inlineMarkdown(text)}</p>`;
  };

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      flushList();
      flushQuote();
      if (inCode) {
        flushCode();
      } else {
        inCode = true;
        codeLanguage = line.replace(/^```/, '').trim();
        codeLines = [];
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      flushQuote();
      listItems.push(line.replace(/^\s*[-*]\s+/, ''));
      inList = true;
      return;
    }

    if (inList) {
      flushList();
      inList = false;
    }

    if (/^>\s?/.test(line)) {
      flushList();
      quoteLines.push(line.replace(/^>\s?/, ''));
      inQuote = true;
      return;
    }

    if (inQuote) {
      flushQuote();
      inQuote = false;
    }

    if (/^#{1,3}\s+/.test(line)) {
      flushList();
      const matches = line.match(/^(#{1,3})\s+(.*)$/);
      const level = matches[1].length;
      const content = inlineMarkdown(matches[2]);
      html += `<h${level}>${content}</h${level}>`;
      return;
    }

    if (!line.trim()) {
      flushList();
      flushQuote();
      return;
    }

    pushParagraph(line);
  });

  flushList();
  flushQuote();
  flushCode();

  return html;
};

function renderHome() {
  const app = document.getElementById('app');
  const projects = siteData.projects
    .map((project, index) => `
      <article class="project-card ${index < 2 ? 'featured' : ''}">
        <div class="card-content">
          <div class="card-header">
            <h3>${escapeHtml(project.name)}</h3>
            <span class="meta-pill">${escapeHtml(project.type)}</span>
          </div>
          <p>${escapeHtml(project.description)}</p>
          <div class="project-meta">
            ${project.stack.map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join('')}
          </div>
          <p><strong>Problem:</strong> ${escapeHtml(project.problem)}</p>
          <p><strong>What I built:</strong> ${escapeHtml(project.outcome)}</p>
          <div class="project-links">
            ${project.links.map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join('')}
          </div>
        </div>
      </article>
    `)
    .join('');

  const focus = siteData.building
    .map((item) => `
      <article class="focus-card">
        <div class="icon">${escapeHtml(item.icon)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `)
    .join('');

  const experience = siteData.experience
    .map((item) => `
      <div class="timeline-item">
        <div class="timeline-card">
          <div class="timeline-meta">${escapeHtml(item.period)}</div>
          <h3>${escapeHtml(item.company)}</h3>
          <p><strong>${escapeHtml(item.role)}</strong></p>
          <p>${escapeHtml(item.summary)}</p>
          <div class="project-meta">
            ${item.stack.map((tech) => `<span class="meta-pill">${escapeHtml(tech)}</span>`).join('')}
          </div>
        </div>
      </div>
    `)
    .join('');

  const skillMarkup = Object.entries(siteData.skills)
    .map(([key, values]) => `
      <div class="skill-group">
        <h3>${escapeHtml(key.charAt(0).toUpperCase() + key.slice(1))}</h3>
        <div class="skill-list">
          ${values.map((value) => `<span class="skill-pill">${escapeHtml(value)}</span>`).join('')}
        </div>
      </div>
    `)
    .join('');

  const contactCards = [
    { label: 'Email', value: siteData.contact.email || 'Available on request', href: siteData.contact.email ? `mailto:${siteData.contact.email}` : '#contact' },
    { label: 'LinkedIn', value: 'Professional profile', href: siteData.contact.linkedin || '#' },
    { label: 'GitHub', value: 'Code and projects', href: siteData.contact.github || '#' }
  ];

  app.innerHTML = `
    <section class="hero" id="home">
      <div class="hero-copy">
        <div class="eyebrow">Available for product and engineering work</div>
        <h1>Hello, I’m <span class="title-highlight">${escapeHtml(siteData.name)}</span>.</h1>
        <div class="hero-role">${escapeHtml(siteData.role)}</div>
        <p class="lead">${escapeHtml(siteData.summary)}</p>
        <div class="hero-actions">
          <a class="button" href="#projects">View projects</a>
          <a class="button-secondary" href="./blog/index.html">Read the blog</a>
        </div>
        <div class="social-links">
          ${siteData.socials.map((link) => `
            <a class="social-link" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(link.aria)}">${escapeHtml(link.label)}</a>
          `).join('')}
        </div>
      </div>

      <div class="terminal-shell" aria-label="Software engineering terminal illustration">
        <div class="terminal-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
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
          <div class="profile-visual" aria-hidden="true"></div>
        </div>
        <div>
          <h2>Building systems that work in the real world.</h2>
          ${siteData.about.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
        </div>
      </div>
    </section>

    <section class="section-shell" id="skills">
      <div class="eyebrow">Technical skills</div>
      <div class="skill-groups">
        ${skillMarkup}
      </div>
    </section>

    <section class="section-shell" id="projects">
      <div class="eyebrow">Selected projects</div>
      <div class="projects-grid">
        ${projects}
      </div>
    </section>

    <section class="section-shell" id="experience">
      <div class="eyebrow">Experience</div>
      <div class="timeline">
        ${experience}
      </div>
    </section>

    <section class="section-shell" id="focus">
      <div class="eyebrow">What I like building</div>
      <div class="focus-grid">
        ${focus}
      </div>
    </section>

    <section class="section-shell" id="blog-preview">
      <div class="eyebrow">Writing</div>
      <div class="blog-grid" id="blog-preview-grid"></div>
    </section>

    <section class="section-shell" id="contact">
      <div class="eyebrow">Contact</div>
      <div class="contact-grid">
        ${contactCards.map((card) => `
          <article class="contact-card">
            <div>
              <div class="eyebrow" style="margin-bottom:8px;">${escapeHtml(card.label)}</div>
              <strong>${escapeHtml(card.value)}</strong>
            </div>
            <a href="${escapeHtml(card.href)}">Reach out</a>
          </article>
        `).join('')}
      </div>
    </section>
  `;

  renderBlogPreview();
}

async function fetchArticleIndex() {
  const basePath = getBasePath();
  const fetchCandidates = [
    `${basePath}index.json`,
    `${basePath}posts/index.json`
  ];

  for (const file of fetchCandidates) {
    try {
      const response = await fetch(file, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) return data;
      }
    } catch (error) {
      // Ignore and continue to next source.
    }
  }

  return [];
}

async function fetchArticleContent(slug) {
  const basePath = getBasePath();
  const fetchCandidates = [
    `${basePath}posts/${slug}.md`,
    `${basePath}${slug}.md`
  ];

  for (const file of fetchCandidates) {
    try {
      const response = await fetch(file, { cache: 'no-store' });
      if (response.ok) return await response.text();
    } catch (error) {
      // Ignore and continue to next source.
    }
  }

  return null;
}

async function renderBlogPreview() {
  const previewGrid = document.getElementById('blog-preview-grid');
  if (!previewGrid) return;

  const posts = await fetchArticleIndex();
  const featured = posts.slice(0, 3);
  previewGrid.innerHTML = featured.map((post) => `
    <article class="blog-card">
      <div class="card-content">
        <div class="blog-meta">
          <span>${formatDate(post.date)}</span>
          <span>${getReadingTime(post.summary || '')} min read</span>
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.description || post.summary || '')}</p>
        <div class="project-meta">
          ${(post.tags || []).slice(0, 3).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <a class="card-link" href="./blog/index.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
      </div>
    </article>
  `).join('');
}

async function renderBlogPage() {
  const app = document.getElementById('app');
  if (!app) return;

  const posts = await fetchArticleIndex();
  const query = new URLSearchParams(window.location.search);
  const slug = query.get('slug');

  if (slug) {
    const matched = posts.find((post) => post.slug === slug) || null;
    if (!matched) {
      app.innerHTML = `
        <section class="blog-shell">
          <div class="eyebrow">Writing</div>
          <h1>Article not found</h1>
          <p>The post you requested does not exist yet. Return to the blog index to continue reading.</p>
          <a class="button-secondary" href="./index.html">Back home</a>
        </section>
      `;
      return;
    }

    const content = await fetchArticleContent(slug);
    const html = markdownToHtml(content || '# Post not found');
    const headings = [...(content || '').matchAll(/^#{1,3}\s+(.*)$/gm)].map((match) => ({
      level: match[0].match(/^#+/)[0].length,
      text: match[1].trim()
    }));

    document.title = `${matched.title} | ${siteData.name}`;
    const metaDescription = matched.description || matched.summary || siteData.summary;
    updateMetaTags(metaDescription, matched.title);

    const currentIndex = posts.findIndex((post) => post.slug === slug);
    const previous = posts[currentIndex - 1] || null;
    const next = posts[currentIndex + 1] || null;
    const related = posts.filter((post) => post.slug !== slug && (post.tags || []).some((tag) => (matched.tags || []).includes(tag))).slice(0, 2);

    app.innerHTML = `
      <div class="progress-bar"><span id="reading-progress"></span></div>
      <section class="article-shell">
        <header class="article-header">
          <div class="eyebrow">Article</div>
          <h1>${escapeHtml(matched.title)}</h1>
          <div class="reading-meta">
            <span>${formatDate(matched.date)}</span>
            <span>${getReadingTime(content || matched.summary || '')} min read</span>
            ${(matched.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
          </div>
        </header>

        <div class="article-layout">
          <aside class="article-toc">
            <h3>Table of contents</h3>
            ${headings.length ? headings.map((heading) => `<a href="#${encodeURIComponent(heading.text.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${escapeHtml(heading.text)}</a>`).join('') : '<p>Content is loading.</p>'}
          </aside>

          <article class="article-body">${html}</article>
        </div>

        <div class="related-posts">
          ${related.length ? related.map((post) => `
            <article class="blog-card">
              <div class="card-content">
                <div class="blog-meta">
                  <span>${formatDate(post.date)}</span>
                </div>
                <h3>${escapeHtml(post.title)}</h3>
                <p>${escapeHtml(post.description || post.summary || '')}</p>
                <a class="card-link" href="./index.html?slug=${encodeURIComponent(post.slug)}">Read more</a>
              </div>
            </article>
          `).join('') : ''}
        </div>

        <div class="hero-actions" style="margin-top: 28px;">
          ${previous ? `<a class="button-secondary" href="./index.html?slug=${encodeURIComponent(previous.slug)}">Previous article</a>` : ''}
          ${next ? `<a class="button-secondary" href="./index.html?slug=${encodeURIComponent(next.slug)}">Next article</a>` : ''}
          <a class="button-ghost" href="./index.html">Back to blog</a>
        </div>
      </section>
    `;

    const headingAnchors = Array.from(document.querySelectorAll('.article-body h1, .article-body h2, .article-body h3'));
    headingAnchors.forEach((heading) => {
      const slug = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      heading.id = slug;
    });

    document.querySelectorAll('.article-body pre code').forEach((node) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-code';
      button.textContent = 'Copy code';
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(node.textContent);
          button.textContent = 'Copied';
          setTimeout(() => { button.textContent = 'Copy code'; }, 1200);
        } catch (error) {
          button.textContent = 'Copy failed';
        }
      });
      node.parentElement.parentElement.insertBefore(button, node.parentElement);
    });

    const progressBar = document.getElementById('reading-progress');
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const percent = total > 0 ? (window.scrollY / total) * 100 : 0;
      if (progressBar) progressBar.style.width = `${percent}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }

  const featured = posts.slice(0, 1);
  const filtered = posts.filter((post) => post.slug !== (featured[0] || {}).slug);
  const tagSet = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  app.innerHTML = `
    <section class="blog-shell">
      <header class="blog-header">
        <div class="eyebrow">Blog</div>
        <h1>Engineering notes and product thinking.</h1>
        <p>Short writing on backend systems, AI applications, product engineering, and what I’m learning.</p>
      </header>

      <div class="blog-controls">
        <input id="blog-search" class="search-box" type="search" placeholder="Search articles" aria-label="Search blog articles" />
        <div class="filter-row" id="tag-filters">
          <button class="filter-chip active" type="button" data-tag="all">All</button>
          ${tagSet.map((tag) => `<button class="filter-chip" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join('')}
        </div>
      </div>

      <div class="blog-grid" id="blog-grid">
        ${featured.map((post) => `
          <article class="blog-card" data-tags="${(post.tags || []).join(',')}">
            <div class="card-content">
              <div class="blog-meta">
                <span>${formatDate(post.date)}</span>
                <span>${getReadingTime(post.summary || '')} min read</span>
              </div>
              <h3>${escapeHtml(post.title)}</h3>
              <p>${escapeHtml(post.description || post.summary || '')}</p>
              <div class="project-meta">
                ${(post.tags || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}
              </div>
              <a class="card-link" href="./index.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
            </div>
          </article>
        `).join('')}
      </div>

      <div class="blog-grid" id="blog-list" style="margin-top: 24px;">
        ${filtered.map((post) => `
          <article class="blog-card" data-tags="${(post.tags || []).join(',')}">
            <div class="card-content">
              <div class="blog-meta">
                <span>${formatDate(post.date)}</span>
                <span>${getReadingTime(post.summary || '')} min read</span>
              </div>
              <h3>${escapeHtml(post.title)}</h3>
              <p>${escapeHtml(post.description || post.summary || '')}</p>
              <div class="project-meta">
                ${(post.tags || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join('')}
              </div>
              <a class="card-link" href="./index.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;

  const searchInput = document.getElementById('blog-search');
  const filterButtons = Array.from(document.querySelectorAll('[data-tag]'));
  const list = document.getElementById('blog-list');

  const applyListFilter = () => {
    const activeTag = document.querySelector('.filter-chip.active')?.dataset.tag || 'all';
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const cards = Array.from(list.querySelectorAll('.blog-card'));

    cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split(',').filter(Boolean);
      const text = card.textContent.toLowerCase();
      const matchesTag = activeTag === 'all' || tags.includes(activeTag);
      const matchesQuery = !query || text.includes(query);
      card.style.display = matchesTag && matchesQuery ? '' : 'none';
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((chip) => chip.classList.toggle('active', chip === button));
      applyListFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyListFilter);
  }
}

function updateMetaTags(description, title) {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', description || siteData.summary);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && window.location.href) canonical.setAttribute('href', window.location.href);

  document.title = `${title || siteData.name} | ${siteData.name}`;
}

function setupNavigation() {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const pageHash = window.location.hash || '#home';
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === pageHash;
    link.classList.toggle('active', active);
  });
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const nextTheme = savedTheme || preferred;
  document.documentElement.setAttribute('data-theme', nextTheme);

  const button = document.getElementById('theme-toggle');
  if (button) {
    button.textContent = nextTheme === 'dark' ? 'Light mode' : 'Dark mode';
    button.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', current);
      localStorage.setItem('portfolio-theme', current);
      button.textContent = current === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }
}

function renderHeader() {
  const headerInner = document.querySelector('.site-header .inner');
  if (!headerInner) return;

  const brandMarkup = `
    <a class="brand" href="${escapeHtml(getNavUrl('#home'))}"><span>Utkarsh</span> Bhola</a>
  `;

  const navMarkup = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Blog', href: './blog/index.html' },
    { label: 'Contact', href: '#contact' }
  ].map((item) => `<a class="nav-link ${item.href === '#home' ? 'active' : ''}" href="${escapeHtml(getNavUrl(item.href))}">${escapeHtml(item.label)}</a>`).join('');

  headerInner.innerHTML = `
    ${brandMarkup}
    <nav class="site-nav" aria-label="Main navigation">
      ${navMarkup}
    </nav>
    <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">Dark mode</button>
  `;

  initializeTheme();
  setupNavigation();
}

async function initPage() {
  const homePage = document.body.dataset.page === 'home';
  const blogPage = document.body.dataset.page === 'blog';

  if (homePage) {
    renderHome();
    updateMetaTags(siteData.summary, siteData.name);
    document.title = `${siteData.name} | Software Engineer`;
    return;
  }

  if (blogPage) {
    await renderBlogPage();
    return;
  }

  const isBlogRoute = window.location.pathname.includes('/blog');
  if (isBlogRoute) {
    await renderBlogPage();
    return;
  }

  renderHome();
  updateMetaTags(siteData.summary, siteData.name);
}

window.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  initPage();
});
