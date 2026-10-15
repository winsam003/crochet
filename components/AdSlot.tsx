"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import AdFit from "@/lib/Adfit";

const units = {
  list: "DAN-b73VqJKhr8wia8ay",
  content: "DAN-Isg7W9GyLwQgmWcF",
};

type Props = { footer?: boolean; placement?: keyof typeof units };

function Slot({ footer = false, placement = "list" }: Props) {
  const [empty, setEmpty] = useState(false);
  const onEmpty = useCallback(() => setEmpty(true), []);
  if (empty) return null;
  return (
    <aside className={footer ? "ad-slot footer-ad" : "ad-slot inline-ad"} aria-label="광고">
      <span className="ad-label">ADVERTISEMENT · 광고</span>
      <AdFit
        unit={units[footer ? "content" : placement]}
        width="300"
        height="250"
        onEmpty={onEmpty}
      />
    </aside>
  );
}

export default function AdSlot(props: Props) {
  const pathname = usePathname();
  // Reading pages already have an in-content slot. Saved patterns stay uncluttered.
  if (
    props.footer &&
    (pathname.startsWith("/pattern/") || pathname === "/guide" || pathname === "/saved")
  )
    return null;
  return (
    <Slot key={`${pathname}-${props.placement ?? "list"}-${props.footer ?? false}`} {...props} />
  );
}
