import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { useI18n } from '../../hooks/useI18n';
import { CtaBand } from '../../components/ui';
import { BrandIcon, IcArrow, IcCheck } from '../../components/Icons';

/** One fact row — hidden when empty (client: don't show blank fields). */
function Fact({ label, value }) {
    if (!value) return null;
    return <li><span className="cs-fact-k">{label}</span><span className="cs-fact-v">{value}</span></li>;
}

/** One narrative block — hidden when empty. */
function Block({ title, body }) {
    if (!body) return null;
    return (
        <div className="cs-block">
            <h2><IcCheck /> {title}</h2>
            <p>{body}</p>
        </div>
    );
}

export default function CaseStudyShow({ item, more = [] }) {
    const { t, pick } = useI18n();
    const title = pick(item, 'title');
    const date = item.supplied_date
        ? new Date(item.supplied_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
        : null;

    return (
        <>
            <Head><title>{`${title} · Ocean Drilling & Trading`}</title></Head>

            <section className="cs-show">
                <div className="wrap">
                    <nav className="crumbs pd-crumbs" aria-label="Breadcrumb">
                        <Link href="/">{t('ph.home')}</Link><i>/</i>
                        <Link href="/case-studies">{t('cs.title')}</Link><i>/</i>
                        <span>{title}</span>
                    </nav>

                    <div className="cs-show-head" data-rv="">
                        <span className="eyebrow">{t('cs.eyebrow')}</span>
                        <h1>{title}</h1>
                        {pick(item, 'summary') && <p className="cs-show-lede">{pick(item, 'summary')}</p>}
                    </div>

                    <div className="cs-show-grid">
                        <div className="cs-show-main" data-rv="">
                            {item.image_url && (
                                <div className="cs-show-media"><img src={item.image_url} alt={title} /></div>
                            )}
                            <Block title={t('cs.challenge')} body={pick(item, 'challenge')} />
                            <Block title={t('cs.solution')} body={pick(item, 'solution')} />
                            <Block title={t('cs.result')} body={pick(item, 'result')} />
                        </div>

                        <aside className="cs-show-facts" data-rv="right">
                            <ul>
                                <Fact label={t('cs.client')} value={item.client_name} />
                                <Fact label={t('cs.industry')} value={item.client_industry} />
                                <Fact label={t('cs.country')} value={item.country} />
                                <Fact label={t('cs.equipment')} value={item.equipment_supplied} />
                                <Fact label={t('cs.date')} value={date} />
                            </ul>
                            <Link href="/contact" className="btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {t('nav.quote')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                            </Link>
                        </aside>
                    </div>

                    <Link href="/case-studies" className="pd-back">← {t('cs.back')}</Link>
                </div>
            </section>

            {more.length > 0 && (
                <section className="sec alt">
                    <div className="wrap">
                        <h2 className="sec-title pd-related-t" data-rv="">{t('cs.more')}</h2>
                        <div className="cs-grid" data-rvs="">
                            {more.map((c, i) => (
                                <Link key={c.id} href={`/case-studies/${c.slug}`} className="cs-card" style={{ transitionDelay: `${i * 0.05}s` }}>
                                    <div className="cs-card-media">
                                        {c.image_url ? <img src={c.image_url} alt={pick(c, 'title')} loading="lazy" /> : <span className="cs-noimg"><BrandIcon /></span>}
                                    </div>
                                    <div className="cs-card-body">
                                        <h3>{pick(c, 'title')}</h3>
                                        {pick(c, 'summary') && <p>{pick(c, 'summary')}</p>}
                                        <span className="prod-link">{t('cs.view')} <IcArrow /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CtaBand />
        </>
    );
}

CaseStudyShow.layout = (page) => <Layout>{page}</Layout>;
