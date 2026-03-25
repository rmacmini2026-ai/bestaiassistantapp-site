"use client";

import { useMemo, useState } from "react";
import type { VideoCard } from "@/lib/youtube";

type Props = {
  videos: VideoCard[];
};

export function VideoSection({ videos }: Props) {
  const safeVideos = useMemo(() => videos.filter(Boolean), [videos]);
  const [activeId, setActiveId] = useState(safeVideos[0]?.id);

  const activeVideo =
    safeVideos.find((video) => video.id === activeId) ?? safeVideos[0];
  const supportingVideos = safeVideos.filter((video) => video.id !== activeVideo?.id);

  if (!activeVideo) return null;

  return (
    <section className="border-t border-black/10 pt-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Video
          </div>
          <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">
            Latest AI Video Briefings
          </h2>
          <p className="max-w-2xl text-base leading-7 text-zinc-700">
            Watch the latest explainers, breakdowns, and operator-focused commentary on AI assistants, agents, and automation directly on the site.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <div className="overflow-hidden rounded-[2.5rem] border border-black/10 bg-[#111111] p-5 text-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:p-6">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/30">
            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                key={activeVideo.id}
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="space-y-3 p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Featured video · {activeVideo.publishedText}
              </div>
              <h3 className="max-w-2xl font-serif text-3xl leading-tight tracking-tight md:text-5xl">
                {activeVideo.title}
              </h3>
              <p className="max-w-xl text-sm leading-6 text-zinc-300 md:text-base">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {supportingVideos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveId(video.id)}
              className="rounded-[2rem] border border-black/10 bg-white/75 p-5 text-left shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition hover:bg-white"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                {video.publishedText} · Video briefing
              </p>
              <h3 className="mt-3 font-serif text-2xl leading-tight tracking-tight text-zinc-950">
                {video.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-700 md:text-base">
                {video.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
