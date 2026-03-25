import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categoryMeta,
  getArticlesByCategory,
  type CategorySlug,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMeta[slug as CategorySlug];

  if (!meta) {
    return {
      title: "Category not found | Best AI Assistant App",
    };
  }

  return {
    title: `${meta.title} | Best AI Assistant App`,
    description: meta.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const typedSlug = slug as CategorySlug;
  const meta = categoryMeta[typedSlug];

  if (!meta) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(typedSlug);

  return (
    <main className="min-h-screen bg-[#f5f2ea] px-6 py-10 text-zinc-950 md:px-10 lg:px-16">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500"
        >
          Best AI Assistant App
        </Link>
        <div className="mt-8 max-w-3xl border-b border-black/10 pb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Category
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
            {meta.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-zinc-700">{meta.description}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categoryArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                {article.publishedAt} · {article.readTime}
              </p>
              <h2 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-zinc-950">
                <Link href={`/article/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-700">
                {article.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
