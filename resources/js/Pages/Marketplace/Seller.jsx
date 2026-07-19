import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import { useI18n } from '../../hooks/useI18n';
import { CtaBand } from '../../components/ui';
import { IcArrow, IcPin } from '../../components/Icons';

const TYPE_KEYS = { sale: 'lf.type_sale', rent: 'lf.type_rent', service: 'lf.type_service' };

export default function Seller({ seller, listings }) {
    const { t, pick } = useI18n();
    const initials = seller.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <>
            <Head><title>{`${seller.name} · ${t('mk.title')}`}</title></Head>

            <section className="seller-hero">
                <div className="wrap">
                    <nav className="crumbs" aria-label="Breadcrumb" style={{ marginBottom: '1.4rem' }}>
                        <Link href="/marketplace">{t('mk.title')}</Link><i>/</i><span>{seller.name}</span>
                    </nav>
                    <div className="seller-head">
                        <span className="seller-avatar">{initials}</span>
                        <div>
                            <h1>{seller.name}</h1>
                            <div className="seller-meta">
                                <span className="seller-badge">{t('role.seller')}</span>
                                {seller.country && <span><IcPin /> {seller.country}</span>}
                                {seller.member_since && <span>{t('mk.since')} {seller.member_since}</span>}
                                <span>{listings.length} {t('mk.listings')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sec">
                <div className="wrap">
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
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2.4rem' }}>
                        <Link href="/marketplace" className="btn ghost dark">
                            {t('mk.all_listings')} <IcArrow className="arr" style={{ width: 18, height: 18 }} />
                        </Link>
                    </div>
                </div>
            </section>

            <CtaBand />
        </>
    );
}

Seller.layout = (page) => <Layout>{page}</Layout>;
