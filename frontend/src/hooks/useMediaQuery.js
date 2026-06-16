import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);

    const update = () => setMatches(mq.matches);

    update(); // ✅ set initial value

    mq.addEventListener("change", update);

    return () => {
      mq.removeEventListener("change", update);
    };
  }, [query]);

  return matches;
}

// ✅ CUSTOM BREAKPOINT HOOK
export function useIsMd() {
  return useMediaQuery("(min-width: 768px)");
}