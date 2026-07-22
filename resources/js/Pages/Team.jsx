import Layout from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { CtaBand, PageHero, SectionHead } from '../components/ui';
import { Values } from './Home';
import { IcLi, IcMail, IcUsers } from '../components/Icons';

/** Arabic pages show the Arabic spelling of a name when the admin supplied one. */
function displayName(m, lang) {
    return lang === 'ar' && m.name_ar ? m.name_ar : m.name;
}

function Photo({ m, name }) {
    return m.photo_url
        ? <img src={m.photo_url} alt={name} loading="lazy" />
        : <span className="team-ph"><IcUsers /></span>;
}

function MemberLinks({ m }) {
    if (!m.linkedin && !m.email) return null;

    return (
        <div className="team-links">
            {m.linkedin && (
                <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><IcLi /></a>
            )}
            {m.email && <a href={`mailto:${m.email}`} aria-label="Email"><IcMail /></a>}
        </div>
    );
}

function MemberCard({ m, delay = 0 }) {
    const { pick, lang } = useI18n();
    const name = displayName(m, lang);

    return (
        <div className="team-card" style={{ transitionDelay: `${delay}s` }}>
            <div className="team-photo"><Photo m={m} name={name} /></div>
            <div className="team-body">
                <h3>{name}</h3>
                <span className="team-role">{pick(m, 'role')}</span>
                {pick(m, 'bio') && <p>{pick(m, 'bio')}</p>}
                <MemberLinks m={m} />
            </div>
        </div>
    );
}

/** The most senior member, given the full width so the page opens on a face. */
function LeadCard({ m }) {
    const { pick, lang } = useI18n();
    const name = displayName(m, lang);

    return (
        <div className="team-lead" data-rv="">
            <div className="team-lead-photo"><Photo m={m} name={name} /></div>
            <div className="team-lead-body">
                <span className="team-lead-badge">{pick(m, 'role')}</span>
                <h3>{name}</h3>
                {pick(m, 'bio') && <p>{pick(m, 'bio')}</p>}
                <MemberLinks m={m} />
            </div>
        </div>
    );
}

export default function Team({ members = [] }) {
    const { t } = useI18n();

    /*
     * Members arrive ordered by `sort`, so the first is the most senior — they
     * head the page and everyone else fills the grid. Only split them out once
     * there are enough people left to still make a proper row.
     */
    const featureLead = members.length >= 4;
    const [lead, ...rest] = members;
    const grid = featureLead ? rest : members;

    return (
        <>
            <PageHero titleKey="team.title" ledeKey="team.lede" bg="/img/hero/h2.jpg" />

            <section className="sec">
                <div className="wrap">
                    <SectionHead center eyebrow={t('team.eyebrow')} title={t('team.heading')} sub={t('team.sub')} />

                    {members.length === 0 ? (
                        <p className="team-empty">{t('team.empty')}</p>
                    ) : (
                        <>
                            {featureLead && <LeadCard m={lead} />}
                            <div className="team-grid" data-rvs="">
                                {grid.map((m, i) => (
                                    <MemberCard key={m.id} m={m} delay={(i % 4) * 0.06} />
                                ))}
                            </div>
                        </>
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
