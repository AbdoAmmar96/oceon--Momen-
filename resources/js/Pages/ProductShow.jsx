import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { useRfq } from '../hooks/useRfq';
import { CtaBand } from '../components/ui';
import {
    BrandIcon, IcArrow, IcCheck, IcClose, IcDownload, IcPlus, IcZoom, IcClipboard,
} from '../components/Icons';
import { ProductCard } from './Home';

/* ---------- full-screen image zoom (req #4) ---------- */
function Lightbox({ images, index, setIndex, onClose, title }) {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
            if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    }, [images.length, onClose, setIndex]);

    return (
        <div className="lb" role="dialog" aria-modal="true" onClick={onClose}>
            <button className="lb-close" onClick={onClose} aria-label="Close"><IcClose /></button>
            <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
                <img src={images[index]} alt={title} />
                {images.length > 1 && (
                    <>
                        <button className="lb-nav prev" onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)} aria-label="Previous">‹</button>
                        <button className="lb-nav next" onClick={() => setIndex((i) => (i + 1) % images.length)} aria-label="Next">›</button>
                        <div className="lb-dots">
                            {images.map((src, i) => (
                                <button key={src} className={i === index ? 'on' : ''} onClick={() => setIndex(i)} aria-label={`Image ${i + 1}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ---------- product-bound Request a Quote form (req #6) ---------- */
function QuoteForm({ product, model }) {
    const { t, lang } = useI18n();
    const { data, setData, post, processing, wasSuccessful, reset, errors } = useForm({
        product_id: product.id,
        quantity: '',
        destination_country: '',
        requirements: '',
        name: '',
        company: '',
        email: '',
        phone: '',
        locale: lang,
    });

    useEffect(() => { setData('locale', lang); }, [lang]);

    const submit = (e) => {
        e.preventDefault();
        post('/quote', {
            preserveScroll: true,
            // Keep this component mounted through the redirect so the success
            // panel stays visible instead of the form silently resetting.
            preserveState: true,
            onSuccess: () => reset('quantity', 'destination_country', 'requirements', 'name', 'company', 'email', 'phone'),
        });
    };

    if (wasSuccessful) {
        return <div className="qf-ok"><IcCheck /> <p>{t('qf.ok')}</p></div>;
    }

    return (
        <form className="qf" onSubmit={submit}>
            <p className="qf-for">{t('qf.for')}: <b>{product.title_en}</b>{model ? <> · <span className="qf-model">{model}</span></> : null} <span className="qf-id">#{product.id}</span></p>
            <div className="qf-grid">
                <label className="qf-field">
                    <span>{t('qf.quantity')}</span>
                    <input value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} placeholder="1" />
                </label>
                <label className="qf-field">
                    <span>{t('qf.destination')}</span>
                    <input value={data.destination_country} onChange={(e) => setData('destination_country', e.target.value)} />
                </label>
                <label className="qf-field">
                    <span>{t('qf.name')} *</span>
                    <input required value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    {errors.name && <em className="qf-err">{errors.name}</em>}
                </label>
                <label className="qf-field">
                    <span>{t('qf.company')} <i>({t('qf.optional')})</i></span>
                    <input value={data.company} onChange={(e) => setData('company', e.target.value)} />
                </label>
                <label className="qf-field">
                    <span>{t('qf.email')} *</span>
                    <input type="email" required value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    {errors.email && <em className="qf-err">{errors.email}</em>}
                </label>
                <label className="qf-field">
                    <span>{t('qf.phone')}</span>
                    <input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                </label>
                <label className="qf-field qf-full">
                    <span>{t('qf.requirements')} <i>({t('qf.optional')})</i></span>
                    <textarea rows={3} value={data.requirements} onChange={(e) => setData('requirements', e.target.value)} />
                </label>
            </div>
            <button type="submit" className="btn" disabled={processing}>
                {processing ? t('qf.sending') : t('qf.send')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
            </button>
        </form>
    );
}

/* ---------- a single spec/detail row, hidden when its value is empty ---------- */
function DetailRow({ label, value }) {
    if (value === null || value === undefined || value === '') return null;
    return <li><IcCheck /><span>{label}: <b>{value}</b></span></li>;
}

export default function ProductShow({ product, related }) {
    const { t, pick } = useI18n();
    const rfq = useRfq();
    const gallery = product.gallery_urls || [];
    const [active, setActive] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [showQuote, setShowQuote] = useState(false);

    const title = pick(product, 'title');
    const meta = pick(product, 'meta');
    const catName = product.category ? pick(product.category, 'name') : null;
    const placeholder = !product.price_note || product.price_note === '0.00 EUR' || product.price_note === '1.00 EUR';
    const price = placeholder ? t('prods.por') : product.price_note;
    const model = product.model_number;
    const conditionLabel = product.condition ? t(`pd.cond_${product.condition}`) : null;
    const specs = Array.isArray(product.specs) ? product.specs.filter((s) => s && s.label && s.value) : [];
    const inRfq = rfq.has(product.id);

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
                            <button
                                type="button"
                                className="pd-main pd-main-zoom"
                                onClick={() => gallery.length && setZoom(true)}
                                aria-label={t('pd.zoom_hint')}
                            >
                                {gallery.length > 0
                                    ? <img src={gallery[active]} alt={title} loading="eager" />
                                    : <span className="pd-noimg"><BrandIcon /></span>}
                                {product.hp ? <span className="pd-hp">{product.hp} HP</span> : null}
                                {gallery.length > 0 && <span className="pd-zoom-badge"><IcZoom /> {t('pd.zoom_hint')}</span>}
                            </button>
                            {gallery.length > 1 && (
                                <div className="pd-thumbs">
                                    {gallery.map((src, i) => (
                                        <button
                                            key={src}
                                            className={`pd-thumb ${i === active ? 'on' : ''}`}
                                            onClick={() => setActive(i)}
                                            aria-label={`${t('pd.gallery')} ${i + 1}`}
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

                            {/* Details — only filled-in fields render (req #6) */}
                            <ul className="pd-specs">
                                <DetailRow label={t('pd.brand')} value={product.brand} />
                                <DetailRow label={t('pd.model')} value={model} />
                                {catName && <DetailRow label={t('pd.category')} value={catName} />}
                                {product.hp ? <DetailRow label={t('pd.power')} value={`${product.hp} HP`} /> : null}
                                <DetailRow label={t('pd.condition')} value={conditionLabel} />
                                <DetailRow label={t('pd.origin')} value={product.country_of_origin} />
                                <DetailRow label={t('pd.availability')} value={product.availability} />
                                <DetailRow label={t('pd.lead')} value={product.lead_time} />
                                <DetailRow label={t('pd.ref')} value={`#${product.id}`} />
                            </ul>

                            <div className="pd-buy">
                                <div className="pd-price">
                                    <span className="pd-price-k">{t('pd.price')}</span>
                                    <b>{price}</b>
                                </div>
                                <button type="button" className="btn pd-quote-btn" onClick={() => setShowQuote((s) => !s)}>
                                    {t('pd.request_quote')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                                </button>
                            </div>

                            <div className="pd-actions">
                                <button
                                    type="button"
                                    className={`btn ghost dark pd-rfq-btn ${inRfq ? 'in' : ''}`}
                                    onClick={() => (inRfq ? rfq.remove(product.id) : rfq.add(product.id))}
                                >
                                    {inRfq ? <><IcCheck /> {t('qf.in_rfq')}</> : <><IcPlus /> {t('qf.add_rfq')}</>}
                                </button>
                                {rfq.count > 0 && (
                                    <Link href="/rfq" className="pd-rfq-link"><IcClipboard /> {t('rfq.view')} ({rfq.count})</Link>
                                )}
                                {product.catalog_pdf && (
                                    <a className="pd-datasheet" href={product.catalog_url} target="_blank" rel="noreferrer">
                                        <IcDownload /> {t('pd.datasheet')}
                                    </a>
                                )}
                            </div>

                            <Link href="/products" className="pd-back">← {t('pd.back')}</Link>
                        </div>
                    </div>

                    {/* Product-bound quote form */}
                    {showQuote && (
                        <div className="pd-quote-panel" data-rv="">
                            <h2 className="pd-quote-h">{t('qf.title')}</h2>
                            <p className="pd-quote-intro">{t('qf.intro')}</p>
                            <QuoteForm product={product} model={model} />
                        </div>
                    )}

                    {/* Technical specifications table (req #5) */}
                    {specs.length > 0 && (
                        <div className="pd-specs-table" data-rv="">
                            <h2 className="pd-specs-title">{t('pd.specs_title')}</h2>
                            <table>
                                <tbody>
                                    {specs.map((s, i) => (
                                        <tr key={i}><th>{s.label}</th><td>{s.value}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>

            {zoom && (
                <Lightbox images={gallery} index={active} setIndex={setActive} onClose={() => setZoom(false)} title={title} />
            )}

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
