"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Bookmark, Check, ArrowUpRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { type SavedPattern, detailHref } from "@/lib/patterns";
import PatternImage from "./PatternImage";
const EVENT = "winsam-library";
const keys = { saved: "winsam.saved.v1", recent: "winsam.recent.v1" };
function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function snapshot(key: string) {
  try {
    return localStorage.getItem(key) || "[]";
  } catch {
    return "[]";
  }
}
function read(value: string): SavedPattern[] {
  try {
    const arr = JSON.parse(value);
    return Array.isArray(arr)
      ? arr.filter(
          (p) =>
            Number.isFinite(p?.id) &&
            typeof p.name === "string" &&
            typeof p.image === "string" &&
            typeof p.designer === "string",
        )
      : [];
  } catch {
    return [];
  }
}
function write(key: string, items: SavedPattern[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items.slice(0, 100)));
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    return false;
  }
}
function useItems(key: string) {
  return read(
    useSyncExternalStore(
      subscribe,
      () => snapshot(key),
      () => "[]",
    ),
  );
}
export function SaveButton({
  pattern,
  compact = false,
}: {
  pattern: SavedPattern;
  compact?: boolean;
}) {
  const items = useItems(keys.saved);
  const active = items.some((p) => p.id === pattern.id);
  const [error, setError] = useState(false);
  return (
    <span className="save-wrap">
      <button
        type="button"
        className={compact ? "save-icon" : `secondary-button ${active ? "is-saved" : ""}`}
        aria-label={`${pattern.name} ${active ? "저장 취소" : "저장"}`}
        aria-pressed={active}
        onClick={() =>
          setError(
            !write(
              keys.saved,
              active ? items.filter((p) => p.id !== pattern.id) : [pattern, ...items],
            ),
          )
        }
      >
        <Bookmark size={17} fill={active ? "currentColor" : "none"} />
        {!compact && (active ? "저장했어요" : "도안 저장")}
      </button>
      {error && (
        <span role="status" className="storage-error">
          브라우저 저장 공간을 사용할 수 없어요.
        </span>
      )}
    </span>
  );
}
export function RecentTracker({ pattern }: { pattern: SavedPattern }) {
  useEffect(() => {
    const old = read(snapshot(keys.recent));
    write(keys.recent, [pattern, ...old.filter((p) => p.id !== pattern.id)].slice(0, 12));
  }, [pattern]);
  return null;
}
export function LibraryView() {
  const saved = useItems(keys.saved),
    recent = useItems(keys.recent);
  const [tab, setTab] = useState<"saved" | "recent">("saved");
  const items = tab === "saved" ? saved : recent;
  const [error, setError] = useState(false);
  return (
    <>
      <div className="library-tabs">
        <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>
          저장한 도안 <span>{saved.length}</span>
        </button>
        <button className={tab === "recent" ? "active" : ""} onClick={() => setTab("recent")}>
          최근 본 도안 <span>{recent.length}</span>
        </button>
      </div>
      {items.length ? (
        <div className="pattern-grid">
          {items.map((p) => (
            <article className="pattern-card" key={p.id}>
              <div className="card-image">
                <Link href={detailHref(p.id, "/saved")}>
                  <PatternImage src={p.image} alt={p.name} />
                </Link>
                <SaveButton pattern={p} compact />
              </div>
              <div className="card-copy">
                <p className="eyebrow">{p.designer}</p>
                <h2>
                  <Link href={detailHref(p.id, "/saved")}>{p.name}</Link>
                </h2>
                <Link className="text-link" href={detailHref(p.id, "/saved")}>
                  도안 다시 보기 <ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark size={28} />
          <h2>
            {tab === "saved" ? "마음에 드는 도안을 모아보세요." : "아직 살펴본 도안이 없어요."}
          </h2>
          <p>도안의 북마크 버튼을 누르면 여기에 보관됩니다.</p>
          <Link className="primary-button" href="/">
            도안 찾아보기 <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
      {tab === "recent" && items.length > 0 && (
        <button
          className="text-link clear-history"
          onClick={() => setError(!write(keys.recent, []))}
        >
          <Trash2 size={15} />
          최근 기록 지우기
        </button>
      )}
      {error && <p role="status">저장 공간에 접근할 수 없어요.</p>}
    </>
  );
}
export function AcquiredButton({ id }: { id: number }) {
  const key = `winsam.acquired.${id}`;
  const value = useSyncExternalStore(
    subscribe,
    () => snapshot(key),
    () => "[]",
  );
  const [error, setError] = useState(false);
  return (
    <>
      <button
        className="text-link acquired"
        aria-pressed={value === "yes"}
        onClick={() => {
          try {
            localStorage.setItem(key, value === "yes" ? "no" : "yes");
            window.dispatchEvent(new Event(EVENT));
          } catch {
            setError(true);
          }
        }}
      >
        <Check size={16} />
        {value === "yes" ? "도안을 구했어요 · 기록됨" : "도안을 구했어요"}
      </button>
      {error && <p role="status">이 브라우저에 기록할 수 없어요.</p>}
    </>
  );
}
