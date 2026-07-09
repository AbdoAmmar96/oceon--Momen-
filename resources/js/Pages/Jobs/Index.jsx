import { Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { PageHero } from '../../components/ui';
import { useI18n } from '../../hooks/useI18n';

const TYPE_KEYS = {
    full_time: 'job.t_full',
    part_time: 'job.t_part',
    contract: 'job.t_contract',
    internship: 'job.t_intern',
};

export default function Index({ jobs }) {
    const { t, pick } = useI18n();

    return (
        <>
            <PageHero titleKey="job.title" ledeKey="job.lede" bg="/img/hero/h3.jpg" />

            <section className="sec">
                <div className="wrap">
                    {jobs.length === 0 ? (
                        <p className="dash-empty">{t('job.empty')}</p>
                    ) : (
                        <div className="job-list">
                            {jobs.map((j) => (
                                <Link key={j.id} href={`/jobs/${j.slug}`} className="job-card">
                                    <div className="job-main">
                                        <h3>{pick(j, 'title')}</h3>
                                        <div className="job-meta">
                                            {j.department && <span className="job-dept">{j.department}</span>}
                                            {j.location && <span>{j.location}</span>}
                                            <span className="job-type">{t(TYPE_KEYS[j.employment_type])}</span>
                                        </div>
                                    </div>
                                    <span className="job-go">{t('job.view')}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

Index.layout = (page) => <Layout>{page}</Layout>;
