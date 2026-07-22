import { Link } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { CatIcon, IcArrow, IcClipboard, IcDownload } from '../components/Icons';

export default function Catalog({ catalogUrl = null, categories = [] }) {
    const { t, pick } = useI18n();

    return (
        <>
            <PageHero titleKey="cat.title" ledeKey="cat.lede" bg="/img/hero/h1.jpg" />

            {/* Download card — the admin uploads the PDF from Site Settings. Until
                one exists we say so rather than serving a dead button. */}
            <section className="sec">
                <div className="wrap">
                    <div className="cat-dl" data-rv="">
                        <span className="cat-dl-ico">{catalogUrl ? <IcDownload /> : <IcClipboard />}</span>
                        <div>
                            <h2>{t('cat.heading')}</h2>
                            <p>{catalogUrl ? t('cat.sub') : t('cat.soon')}</p>
                        </div>
                        {catalogUrl && (
                            <a className="btn" href={catalogUrl} target="_blank" rel="noreferrer" download>
                                {t('cat.download')}<IcArrow className="arr" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* The catalogue index: every section, browsable with live stock. */}
            <section className="sec alt">
                <div className="wrap">
                    <SectionHead center eyebrow={t('cat.eyebrow')} title={t('cat.browse_t')} sub={t('cat.browse_s')} />
                    <div className="cat-grid" data-rvs="">
                        {categories.map((c, i) => (
                            <Link href={`/products?cat=${c.id}`} className="cat-card" key={c.id} style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
                                <span className="cat-watermark" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                                <span className="cat-ico"><CatIcon cid={c.cid} /></span>
                                <span className="cat-body">
                                    <h3>{pick(c, 'name')}</h3>
                                    <span className="cat-count">{c.products_count} {t('cat.items')}</span>
                                </span>
                                <span className="cat-arrow"><IcArrow /></span>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Link href="/products" className="btn">{t('cat.all')}<IcArrow className="arr" /></Link>
                    </div>
                </div>
            </section>

            <CtaBand />
        </>
    );
}

Catalog.layout = (page) => <Layout>{page}</Layout>;
