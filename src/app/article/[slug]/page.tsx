import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article not found | Best AI Assistant App",
    };
  }

  return {
    title: `${article.title} | Best AI Assistant App`,
    description: article.summary,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f5f2ea] px-6 py-10 text-zinc-950 md:px-10 lg:px-16">
      <article className="mx-auto max-w-4xl">
        <div className="mb-10 border-b border-black/10 pb-10">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500"
          >
            Best AI Assistant App
          </Link>
          <div className="mt-8 text-sm uppercase tracking-[0.24em] text-zinc-500">
            {article.category} · {article.readTime} · {article.publishedAt}
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-balance md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700">
            {article.summary}
          </p>
          <div className="mt-8 rounded-[2rem] border border-black/10 bg-white/70 p-6 text-base leading-7 text-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Editorial take
            </div>
            <p className="mt-3">{article.opinion}</p>
          </div>
        </div>

        <div className="space-y-7 text-lg leading-9 text-zinc-800">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 rounded-[2rem] border border-black/10 bg-white/75 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Subscribe
          </div>
          <h2 className="mt-4 font-serif text-3xl tracking-tight">
            Get the next AI assistant briefing in your inbox.
          </h2>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/8 bg-[#f7f4ee] p-2">
            <iframe
              src="https://subscribe-forms.beehiiv.com/bb32401e-c7a5-4631-bc05-ce32449ecf21"
              className="beehiiv-embed h-[320px] w-full bg-transparent"
              frameBorder="0"
              scrolling="no"
              title="Beehiiv subscribe form"
            />
          </div>
        </div>
      </article>
    </main>
  );
}
