import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { PartnersSection } from './Home';

/** The six commitments carried over from the old site's أهداف الشركة page. */
const COUNT = 6;

export default function Objectives() {
    const { t } = useI18n();

    return (
        <>
            <PageHero titleKey="obj.title" ledeKey="obj.lede" bg="/img/hero/h2.jpg" />

            <section className="sec">
                <div className="wrap">
                    <SectionHead center eyebrow={t('obj.eyebrow')} title={t('obj.heading')} sub={t('obj.sub')} />
                    <div className="obj-grid" data-rvs="">
                        {Array.from({ length: COUNT }, (_, i) => (
                            <div className="obj-card" key={i} style={{ transitionDelay: `${(i % 2) * 0.07}s` }}>
                                <span className="obj-num">{String(i + 1).padStart(2, '0')}</span>
                                <h3>{t(`obj.v${i + 1}t`)}</h3>
                                <p>{t(`obj.v${i + 1}p`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <PartnersSection />
            <CtaBand />
        </>
    );
}

Objectives.layout = (page) => <Layout>{page}</Layout>;
