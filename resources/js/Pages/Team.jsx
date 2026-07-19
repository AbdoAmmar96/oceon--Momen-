import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { Values } from './Home';
import { IcLi, IcMail, IcUsers } from '../components/Icons';

function MemberCard({ m, delay = 0 }) {
    const { pick } = useI18n();
    return (
        <div className="team-card" style={{ transitionDelay: `${delay}s` }}>
            <div className="team-photo">
                {m.photo_url ? <img src={m.photo_url} alt={m.name} loading="lazy" /> : <span className="team-ph"><IcUsers /></span>}
            </div>
            <div className="team-body">
                <h3>{m.name}</h3>
                <span className="team-role">{pick(m, 'role')}</span>
                {pick(m, 'bio') && <p>{pick(m, 'bio')}</p>}
                <div className="team-links">
                    {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><IcLi /></a>}
                    {m.email && <a href={`mailto:${m.email}`} aria-label="Email"><IcMail /></a>}
                </div>
            </div>
        </div>
    );
}

export default function Team({ members = [] }) {
    const { t } = useI18n();
    return (
        <>
            <PageHero titleKey="team.title" ledeKey="team.lede" bg="/img/hero/h2.jpg" />

            <section className="sec">
                <div className="wrap">
                    <SectionHead center eyebrow={t('team.eyebrow')} title={t('team.heading')} sub={t('team.sub')} />
                    {members.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--mut)', padding: '2rem 0' }}>{t('team.empty')}</p>
                    ) : (
                        <div className="team-grid" data-rvs="">
                            {members.map((m, i) => <MemberCard key={m.id} m={m} delay={(i % 4) * 0.06} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* The company's teamwork values give the page substance even before
                individual members are added. */}
            <Values />
            <CtaBand />
        </>
    );
}

Team.layout = (page) => <Layout>{page}</Layout>;
