import { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero } from '../components/ui';
import { ProductCard } from './Home';
import { IcSearch } from '../components/Icons';

/**
 * Fold text so search is forgiving: lowercase, strip Latin accents (é→e) and
 * Arabic diacritics/tatweel, and unify alef/ya/ta-marbuta variants. Lets an
 * Arabic, English or French query match regardless of accents or spelling of
 * those letters.
 */
function fold(s) {
    return (s ?? '')
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')          // Latin combining accents (é→e)
        .replace(/[ً-ٰٟـ]/g, '') // Arabic tashkeel, hamza marks, tatweel
        .replace(/[أإآ]/g, 'ا') // أ إ آ → ا (for already-composed input)
        .replace(/ى/g, 'ي')             // ى → ي
        .replace(/ة/g, 'ه')             // ة → ه
        .replace(/\s+/g, ' ')
        .trim();
}

/** Read the ?cat= query param and validate it against the loaded products. */
function catFromUrl(products) {
    if (typeof window === 'undefined') return 'all';
    const q = new URLSearchParams(window.location.search).get('cat');
    if (!q) return 'all';
    const id = parseInt(q, 10);
    return products.some((p) => p.category_id === id) ? id : 'all';
}

/** Read the ?q= search term coming from the site-wide header search. */
function queryFromUrl() {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
}

/** Read the ?brand= param and validate it against the brands we actually list. */
function brandFromUrl(brands) {
    if (typeof window === 'undefined') return 'all';
    const b = new URLSearchParams(window.location.search).get('brand');
    return b && brands.includes(b) ? b : 'all';
}

export default function Products({ products, categories, brands = [] }) {
    const { t, pick } = useI18n();
    const { url } = usePage();
    const [cat, setCat] = useState(() => catFromUrl(products));
    const [brand, setBrand] = useState(() => brandFromUrl(brands));
    const [q, setQ] = useState(queryFromUrl);
    const cats = categories.filter((c) => c.products_count > 0);

    // Keep the selected category and search term in sync with the URL.
    useEffect(() => {
        setCat(catFromUrl(products));
        setBrand(brandFromUrl(brands));
        setQ(queryFromUrl());
    }, [url]);

    /*
     * Mirror the active filters into the address bar. Without this the filters
     * live only in component state, so opening a product and pressing Back
     * returned the visitor to a bare /products — i.e. "All" — losing the
     * section they were browsing.
     *
     * replaceState (not pushState) keeps one history entry for the listing, so
     * Back from a product detail goes straight to the filtered list instead of
     * stepping back through every chip the visitor tapped. Passing the existing
     * history.state through is required: Inertia keeps its page payload there,
     * and dropping it breaks restoring this page on Back.
     */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        cat === 'all' ? params.delete('cat') : params.set('cat', cat);
        brand === 'all' ? params.delete('brand') : params.set('brand', brand);
        q ? params.set('q', q) : params.delete('q');
        const qs = params.toString();
        window.history.replaceState(
            window.history.state,
            '',
            window.location.pathname + (qs ? `?${qs}` : ''),
        );
    }, [cat, brand, q]);

    // Pre-fold every product's searchable text once: names, descriptions and
    // category in all three languages, plus brand / group / horsepower.
    const haystacks = useMemo(() => {
        const map = new Map();
        for (const p of products) {
            const parts = [
                p.title_en, p.title_ar, p.title_fr,
                p.meta_en, p.meta_ar, p.meta_fr,
                p.brand, p.group, p.hp,
                p.category?.name_en, p.category?.name_ar, p.category?.name_fr,
            ];
            map.set(p.id, fold(parts.filter(Boolean).join(' ')));
        }
        return map;
    }, [products]);

    // Split the query into words; a product matches when it contains every word
    // (in any order), so "atlas rd20" finds "Atlas Copco RD20".
    const tokens = fold(q).split(' ').filter(Boolean);

    // A product is visible when it matches the active category, brand and search.
    const matches = useMemo(() => {
        const test = (p) => {
            if (cat !== 'all' && p.category_id !== cat) return false;
            if (brand !== 'all' && p.brand !== brand) return false;
            if (tokens.length) {
                const hay = haystacks.get(p.id) || '';
                if (!tokens.every((tk) => hay.includes(tk))) return false;
            }
            return true;
        };
        return new Set(products.filter(test).map((p) => p.id));
    }, [products, cat, brand, tokens.join(' '), haystacks]);

    return (
        <>
            <PageHero titleKey="ph.products_t" ledeKey="ph.products_l" bg="/img/hero/h1.jpg" />

            <section className="sec">
                <div className="wrap">
                    {/* Search */}
                    <div className="prod-search" data-rv="">
                        <IcSearch />
                        <input
                            type="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t('prods.search_ph')}
                            aria-label={t('prods.search_ph')}
                        />
                    </div>

                    {/* Category chips */}
                    <div className="chip-row" data-rv="">
                        <button className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>
                            {t('prods.all')} <em>{products.length}</em>
                        </button>
                        {cats.map((c) => (
                            <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
                                {pick(c, 'name')} <em>{c.products_count}</em>
                            </button>
                        ))}
                    </div>

                    {/* Brand chips — only when products have brands assigned */}
                    {brands.length > 0 && (
                        <div className="chip-row chip-row-brand" data-rv="">
                            <span className="chip-label">{t('prods.brand')}:</span>
                            <button className={`chip ${brand === 'all' ? 'on' : ''}`} onClick={() => setBrand('all')}>
                                {t('prods.all')}
                            </button>
                            {brands.map((b) => (
                                <button key={b} className={`chip ${brand === b ? 'on' : ''}`} onClick={() => setBrand(b)}>
                                    {b}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="prod-count-bar">
                        <span className="prod-count">{matches.size} {t('prods.items')}</span>
                    </div>

                    <div className="prod-grid" data-rvs="" style={{ position: 'relative' }}>
                        {products.map((p, i) => (
                            <ProductCard
                                key={p.id}
                                p={p}
                                delay={(i % 4) * 0.04}
                                hidden={!matches.has(p.id)}
                                showCatalog
                                showRfq
                            />
                        ))}
                    </div>
                    {matches.size === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--mut)', padding: '3rem 0' }}>
                            {t('prods.none')}
                        </p>
                    )}
                </div>
            </section>

            <CtaBand />
        </>
    );
}

Products.layout = (page) => <Layout>{page}</Layout>;
