import { useEffect, useMemo } from 'react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { useRfq } from '../hooks/useRfq';
import { PageHero } from '../components/ui';
import { BrandIcon, IcArrow, IcCheck, IcTrash, IcClipboard } from '../components/Icons';

export default function Rfq({ catalog = [] }) {
    const { t, pick, lang } = useI18n();
    const rfq = useRfq();

    // Resolve saved cart ids against the server-provided product index.
    const byId = useMemo(() => {
        const m = new Map();
        catalog.forEach((p) => m.set(p.id, p));
        return m;
    }, [catalog]);

    const rows = rfq.items
        .map((r) => ({ ...r, product: byId.get(r.id) }))
        .filter((r) => r.product);

    // Drop any saved ids that no longer exist in the catalogue.
    useEffect(() => {
        rfq.items.forEach((r) => { if (!byId.has(r.id)) rfq.remove(r.id); });
    }, [byId]);

    const { data, setData, post, transform, processing, wasSuccessful, errors } = useForm({
        items: [],
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
        // Snapshot the current cart into the payload right before sending —
        // transform runs at send time so the async state update isn't a problem.
        transform((d) => ({
            ...d,
            items: rows.map((r) => ({ product_id: r.id, quantity: r.qty || '', note: r.note || '' })),
        }));
        post('/rfq', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => rfq.clear(),
        });
    };

    if (wasSuccessful) {
        return (
            <>
                <PageHero titleKey="rfq.title" ledeKey="rfq.lede" bg="/img/hero/h1.jpg" />
                <section className="sec"><div className="wrap">
                    <div className="qf-ok" style={{ maxWidth: 620, margin: '0 auto' }}>
                        <IcCheck /> <p>{t('qf.ok')}</p>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link href="/products" className="btn ghost dark">{t('rfq.browse')} <IcArrow className="arr" style={{ width: 18, height: 18 }} /></Link>
                    </div>
                </div></section>
            </>
        );
    }

    return (
        <>
            <PageHero titleKey="rfq.title" ledeKey="rfq.lede" bg="/img/hero/h1.jpg" />

            <section className="sec">
                <div className="wrap">
                    <div className="rfq-head">
                        <h2 className="rfq-count"><IcClipboard /> {t('rfq.title')} ({rows.length} {t('rfq.items')})</h2>
                        {rows.length > 0 && (
                            <button className="rfq-clear" onClick={() => rfq.clear()}><IcTrash /> {t('rfq.clear')}</button>
                        )}
                    </div>

                    {rows.length === 0 ? (
                        <div className="rfq-empty">
                            <BrandIcon />
                            <p>{t('rfq.empty')}</p>
                            <Link href="/products" className="btn">{t('rfq.browse')} <IcArrow className="arr" style={{ width: 18, height: 18 }} /></Link>
                        </div>
                    ) : (
                        <div className="rfq-grid">
                            <div className="rfq-items">
                                {rows.map((r) => (
                                    <div className="rfq-item" key={r.id}>
                                        <Link href={`/products/${r.product.slug}`} className="rfq-thumb">
                                            {r.product.image_url ? <img src={r.product.image_url} alt="" /> : <BrandIcon />}
                                        </Link>
                                        <div className="rfq-item-main">
                                            <Link href={`/products/${r.product.slug}`} className="rfq-item-name">{pick(r.product, 'title')}</Link>
                                            <div className="rfq-item-meta">
                                                {r.product.brand ? <span>{r.product.brand}</span> : null}
                                                {r.product.model_number ? <span>{r.product.model_number}</span> : null}
                                                <span>#{r.product.id}</span>
                                            </div>
                                            <div className="rfq-item-fields">
                                                <label>
                                                    <span>{t('rfq.qty')}</span>
                                                    <input value={r.qty || ''} onChange={(e) => rfq.update(r.id, { qty: e.target.value })} placeholder="1" />
                                                </label>
                                                <label className="rfq-note-field">
                                                    <span>{t('rfq.note')}</span>
                                                    <input value={r.note || ''} onChange={(e) => rfq.update(r.id, { note: e.target.value })} />
                                                </label>
                                            </div>
                                        </div>
                                        <button className="rfq-remove" onClick={() => rfq.remove(r.id)} aria-label={t('rfq.remove')}><IcTrash /></button>
                                    </div>
                                ))}
                            </div>

                            <form className="rfq-form" onSubmit={submit}>
                                <h3>{t('rfq.your_details')}</h3>
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
                                <label className="qf-field">
                                    <span>{t('qf.destination')}</span>
                                    <input value={data.destination_country} onChange={(e) => setData('destination_country', e.target.value)} />
                                </label>
                                <label className="qf-field">
                                    <span>{t('qf.requirements')} <i>({t('qf.optional')})</i></span>
                                    <textarea rows={3} value={data.requirements} onChange={(e) => setData('requirements', e.target.value)} />
                                </label>
                                <button type="submit" className="btn" disabled={processing}>
                                    {processing ? t('qf.sending') : `${t('rfq.submit')} (${rows.length})`} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

Rfq.layout = (page) => <Layout>{page}</Layout>;
