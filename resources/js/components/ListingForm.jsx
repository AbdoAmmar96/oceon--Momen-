import { useI18n } from '../hooks/useI18n';

const TYPE_KEYS = { sale: 'lf.type_sale', rent: 'lf.type_rent', service: 'lf.type_service' };

function Row({ label, error, children, wide = false }) {
    return (
        <div className={`lf-row ${wide ? 'lf-wide' : ''}`}>
            <label>{label}</label>
            {children}
            {error && <p className="lf-err">{error}</p>}
        </div>
    );
}

/**
 * Shared by Listings/Create and Listings/Edit. `data`/`setData`/`errors` come
 * straight from Inertia's useForm so both pages stay in sync with the server.
 */
export default function ListingForm({ data, setData, errors, categories, types, processing, onSubmit, submitLabel }) {
    const { t, pick } = useI18n();

    return (
        <form className="lf" onSubmit={onSubmit} encType="multipart/form-data">
            <Row label={t('lf.type')} error={errors.type} wide>
                <div className="lf-types">
                    {types.map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={`lf-type ${data.type === type ? 'on' : ''}`}
                            onClick={() => setData('type', type)}
                        >
                            {t(TYPE_KEYS[type])}
                        </button>
                    ))}
                </div>
            </Row>

            <Row label={t('lf.title')} error={errors.title} wide>
                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} required maxLength={180} />
            </Row>

            <Row label={t('lf.description')} error={errors.description} wide>
                <textarea rows={6} value={data.description} onChange={(e) => setData('description', e.target.value)} required />
            </Row>

            <Row label={t('lf.category')} error={errors.category_id}>
                <select value={data.category_id ?? ''} onChange={(e) => setData('category_id', e.target.value || null)}>
                    <option value="">—</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{pick(c, 'name')}</option>)}
                </select>
            </Row>

            <Row label={t('lf.price')} error={errors.price}>
                <input type="number" min="0" step="0.01" value={data.price ?? ''}
                    onChange={(e) => setData('price', e.target.value)} placeholder={t('lf.price_ph')} />
            </Row>

            <Row label={t('lf.price_note')} error={errors.price_note}>
                <input type="text" value={data.price_note ?? ''} onChange={(e) => setData('price_note', e.target.value)}
                    placeholder={t('lf.price_note_ph')} />
            </Row>

            <Row label={t('lf.location')} error={errors.location}>
                <input type="text" value={data.location ?? ''} onChange={(e) => setData('location', e.target.value)} />
            </Row>

            <Row label={t('lf.phone')} error={errors.contact_phone}>
                <input type="text" value={data.contact_phone ?? ''} onChange={(e) => setData('contact_phone', e.target.value)} />
            </Row>

            <Row label={t('lf.email')} error={errors.contact_email}>
                <input type="email" value={data.contact_email ?? ''} onChange={(e) => setData('contact_email', e.target.value)} />
            </Row>

            <Row label={t('lf.cover')} error={errors.image} wide>
                <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files[0] ?? null)} />
            </Row>

            <Row label={t('lf.gallery')} error={errors.images} wide>
                <input type="file" accept="image/*" multiple
                    onChange={(e) => setData('images', Array.from(e.target.files))} />
            </Row>

            <div className="lf-actions">
                <p className="lf-note">{t('lf.review_note')}</p>
                <button className="btn" disabled={processing}>{processing ? t('lf.sending') : submitLabel}</button>
            </div>
        </form>
    );
}
