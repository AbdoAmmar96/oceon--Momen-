import { useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * Scroll-reveal animations are a first-impression flourish: they play on the
 * very first page load and never again, so content can never sit invisible
 * while a page transitions.
 *
 * "Never again" is a flag on <html> that CSS reads, not a class written onto
 * each element. Inertia keeps this layout mounted between visits and rebuilds
 * only the page's own DOM, so a per-element JS pass reveals the markup that
 * exists at the moment it runs and misses anything mounted afterwards — which
 * is the entire page when a visitor clicks the link for the page they are
 * already on: the URL never changes, so nothing keyed on it re-runs, and the
 * rebuilt content is left at opacity 0.
 *
 * The flag is raised on 'start' rather than 'navigate' because 'navigate' also
 * fires for the initial page load, which would switch the animation off before
 * it ever played.
 */
export function useReveal() {
    useEffect(() => router.on('start', () => {
        document.documentElement.dataset.reveals = 'off';
    }), []);

    useEffect(() => {
        const targets = document.querySelectorAll('[data-rv], [data-rvs], .steps');
        if (!targets.length) return;

        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                // Elements taller than the viewport can never hit a fractional
                // threshold, so reveal them as soon as they enter.
                const tallerThanViewport = e.boundingClientRect.height > window.innerHeight;
                if (e.isIntersecting && (e.intersectionRatio >= 0.16 || tallerThanViewport)) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            }),
            { threshold: [0, 0.16], rootMargin: '0px 0px -6% 0px' }
        );
        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
}
