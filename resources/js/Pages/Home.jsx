import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AdvertiseHere from '../components/AdvertiseHere';
import { useI18n } from '../hooks/useI18n';
import {
    Bubbles, Counter, CtaBand, Marquee, Partners, SectionHead,
} from '../components/ui';
import {
    BrandIcon, CatIcon, IcArrow, IcCheck, IcDrillSvc, IcTradeSvc,
    IcTarget, IcShield, IcUsers, IcHands, IcBadge, IcGlobeHeart, IcDownload,
} from '../components/Icons';

const HERO_IMGS = ['/img/hero/h1.jpg', '/img/hero/h2.jpg', '/img/hero/h3.jpg'];
const VAL_ICONS = [IcTarget, IcShield, IcUsers, IcHands, IcBadge, IcGlobeHeart];

function Words({ text, base = 0 }) {
    return text.split(' ').filter(Boolean).map((w, i) => (
        <span className="w" key={`${w}-${i}`}>
            <span style={{ transitionDelay: `${base + i * 0.07}s` }}>{w}</span>
        </span>
    ));
}

// Background reel for the hero (muted, looped, no chrome). Falls back to the
// image slides underneath while it loads or if autoplay is blocked.
const HERO_VIDEO_ID = 'Su3Rf5pFQyM';
const HERO_VIDEO_SRC = `https://www.youtube-nocookie.com/embed/${HERO_VIDEO_ID}`
    + `?autoplay=1&mute=1&controls=0&loop=1&playlist=${HERO_VIDEO_ID}`
    + '&playsinline=1&modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0'
    + '&iv_load_policy=3&cc_load_policy=0&cc_lang_pref=none';

function Hero() {
    const { t, lang } = useI18n();
    const [slide, setSlide] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const iv = setInterval(() => setSlide((s) => (s + 1) % HERO_IMGS.length), 7000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        setReady(false);
        const raf = setTimeout(() => setReady(true), 350);
        return () => clearTimeout(raf);
    }, [lang]);

    return (
        <section className={`hero ${ready ? 'ready' : ''}`}>
            <div className="hero-slides" aria-hidden="true">
                {HERO_IMGS.map((src, i) => (
                    <div key={src} className={`slide ${i === slide ? 'on' : ''}`} style={{ backgroundImage: `url(${src})` }} />
                ))}
            </div>
            <div className="hero-video" aria-hidden="true">
                <iframe
                    src={HERO_VIDEO_SRC}
                    title="Ocean Drilling reel"
                    allow="autoplay; encrypted-media"
                    frameBorder="0"
                    tabIndex={-1}
                />
            </div>
            <div className="hero-veil" aria-hidden="true" />
            <div className="hero-grid" aria-hidden="true" />
            <Bubbles />

            <div className="wrap">
                <div className="hero-inner" key={lang}>
                    <span className="hero-eyebrow">{t('hero.eyebrow')}</span>
                    <h1 className="hero-title">
                        <Words text={t('hero.title')} />
                    </h1>
                    <p className="hero-sub">{t('hero.sub')}</p>
                    <div className="hero-ctas">
                        <Link href="/products" className="btn">
                            {t('hero.cta1')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                        </Link>
                        <Link href="/contact" className="btn ghost">{t('hero.cta2')}</Link>
                    </div>
                    <div className="hero-stats">
                        <Counter value={t('hero.s1n')} label={t('hero.s1l')} />
                        <Counter value={t('hero.s2n')} label={t('hero.s2l')} />
                        <Counter value={t('hero.s3n')} label={t('hero.s3l')} />
                        <Counter value={t('hero.s4n')} label={t('hero.s4l')} />
                    </div>
                </div>
            </div>

            <div className="scroll-cue" aria-hidden="true">
                {t('hero.scroll')}
                <span className="line" />
            </div>
        </section>
    );
}

function AboutPreview() {
    const { t } = useI18n();
    return (
        <section className="sec">
            <div className="wrap about-grid">
                <div className="about-media" data-rv="left">
                    <span className="deco" aria-hidden="true" />
                    <div className="ph"><img src="/img/about2.jpg" alt="Ocean Drilling & Trading operations" loading="lazy" /></div>
                    <div className="badge">
                        <BrandIcon />
                        <div>
                            <b>{t('about.badge_t')}</b>
                            <span>{t('about.badge_s')}</span>
                        </div>
                    </div>
                </div>
                <div className="about-copy" data-rv="right">
                    <span className="eyebrow">{t('about.eyebrow')}</span>
                    <h2 className="sec-title" style={{ fontSize: 'clamp(1.9rem,4vw,2.9rem)', color: 'var(--navy-800)' }}>{t('about.title')}</h2>
                    <p>{t('about.p1')}</p>
                    <ul className="tick-list">
                        {['about.li1', 'about.li2', 'about.li3', 'about.li4'].map((k) => (
                            <li key={k}><IcCheck style={{ color: 'var(--aqua)' }} />{t(k)}</li>
                        ))}
                    </ul>
                    <div><Link href="/about" className="btn sea" style={{ marginTop: '.6rem' }}>
                        {t('about.more')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                    </Link></div>
                </div>
            </div>
        </section>
    );
}

function Categories({ categories }) {
    const { t, pick } = useI18n();
    return (
        <section className="sec alt">
            <div className="wrap">
                <SectionHead center eyebrow={t('cats.eyebrow')} title={t('cats.title')} sub={t('cats.sub')} />
                <div className="cat-grid" data-rvs="">
                    {categories.map((c, i) => (
                        <Link href={`/products?cat=${c.id}`} className="cat-card" key={c.id} style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
                            <span className="cat-watermark" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                            <span className="cat-ico"><CatIcon cid={c.cid} /></span>
                            <span className="cat-body">
                                <h3>{pick(c, 'name')}</h3>
                                <span className="cat-count">{c.products_count} {t('prods.items')}</span>
                            </span>
                            <span className="cat-arrow"><IcArrow /></span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ProductCard({ p, delay = 0, hidden = false, showCatalog = false }) {
    const { t, pick } = useI18n();
    const tag = p.category
        ? pick(p.category, 'name')
        : t(p.group === 'rigs' ? 'prods.tag_rig' : p.group === 'bits' ? 'prods.tag_bit' : 'prods.tag_pipe');
    const placeholder = !p.price_note || p.price_note === '0.00 EUR' || p.price_note === '1.00 EUR';
    const price = placeholder ? t('prods.por') : p.price_note;
    return (
        <Link href={`/products/${p.slug}`} className={`prod ${hidden ? 'hide' : ''}`} style={{ transitionDelay: `${delay}s` }}>
            <div className="prod-media">
                <span className="prod-tag">{tag}</span>
                {p.brand ? <span className="prod-brand">{p.brand}</span> : null}
                {p.hp ? <span className="prod-hp">{p.hp} HP</span> : null}
                {p.image_url
                    ? <img src={p.image_url} alt={pick(p, 'title')} loading="lazy" />
                    : <span className="prod-noimg"><BrandIcon /></span>}
            </div>
            <div className="prod-body">
                <h3>{pick(p, 'title')}</h3>
                {pick(p, 'meta') && <p className="prod-meta">{pick(p, 'meta')}</p>}
                <div className="prod-foot">
                    <span className="prod-price">{price}</span>
                    <span className="prod-link">
                        {t('prods.view')} <IcArrow />
                    </span>
                </div>
                {showCatalog && (
                    // A button, not a nested <a>, so it stays valid inside the card link.
                    <button
                        type="button"
                        className="prod-pdf"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(p.catalog_url, '_blank', 'noopener'); }}
                    >
                        <IcDownload /> {t('prods.pdf')}
                    </button>
                )}
            </div>
        </Link>
    );
}

function Featured({ featured }) {
    const { t } = useI18n();
    return (
        <section className="sec">
            <div className="wrap">
                <SectionHead eyebrow={t('prods.eyebrow')} title={t('prods.title')} sub={t('prods.sub')} />
                <div className="prod-grid" data-rvs="">
                    {featured.map((p, i) => <ProductCard key={p.id} p={p} delay={(i % 4) * 0.06} />)}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2.4rem' }} data-rv="">
                    <Link href="/products" className="btn ghost dark">
                        {t('prods.all_btn')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function ServicesSplit({ compact = false }) {
    const { t } = useI18n();
    return (
        <div className="svc-split" data-rvs="">
            <div className="svc-panel dark">
                <span className="svc-ico"><IcDrillSvc /></span>
                <h3>{t('svc.d_t')}</h3>
                <p>{t('svc.d_p')}</p>
                <ul className="svc-list">
                    {['svc.d_li1', 'svc.d_li2', 'svc.d_li3', 'svc.d_li4'].map((k) => (
                        <li key={k}><IcCheck />{t(k)}</li>
                    ))}
                </ul>
                {compact && <Link href="/services" className="btn" style={{ width: 'fit-content', marginTop: '.4rem' }}>
                    {t('svc.more')} <IcArrow className="arr" style={{ width: 17, height: 17 }} />
                </Link>}
                <span className="num" aria-hidden="true">01</span>
            </div>
            <div className="svc-panel light">
                <span className="svc-ico"><IcTradeSvc /></span>
                <h3>{t('svc.t_t')}</h3>
                <p>{t('svc.t_p')}</p>
                <ul className="svc-list" style={{ color: 'var(--navy-800)' }}>
                    {['svc.t_li1', 'svc.t_li2', 'svc.t_li3', 'svc.t_li4'].map((k) => (
                        <li key={k}><IcCheck />{t(k)}</li>
                    ))}
                </ul>
                <span className="num" aria-hidden="true">02</span>
            </div>
        </div>
    );
}

export function Values() {
    const { t } = useI18n();
    return (
        <section className="sec deep">
            <div className="wrap">
                <SectionHead center eyebrow={t('vals.eyebrow')} title={t('vals.title')} sub={t('vals.sub')} />
                <div className="val-grid" data-rvs="">
                    {VAL_ICONS.map((Ic, i) => (
                        <div className="val" key={i} style={{ transitionDelay: `${(i % 3) * 0.07}s` }}>
                            <span className="val-ico"><Ic /></span>
                            <h3>{t(`vals.v${i + 1}t`)}</h3>
                            <p>{t(`vals.v${i + 1}p`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function PartnersSection() {
    const { t } = useI18n();
    return (
        <section className="sec alt" style={{ paddingBlock: 'clamp(3rem,6vw,4.5rem)' }}>
            <div className="wrap">
                <SectionHead center eyebrow={t('partners.eyebrow')} title={t('partners.title')} />
            </div>
            <Partners />
        </section>
    );
}

export default function Home({ categories, featured }) {
    const { t } = useI18n();
    return (
        <>
            <Hero />
            <Marquee />
            <AboutPreview />
            <Categories categories={categories} />
            <Featured featured={featured} />
            <section className="sec alt">
                <div className="wrap">
                    <SectionHead center eyebrow={t('svc.eyebrow')} title={t('svc.title')} sub={t('svc.sub')} />
                    <ServicesSplit compact />
                </div>
            </section>
            <Values />
            <AdvertiseHere />
            <PartnersSection />
            <CtaBand />
        </>
    );
}

Home.layout = (page) => <Layout>{page}</Layout>;
