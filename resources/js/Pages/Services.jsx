import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { ServicesSplit, PartnersSection } from './Home';

export default function Services() {
    const { t } = useI18n();
    const steps = [1, 2, 3, 4, 5];

    return (
        <>
            <PageHero titleKey="ph.services_t" ledeKey="ph.services_l" bg="/img/hero/h3.jpg" />

            <section className="sec">
                <div className="wrap">
                    <SectionHead eyebrow={t('svc.eyebrow')} title={t('svc.title')} sub={t('svc.sub')} />
                    <ServicesSplit />
                </div>
            </section>

            <section className="sec alt">
                <div className="wrap">
                    <SectionHead center eyebrow={t('steps.eyebrow')} title={t('steps.title')} />
                    <div className="steps">
                        {steps.map((n) => (
                            <div className="step" key={n} data-rv="" style={{ transitionDelay: `${n * 0.09}s` }}>
                                <span className="step-dot" aria-hidden="true" />
                                <h4>{t(`steps.s${n}t`)}</h4>
                                <p>{t(`steps.s${n}p`)}</p>
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

Services.layout = (page) => <Layout>{page}</Layout>;
