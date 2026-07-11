import { useForm, usePage } from '@inertiajs/react';
import Layout from '../components/Layout';
import { buildSocials, telHref } from '../components/Layout';
import { useI18n } from '../hooks/useI18n';
import { PageHero } from '../components/ui';
import { IcArrow, IcCheck, IcMail, IcPhone, IcPin, IcShare } from '../components/Icons';

function Field({ id, label, type = 'text', value, onChange, textarea = false, required = false, error }) {
    const filled = value && value.length > 0;
    const Tag = textarea ? 'textarea' : 'input';
    return (
        <div className={`f-field ${filled ? 'filled' : ''}`}>
            <Tag id={id} type={type} value={value} required={required}
                onChange={(e) => onChange(e.target.value)} rows={textarea ? 5 : undefined} />
            <label htmlFor={id}>{label}</label>
            {error && <small style={{ color: 'var(--orange-deep)', fontSize: '.75rem' }}>{error}</small>}
        </div>
    );
}

export default function Contact() {
    const { t, lang } = useI18n();
    const { flash, settings = {} } = usePage().props;
    const phones = [settings.contact_phone, settings.contact_phone2, settings.contact_phone3].filter(Boolean);
    const email = settings.contact_email || 'info@oceandrilling.co.uk';
    const address = settings[`contact_address_${lang}`] || settings.contact_address_en || t('contact.addr_v');
    const mapQuery = settings.contact_map_query || 'Faneromenis 148, Larnaca, Cyprus';
    const socials = buildSocials(settings);
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '', email: '', phone: '', subject: '', body: '', locale: lang, files: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post('/contact', { preserveScroll: true, forceFormData: true, onSuccess: () => reset() });
    };

    const ok = recentlySuccessful || flash?.ok;

    return (
        <>
            <PageHero titleKey="ph.contact_t" ledeKey="ph.contact_l" bg="/img/hero/h2.jpg" />

            <section className="sec">
                <div className="wrap contact-grid">
                    <div className="c-cards" data-rvs="">
                        <div className="c-card">
                            <span className="c-ico"><IcPin /></span>
                            <div>
                                <h4>{t('contact.addr_t')}</h4>
                                <p className="rtl-ok">{address}</p>
                            </div>
                        </div>
                        <div className="c-card">
                            <span className="c-ico"><IcPhone /></span>
                            <div>
                                <h4>{t('contact.phone_t')}</h4>
                                {phones.map((num) => (
                                    <a key={num} href={telHref(num)}><b className="ltr">{num}</b></a>
                                ))}
                            </div>
                        </div>
                        <div className="c-card">
                            <span className="c-ico"><IcMail /></span>
                            <div>
                                <h4>{t('contact.mail_t')}</h4>
                                <a href={`mailto:${email}`}>{email}</a>
                            </div>
                        </div>
                        <div className="c-card">
                            <span className="c-ico"><IcShare /></span>
                            <div>
                                <h4>{t('contact.social_t')}</h4>
                                <div className="socials" style={{ marginTop: '.5rem' }}>
                                    {socials.map(({ Icon, href, label }) => (
                                        <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label}
                                            style={{ borderColor: 'var(--line)', color: 'var(--mut)' }}>
                                            <Icon />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="form-card" data-rv="right" onSubmit={submit}>
                        <div className={`form-ok ${ok ? 'show' : ''}`} role="status">
                            <IcCheck style={{ width: 22, height: 22, flexShrink: 0 }} />
                            {t('contact.f_ok')}
                        </div>
                        <div className="f-row">
                            <Field id="c-name" label={t('contact.f_name')} value={data.name}
                                onChange={(v) => setData('name', v)} required error={errors.name} />
                            <Field id="c-mail" label={t('contact.f_mail')} type="email" value={data.email}
                                onChange={(v) => setData('email', v)} required error={errors.email} />
                        </div>
                        <div className="f-row">
                            <Field id="c-phone" label={t('contact.f_phone')} value={data.phone}
                                onChange={(v) => setData('phone', v)} error={errors.phone} />
                            <Field id="c-subj" label={t('contact.f_subj')} value={data.subject}
                                onChange={(v) => setData('subject', v)} error={errors.subject} />
                        </div>
                        <Field id="c-msg" label={t('contact.f_msg')} textarea value={data.body}
                            onChange={(v) => setData('body', v)} required error={errors.body} />
                        <div className="c-files">
                            <label htmlFor="c-files">{t('contact.f_files')}</label>
                            <input
                                id="c-files"
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf,.doc,.docx,.xls,.xlsx"
                                onChange={(e) => setData('files', Array.from(e.target.files).slice(0, 3))}
                            />
                            <span className="c-files-hint">{t('contact.f_files_hint')}</span>
                            {(errors.files || errors['files.0']) && (
                                <p className="lf-err">{errors.files || errors['files.0']}</p>
                            )}
                        </div>
                        <button type="submit" className="btn" disabled={processing} style={{ justifyContent: 'center' }}>
                            {t('contact.f_send')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                        </button>
                        <p className="form-note">{t('contact.f_note')}</p>
                    </form>
                </div>

                <div className="wrap">
                    <div className="map-shell" data-rv="">
                        <iframe
                            title={t('contact.map')}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        <div className="map-pin"><IcPin />{t('contact.map')}</div>
                    </div>
                </div>
            </section>
        </>
    );
}

Contact.layout = (page) => <Layout>{page}</Layout>;
