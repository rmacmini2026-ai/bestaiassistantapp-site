import Link from "next/link";
import {
  categoryMeta,
  getFeaturedArticle,
  getLatestArticles,
} from "@/lib/content";
import { getLatestYouTubeVideos } from "@/lib/youtube";
import { VideoSection } from "@/components/video-section";
import { SubscribeCard } from "@/components/subscribe-card";

export default async function Home() {
  const topStories = getLatestArticles(3);
  const featuredStory = getFeaturedArticle();
  const latestArticles = getLatestArticles(6);
  const categories = Object.entries(categoryMeta);
  const videos = await getLatestYouTubeVideos();

  return (
    <main className="min-h-screen bg-[#f5f2ea] text-zinc-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-12 pt-8 md:px-10 lg:px-16">
        <header className="flex flex-col gap-8 border-b border-black/10 pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Best AI Assistant App
              </div>
              <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight text-balance md:text-7xl">
                Daily intelligence on AI assistants, agents, automation, and what matters next.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-700 md:text-lg">
                A clean editorial publication covering the companies, products, workflows, and ideas shaping the future of AI assistants and AI-powered work.
              </p>
            </div>
            <SubscribeCard />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categories.map(([slug, meta]) => (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className="rounded-full border border-black/10 bg-white/60 px-4 py-3 text-sm text-zinc-700 shadow-sm transition hover:bg-white"
              >
                {meta.title}
              </Link>
            ))}
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <article className="rounded-[2.5rem] border border-black/10 bg-[#111111] p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:p-12">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              {featuredStory.category}
            </div>
            <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-tight text-balance md:text-6xl">
              {featuredStory.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              {featuredStory.summary}
            </p>
            <div className="mt-6 max-w-2xl border-l border-white/20 pl-4 text-sm leading-6 text-zinc-400 md:text-base">
              {featuredStory.opinion}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/article/${featuredStory.slug}`} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
                Read article
              </Link>
              <Link href={`/category/${featuredStory.categorySlug}`} className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5">
                Explore category
              </Link>
            </div>
          </article>

          <div className="space-y-4">
            {topStories.map((story) => (
              <article key={story.slug} className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  {story.category}
                </div>
                <h3 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-zinc-950">
                  <Link href={`/article/${story.slug}`}>{story.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-700 md:text-base">{story.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-black/10 pt-10 lg:grid-cols-[0.95fr_1.45fr]">
          <div className="space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Daily briefing
            </div>
            <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">
              Daily AI assistant news, filtered for what actually matters.
            </h2>
            <p className="max-w-xl text-base leading-7 text-zinc-700">
              Every morning, the site refreshes with the most relevant stories in AI assistants, agents, voice, automation, and assistant apps — filtered for signal, not noise.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {latestArticles.map((article) => (
              <article key={article.slug} className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  {article.category} · {article.readTime}
                </p>
                <h3 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-zinc-950">
                  <Link href={`/article/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="mt-4 text-sm leading-6 text-zinc-700">{article.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <VideoSection videos={videos} />
      </section>
    </main>
  );
}
