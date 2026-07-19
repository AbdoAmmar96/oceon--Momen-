import { Link, usePage } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { PageHero } from '../../components/ui';
import { useI18n } from '../../hooks/useI18n';

const TYPE_KEYS = { sale: 'lf.type_sale', rent: 'lf.type_rent', service: 'lf.type_service' };

export default function Index({ listings, activeType }) {
    const { t, pick } = useI18n();
    const user = usePage().props.auth?.user;

    const tabs = [null, 'sale', 'rent', 'service'];

    return (
        <>
            <PageHero titleKey="mk.title" ledeKey="mk.lede" bg="/img/hero/h1.jpg" />

            <section className="sec">
                <div className="wrap">
                    <div className="mk-bar">
                        <div className="mk-tabs">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab ?? 'all'}
                                    href={tab ? `/marketplace?type=${tab}` : '/marketplace'}
                                    className={(activeType ?? null) === tab ? 'on' : ''}
                                >
                                    {tab ? t(TYPE_KEYS[tab]) : t('mk.all')}
                                </Link>
                            ))}
                        </div>
                        <Link href={user ? '/listings/create' : '/register'} className="btn">
                            {user ? t('dash.new') : t('adv.cta')}
                        </Link>
                    </div>

                    {listings.length === 0 ? (
                        <p className="dash-empty">{t('mk.empty')}</p>
                    ) : (
                        <div className="mk-grid">
                            {listings.map((l) => (
                                <Link key={l.id} href={`/listings/${l.slug}`} className="mk-card">
                                    <div className="mk-img">
                                        {l.image_url ? <img src={l.image_url} alt={l.title} loading="lazy" /> : <span />}
                                        <em className={`mk-badge mk-${l.type}`}>{t(TYPE_KEYS[l.type])}</em>
                                    </div>
                                    <div className="mk-body">
                                        <h3>{l.title}</h3>
                                        {l.category && <span className="mk-cat">{pick(l.category, 'name')}</span>}
                                        <div className="mk-foot">
                                            <span className="mk-price">
                                                {l.final_price ? `${l.final_price} ${l.currency}` : t('mk.on_request')}
                                                {l.price_note && <em> · {l.price_note}</em>}
                                            </span>
                                            {l.user && <span className="mk-by">{l.user.name}</span>}
                                        </div>
                                    </div>
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
