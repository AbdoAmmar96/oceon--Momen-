import { useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';
import ListingForm from '../../components/ListingForm';
import { PageHero } from '../../components/ui';
import { useI18n } from '../../hooks/useI18n';

export default function Create({ categories, types }) {
    const { t } = useI18n();

    const { data, setData, post, processing, errors } = useForm({
        type: 'sale',
        title: '',
        model: '',
        description: '',
        category_id: null,
        price: '',
        price_note: '',
        location: '',
        contact_phone: '',
        contact_email: '',
        image: null,
        images: [],
        catalog_pdf: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/listings', { forceFormData: true });
    };

    return (
        <>
            <PageHero titleKey="mk.new_title" ledeKey="mk.new_lede" />
            <section className="sec">
                <div className="wrap wrap-narrow">
                    <ListingForm
                        data={data} setData={setData} errors={errors}
                        categories={categories} types={types}
                        processing={processing} onSubmit={submit}
                        submitLabel={t('lf.submit')}
                    />
                </div>
            </section>
        </>
    );
}

Create.layout = (page) => <Layout>{page}</Layout>;
