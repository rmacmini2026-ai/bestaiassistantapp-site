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
  { match: /(voice|speech|audio)/i, category: 'AI Voice Assistants', slug: 'voice-assistants' },
  { match: /(agent|orchestration|workflow|operator)/i, category: 'AI Agents', slug: 'ai-agents' },
  { match: /(automation|automate|workflow)/i, category: 'AI Automation', slug: 'automation' },
  { match: /(virtual assistant|remote assistant)/i, category: 'Remote Virtual Assistants', slug: 'remote-virtual-assistants' },
  { match: /(app|mobile|assistant app)/i, category: 'AI Assistant Apps', slug: 'ai-assistant-apps' },
];

function inferCategory(text) {
  for (const rule of categoryMap) {
    if (rule.match.test(text)) return rule;
  }
  return { category: 'AI Assistants', slug: 'ai-assistants' };
}

function toMarkdown(item) {
  const sourceText = `${item.title} ${item.contentSnippet || ''} ${item.content || ''}`;
  const inferred = inferCategory(sourceText);
  const cleanTitle = item.title.replace(/\s+/g, ' ').trim();
  const slug = slugify(cleanTitle, { lower: true, strict: true, trim: true }).slice(0, 72);
  const summary = (item.contentSnippet || 'New developments in AI assistants and automation are reshaping how people work.').replace(/\s+/g, ' ').trim();
  const opinion = `The practical takeaway is not just that ${cleanTitle.toLowerCase()} matters. It is how this changes the assistant, agent, and automation stack for operators right now.`;
  const body = [
    `${cleanTitle} is part of a larger shift in how AI assistants, agents, and automation systems are evolving in public.`,
    `${summary}`,
    `The operator angle is what matters most here: products that improve execution, reduce friction, and create leverage for teams will keep compounding while generic AI noise gets ignored.`,
  ].join('\n\n');

  return `---\ntitle: "${cleanTitle.replace(/"/g, '\\"')}"\nslug: "${slug}"\ncategory: "${inferred.category}"\ncategorySlug: "${inferred.slug}"\nsummary: "${summary.replace(/"/g, '\\"')}"\nopinion: "${opinion.replace(/"/g, '\\"')}"\npublishedAt: "${today}"\nreadTime: "4 min read"\nauthor: "Best AI Assistant App Editorial"\nfeatured: false\nsourceUrl: "${item.link || ''}"\n---\n\n${body}\n`;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const existing = new Set(fs.readdirSync(outDir));
  let created = 0;

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const item of (feed.items || []).slice(0, 3)) {
        if (!item.title) continue;
        const slug = slugify(item.title, { lower: true, strict: true, trim: true }).slice(0, 72);
        const fileName = `${today}-${slug}.md`;
        if (existing.has(fileName)) continue;
        fs.writeFileSync(path.join(outDir, fileName), toMarkdown(item));
        existing.add(fileName);
        created += 1;
      }
    } catch (error) {
      console.error(`Feed failed: ${feedUrl}`);
      console.error(error instanceof Error ? error.message : String(error));
    }
  }

  console.log(`Created ${created} new article files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
