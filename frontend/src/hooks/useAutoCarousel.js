import { useCallback, useEffect, useState } from "react";

export function useAutoCarousel({
  total,
  interval = 3500,
  autoplay = true,
}) {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(total / 2)
  );
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoplay || paused || total <= 1) return;

    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoplay, paused, interval, next, total]);

  return {
    activeIndex,
    setActiveIndex,
    next,
    prev,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    paused,
  };
}