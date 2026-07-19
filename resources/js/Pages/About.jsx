import { Link } from '@inertiajs/react';
import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { IcArrow, IcCheck, IcGlobe, IcTruck, IcDrillSvc, IcBadge, IcUsers } from '../components/Icons';
import { Values, PartnersSection } from './Home';

// Internal links tying About to the pages a visitor most often needs next (req #15).
const ABOUT_LINKS = [
    { href: '/products', key: 'nav.products' },
    { href: '/services', key: 'nav.services' },
    { href: '/team', key: 'team.nav' },
    { href: '/case-studies', key: 'cs.nav' },
    { href: '/jobs', key: 'nav.jobs' },
    { href: '/contact', key: 'nav.contact' },
];

// The client's five reasons to choose Ocean Drilling.
const WHY = [
    { Icon: IcGlobe, i: 1 },
    { Icon: IcTruck, i: 2 },
    { Icon: IcDrillSvc, i: 3 },
    { Icon: IcBadge, i: 4 },
    { Icon: IcUsers, i: 5 },
];

export default function About() {
    const { t } = useI18n();
    return (
        <>
            <PageHero titleKey="ph.about_t" ledeKey="ph.about_l" bg="/img/hero/h2.jpg" />

            {/* Why Choose Ocean Drilling — five reasons */}
            <section className="sec">
                <div className="wrap">
                    <SectionHead center eyebrow={t('why.eyebrow')} title={t('why.title')} />
                    <div className="why-grid" data-rvs="">
                        {WHY.map(({ Icon, i }) => (
                            <div className="why-card" key={i} style={{ transitionDelay: `${(i - 1) * 0.07}s` }}>
                                <span className="why-ico"><Icon /></span>
                                <h3>{t(`why.${i}t`)}</h3>
                                <p>{t(`why.${i}p`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who we are — intro copy with a real drilling photo */}
            <section className="sec alt">
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
                        <div className="ph"><img src="/img/why-ocean.jpg" alt="Ocean Drilling & Trading rig" loading="lazy" /></div>
                    </div>
                </div>
            </section>

            <Values />

            {/* Quick links to the pages visitors need next (req #15) */}
            <section className="sec">
                <div className="wrap">
                    <SectionHead center eyebrow={t('about.eyebrow')} title={t('about.more')} />
                    <div className="about-links" data-rvs="">
                        {ABOUT_LINKS.map((l, i) => (
                            <Link key={l.href} href={l.href} className="about-link" style={{ transitionDelay: `${(i % 3) * 0.05}s` }}>
                                <span>{t(l.key)}</span>
                                <IcArrow />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <PartnersSection />
            <CtaBand />
        </>
    );
}

About.layout = (page) => <Layout>{page}</Layout>;
