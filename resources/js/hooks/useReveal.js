import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

// Scroll-reveal animations play on the first page load only. On subsequent
// Inertia visits we show content immediately, so it can never flash invisible
// while the page transitions / scroll resets.
let firstLoad = true;

export function useReveal() {
    const { url } = usePage();

    useEffect(() => {
        const targets = document.querySelectorAll('[data-rv], [data-rvs], .steps');
        if (!targets.length) return;

        if (!firstLoad) {
            targets.forEach((el) => el.classList.add('in'));
            return;
        }
        firstLoad = false;

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
        targets.forEach((el) => (el.classList.contains('in') ? null : io.observe(el)));
        return () => io.disconnect();
    }, [url]);
}
