import { Link, useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { PageHero } from '../../components/ui';
import { useI18n } from '../../hooks/useI18n';

export default function Login() {
    const { t } = useI18n();

    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <PageHero titleKey="auth.login_title" ledeKey="auth.login_lede" />
            <section className="sec">
                <div className="wrap wrap-narrow">
                    <form className="lf" onSubmit={submit}>
                        <div className="lf-row">
                            <label>{t('auth.email')}</label>
                            <input type="email" value={data.email} required
                                onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="lf-err">{errors.email}</p>}
                        </div>

                        <div className="lf-row">
                            <label>{t('auth.password')}</label>
                            <input type="password" value={data.password} required
                                onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && <p className="lf-err">{errors.password}</p>}
                        </div>

                        <div className="lf-row lf-wide">
                            <label className="lf-check">
                                <input type="checkbox" checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)} />
                                <span>{t('auth.remember')}</span>
                            </label>
                        </div>

                        <div className="lf-actions">
                            <p className="lf-note">
                                {t('auth.no_account')} <Link href="/register">{t('nav.register')}</Link>
                            </p>
                            <button className="btn" disabled={processing}>
                                {processing ? t('lf.sending') : t('auth.login_cta')}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}

Login.layout = (page) => <Layout>{page}</Layout>;
