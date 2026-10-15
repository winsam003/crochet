import { test } from "node:test";
import assert from "node:assert/strict";
import { mountAdFit } from "../lib/adfit-loader.ts";

function setup(t, lazy = true) {
  const saved = Object.fromEntries(
    ["window", "document", "IntersectionObserver"].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  t.after(() => {
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  const observers = [];
  class Observer {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      observers.push(this);
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  }
  globalThis.window = lazy ? { IntersectionObserver: Observer } : {};
  globalThis.IntersectionObserver = Observer;
  globalThis.document = {
    createElement: (tag) => ({
      tag,
      style: {},
      attributes: {},
      setAttribute(key, value) {
        this.attributes[key] = value;
      },
    }),
  };
  const container = {
    children: [],
    replaceChildren(...children) {
      this.children = children;
    },
  };
  let empty = 0;
  const options = {
    unit: "DAN-test",
    width: "300",
    height: "250",
    onEmpty: () => {
      empty++;
    },
  };
  return { observers, container, options, empty: () => empty };
}

test("does not request ads offscreen and initializes only once near the viewport", (t) => {
  const env = setup(t);
  const cleanup = mountAdFit(env.container, env.options);
  assert.equal(env.container.children.length, 0);
  const observer = env.observers[0];
  assert.equal(observer.options.rootMargin, "200px 0px");
  observer.callback([{ isIntersecting: false }]);
  assert.equal(env.container.children.length, 0);
  observer.callback([{ isIntersecting: true }]);
  const [ins, script] = env.container.children;
  assert.equal(ins.attributes["data-ad-unit"], "DAN-test");
  assert.equal(ins.attributes["data-ad-width"], "300");
  assert.equal(script.src, "https://t1.kakaocdn.net/kas/static/ba.min.js");
  observer.callback([{ isIntersecting: true }]);
  assert.equal(env.container.children[1], script);
  assert.equal(observer.disconnected, true);
  cleanup();
});

test("NO-AD callbacks are slot-specific and clean up on unmount", (t) => {
  const env = setup(t, false);
  const other = { ...env.container, children: [] };
  const cleanup = mountAdFit(env.container, env.options);
  const cleanupOther = mountAdFit(other, env.options);
  const callback = env.container.children[0].attributes["data-ad-onfail"];
  const otherCallback = other.children[0].attributes["data-ad-onfail"];
  assert.notEqual(callback, otherCallback);
  window[callback]();
  assert.equal(env.empty(), 1);
  assert.equal(env.container.children.length, 0);
  assert.equal(other.children.length, 2);
  const lateCallback = window[otherCallback];
  cleanup();
  cleanupOther();
  lateCallback();
  assert.equal(env.empty(), 1);
  assert.equal(window[callback], undefined);
  assert.equal(window[otherCallback], undefined);
});

test("SDK load errors collapse the slot", (t) => {
  const env = setup(t, false);
  const cleanup = mountAdFit(env.container, env.options);
  env.container.children[1].onerror();
  assert.equal(env.empty(), 1);
  assert.equal(env.container.children.length, 0);
  cleanup();
});

test("unmount before visibility prevents late initialization", (t) => {
  const env = setup(t);
  const cleanup = mountAdFit(env.container, env.options);
  cleanup();
  env.observers[0].callback([{ isIntersecting: true }]);
  assert.equal(env.container.children.length, 0);
  assert.equal(env.observers[0].disconnected, true);
});
