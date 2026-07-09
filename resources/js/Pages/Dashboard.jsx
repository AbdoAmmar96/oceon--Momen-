import { Link, router, usePage } from '@inertiajs/react';
import Layout from '../components/Layout';
import { PageHero } from '../components/ui';
import { useI18n } from '../hooks/useI18n';

const STATUS_KEYS = {
    pending: 'dash.st_pending',
    approved: 'dash.st_approved',
    rejected: 'dash.st_rejected',
};

const TYPE_KEYS = { sale: 'lf.type_sale', rent: 'lf.type_rent', service: 'lf.type_service' };

export default function Dashboard({ listings }) {
    const { t } = useI18n();
    const { props } = usePage();
    const user = props.auth?.user;

    const remove = (listing) => {
        if (window.confirm(t('dash.confirm_delete'))) {
            router.delete(`/listings/${listing.id}`);
        }
    };

    return (
        <>
            <PageHero titleKey="dash.title" ledeKey="dash.lede" />
            <section className="sec">
                <div className="wrap">
                    <div className="dash-bar">
                        <div>
                            <strong>{user?.name}</strong>
                            <span className={`role-chip role-${user?.role}`}>{t(`role.${user?.role}`)}</span>
                        </div>
                        <Link href="/listings/create" className="btn">{t('dash.new')}</Link>
                    </div>

                    {props.flash?.ok && <div className="dash-flash">{props.flash.ok}</div>}

                    {listings.length === 0 ? (
                        <p className="dash-empty">{t('dash.empty')}</p>
                    ) : (
                        <div className="dash-list">
                            {listings.map((l) => (
                                <article key={l.id} className="dash-card">
                                    <div className="dash-thumb">
                                        {l.image_url
                                            ? <img src={l.image_url} alt="" />
                                            : <span className="dash-nothumb" />}
                                    </div>
                                    <div className="dash-body">
                                        <h3>{l.title}</h3>
                                        <div className="dash-meta">
                                            <span className={`st st-${l.status}`}>{t(STATUS_KEYS[l.status])}</span>
                                            <span className="dash-type">{t(TYPE_KEYS[l.type])}</span>
                                            {l.price && <span className="dash-price">{l.price} {l.currency}</span>}
                                        </div>
                                        {l.status === 'rejected' && l.admin_note && (
                                            <p className="dash-note">{t('dash.reason')}: {l.admin_note}</p>
                                        )}
                                        {l.status === 'pending' && (
                                            <p className="dash-note dash-note-wait">{t('dash.waiting')}</p>
                                        )}
                                    </div>
                                    <div className="dash-acts">
                                        {l.status === 'approved' && (
                                            <Link href={`/listings/${l.slug}`} className="lnk">{t('dash.view')}</Link>
                                        )}
                                        <Link href={`/listings/${l.id}/edit`} className="lnk">{t('dash.edit')}</Link>
                                        <button className="lnk lnk-danger" onClick={() => remove(l)}>{t('dash.delete')}</button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

Dashboard.layout = (page) => <Layout>{page}</Layout>;
