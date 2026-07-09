import { useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';
import ListingForm from '../../components/ListingForm';
import { PageHero } from '../../components/ui';
import { useI18n } from '../../hooks/useI18n';

export default function Edit({ listing, categories, types }) {
    const { t } = useI18n();

    const { data, setData, post, processing, errors } = useForm({
        // Inertia cannot send files over PUT, so spoof the method on a POST.
        _method: 'put',
        type: listing.type,
        title: listing.title,
        description: listing.description,
        category_id: listing.category_id,
        price: listing.price ?? '',
        price_note: listing.price_note ?? '',
        location: listing.location ?? '',
        contact_phone: listing.contact_phone ?? '',
        contact_email: listing.contact_email ?? '',
        image: null,
        images: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/listings/${listing.id}`, { forceFormData: true });
    };

    return (
        <>
            <PageHero titleKey="mk.edit_title" ledeKey="mk.edit_lede" />
            <section className="sec">
                <div className="wrap wrap-narrow">
                    {listing.image_url && (
                        <div className="lf-current">
                            <span>{t('lf.current_cover')}</span>
                            <img src={listing.image_url} alt="" />
                        </div>
                    )}
                    <ListingForm
                        data={data} setData={setData} errors={errors}
                        categories={categories} types={types}
                        processing={processing} onSubmit={submit}
                        submitLabel={t('lf.save')}
                    />
                </div>
            </section>
        </>
    );
}

Edit.layout = (page) => <Layout>{page}</Layout>;
