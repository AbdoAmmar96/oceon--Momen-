import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { I18nProvider, useI18n } from '../hooks/useI18n';
import { useReveal } from '../hooks/useReveal';
import { useRfq } from '../hooks/useRfq';
import {
    BrandIcon, IcChevron, IcClipboard, IcFb, IcGlobe, IcIg, IcLi, IcMail, IcPhone, IcPin,
    IcSearch, IcUp, IcUser, IcWhats, IcX, IcYt,
} from './Icons';

// "About the company" mirrors the old site's عن الشركة menu: profile,
// objectives, team, catalogue.
const COMPANY_LINKS = [
    { href: '/about', key: 'nav.profile' },
    { href: '/objectives', key: 'obj.nav' },
    { href: '/team', key: 'team.nav' },
    { href: '/catalog', key: 'cat.nav' },
];

const NAV = [
    { href: '/', key: 'nav.home' },
    { href: '/about', key: 'nav.company', children: COMPANY_LINKS },
    { href: '/products', key: 'nav.products' },
    { href: '/services', key: 'nav.services' },
    { href: '/jobs', key: 'nav.jobs' },
    { href: '/contact', key: 'nav.contact' },
    // Rendered as a highlighted pill so it stands out from the other links.
    { href: '/marketplace', key: 'nav.marketplace', highlight: true },
];

// Secondary links surfaced in the footer and the mobile menu (kept out of the
// crowded top bar per req #9). These also appear on the About page.
const NAV_MORE = [
    { href: '/case-studies', key: 'cs.nav' },
];

const META = {
    Home: 'meta.home', About: 'meta.about', Products: 'meta.products',
    Services: 'meta.services', Contact: 'meta.contact', ProductShow: 'meta.products',
    'Marketplace/Index': 'meta.marketplace', 'Marketplace/Show': 'meta.marketplace',
    'Marketplace/Seller': 'meta.marketplace',
    'Jobs/Index': 'meta.jobs', 'Jobs/Show': 'meta.jobs',
    'CaseStudies/Index': 'cs.title', 'CaseStudies/Show': 'cs.title',
    Team: 'team.title',
    Objectives: 'obj.title',
    Catalog: 'cat.title',
    Rfq: 'rfq.title',
    'Auth/Login': 'meta.login', 'Auth/Register': 'meta.register',
    Dashboard: 'meta.dashboard',
    'Listings/Create': 'meta.dashboard', 'Listings/Edit': 'meta.dashboard',
};

const LANGS = [['en', 'English'], ['ar', 'العربية'], ['fr', 'Français']];

export const SOCIALS = [
    { Icon: IcFb, href: 'https://www.facebook.com/ocean.drilling', label: 'Facebook' },
    { Icon: IcX, href: 'https://twitter.com/OceanDrilling', label: 'X / Twitter' },
    { Icon: IcIg, href: 'https://www.instagram.com/ocean.drilling/', label: 'Instagram' },
    { Icon: IcLi, href: 'https://www.linkedin.com/in/ocean-drilling-382789155/', label: 'LinkedIn' },
    { Icon: IcYt, href: 'https://www.youtube.com/channel/UCSR9sanE8NIHQcjHmtEutGA', label: 'YouTube' },
];

const SOCIAL_DEFS = [
    ['social_facebook', IcFb, 'Facebook'],
    ['social_x', IcX, 'X / Twitter'],
    ['social_instagram', IcIg, 'Instagram'],
    ['social_linkedin', IcLi, 'LinkedIn'],
    ['social_youtube', IcYt, 'YouTube'],
];

/** Build the socials list from admin settings, falling back to the defaults. */
export function buildSocials(settings) {
    const list = SOCIAL_DEFS
        .filter(([k]) => settings?.[k])
        .map(([k, Icon, label]) => ({ Icon, href: settings[k], label }));
    return list.length ? list : SOCIALS;
}

export const telHref = (n) => `tel:${String(n || '').replace(/[^\d+]/g, '')}`;

function BrandLockup() {
    return (
        <span className="brand-plate">
            <img src="/img/logo.png" width="155" height="69" alt="Ocean Drilling & Trading" />
        </span>
    );
}

function IcClose({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
        </svg>
    );
}

function Preloader() {
    const [done, setDone] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setDone(true), 1100);
        return () => clearTimeout(t);
    }, []);
    return (
        <div id="loader" className={done ? 'done' : ''} aria-hidden="true">
            <div className="loader-inner">
                <BrandIcon className="loader-icon" />
                <div className="loader-shaft" />
                <div className="loader-word">Ocean Drilling &amp; Trading</div>
            </div>
        </div>
    );
}

function LangSwitch({ mobile = false }) {
    const { lang, setLang, t } = useI18n();
    const [open, setOpen] = useState(false);
    const box = useRef(null);
    useEffect(() => {
        const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    }, []);
    const current = LANGS.find(([code]) => code === lang) || LANGS[0];

    if (mobile) {
        return (
            <div className="m-langs">
                {LANGS.map(([code, name]) => (
                    <button key={code} className={lang === code ? 'on' : ''} onClick={() => setLang(code)}>{name}</button>
                ))}
            </div>
        );
    }
    return (
        <div className={`lang-switch ${open ? 'open' : ''}`} ref={box}>
            <button className="lang-btn" onClick={() => setOpen(!open)} aria-label={t('langname')} title={current[1]}>
                <IcGlobe style={{ width: 15, height: 15 }} />
                <span className="lang-cur">{current[0].toUpperCase()}</span>
                <IcChevron />
            </button>
            <div className="lang-menu">
                {LANGS.map(([code, name]) => (
                    <button key={code} className={lang === code ? 'on' : ''} onClick={() => { setLang(code); setOpen(false); }}>
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
}

/** Login / register links for guests, or an account menu for members. On
 *  desktop this is a compact icon dropdown to keep the header uncluttered;
 *  the mobile menu keeps full-width text links. */
function AccountNav({ mobile = false }) {
    const { t } = useI18n();
    const user = usePage().props.auth?.user;
    const [open, setOpen] = useState(false);
    const box = useRef(null);
    useEffect(() => {
        const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
        document.addEventListener('pointerdown', close);
        return () => document.removeEventListener('pointerdown', close);
    }, []);

    if (mobile) {
        return (
            <div className="m-account">
                {! user ? (
                    <>
                        <Link href="/login" className="acc-link">{t('nav.login')}</Link>
                        <Link href="/register" className="acc-link acc-strong">{t('nav.register')}</Link>
                    </>
                ) : (
                    <>
                        <Link href="/dashboard" className="acc-link">{t('nav.dashboard')}</Link>
                        <button className="acc-link acc-out" onClick={() => router.post('/logout')}>{t('nav.logout')}</button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className={`acc-switch ${open ? 'open' : ''}`} ref={box}>
            <button className="acc-btn" onClick={() => setOpen(!open)} aria-label={t(user ? 'nav.dashboard' : 'nav.login')} aria-expanded={open}>
                <IcUser />
            </button>
            <div className="acc-menu">
                {! user ? (
                    <>
                        <Link href="/login" onClick={() => setOpen(false)}>{t('nav.login')}</Link>
                        <Link href="/register" onClick={() => setOpen(false)}>{t('nav.register')}</Link>
                    </>
                ) : (
                    <>
                        <Link href="/dashboard" onClick={() => setOpen(false)}>{t('nav.dashboard')}</Link>
                        <button onClick={() => router.post('/logout')}>{t('nav.logout')}</button>
                    </>
                )}
            </div>
        </div>
    );
}

/** Site-wide product search — available on every page, not just Products (req #9). */
function SearchBox({ mobile = false }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const inputRef = useRef(null);

    useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

    const go = (e) => {
        e.preventDefault();
        const term = q.trim();
        router.visit(term ? `/products?q=${encodeURIComponent(term)}` : '/products');
        setOpen(false);
        setQ('');
    };

    if (mobile) {
        return (
            <form className="m-search" onSubmit={go}>
                <IcSearch />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search.ph')} aria-label={t('search.label')} />
            </form>
        );
    }

    return (
        <div className={`head-search ${open ? 'open' : ''}`}>
            <form onSubmit={go}>
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search.ph')} aria-label={t('search.label')} />
                <button type={open ? 'submit' : 'button'} className="head-search-btn" onClick={() => !open && setOpen(true)} aria-label={t('search.label')}>
                    <IcSearch />
                </button>
            </form>
        </div>
    );
}

/** RFQ list shortcut with a live item count. */
function RfqButton() {
    const { t } = useI18n();
    const { count } = useRfq();
    return (
        <Link href="/rfq" className={`head-rfq ${count > 0 ? 'has' : ''}`} aria-label={t('rfq.nav')}>
            <IcClipboard />
            <span className="head-rfq-label">{t('rfq.nav')}</span>
            {count > 0 && <span className="head-rfq-count">{count}</span>}
        </Link>
    );
}

function Header() {
    const { t, pick } = useI18n();
    const { url, props } = usePage();
    const { count: rfqCount } = useRfq();
    const cats = (props.navCategories || []).filter((c) => c.products_count > 0);
    const [scrolled, setScrolled] = useState(false);
    const [menu, setMenu] = useState(false);
    // Which mobile nav group is expanded (only one at a time).
    const [openGroup, setOpenGroup] = useState(null);
    const path = url.split('?')[0];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenu(false); }, [url]);
    useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);
    // Reset the accordion when the sheet closes so it always reopens tidy.
    useEffect(() => { if (! menu) setOpenGroup(null); }, [menu]);

    const active = (href) => (href === '/' ? path === '/' : path.startsWith(href));

    return (
        <>
            <header className={`site-head ${scrolled ? 'scrolled' : ''}`}>
                <div className="wrap">
                    <Link href="/" className="brand" aria-label="Ocean Drilling & Trading — Home">
                        <BrandLockup />
                    </Link>
                    <nav className="main-nav" aria-label="Main">
                        {NAV.map((n) => (
                            n.href === '/products' && cats.length ? (
                                <div key={n.href} className="nav-item has-dd">
                                    <Link href={n.href} className={active(n.href) ? 'active' : ''}>
                                        {t(n.key)}<IcChevron className="dd-caret" />
                                    </Link>
                                    <div className="nav-dd" role="menu">
                                        <div className="nav-dd-grid">
                                            {cats.map((c) => (
                                                <Link key={c.id} href={`/products?cat=${c.id}`} className="nav-dd-link" role="menuitem">
                                                    <span>{pick(c, 'name')}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : n.children ? (
                                <div key={n.href} className="nav-item has-dd">
                                    <Link
                                        href={n.href}
                                        className={n.children.some((c) => active(c.href)) ? 'active' : ''}
                                    >
                                        {t(n.key)}<IcChevron className="dd-caret" />
                                    </Link>
                                    <div className="nav-dd nav-dd-sm" role="menu">
                                        <div className="nav-dd-grid nav-dd-list">
                                            {n.children.map((c) => (
                                                <Link key={c.href} href={c.href} className="nav-dd-link" role="menuitem">
                                                    <span>{t(c.key)}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={n.href}
                                    href={n.href}
                                    className={`${active(n.href) ? 'active' : ''} ${n.highlight ? 'nav-hot' : ''}`}
                                >
                                    {t(n.key)}
                                </Link>
                            )
                        ))}
                    </nav>
                    <div className="head-actions">
                        <SearchBox />
                        <RfqButton />
                        <LangSwitch />
                        <AccountNav />
                        <Link href="/contact" className="btn head-cta">{t('nav.quote')}</Link>
                        <button className={`burger ${menu ? 'open' : ''}`} onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}>
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </header>
            <div className={`m-menu ${menu ? 'open' : ''}`}>
                <button className="m-close" onClick={() => setMenu(false)} aria-label="Close menu">
                    <IcClose />
                </button>
                <SearchBox mobile />
                <nav className="m-nav" aria-label="Mobile">
                    {[...NAV, ...NAV_MORE].map((n, i) => (
                        n.children ? (
                            /* Collapsed by default: the four company pages would
                               otherwise push the rest of the menu off-screen. */
                            <div key={n.href} className={`m-nav-group ${openGroup === n.href ? 'open' : ''}`}>
                                <button
                                    type="button"
                                    className="m-nav-toggle"
                                    aria-expanded={openGroup === n.href}
                                    onClick={() => setOpenGroup(openGroup === n.href ? null : n.href)}
                                    style={{ transitionDelay: menu ? `${0.12 + i * 0.06}s` : '0s' }}
                                >
                                    {t(n.key)}<IcChevron className="m-nav-caret" />
                                </button>
                                <div className="m-nav-sublist">
                                    <div>
                                        {n.children.map((c) => (
                                            <Link
                                                key={c.href}
                                                href={c.href}
                                                className={`m-nav-sub ${active(c.href) ? 'active' : ''}`}
                                            >
                                                {t(c.key)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link key={n.href} href={n.href} style={{ transitionDelay: menu ? `${0.12 + i * 0.06}s` : '0s' }}
                                className={`${active(n.href) ? 'active' : ''} ${n.highlight ? 'nav-hot' : ''}`}>
                                {t(n.key)}
                            </Link>
                        )
                    ))}
                    <Link href="/rfq" className="m-rfq">{t('rfq.nav')}{rfqCount > 0 ? ` (${rfqCount})` : ''}</Link>
                </nav>
                <AccountNav mobile />
                <LangSwitch mobile />
            </div>
        </>
    );
}

function Footer() {
    const { t, pick, lang } = useI18n();
    const { props } = usePage();
    const year = new Date().getFullYear();
    // Quick links: the main nav (minus Home and the marketplace pill, which gets
    // its own highlighted button below) plus the secondary links. The company
    // menu is flattened to its children so Team and the catalogue keep a footer
    // entry of their own rather than hiding behind one "About" label.
    const quick = [
        ...NAV.slice(1)
            .filter((n) => n.href !== '/marketplace')
            .flatMap((n) => n.children ?? [n]),
        ...NAV_MORE,
    ];
    const cats = (props.navCategories || []).filter((c) => c.products_count > 0).slice(0, 8);
    const s = props.settings || {};
    const socials = buildSocials(s);
    const address = s[`contact_address_${lang}`] || s.contact_address_en || t('contact.addr_v');
    const phone = s.contact_phone || '+357 977 53 878';
    const email = s.contact_email || 'info@oceandrilling.co.uk';

    return (
        <footer className="site-foot">
            <div className="wrap">
                {/* Highlighted primary actions (req #16) */}
                <div className="foot-cta">
                    <div className="foot-cta-copy">
                        <BrandIcon className="foot-cta-icon" />
                        <span>{t('cta.title')}</span>
                    </div>
                    <div className="foot-cta-btns">
                        <Link href="/contact" className="foot-cta-btn primary">{t('foot.rfq_cta')}</Link>
                        <Link href="/marketplace" className="foot-cta-btn accent">{t('foot.adv_cta')}</Link>
                    </div>
                </div>

                <div className="foot-main">
                    <div className="foot-brand">
                        <Link href="/" className="brand"><BrandLockup /></Link>
                        <p>{t('foot.blurb')}</p>
                    </div>
                    <div className="foot-col">
                        <h4>{t('foot.quick')}</h4>
                        <ul>
                            {quick.map((n) => <li key={n.href}><Link href={n.href}>{t(n.key)}</Link></li>)}
                            <li><Link href="/rfq">{t('rfq.nav')}</Link></li>
                        </ul>
                    </div>
                    {cats.length > 0 && (
                        <div className="foot-col foot-col-cats">
                            <h4>{t('foot.cats')}</h4>
                            <ul className="foot-cats-list">
                                {cats.map((c) => (
                                    <li key={c.id}><Link href={`/products?cat=${c.id}`}>{pick(c, 'name')}</Link></li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="foot-col">
                        <h4>{t('foot.contact')}</h4>
                        <ul className="foot-contact">
                            <li><IcPin /><span>{address}</span></li>
                            <li><IcPhone /><a className="ltr" href={telHref(phone)}>{phone}</a></li>
                            <li><IcMail /><a href={`mailto:${email}`}>{email}</a></li>
                        </ul>
                        {/* Socials given their own labelled block (req #16) */}
                        <div className="foot-social">
                            <span className="foot-social-k">{t('contact.social_t')}</span>
                            <div className="socials">
                                {socials.map(({ Icon, href, label }) => (
                                    <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="foot-bar">
                    <div className="own">{t('foot.own')}</div>
                    <div className="credit">
                        © {year} <a href="https://bp-eg.com" target="_blank" rel="noreferrer">Business Partner for Information Technology</a>. All rights reserved.
                        <br />
                        © {year} <a href="https://bp-eg.com" target="_blank" rel="noreferrer">شركة شريك الأعمال لتقنية المعلومات</a>. جميع الحقوق محفوظة.
                    </div>
                </div>
            </div>
        </footer>
    );
}

function ToTop() {
    const [show, setShow] = useState(false);
    const circ = useRef(null);
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
            setShow(h.scrollTop > 500);
            if (circ.current) circ.current.style.strokeDashoffset = String(151 - 151 * p);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <button className={`to-top ${show ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
            <svg className="ring" viewBox="0 0 54 54"><circle ref={circ} cx="27" cy="27" r="24" /></svg>
            <IcUp className="up" />
        </button>
    );
}

/** Floating WhatsApp button — number comes from admin settings. */
function WhatsFloat() {
    const { t } = useI18n();
    const { props } = usePage();
    const s = props.settings || {};
    const raw = s.social_whatsapp || s.contact_phone2 || s.contact_phone || '+357 977 53 878';
    const num = String(raw).replace(/[^\d]/g, '');
    if (!num) return null;
    return (
        <a
            className="wa-float"
            href={`https://wa.me/${num}`}
            target="_blank"
            rel="noreferrer"
            aria-label={t('wa.label')}
        >
            <IcWhats />
            <span className="wa-tip">{t('wa.label')}</span>
        </a>
    );
}

function Shell({ children }) {
    const { t, lang } = useI18n();
    const { component } = usePage();
    useReveal();
    // Keep the single server-rendered <title> element in sync on SPA navigation
    // and language change — using Inertia's <Head> here duplicated the tag.
    useEffect(() => {
        document.title = t(META[component] || 'meta.home');
    }, [component, lang, t]);
    // Always land at the top of the page after navigating between pages.
    useEffect(() => {
        if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
        // Jump to the top of the new page. Fire across a few frames because the
        // new page's DOM/height settles a beat after the visit event.
        // behavior:'instant' overrides the page's smooth scroll-behavior so page
        // changes jump straight to the top instead of animating.
        const top = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        const off = router.on('navigate', () => {
            top();
            requestAnimationFrame(top);
        });
        return off;
    }, []);
    return (
        <>
            <Preloader />
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsFloat />
            <ToTop />
        </>
    );
}

export default function Layout({ children }) {
    return (
        <I18nProvider>
            <Shell>{children}</Shell>
        </I18nProvider>
    );
}
