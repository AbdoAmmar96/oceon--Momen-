import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { useI18n } from '../../hooks/useI18n';
import { telHref } from '../../components/Layout';
import { IcMail, IcPhone, IcPin } from '../../components/Icons';

const TYPE_KEYS = { sale: 'lf.type_sale', rent: 'lf.type_rent', service: 'lf.type_service' };

export default function Show({ listing, related }) {
    const { t, pick } = useI18n();
    const gallery = listing.gallery_urls?.length ? listing.gallery_urls : [];
    const [active, setActive] = useState(0);

    return (
        <section className="sec sec-top">
            <div className="wrap">
                <nav className="crumbs">
                    <Link href="/marketplace">{t('mk.title')}</Link> <span>/</span> {listing.title}
                </nav>

                <div className="mk-show">
                    <div className="mk-show-media">
                        {gallery.length > 0 ? (
                            <>
                                <img className="mk-show-main" src={gallery[active]} alt={listing.title} />
                                {gallery.length > 1 && (
                                    <div className="mk-thumbs">
                                        {gallery.map((src, i) => (
                                            <button key={src} className={i === active ? 'on' : ''} onClick={() => setActive(i)}>
                                                <img src={src} alt="" loading="lazy" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : <div className="mk-show-noimg" />}
                    </div>

                    <div className="mk-show-info">
                        <em className={`mk-badge mk-${listing.type}`}>{t(TYPE_KEYS[listing.type])}</em>
                        <h1>{listing.title}</h1>

                        {listing.category && <p className="mk-cat">{pick(listing.category, 'name')}</p>}

                        <p className="mk-show-price">
                            {listing.price ? `${listing.price} ${listing.currency}` : t('mk.on_request')}
                            {listing.price_note && <em> · {listing.price_note}</em>}
                        </p>

                        <p className="mk-show-desc">{listing.description}</p>

                        <ul className="mk-show-contact">
                            {listing.location && <li><IcPin /><span>{listing.location}</span></li>}
                            {listing.contact_phone && (
                                <li><IcPhone /><a className="ltr" href={telHref(listing.contact_phone)}>{listing.contact_phone}</a></li>
                            )}
                            {listing.contact_email && (
                                <li><IcMail /><a href={`mailto:${listing.contact_email}`}>{listing.contact_email}</a></li>
                            )}
                        </ul>

                        {listing.user && (
                            <p className="mk-show-by">{t('mk.posted_by')}: <strong>{listing.user.name}</strong></p>
                        )}
                    </div>
                </div>

                {related.length > 0 && (
                    <>
                        <h2 className="mk-rel-h">{t('mk.related')}</h2>
                        <div className="mk-grid">
                            {related.map((l) => (
                                <Link key={l.id} href={`/listings/${l.slug}`} className="mk-card">
                                    <div className="mk-img">
                                        {l.image_url ? <img src={l.image_url} alt={l.title} loading="lazy" /> : <span />}
                                    </div>
                                    <div className="mk-body">
                                        <h3>{l.title}</h3>
                                        <span className="mk-price">
                                            {l.price ? `${l.price} ${l.currency}` : t('mk.on_request')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

Show.layout = (page) => <Layout>{page}</Layout>;
