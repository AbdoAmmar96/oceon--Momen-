import { Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { PageHero } from '../../components/ui';
import { DeptIcon } from '../../components/Icons';
import { useI18n } from '../../hooks/useI18n';

const TYPE_KEYS = {
    full_time: 'job.t_full',
    part_time: 'job.t_part',
    contract: 'job.t_contract',
    internship: 'job.t_intern',
};

// Canonical department name (as stored on the opening) -> translation key.
const DEPT_KEYS = {
    Finance: 'dept.finance',
    Operation: 'dept.operation',
    'Human Resource': 'dept.hr',
    Logistic: 'dept.logistic',
    Sales: 'dept.sales',
    Information: 'dept.information',
};

const deptSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function Index({ jobs, departments = [] }) {
    const { t, pick } = useI18n();

    // Translate a department for display, falling back to any custom name an
    // admin typed that isn't one of the standard sections.
    const deptLabel = (name) => (DEPT_KEYS[name] ? t(DEPT_KEYS[name]) : name);

    // Group openings by department.
    const byDept = new Map();
    for (const j of jobs) {
        const key = j.department || t('job.other_dept');
        if (!byDept.has(key)) byDept.set(key, []);
        byDept.get(key).push(j);
    }

    // Show every standard department first (even with zero openings, mirroring
    // the old site's sections), then any custom departments that have roles.
    const order = [...departments];
    for (const key of byDept.keys()) if (!order.includes(key)) order.push(key);
    const groups = order.filter((d) => byDept.has(d)); // sections with roles

    const countLabel = (n) =>
        n === 0 ? t('job.no_open') : `${n} ${n === 1 ? t('job.open_role') : t('job.open_roles')}`;

    return (
        <>
            <PageHero titleKey="job.title" ledeKey="job.lede" bg="/img/hero/h3.jpg" />

            <section className="sec">
                <div className="wrap">
                    {/* Intro (replaces the old "brown rectangle" placeholder text). */}
                    <div className="job-intro" data-rv="">
                        <h2>{t('job.intro_h')}</h2>
                        <p>{t('job.intro')}</p>
                    </div>

                    {/* Department grid — the sections carried over from the old site. */}
                    <h2 className="job-sec-h">{t('job.depts_h')}</h2>
                    <div className="job-dept-grid">
                        {order.map((dept) => {
                            const n = byDept.get(dept)?.length ?? 0;
                            const target = n > 0 ? `#dept-${deptSlug(dept)}` : '#job-talent';
                            return (
                                <a key={dept} href={target} className="job-dept-card" data-rv="">
                                    <span className="jd-ico" style={{ '--i-acc': '#0f7fb8' }}>
                                        <DeptIcon name={dept} />
                                    </span>
                                    <span className="jd-name">{deptLabel(dept)}</span>
                                    <span className={`jd-count${n === 0 ? ' jd-none' : ''}`}>{countLabel(n)}</span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Open positions, grouped by department. */}
                    <h2 className="job-sec-h" id="roles">{t('job.roles_h')}</h2>
                    {groups.length === 0 ? (
                        <p className="dash-empty">{t('job.empty')}</p>
                    ) : (
                        <div className="job-groups">
                            {groups.map((dept) => (
                                <div key={dept} className="job-group" id={`dept-${deptSlug(dept)}`} data-rv="">
                                    <h3 className="job-group-title">
                                        {deptLabel(dept)} <em>{byDept.get(dept).length}</em>
                                    </h3>
                                    <div className="job-list">
                                        {byDept.get(dept).map((j) => (
                                            <Link key={j.id} href={`/jobs/${j.slug}`} className="job-card">
                                                <div className="job-main">
                                                    <h4>{pick(j, 'title')}</h4>
                                                    <div className="job-meta">
                                                        {j.location && <span>{j.location}</span>}
                                                        <span className="job-type">{t(TYPE_KEYS[j.employment_type])}</span>
                                                    </div>
                                                </div>
                                                <span className="job-go">{t('job.view')}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Talent pool — register even when nothing fits right now. */}
                    <div className="job-talent" id="job-talent" data-rv="">
                        <div>
                            <h2>{t('job.talent_h')}</h2>
                            <p>{t('job.talent_p')}</p>
                        </div>
                        <Link href="/register" className="btn">{t('job.talent_cta')}</Link>
                    </div>
                </div>
            </section>
        </>
    );
}

Index.layout = (page) => <Layout>{page}</Layout>;
