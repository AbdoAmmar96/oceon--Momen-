import { useCallback, useEffect, useState } from 'react';

/**
 * A lightweight RFQ ("Request for Quote") cart kept entirely in the browser via
 * localStorage. The customer collects products across the site, then sends the
 * whole list as one request from the /rfq page. Each entry is {id, qty, note}.
 */
const KEY = 'odt_rfq';
const EVT = 'odt-rfq-change';

function read() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(raw) ? raw.filter((r) => r && r.id != null) : [];
    } catch {
        return [];
    }
}

function write(list) {
    try {
        localStorage.setItem(KEY, JSON.stringify(list));
    } catch { /* private mode / quota */ }
    // Notify every hook instance in this tab (storage events only fire cross-tab).
    window.dispatchEvent(new CustomEvent(EVT));
}

export function useRfq() {
    const [items, setItems] = useState(read);

    useEffect(() => {
        const sync = () => setItems(read());
        window.addEventListener(EVT, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(EVT, sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    const add = useCallback((id, qty = '') => {
        const list = read();
        if (!list.some((r) => r.id === id)) {
            list.push({ id, qty: String(qty || ''), note: '' });
            write(list);
        }
    }, []);

    const remove = useCallback((id) => {
        write(read().filter((r) => r.id !== id));
    }, []);

    const update = useCallback((id, patch) => {
        write(read().map((r) => (r.id === id ? { ...r, ...patch } : r)));
    }, []);

    const clear = useCallback(() => write([]), []);

    const has = useCallback((id) => items.some((r) => r.id === id), [items]);

    return { items, count: items.length, add, remove, update, clear, has };
}
