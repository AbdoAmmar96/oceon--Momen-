import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero } from '../components/ui';
import { ProductCard } from './Home';
import { IcChevron } from '../components/Icons';

/** Read the ?cat= query param and validate it against the loaded products. */
function catFromUrl(products) {
    if (typeof window === 'undefined') return 'all';
    const q = new URLSearchParams(window.location.search).get('cat');
    if (!q) return 'all';
    const id = parseInt(q, 10);
    return products.some((p) => p.category_id === id) ? id : 'all';
}

export default function Products({ products, categories }) {
    const { t, pick } = useI18n();
    const { url } = usePage();
    const [filter, setFilter] = useState(() => catFromUrl(products));
    const cats = categories.filter((c) => c.products_count > 0);

    // Keep the selected category in sync when arriving via a ?cat= link.
    useEffect(() => { setFilter(catFromUrl(products)); }, [url]);

    const shown = filter === 'all'
        ? products.length
        : products.filter((p) => p.category_id === filter).length;

    return (
        <>
            <PageHero titleKey="ph.products_t" ledeKey="ph.products_l" bg="/img/hero/h1.jpg" />

            <section className="sec">
                <div className="wrap">
                    <div className="prod-toolbar" data-rv="">
                        <div className="prod-filter">
                            <label htmlFor="cat-filter">{t('prods.filter')}</label>
                            <div className="select-wrap">
                                <select
                                    id="cat-filter"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
                                >
                                    <option value="all">{t('prods.all')} ({products.length})</option>
                                    {cats.map((c) => (
                                        <option key={c.id} value={c.id}>{pick(c, 'name')} ({c.products_count})</option>
                                    ))}
                                </select>
                                <IcChevron />
                            </div>
                        </div>
                        <span className="prod-count">{shown} {t('prods.items')}</span>
                    </div>

                    <div className="prod-grid" data-rvs="" style={{ position: 'relative' }}>
                        {products.map((p, i) => (
                            <ProductCard
                                key={p.id}
                                p={p}
                                delay={(i % 4) * 0.04}
                                hidden={filter !== 'all' && p.category_id !== filter}
                            />
                        ))}
                    </div>
                    {shown === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--mut)', padding: '3rem 0' }}>—</p>
                    )}
                </div>
            </section>

            <CtaBand />
        </>
    );
}

Products.layout = (page) => <Layout>{page}</Layout>;
