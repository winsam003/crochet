let nextCallbackId = 0;

// Each slot is initialized once when it approaches the viewport. The SDK itself
// is left unchanged; dynamically mounted slots use its documented script markup.
export function mountAdFit(
  container: HTMLElement,
  {
    unit,
    width,
    height,
    onEmpty,
  }: {
    unit: string;
    width: string;
    height: string;
    onEmpty: () => void;
  },
) {
  let disposed = false;
  let started = false;
  let observer: IntersectionObserver | undefined;
  let script: HTMLScriptElement | undefined;
  const callbackName = `__winsamAdFitNoAd${++nextCallbackId}`;
  const callbacks = window as unknown as Record<string, unknown>;

  function fail() {
    if (disposed) return;
    container.replaceChildren();
    onEmpty();
  }

  function load() {
    if (started || disposed) return;
    started = true;
    observer?.disconnect();
    callbacks[callbackName] = fail;
    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.style.width = "100%";
    ins.setAttribute("data-ad-unit", unit);
    ins.setAttribute("data-ad-width", width);
    ins.setAttribute("data-ad-height", height);
    ins.setAttribute("data-ad-onfail", callbackName);
    script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.src = "https://t1.kakaocdn.net/kas/static/ba.min.js";
    script.async = true;
    script.onerror = fail;
    container.replaceChildren(ins, script);
  }

  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) load();
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(container);
  } else {
    load();
  }

  return () => {
    disposed = true;
    observer?.disconnect();
    if (script) script.onerror = null;
    delete callbacks[callbackName];
    container.replaceChildren();
  };
}
