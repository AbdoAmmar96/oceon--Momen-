import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { I18N } from '../i18n';

const Ctx = createContext(null);

export function I18nProvider({ children }) {
    const [lang, setLang] = useState(() => {
        if (typeof window === 'undefined') return 'en';
        const q = new URLSearchParams(window.location.search).get('lang');
        if (q && I18N[q]) return q;
        try {
            const s = localStorage.getItem('odt_lang');
            if (s && I18N[s]) return s;
        } catch { /* private mode */ }
        return 'en';
    });

    useEffect(() => {
        const el = document.documentElement;
        el.lang = lang;
        el.dir = lang === 'ar' ? 'rtl' : 'ltr';
        try { localStorage.setItem('odt_lang', lang); } catch { /* noop */ }
    }, [lang]);

    const t = useCallback((k) => I18N[lang]?.[k] ?? I18N.en[k] ?? k, [lang]);
    const pick = useCallback((row, field) => row?.[`${field}_${lang}`] ?? row?.[`${field}_en`] ?? '', [lang]);

    return (
        <Ctx.Provider value={{ lang, setLang, t, pick, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {children}
        </Ctx.Provider>
    );
}

export const useI18n = () => useContext(Ctx);
