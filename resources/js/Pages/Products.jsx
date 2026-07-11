import { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero } from '../components/ui';
import { ProductCard } from './Home';
import { IcSearch } from '../components/Icons';

/** Read the ?cat= query param and validate it against the loaded products. */
function catFromUrl(products) {
    if (typeof window === 'undefined') return 'all';
    const q = new URLSearchParams(window.location.search).get('cat');
    if (!q) return 'all';
    const id = parseInt(q, 10);
    return products.some((p) => p.category_id === id) ? id : 'all';
}

export default function Products({ products, categories, brands = [] }) {
    const { t, pick } = useI18n();
    const { url } = usePage();
    const [cat, setCat] = useState(() => catFromUrl(products));
    const [brand, setBrand] = useState('all');
    const [q, setQ] = useState('');
    const cats = categories.filter((c) => c.products_count > 0);

    // Keep the selected category in sync when arriving via a ?cat= link.
    useEffect(() => { setCat(catFromUrl(products)); }, [url]);

    const needle = q.trim().toLowerCase();

    // A product is visible when it matches the active category, brand and search.
    const matches = useMemo(() => {
        const test = (p) => {
            if (cat !== 'all' && p.category_id !== cat) return false;
            if (brand !== 'all' && p.brand !== brand) return false;
            if (needle) {
                const hay = [p.title_en, p.title_ar, p.title_fr, p.meta_en, p.brand]
                    .filter(Boolean).join(' ').toLowerCase();
                if (!hay.includes(needle)) return false;
            }
            return true;
        };
        return new Set(products.filter(test).map((p) => p.id));
    }, [products, cat, brand, needle]);

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
