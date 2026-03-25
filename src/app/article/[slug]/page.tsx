import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { SubscribeCard } from "@/components/subscribe-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found | Best AI Assistant App" };
  }

  return {
    title: `${article.title} | Best AI Assistant App`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      images: article.heroImage ? [{ url: article.heroImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: article.heroImage ? [article.heroImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f2ea] px-6 py-10 text-zinc-950 md:px-10 lg:px-16">
      <article className="mx-auto max-w-4xl">
        <div className="mb-10 border-b border-black/10 pb-10">
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Best AI Assistant App
          </Link>
          <div className="mt-8 text-sm uppercase tracking-[0.24em] text-zinc-500">
            {article.category} · {article.readTime} · {article.publishedAt}
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-balance md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700">{article.summary}</p>
          {article.heroImage ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <img src={article.heroImage} alt={article.title} className="aspect-[16/9] w-full object-cover" />
            </div>
          ) : null}
          <div className="mt-8 rounded-[2rem] border border-black/10 bg-white/70 p-6 text-base leading-7 text-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Editorial take</div>
            <p className="mt-3">{article.opinion}</p>
          </div>
        </div>

        <div className="space-y-7 text-lg leading-9 text-zinc-800">
          {article.body.map((paragraph, index) => (
            <div key={`${article.slug}-${index}`} className="space-y-7">
              <p>{paragraph}</p>
              {index === 0 && article.heroImage ? (
                <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                  <img src={article.heroImage} alt={article.title} className="aspect-[16/9] w-full object-cover opacity-95" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-14"><SubscribeCard /></div>
      </article>
    </main>
  );
}
