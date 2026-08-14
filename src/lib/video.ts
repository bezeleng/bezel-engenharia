// src/lib/video.ts
interface VideoEmbedInfo {
  embedUrl: string;
  thumbnailUrl?: string;
}

export function getVideoEmbedInfo(url: string): VideoEmbedInfo | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
  );
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
    };
  }

  return null;
}