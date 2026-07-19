import { Link, useForm, usePage } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { useI18n } from '../../hooks/useI18n';

const TYPE_KEYS = {
    full_time: 'job.t_full',
    part_time: 'job.t_part',
    contract: 'job.t_contract',
    internship: 'job.t_intern',
};

function ApplyForm({ job }) {
    const { t } = useI18n();
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors } = useForm({
        full_name: user?.name ?? '',
        email: user?.email ?? '',
        phone: '',
        country: '',
        current_title: '',
        years_experience: '',
        linkedin_url: '',
        qualifications: '',
        cover_letter: '',
        cv: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/jobs/${job.slug}/apply`, { forceFormData: true });
    };

    return (
        <form className="lf" onSubmit={submit} encType="multipart/form-data">
            <div className="lf-row">
                <label>{t('job.f_name')}</label>
                <input type="text" value={data.full_name} required onChange={(e) => setData('full_name', e.target.value)} />
                {errors.full_name && <p className="lf-err">{errors.full_name}</p>}
            </div>

            <div className="lf-row">
                <label>{t('job.f_email')}</label>
                <input type="email" value={data.email} required onChange={(e) => setData('email', e.target.value)} />
                {errors.email && <p className="lf-err">{errors.email}</p>}
            </div>

            <div className="lf-row">
                <label>{t('job.f_phone')}</label>
                <input type="text" value={data.phone} required onChange={(e) => setData('phone', e.target.value)} />
                {errors.phone && <p className="lf-err">{errors.phone}</p>}
            </div>

            <div className="lf-row">
                <label>{t('job.f_country')}</label>
                <input type="text" value={data.country} onChange={(e) => setData('country', e.target.value)} />
                {errors.country && <p className="lf-err">{errors.country}</p>}
            </div>

            <div className="lf-row">
                <label>{t('job.f_position')}</label>
                <input type="text" value={data.current_title} onChange={(e) => setData('current_title', e.target.value)} />
                {errors.current_title && <p className="lf-err">{errors.current_title}</p>}
            </div>

            <div className="lf-row">
                <label>{t('job.f_years')}</label>
                <input type="number" min="0" max="60" value={data.years_experience}
                    onChange={(e) => setData('years_experience', e.target.value)} />
                {errors.years_experience && <p className="lf-err">{errors.years_experience}</p>}
            </div>

            <div className="lf-row lf-wide">
                <label>{t('job.f_linkedin')}</label>
                <input type="url" placeholder="https://linkedin.com/in/…" value={data.linkedin_url}
                    onChange={(e) => setData('linkedin_url', e.target.value)} />
                {errors.linkedin_url && <p className="lf-err">{errors.linkedin_url}</p>}
            </div>

            <div className="lf-row lf-wide">
                <label>{t('job.f_quals')}</label>
                <textarea rows={4} value={data.qualifications} onChange={(e) => setData('qualifications', e.target.value)} />
                {errors.qualifications && <p className="lf-err">{errors.qualifications}</p>}
            </div>

            <div className="lf-row lf-wide">
                <label>{t('job.f_cover')}</label>
                <textarea rows={5} value={data.cover_letter} onChange={(e) => setData('cover_letter', e.target.value)} />
                {errors.cover_letter && <p className="lf-err">{errors.cover_letter}</p>}
            </div>

            <div className="lf-row lf-wide">
                <label>{t('job.f_cv')}</label>
                <input type="file" accept=".pdf,.doc,.docx" required
                    onChange={(e) => setData('cv', e.target.files[0] ?? null)} />
                <span className="lf-hint">{t('job.f_cv_hint')}</span>
                {errors.cv && <p className="lf-err">{errors.cv}</p>}
            </div>

            <div className="lf-actions">
                <p className="lf-note">{t('job.privacy')}</p>
                <button className="btn" disabled={processing}>
                    {processing ? t('lf.sending') : t('job.apply')}
                </button>
            </div>
        </form>
    );
}

export default function Show({ job, hasApplied }) {
    const { t, pick } = useI18n();
    const user = usePage().props.auth.user;

    return (
        <section className="sec sec-top">
            <div className="wrap wrap-narrow">
                <nav className="crumbs">
                    <Link href="/jobs">{t('job.title')}</Link> <span>/</span> {pick(job, 'title')}
                </nav>

                <header className="job-head">
                    <h1>{pick(job, 'title')}</h1>
                    <div className="job-meta">
                        {job.department && <span className="job-dept">{job.department}</span>}
                        {job.location && <span>{job.location}</span>}
                        <span className="job-type">{t(TYPE_KEYS[job.employment_type])}</span>
                    </div>
                    {job.closes_at && <p className="job-closes">{t('job.closes')}: {job.closes_at}</p>}
                </header>

                <div className="job-desc">{pick(job, 'description')}</div>

                <div className="job-apply">
                    <h2>{t('job.apply_h')}</h2>

                    {! user && (
                        <div className="job-gate">
                            <p>{t('job.login_first')}</p>
                            <div className="adv-actions">
                                <Link href="/login" className="btn">{t('nav.login')}</Link>
                                <Link href="/register" className="btn btn-ghost">{t('nav.register')}</Link>
                            </div>
                        </div>
                    )}

                    {user && hasApplied && (
                        <div className="job-gate job-done">
                            <p>{t('job.already')}</p>
                            <Link href="/dashboard" className="btn">{t('nav.dashboard')}</Link>
                        </div>
                    )}

                    {user && ! hasApplied && <ApplyForm job={job} />}
                </div>
            </div>
        </section>
    );
}

Show.layout = (page) => <Layout>{page}</Layout>;
