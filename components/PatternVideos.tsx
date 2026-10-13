import { ArrowUpRight, Play } from "lucide-react";
import type { Pattern } from "@/lib/patterns";
import { getPatternVideos } from "@/lib/youtube";
import PatternImage from "./PatternImage";

export default async function PatternVideos({ pattern }: { pattern: Pattern }) {
  const { videos, searchUrl, failed } = await getPatternVideos(pattern);
  return (
    <section className="related pattern-videos" aria-labelledby="pattern-videos-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow accent">YouTube · 함께 보는 뜨개 영상</p>
          <h2 id="pattern-videos-title">영상으로도 살펴보세요.</h2>
        </div>
        <a className="text-link" href={searchUrl} target="_blank" rel="noopener noreferrer">
          YouTube에서 더 찾아보기 <ArrowUpRight size={16} />
        </a>
      </div>
      <p className="section-note video-intro">
        작가와 도안의 특징으로 찾은 영상이에요. 한국어 정보를 우선하며, 다른 도안의 참고 영상도
        포함될 수 있어요.
      </p>
      {videos.length ? (
        <div className="video-grid">
          {videos.map((video) => (
            <a
              className="video-card"
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${video.title} — YouTube에서 새 창으로 보기`}
            >
              <div className="video-thumbnail">
                <PatternImage src={video.thumbnail} alt="" />
                <span className="video-play">
                  <Play size={20} fill="currentColor" aria-hidden="true" /> YouTube
                </span>
              </div>
              <div className="video-copy">
                <div className="video-labels">
                  <span>{video.languageLabel}</span>
                  <span>{video.matchLabel}</span>
                </div>
                <h3>{video.title}</h3>
                <p>{video.channel}</p>
                <span className="text-link">
                  YouTube에서 보기 <ArrowUpRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="notice" role="status">
          {failed
            ? "지금은 영상을 불러오지 못했어요. YouTube에서 직접 찾아볼 수 있어요."
            : "관련성이 높은 영상을 아직 찾지 못했어요. YouTube에서 더 찾아보세요."}
        </p>
      )}
    </section>
  );
}
