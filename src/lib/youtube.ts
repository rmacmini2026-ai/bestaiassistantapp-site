export type VideoCard = {
  id: string;
  title: string;
  description: string;
  publishedText: string;
  url: string;
  embedUrl: string;
  thumbnail: string;
};

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@nateherk';

const fallbackVideos: VideoCard[] = [
  {
    id: 'fallback-1',
    title: 'How AI automation is changing the way operators work',
    description:
      'A featured slot for the latest breakdown on assistants, agents, and AI automation systems.',
    publishedText: 'Latest from YouTube',
    url: YOUTUBE_CHANNEL_URL,
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  },
  {
    id: 'fallback-2',
    title: 'Operator systems, automations, and AI leverage',
    description:
      'A supporting slot for practical AI workflow and automation content from the channel.',
    publishedText: 'Latest from YouTube',
    url: YOUTUBE_CHANNEL_URL,
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: 'fallback-3',
    title: 'AI assistants, agents, and execution layers',
    description:
      'A card for product breakdowns, AI business angles, and execution-first commentary.',
    publishedText: 'Latest from YouTube',
    url: YOUTUBE_CHANNEL_URL,
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: 'fallback-4',
    title: 'AI automation workflows worth stealing',
    description:
      'A card for videos on systems, delegation, and practical implementation.',
    publishedText: 'Latest from YouTube',
    url: YOUTUBE_CHANNEL_URL,
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
];

export async function getLatestYouTubeVideos(): Promise<VideoCard[]> {
  try {
    const { Innertube } = await import('youtubei.js');
    const youtube = await Innertube.create();
    const channel = await youtube.getChannel('UCX6b17PVsYBQ0ip5gyeme-Q');
    const videosTab = await channel.getVideos();
    const latest = videosTab.videos.slice(0, 4);

    const mapped = latest
      .map((video: any) => ({
        id: String(video.id ?? ''),
        title: String(video.title?.text ?? video.title ?? 'Untitled video'),
        description: String(
          video.description_snippet?.text ??
            'Latest video from Nate Herk on AI automation and assistants.'
        ),
        publishedText: String(
          video.published?.text ?? video.published ?? 'Latest from YouTube'
        ),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        thumbnail: String(video.thumbnails?.[video.thumbnails.length - 1]?.url ?? ''),
      }))
      .filter((video: VideoCard) => video.id && video.url);

    return mapped.length ? mapped : fallbackVideos;
  } catch {
    return fallbackVideos;
  }
}
