import { Link, usePage } from '@inertiajs/react';
import { useI18n } from '../hooks/useI18n';

const STEPS = ['adv.s1', 'adv.s2', 'adv.s3'];

/**
 * Home-page invitation to the member marketplace. Signed-in members jump
 * straight to the submission form; guests are sent to register first.
 */
export default function AdvertiseHere() {
    const { t } = useI18n();
    const user = usePage().props.auth?.user;

    return (
        <section className="adv reveal">
            <div className="wrap">
                <div className="adv-inner">
                    <div className="adv-copy">
                        <span className="adv-eyebrow">{t('adv.eyebrow')}</span>
                        <h2>{t('adv.title')}</h2>
                        <p>{t('adv.sub')}</p>

                        <ol className="adv-steps">
                            {STEPS.map((key, i) => (
                                <li key={key}><em>{i + 1}</em><span>{t(key)}</span></li>
                            ))}
                        </ol>

                        <div className="adv-actions">
                            <Link href={user ? '/listings/create' : '/register'} className="btn">
                                {user ? t('adv.cta_in') : t('adv.cta')}
                            </Link>
                            <Link href="/marketplace" className="btn btn-ghost">{t('adv.browse')}</Link>
                        </div>

                        <p className="adv-note">{t('adv.note')}</p>
                    </div>

                    <div className="adv-cards" aria-hidden="true">
                        <div className="adv-card adv-c1"><span>{t('lf.type_sale')}</span></div>
                        <div className="adv-card adv-c2"><span>{t('lf.type_rent')}</span></div>
                        <div className="adv-card adv-c3"><span>{t('lf.type_service')}</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
