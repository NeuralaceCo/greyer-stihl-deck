"use client";

import { isValidElement, useEffect, useLayoutEffect, type ReactElement, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import type { Slide } from "../../content/deck";
import { PHOTOS } from "../../content/photos";

export type ViewProps = { slide: Slide; active: boolean };

/* The plain words of a title, for screen readers, since the visible title is split into pieces. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
  return "";
}

/* Words rise in one by one when the slide arrives. */
function words(line: string) {
  return line.split(" ").map((w, i, all) => (
    <span key={i}>
      <span className="dk-word">{w}</span>
      {i < all.length - 1 ? " " : ""}
    </span>
  ));
}

/* A headline, split into lines at the full stops so each sentence starts its own line. */
export function Title({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.match(/[^.!?]+[.!?]?/g)?.map((l) => l.trim()).filter(Boolean) ?? [text];
  return (
    <h2 className={`gs-title ${className}`} aria-label={textOf(text)}>
      {lines.map((line, i) => (
        <span className="gs-tline" key={i} aria-hidden="true">
          {words(line)}
        </span>
      ))}
    </h2>
  );
}

export function Kicker({ children }: { children: string }) {
  return (
    <p className="gs-kicker" data-in>
      {children}
    </p>
  );
}

export function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`gs-body ${className}`} data-in>
      {children}
    </p>
  );
}

export function Small({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`gs-small ${className}`} data-in>
      {children}
    </p>
  );
}

/* A photo slot, by shot id from content/photos.ts. Until the still exists it says what the shot is. */
export function Photo({ id, src, alt, className = "" }: { id?: string; src?: string; alt?: string; className?: string }) {
  const p = id ? PHOTOS[id] : undefined;
  const image = src ?? p?.src;
  return (
    <figure className={`gs-photo ${className}`} data-in>
      {image ? (
        <img src={image} alt={alt ?? p?.alt ?? ""} />
      ) : (
        <figcaption>
          <b>Photo to generate</b>
          {p?.shot}
        </figcaption>
      )}
    </figure>
  );
}

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* Runs a slide's own motion while it is on screen, and stops it a moment after the slide leaves,
   once the exit has played. Less motion asked for: the finished layout, no loops. */
export function useOnActive(active: boolean, scope: RefObject<HTMLElement | null>, run: () => void | (() => void)) {
  useIsoLayout(() => {
    if (!active || !scope.current) return;
    let extra: void | (() => void);
    const ctx = gsap.context(() => {
      extra = run();
    }, scope.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ctx.revert();
    return () => {
      gsap.delayedCall(0.7, () => {
        ctx.kill();
        if (typeof extra === "function") extra();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
