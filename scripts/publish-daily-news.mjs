#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Parser from 'rss-parser';
import slugify from 'slugify';

const parser = new Parser();
const today = new Date().toISOString().slice(0, 10);
const outDir = path.join(process.cwd(), 'content', 'articles');
const generatedImageDir = path.join(process.cwd(), 'public', 'generated-images');

const feeds = [
  'https://openai.com/news/rss.xml',
  'https://blog.google/technology/ai/rss/',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
];

const categoryMap = [
  { match: /(voice|speech|audio|assistant voice|voice assistant)/i, category: 'AI Voice Assistants', slug: 'voice-assistants' },
  { match: /(agent|orchestration|operator|tool use|memory|workflow runtime)/i, category: 'AI Agents', slug: 'ai-agents' },
  { match: /(automation|automate|workflow|zapier|make.com|delegate)/i, category: 'AI Automation', slug: 'automation' },
  { match: /(virtual assistant|remote assistant|executive assistant)/i, category: 'Remote Virtual Assistants', slug: 'remote-virtual-assistants' },
  { match: /(app|mobile|assistant app|consumer assistant)/i, category: 'AI Assistant Apps', slug: 'ai-assistant-apps' },
];

const nicheGate = /(assistant|assistants|agent|agents|automation|automate|workflow|voice|virtual assistant|remote assistant|tool use|operator)/i;

function inferCategory(text) {
  for (const rule of categoryMap) {
    if (rule.match.test(text)) return rule;
  }
  return { category: 'AI Assistants', slug: 'ai-assistants' };
}

function clean(text = '') {
  return text.replace(/\s+/g, ' ').replace(/"/g, '\\"').trim();
}

function getHeroImage(item) {
  const enclosure = item.enclosure?.url || item.enclosure?.link;
  if (enclosure) return enclosure;
  const content = item['content:encoded'] || item.content || '';
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || '';
}

function escapeXml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapTitle(title, max = 24) {
  const words = title.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

function createFallbackHeroImage({ slug, title, category }) {
  fs.mkdirSync(generatedImageDir, { recursive: true });
  const outPath = path.join(generatedImageDir, `${slug}.svg`);
  if (fs.existsSync(outPath)) {
    return `/generated-images/${slug}.svg`;
  }
  const lines = wrapTitle(title);
  const tspan = lines
    .map((line, index) => `<tspan x="80" dy="${index === 0 ? 0 : 76}">${escapeXml(line)}</tspan>`)
    .join('');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="900" fill="#0C0C0D"/>
  <rect x="60" y="60" width="1480" height="780" rx="36" fill="url(#bg)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="80" y="96" width="220" height="18" rx="9" fill="#D4AF37" opacity="0.9"/>
  <text x="80" y="165" fill="#E7E5E4" font-size="24" font-family="Arial, Helvetica, sans-serif" letter-spacing="6">${escapeXml(category.toUpperCase())}</text>
  <text x="80" y="290" fill="#F8F7F2" font-size="72" font-weight="700" font-family="Georgia, 'Times New Roman', serif">${tspan}</text>
  <text x="80" y="760" fill="#B3B0AA" font-size="28" font-family="Arial, Helvetica, sans-serif">Best AI Assistant App</text>
  <circle cx="1360" cy="180" r="140" fill="#1F2937" opacity="0.55"/>
  <circle cx="1260" cy="710" r="220" fill="#111827" opacity="0.7"/>
  <defs>
    <linearGradient id="bg" x1="80" y1="60" x2="1520" y2="840" gradientUnits="userSpaceOnUse">
      <stop stop-color="#111214"/>
      <stop offset="1" stop-color="#171819"/>
    </linearGradient>
  </defs>
</svg>`;
  fs.writeFileSync(outPath, svg);
  return `/generated-images/${slug}.svg`;
}

function buildArticle(item) {
  const sourceText = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`;
  if (!nicheGate.test(sourceText)) return null;

  const inferred = inferCategory(sourceText);
  const cleanTitle = clean(item.title || 'Untitled AI assistant story');
  const slug = slugify(cleanTitle, { lower: true, strict: true, trim: true }).slice(0, 72);
  const summaryBase = clean(item.contentSnippet || 'A new development is reshaping the AI assistant and automation landscape.');
  const summary = summaryBase.length > 210 ? `${summaryBase.slice(0, 207)}...` : summaryBase;
  const opinion = clean(`What matters here is not just the headline. It is what this changes for the assistant, agent, automation, or operator stack right now.`);
  const sourceHeroImage = clean(getHeroImage(item));
  const heroImage = sourceHeroImage || createFallbackHeroImage({ slug, title: cleanTitle, category: inferred.category });

  const paragraphs = [
    `${cleanTitle} matters because the AI assistant market is shifting away from isolated chat experiences and toward execution, delegation, and workflow ownership.`,
    `${summary}`,
    `The operator takeaway is the real point. If this improves context, execution, speed, or leverage for people building with assistants and agents, it matters. If it is only model theater, it does not.`
  ];

  return {
    slug,
    category: inferred.category,
    categorySlug: inferred.slug,
    title: cleanTitle,
    summary,
    opinion,
    heroImage,
    sourceUrl: clean(item.link || ''),
    markdown: `---\ntitle: "${cleanTitle}"\nslug: "${slug}"\ncategory: "${inferred.category}"\ncategorySlug: "${inferred.slug}"\nsummary: "${summary}"\nopinion: "${opinion}"\npublishedAt: "${today}"\nreadTime: "4 min read"\nauthor: "Best AI Assistant App Editorial"\nfeatured: false\nheroImage: "${heroImage}"\nsourceUrl: "${clean(item.link || '')}"\n---\n\n${paragraphs.join('\n\n')}\n`,
  };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(generatedImageDir, { recursive: true });
  const existing = new Set(fs.readdirSync(outDir));
  const candidates = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const item of (feed.items || []).slice(0, 6)) {
        const article = buildArticle(item);
        if (article) candidates.push(article);
      }
    } catch (error) {
      console.error(`Feed failed: ${feedUrl}`);
      console.error(error instanceof Error ? error.message : String(error));
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const article of candidates) {
    if (seen.has(article.slug)) continue;
    seen.add(article.slug);
    deduped.push(article);
  }

  const selected = deduped.slice(0, 5);
  let created = 0;
  for (const article of selected) {
    const fileName = `${today}-${article.slug}.md`;
    if (existing.has(fileName)) continue;
    fs.writeFileSync(path.join(outDir, fileName), article.markdown);
    existing.add(fileName);
    created += 1;
  }

  console.log(`Created ${created} new article files from ${selected.length} selected stories.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
