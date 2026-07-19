import { Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { useI18n } from '../../hooks/useI18n';
import { CtaBand, PageHero } from '../../components/ui';
import { BrandIcon, IcArrow } from '../../components/Icons';

function CaseCard({ c, delay = 0 }) {
    const { t, pick } = useI18n();
    return (
        <Link href={`/case-studies/${c.slug}`} className="cs-card" style={{ transitionDelay: `${delay}s` }}>
            <div className="cs-card-media">
                {c.image_url ? <img src={c.image_url} alt={pick(c, 'title')} loading="lazy" /> : <span className="cs-noimg"><BrandIcon /></span>}
            </div>
            <div className="cs-card-body">
                {c.client_industry && <span className="cs-card-tag">{c.client_industry}</span>}
                <h3>{pick(c, 'title')}</h3>
                {pick(c, 'summary') && <p>{pick(c, 'summary')}</p>}
                <div className="cs-card-meta">
                    {c.country && <span>{c.country}</span>}
                    {c.client_name && <span>{c.client_name}</span>}
                </div>
                <span className="prod-link">{t('cs.view')} <IcArrow /></span>
            </div>
        </Link>
    );
}

export default function CaseStudiesIndex({ cases = [] }) {
    const { t } = useI18n();
    return (
        <>
            <PageHero titleKey="cs.title" ledeKey="cs.lede" bg="/img/hero/h3.jpg" />
            <section className="sec">
                <div className="wrap">
                    {cases.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--mut)', padding: '3rem 0' }}>{t('cs.empty')}</p>
                    ) : (
                        <div className="cs-grid" data-rvs="">
                            {cases.map((c, i) => <CaseCard key={c.id} c={c} delay={(i % 3) * 0.06} />)}
                        </div>
                    )}
                </div>
            </section>
            <CtaBand />
        </>
    );
}

CaseStudiesIndex.layout = (page) => <Layout>{page}</Layout>;
