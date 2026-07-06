import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand } from '../components/ui';
import { BrandIcon, IcArrow, IcCheck } from '../components/Icons';
import { ProductCard } from './Home';

export default function ProductShow({ product, related }) {
    const { t, pick } = useI18n();
    const gallery = product.gallery_urls || [];
    const [active, setActive] = useState(0);

    const title = pick(product, 'title');
    const meta = pick(product, 'meta');
    const catName = product.category ? pick(product.category, 'name') : null;
    const placeholder = !product.price_note || product.price_note === '0.00 EUR' || product.price_note === '1.00 EUR';
    const price = placeholder ? t('prods.por') : product.price_note;

    return (
        <>
            <Head><title>{`${title} · Ocean Drilling & Trading`}</title></Head>

            <section className="pd">
                <div className="wrap">
                    <nav className="crumbs pd-crumbs" aria-label="Breadcrumb">
                        <Link href="/">{t('ph.home')}</Link><i>/</i>
                        <Link href="/products">{t('nav.products')}</Link><i>/</i>
                        <span>{title}</span>
                    </nav>

                    <div className="pd-grid" data-rv="">
                        <div className="pd-gallery">
                            <div className="pd-main">
                                {gallery.length > 0
                                    ? <img src={gallery[active]} alt={title} loading="eager" />
                                    : <span className="pd-noimg"><BrandIcon /></span>}
                                {product.hp ? <span className="pd-hp">{product.hp} HP</span> : null}
                            </div>
                            {gallery.length > 1 && (
                                <div className="pd-thumbs">
                                    {gallery.map((src, i) => (
                                        <button
                                            key={src}
                                            className={`pd-thumb ${i === active ? 'on' : ''}`}
                                            onClick={() => setActive(i)}
                                            aria-label={`Image ${i + 1}`}
                                        >
                                            <img src={src} alt="" loading="lazy" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pd-info">
                            {catName && <span className="pd-tag">{catName}</span>}
                            <h1>{title}</h1>
                            {meta && <p className="pd-lede">{meta}</p>}

                            <ul className="pd-specs">
                                {catName && (
                                    <li><IcCheck /><span>{t('pd.category')}: <b>{catName}</b></span></li>
                                )}
                                {product.hp ? (
                                    <li><IcCheck /><span>{t('pd.power')}: <b>{product.hp} HP</b></span></li>
                                ) : null}
                                <li><IcCheck /><span>{t('pd.ref')}: <b>#{product.id}</b></span></li>
                            </ul>

                            <div className="pd-buy">
                                <div className="pd-price">
                                    <span className="pd-price-k">{t('pd.price')}</span>
                                    <b>{price}</b>
                                </div>
                                <Link href="/contact" className="btn">
                                    {t('prods.quote')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                                </Link>
                            </div>
                            <Link href="/products" className="pd-back">← {t('pd.back')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {related && related.length > 0 && (
                <section className="sec alt">
                    <div className="wrap">
                        <h2 className="sec-title pd-related-t" data-rv="">{t('pd.related')}</h2>
                        <div className="prod-grid" data-rvs="">
                            {related.map((p, i) => <ProductCard key={p.id} p={p} delay={(i % 4) * 0.05} />)}
                        </div>
                    </div>
                </section>
            )}

            <CtaBand />
        </>
    );
}

ProductShow.layout = (page) => <Layout>{page}</Layout>;
