"use client";

import type { ClientData } from "@/data/clients";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandDisplay } from "./BrandDisplay";

interface FlipCardProps {
  data: ClientData;
  index: number;
  isDimmed: boolean;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
  requestAutoFlip: () => boolean;
  releaseFlip: () => void;
}

export function FlipCard({
  data,
  index,
  isDimmed,
  onHoverStart,
  onHoverEnd,
  requestAutoFlip,
  releaseFlip,
}: FlipCardProps) {
  const reduced = usePrefersReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);

  const isInteractingRef = useRef(false);
  const isAutoFlippedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cycleRef = useRef<(() => void) | null>(null);
  const requestRef = useRef(requestAutoFlip);
  const releaseRef = useRef(releaseFlip);

  useEffect(() => { requestRef.current = requestAutoFlip; }, [requestAutoFlip]);
  useEffect(() => { releaseRef.current = releaseFlip; }, [releaseFlip]);

  const addT = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const clearT = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    const interval = 4000 + Math.random() * 3000;
    const show = 2500 + Math.random() * 500;

    function cycle() {
      if (isInteractingRef.current) return;
      if (!requestRef.current()) {
        addT(cycle, 2000 + Math.random() * 1000);
        return;
      }
      isAutoFlippedRef.current = true;
      setIsFlipped(true);
      addT(() => {
        isAutoFlippedRef.current = false;
        setIsFlipped(false);
        releaseRef.current();
        addT(cycle, interval);
      }, show);
    }

    cycleRef.current = cycle;

    if (!reduced) {
      const delay = index * 1300 + Math.random() * 2000;
      addT(cycle, delay);
    }

    return () => {
      clearT();
      if (isAutoFlippedRef.current) {
        isAutoFlippedRef.current = false;
        releaseRef.current();
      }
    };
    // stable callbacks (useCallback [] deps), no re-runs on them
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, index, addT, clearT]);

  const handleStart = useCallback(() => {
    if (isInteractingRef.current) return;
    isInteractingRef.current = true;
    if (isAutoFlippedRef.current) {
      isAutoFlippedRef.current = false;
      releaseRef.current();
    }
    clearT();
    onHoverStart(data.id);
    setIsFlipped(true);
  }, [data.id, onHoverStart, clearT]);

  const handleEnd = useCallback(() => {
    if (!isInteractingRef.current) return;
    isInteractingRef.current = false;
    onHoverEnd();
    addT(() => {
      setIsFlipped(false);
      if (!reduced && cycleRef.current) {
        addT(cycleRef.current, 1500);
      }
    }, 400);
  }, [onHoverEnd, addT, reduced]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (!isFlipped) handleStart();
      else handleEnd();
    },
    [isFlipped, handleStart, handleEnd],
  );

  return (
    <div
      style={{
        opacity: isDimmed ? 0.55 : 1,
        transform: isDimmed ? "scale(0.98)" : "scale(1)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        "--float-dur": `${4 + index * 0.3}s`,
        "--float-delay": `${(index % 6) * 0.2}s`,
      } as React.CSSProperties}
    >
      <div
        className="clients-card-float"
        role="button"
        tabIndex={0}
        aria-label={`${data.brandName} — ${data.backText}`}
        aria-pressed={isFlipped}
        onMouseEnter={handleStart}
        onMouseLeave={handleEnd}
        onFocus={handleStart}
        onBlur={handleEnd}
        onKeyDown={handleKeyDown}
        style={{
          width: "clamp(150px, 14vw, 200px)",
          height: "clamp(115px, 10vw, 150px)",
        }}
      >
        <div className="flip-card-perspective">
          <div className={`flip-card-inner${isFlipped ? " is-flipped" : ""}`}>
            <div className="flip-card-face">
              <BrandDisplay display={data.display} brandName={data.brandName} />
            </div>
            <div
              className="flip-card-face flip-card-back-face"
              aria-live="polite"
            >
              <p className="flip-back-text">{data.backText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
