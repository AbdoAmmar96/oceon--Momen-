import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { BrandIcon, IcArrow } from './Icons';

/* ---------- section head ---------- */
export function SectionHead({ eyebrow, title, sub, center = false }) {
    return (
        <div className={`sec-head ${center ? 'center' : ''}`} data-rv="">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
        </div>
    );
}

/* ---------- outlined text marquee ---------- */
export function Marquee() {
    const { t } = useI18n();
    const items = ['marq.1', 'marq.2', 'marq.3', 'marq.4', 'marq.5', 'marq.6'];
    const run = (
        <span>
            {items.map((k) => (
                <em key={k} style={{ fontStyle: 'normal', display: 'inline-flex', alignItems: 'center', gap: '3rem' }}>
                    {t(k)} <i>◆</i>
                </em>
            ))}
        </span>
    );
    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee-track">{run}{run}</div>
        </div>
    );
}

/* ---------- partner logos marquee ---------- */
// Real distributor / manufacturer brands, kept in their original colours as
// requested. Each renders inside a white chip so logos on white backgrounds
// sit cleanly on the tinted section.
const PARTNER_LOGOS = [
    ['atlas-copco.jpg', 'Atlas Copco'],
    ['caterpillar.png', 'Caterpillar'],
    ['komatsu.png', 'Komatsu'],
    ['ingersoll-rand.jpg', 'Ingersoll Rand'],
    ['gardner-denver.jpg', 'Gardner Denver'],
    ['furukawa.png', 'Furukawa FRD'],
    ['sullair.png', 'Sullair'],
    ['mitsubishi-materials.png', 'Mitsubishi Materials'],
    ['east-west.jpg', 'East West Machinery & Drilling'],
    ['brunner-lay.jpg', 'Brunner & Lay'],
    ['robit.jpg', 'Robit'],
    ['derex.jpg', 'Derex'],
    ['rock-hog.jpg', 'Rock Hog Drilling Products'],
    ['star-iron-works.jpg', 'Star Iron Works'],
];

export function Partners() {
    const run = [...PARTNER_LOGOS, ...PARTNER_LOGOS];
    return (
        <div className="partners-wrap" data-rv="">
            <div className="partners-track">
                {run.map(([file, name], i) => (
                    <span className="partner-chip" key={i}>
                        <img src={`/img/partners/${file}`} alt={i < PARTNER_LOGOS.length ? name : ''}
                            aria-hidden={i >= PARTNER_LOGOS.length ? 'true' : undefined} loading="lazy" />
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ---------- FAQ accordion (req #14) ---------- */
export function Faq({ items = ['1', '2', '3', '4', '5', '6'] }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(0);
    return (
        <section className="sec">
            <div className="wrap">
                <SectionHead center eyebrow={t('faq.eyebrow')} title={t('faq.title')} sub={t('faq.sub')} />
                <div className="faq-list" data-rv="">
                    {items.map((n, i) => (
                        <div className={`faq-item ${open === i ? 'on' : ''}`} key={n}>
                            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                                <span>{t(`faq.q${n}`)}</span>
                                <i className="faq-ico" aria-hidden="true"><span /><span /></i>
                            </button>
                            <div className="faq-a"><p>{t(`faq.a${n}`)}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- CTA band ---------- */
export function CtaBand() {
    const { t } = useI18n();
    return (
        <section className="sec alt">
            <div className="wrap">
                <div className="cta-band" data-rv="zoom">
                    <BrandIcon className="cta-icon" />
                    <h2>{t('cta.title')}</h2>
                    <p>{t('cta.sub')}</p>
                    <Link href="/contact" className="btn">
                        {t('cta.btn')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ---------- inner page hero ---------- */
export function PageHero({ titleKey, ledeKey, bg = '/img/hero/h2.jpg' }) {
    const { t } = useI18n();
    return (
        <section className="page-hero">
            <div className="bg" style={bg ? { backgroundImage: `url(${bg})` } : undefined} />
            <div className="veil" />
            <div className="wrap">
                <nav className="crumbs" aria-label="Breadcrumb">
                    <Link href="/">{t('ph.home')}</Link><i>/</i><span>{t(titleKey)}</span>
                </nav>
                <h1 data-rv="">{t(titleKey)}</h1>
                <p className="lede" data-rv="">{t(ledeKey)}</p>
            </div>
        </section>
    );
}

/* ---------- animated counter ---------- */
export function Counter({ value, label }) {
    const ref = useRef(null);
    const [txt, setTxt] = useState('0');
    const num = parseInt(value, 10);
    const countable = !Number.isNaN(num) && String(num) === String(value).replace('+', '');

    useEffect(() => {
        if (!countable) { setTxt(value); return; }
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return;
            io.disconnect();
            const t0 = performance.now();
            const dur = 1500;
            const tick = (t) => {
                const p = Math.min((t - t0) / dur, 1);
                setTxt(String(Math.round(num * (1 - Math.pow(1 - p, 3)))));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, { threshold: 0.6 });
        io.observe(el);
        return () => io.disconnect();
    }, [countable, num, value]);

    return (
        <div className="hstat" ref={ref}>
            <b>{txt}{countable && <em>+</em>}</b>
            <span>{label}</span>
        </div>
    );
}

/* ---------- rotating flip word ---------- */
export function FlipWord({ words, interval = 2400 }) {
    const [idx, setIdx] = useState(0);
    const [prev, setPrev] = useState(-1);
    useEffect(() => {
        const t = setInterval(() => {
            setIdx((i) => { setPrev(i); return (i + 1) % words.length; });
        }, interval);
        return () => clearInterval(t);
    }, [words.length, interval]);
    return (
        <span className="flip">
            {words.map((w, i) => (
                <span key={w + i} className={i === idx ? 'on' : i === prev ? 'out' : ''}>{w}</span>
            ))}
        </span>
    );
}

/* ---------- rising bubbles ---------- */
export function Bubbles({ count = 14 }) {
    const list = useMemo(() => Array.from({ length: count }, (_, i) => ({
        left: `${(i * 61) % 100}%`,
        size: 6 + ((i * 37) % 22),
        dur: 9 + ((i * 53) % 11),
        delay: -((i * 29) % 12),
        sway: ((i % 2 ? 1 : -1) * (14 + ((i * 17) % 30))),
    })), [count]);
    return (
        <div className="bubbles" aria-hidden="true">
            {list.map((b, i) => (
                <i key={i} style={{
                    left: b.left, width: b.size, height: b.size,
                    animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, '--sway': `${b.sway}px`,
                }} />
            ))}
        </div>
    );
}

/* ---------- animated waves divider ---------- */
export function Waves() {
    const path = 'M0 60 C 180 20 360 20 540 60 C 720 100 900 100 1080 60 C 1260 20 1440 20 1620 60 C 1800 100 1980 100 2160 60 L 2160 120 L 0 120 Z';
    return (
        <div className="waves" aria-hidden="true">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path className="wave-b" d={path} fill="rgba(243,247,250,.35)" />
                <path className="wave-a" d={path} fill="#f3f7fa" transform="translate(-360 8)" />
            </svg>
        </div>
    );
}
