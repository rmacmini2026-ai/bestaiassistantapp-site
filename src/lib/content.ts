import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type CategorySlug =
  | "ai-assistants"
  | "ai-agents"
  | "voice-assistants"
  | "automation"
  | "remote-virtual-assistants"
  | "ai-assistant-apps";

export type Article = {
  slug: string;
  title: string;
  category: string;
  categorySlug: CategorySlug;
  summary: string;
  opinion: string;
  publishedAt: string;
  readTime: string;
  author: string;
  featured?: boolean;
  heroImage?: string;
  sourceUrl?: string;
  body: string[];
};

export const categoryMeta: Record<CategorySlug, { title: string; description: string }> = {
  "ai-assistants": {
    title: "AI Assistants",
    description: "Daily reporting on the products, companies, and workflow shifts shaping the future of AI assistants.",
  },
  "ai-agents": {
    title: "AI Agents",
    description: "Coverage of agent infrastructure, orchestration, memory, permissions, and real-world deployment.",
  },
  "voice-assistants": {
    title: "AI Voice Assistants",
    description: "Voice interfaces, multimodal assistants, speech workflows, and execution-layer voice products.",
  },
  automation: {
    title: "AI Automation",
    description: "News and analysis on automation systems, agentic workflows, and operational AI.",
  },
  "remote-virtual-assistants": {
    title: "Remote Virtual Assistants",
    description: "How AI is changing remote assistant work, delegation, and hybrid human-plus-AI service models.",
  },
  "ai-assistant-apps": {
    title: "AI Assistant Apps",
    description: "App launches, product strategy, growth moves, and market shifts around AI assistant apps.",
  },
};

const contentDir = path.join(process.cwd(), "content", "articles");

function parseArticle(filePath: string): Article {
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    categorySlug: data.categorySlug,
    summary: data.summary,
    opinion: data.opinion,
    publishedAt: data.publishedAt,
    readTime: data.readTime,
    author: data.author,
    featured: Boolean(data.featured),
    heroImage: data.heroImage,
    sourceUrl: data.sourceUrl,
    body: content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => parseArticle(path.join(contentDir, file)))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getFeaturedArticle() {
  const articles = getAllArticles();
  return articles.find((article) => article.featured) ?? articles[0];
}

export function getLatestArticles(limit?: number) {
  const articles = getAllArticles();
  return typeof limit === 'number' ? articles.slice(0, limit) : articles;
}

export function getArticleBySlug(slug: string) {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: CategorySlug) {
  return getAllArticles().filter((article) => article.categorySlug === categorySlug);
}
