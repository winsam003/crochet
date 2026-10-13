import AdFit from "@/lib/Adfit";

export default function AdSlot({ footer = false }: { footer?: boolean }) {
  return (
    <aside className={footer ? "ad-slot footer-ad" : "ad-slot inline-ad"} aria-label="광고">
      <span className="ad-label">ADVERTISEMENT · 광고</span>
      <AdFit unit="DAN-Isg7W9GyLwQgmWcF" width="300" height="250" />
    </aside>
  );
}
