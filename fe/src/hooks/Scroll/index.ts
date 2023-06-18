import { useEffect, useState } from 'react';

interface ScrollProps {
  root?: null;
  rootMargin?: string;
  threshold?: number;
  onIntersect: IntersectionObserverCallback;
}

export const Scroll = ({
  root,
  rootMargin = '0px',
  threshold = 0,
  onIntersect,
}: ScrollProps) => {
  const [target, setTarget] = useState<HTMLElement | undefined>();

  useEffect(() => {
    if (!target) return;

    const observer: IntersectionObserver = new IntersectionObserver(
      onIntersect,
      { root, rootMargin, threshold },
    );
    observer.observe(target);

    return () => observer.unobserve(target);
  }, [onIntersect, root, rootMargin, target, threshold]);

  return { setTarget };
};
