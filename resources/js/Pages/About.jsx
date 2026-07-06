import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { IcCheck, IcTarget, IcDrillSvc, IcGlobe } from '../components/Icons';
import { Values, PartnersSection } from './Home';

function WhyCard({ Icon, t, i }) {
    return (
        <div className={`mv ${i === 1 ? 'fire' : ''}`} style={{ transitionDelay: `${i * 0.08}s` }}>
            <span className="mv-ico"><Icon /></span>
            <h3>{t(`why.${i + 1}t`)}</h3>
            <p>{t(`why.${i + 1}p`)}</p>
        </div>
    );
}

export default function About() {
    const { t } = useI18n();
    const WHY_ICONS = [IcTarget, IcDrillSvc, IcGlobe];
    return (
        <>
            <PageHero titleKey="ph.about_t" ledeKey="ph.about_l" bg="/img/hero/h2.jpg" />

            <section className="sec">
                <div className="wrap about-grid">
                    <div className="about-copy" data-rv="left">
                        <span className="eyebrow">{t('about.eyebrow')}</span>
                        <h2 style={{ fontSize: 'clamp(1.9rem,4vw,2.9rem)', color: 'var(--navy-800)' }}>{t('about.title')}</h2>
                        <p>{t('about.p1')}</p>
                        <p>{t('about.p2')}</p>
                        <ul className="tick-list">
                            {['about.li1', 'about.li2', 'about.li3', 'about.li4'].map((k) => (
                                <li key={k}><IcCheck style={{ color: 'var(--aqua)' }} />{t(k)}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="about-media" data-rv="right">
                        <span className="deco" aria-hidden="true" />
                        <div className="ph"><img src="/img/about1.jpg" alt="Ocean Drilling & Trading" loading="lazy" /></div>
                    </div>
                </div>
            </section>

            <section className="sec alt">
                <div className="wrap">
                    <div className="mv-grid" data-rvs="">
                        <div className="mv">
                            <span className="mv-ico"><IcTarget /></span>
                            <h3>{t('mv.v_t')}</h3>
                            <p>{t('mv.v_p')}</p>
                        </div>
                        <div className="mv fire">
                            <span className="mv-ico"><IcDrillSvc /></span>
                            <h3>{t('mv.m_t')}</h3>
                            <p>{t('mv.m_p')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <Values />

            <section className="sec alt">
                <div className="wrap">
                    <SectionHead center eyebrow={t('why.eyebrow')} title={t('why.title')} />
                    <div className="mv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }} data-rvs="">
                        {WHY_ICONS.map((Icon, i) => <WhyCard key={i} Icon={Icon} t={t} i={i} />)}
                    </div>
                </div>
            </section>

            <PartnersSection />
            <CtaBand />
        </>
    );
}

About.layout = (page) => <Layout>{page}</Layout>;
