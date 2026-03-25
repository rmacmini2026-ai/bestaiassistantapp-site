#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Parser from 'rss-parser';
import slugify from 'slugify';

const parser = new Parser();
const today = new Date().toISOString().slice(0, 10);
const outDir = path.join(process.cwd(), 'content', 'articles');

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

function buildArticle(item) {
  const sourceText = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`;
  if (!nicheGate.test(sourceText)) return null;

  const inferred = inferCategory(sourceText);
  const cleanTitle = clean(item.title || 'Untitled AI assistant story');
  const slug = slugify(cleanTitle, { lower: true, strict: true, trim: true }).slice(0, 72);
  const summaryBase = clean(item.contentSnippet || 'A new development is reshaping the AI assistant and automation landscape.');
  const summary = summaryBase.length > 210 ? `${summaryBase.slice(0, 207)}...` : summaryBase;
  const opinion = clean(`What matters here is not just the headline. It is what this changes for the assistant, agent, automation, or operator stack right now.`);
  const heroImage = clean(getHeroImage(item));

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
