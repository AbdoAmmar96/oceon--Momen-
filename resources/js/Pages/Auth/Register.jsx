import { Link, useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { PageHero } from '../../components/ui';
import { useI18n } from '../../hooks/useI18n';

export default function Register() {
    const { t } = useI18n();

    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', country: '',
        password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const field = (name, label, type = 'text', required = false) => (
        <div className="lf-row">
            <label>{label}</label>
            <input type={type} value={data[name]} required={required}
                onChange={(e) => setData(name, e.target.value)} />
            {errors[name] && <p className="lf-err">{errors[name]}</p>}
        </div>
    );

    return (
        <>
            <PageHero titleKey="auth.reg_title" ledeKey="auth.reg_lede" />
            <section className="sec">
                <div className="wrap wrap-narrow">
                    <form className="lf" onSubmit={submit}>
                        {field('name', t('auth.name'), 'text', true)}
                        {field('email', t('auth.email'), 'email', true)}
                        {field('phone', t('auth.phone'))}
                        {field('country', t('auth.country'))}
                        {field('password', t('auth.password'), 'password', true)}
                        {field('password_confirmation', t('auth.password2'), 'password', true)}

                        <div className="lf-actions">
                            <p className="lf-note">
                                {t('auth.have_account')} <Link href="/login">{t('nav.login')}</Link>
                            </p>
                            <button className="btn" disabled={processing}>
                                {processing ? t('lf.sending') : t('auth.reg_cta')}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}

Register.layout = (page) => <Layout>{page}</Layout>;
