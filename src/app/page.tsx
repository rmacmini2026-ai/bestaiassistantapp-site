import Link from "next/link";
import {
  categoryMeta,
  getFeaturedArticle,
  getLatestArticles,
} from "@/lib/content";

const topStories = getLatestArticles(3);
const featuredStory = getFeaturedArticle();
const latestArticles = getLatestArticles(6);
const categories = Object.entries(categoryMeta);
const videoCards = [
  {
    title: "How AI assistants are becoming the new operating layer",
    meta: "Featured video · YouTube",
    description:
      "A flagship explainer slot for your strongest weekly video on assistants, agents, and AI workflow shifts.",
  },
  {
    title: "AI agent breakdowns",
    meta: "Series slot · YouTube",
    description:
      "Use this for shorter breakdowns on tools, launches, and operator strategies worth paying attention to.",
  },
  {
    title: "Voice assistant updates",
    meta: "Series slot · YouTube",
    description:
      "A dedicated home for multimodal voice, real-time assistants, and interface-layer product changes.",
  },
  {
    title: "Automation and remote assistant workflows",
    meta: "Series slot · YouTube",
    description:
      "Use this area for workflow demos, behind-the-scenes builds, and practical deployment videos.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f2ea] text-zinc-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-12 pt-8 md:px-10 lg:px-16">
        <header className="flex flex-col gap-8 border-b border-black/10 pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <SectionLabel>Best AI Assistant App</SectionLabel>
              <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight text-balance md:text-7xl">
                Daily intelligence on AI assistants, agents, automation, and
                what matters next.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-700 md:text-lg">
                A clean editorial publication covering the companies, products,
                workflows, and ideas shaping the future of AI assistants and
                AI-powered work.
              </p>
            </div>
            <div className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur">
              <div className="mb-4 px-3 pt-2">
                <SectionLabel>Subscribe</SectionLabel>
                <p className="mt-3 text-sm leading-6 text-zinc-700 md:text-base">
                  Get the latest AI assistant news delivered to your inbox every
                  morning.
                </p>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-black/8 bg-[#f7f4ee] p-2">
                <iframe
                  src="https://subscribe-forms.beehiiv.com/bb32401e-c7a5-4631-bc05-ce32449ecf21"
                  className="beehiiv-embed h-[320px] w-full bg-transparent"
                  data-test-id="beehiiv-embed"
                  frameBorder="0"
                  scrolling="no"
                  title="Beehiiv subscribe form"
                />
              </div>
            </div>
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
            <SectionLabel>{featuredStory.category}</SectionLabel>
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
              <Link
                href={`/article/${featuredStory.slug}`}
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Read article
              </Link>
              <Link
                href={`/category/${featuredStory.categorySlug}`}
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Explore category
              </Link>
            </div>
          </article>

          <div className="space-y-4">
            {topStories.map((story) => (
              <article
                key={story.slug}
                className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
              >
                <SectionLabel>{story.category}</SectionLabel>
                <h3 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-zinc-950">
                  <Link href={`/article/${story.slug}`}>{story.title}</Link>
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-700 md:text-base">
                  {story.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-t border-black/10 pt-10 lg:grid-cols-[0.95fr_1.45fr]">
          <div className="space-y-4">
            <SectionLabel>Publishing engine</SectionLabel>
            <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">
              Built to publish fresh AI assistant coverage every morning at 5:00
              AM PST.
            </h2>
            <p className="max-w-xl text-base leading-7 text-zinc-700">
              The site is structured for an automated pipeline: collect stories,
              rank the most relevant topics, generate summary-plus-opinion
              articles, and publish them daily to the homepage and category
              feeds.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {latestArticles.map((article) => (
              <article
                key={article.slug}
                className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  {article.category} · {article.readTime}
                </p>
                <h3 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-zinc-950">
                  <Link href={`/article/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="mt-4 text-sm leading-6 text-zinc-700">
                  {article.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 pt-10">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <SectionLabel>Video</SectionLabel>
              <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">
                A video layer for explainers, breakdowns, and weekly AI
                assistant analysis.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-zinc-700">
                This placeholder section is ready for YouTube embeds. Once your
                channel feed is wired in, this area can surface the latest
                featured video plus supporting clips automatically.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="overflow-hidden rounded-[2.5rem] border border-black/10 bg-[#111111] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:p-6">
              <div className="aspect-video rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.01)_100%)] p-6">
                <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/10 bg-black/30 p-6">
                  <div className="space-y-3">
                    <SectionLabel>{videoCards[0].meta}</SectionLabel>
                    <h3 className="max-w-2xl font-serif text-3xl leading-tight tracking-tight md:text-5xl">
                      {videoCards[0].title}
                    </h3>
                    <p className="max-w-xl text-sm leading-6 text-zinc-300 md:text-base">
                      {videoCards[0].description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg">
                      ▶
                    </div>
                    <span>YouTube featured video slot</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {videoCards.slice(1).map((video) => (
                <article
                  key={video.title}
                  className="rounded-[2rem] border border-black/10 bg-white/75 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    {video.meta}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl leading-tight tracking-tight text-zinc-950">
                    {video.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-700 md:text-base">
                    {video.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
