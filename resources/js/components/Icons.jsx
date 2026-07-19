/* Ocean Drilling & Trading — inline icon library */

export function BrandIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 100 110" className={className} style={style} aria-hidden="true">
            <defs>
                <linearGradient id="odt-silv" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e2e6ea" /><stop offset=".55" stopColor="#c3c9cf" /><stop offset="1" stopColor="#9aa2ab" />
                </linearGradient>
                <linearGradient id="odt-dark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#565d66" /><stop offset="1" stopColor="#3f454d" />
                </linearGradient>
                <linearGradient id="odt-blu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#2fbdec" /><stop offset=".5" stopColor="#149fd4" /><stop offset="1" stopColor="#0c74ad" />
                </linearGradient>
            </defs>
            <polygon points="50,2 93,28 93,82 50,108 7,82 7,28" fill="url(#odt-dark)" />
            <polygon points="50,2 93,28 93,82 50,108" fill="url(#odt-silv)" />
            <circle cx="47" cy="55" r="35" fill="url(#odt-blu)" />
            <circle cx="47" cy="55" r="35" fill="none" stroke="#0a6ea6" strokeWidth="1.4" opacity=".55" />
            <g fill="#fff">
                <path d="M23 36 Q47 26 71 36 L71 42 Q47 52 23 42 Z" />
                <path d="M28 50 Q47 41 66 50 L66 56 Q47 65 28 56 Z" />
                <path d="M33 63 Q47 55 61 63 L61 68.5 Q47 76.5 33 68.5 Z" />
                <path d="M38.5 75 Q47 69 55.5 75 L55.5 79.5 Q47 85.5 38.5 79.5 Z" />
                <path d="M43.5 85 L50.5 85 L47 93 Z" />
            </g>
        </svg>
    );
}

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Svg = ({ children, className }) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...S}>{children}</svg>
);

/* ---------- UI ---------- */
export const IcArrow = (p) => <Svg {...p}><path d="M4 12h15M13 6l6 6-6 6" /></Svg>;
export const IcCheck = (p) => <Svg {...p}><circle cx="12" cy="12" r="9.2" opacity=".35" /><path d="M8 12.2l2.8 2.8L16.4 9" /></Svg>;
export const IcChevron = (p) => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>;
export const IcGlobe = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z" /></Svg>;
export const IcUp = (p) => <Svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Svg>;
export const IcQuote = (p) => <Svg {...p}><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeWidth="2.6" /></Svg>;
export const IcSearch = (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Svg>;
export const IcTruck = (p) => <Svg {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></Svg>;
export const IcDownload = (p) => <Svg {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></Svg>;
export const IcWhats = (p) => <Svg {...p}><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" /><path d="M8.5 8.5c.3 3 2.8 5.6 5.8 6 .8.1 1.5-.4 1.6-1.1l.1-.6-2-.9-1 1a5.6 5.6 0 0 1-2.6-2.6l1-1-.9-2-.6.1c-.7.1-1.2.8-1.1 1.6z" strokeWidth="1.4" /></Svg>;
export const IcZoom = (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" /></Svg>;
export const IcPlus = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const IcClipboard = (p) => <Svg {...p}><rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4.5V6H9zM9 11h6M9 14.5h6M9 17.5h4" /></Svg>;
export const IcTrash = (p) => <Svg {...p}><path d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7M10 11v6M14 11v6" /></Svg>;
export const IcClose = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const IcUser = (p) => <Svg {...p}><circle cx="12" cy="8" r="3.6" /><path d="M5 20a7 7 0 0 1 14 0" /></Svg>;

/* ---------- contact ---------- */
export const IcPin = (p) => <Svg {...p}><path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></Svg>;
export const IcPhone = (p) => <Svg {...p}><path d="M5 4h4l1.7 4.2-2.2 1.6a13 13 0 0 0 5.7 5.7l1.6-2.2L20 15v4a2 2 0 0 1-2.2 2A16.9 16.9 0 0 1 3 6.2 2 2 0 0 1 5 4z" /></Svg>;
export const IcMail = (p) => <Svg {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M4 7.5l8 5.6 8-5.6" /></Svg>;
export const IcShare = (p) => <Svg {...p}><circle cx="6" cy="12" r="2.6" /><circle cx="17.5" cy="6" r="2.6" /><circle cx="17.5" cy="18" r="2.6" /><path d="M8.4 10.8l6.8-3.6M8.4 13.2l6.8 3.6" /></Svg>;

/* ---------- socials ---------- */
export const IcFb = (p) => <Svg {...p}><path d="M14.5 8.5H17V5h-2.5A4.5 4.5 0 0 0 10 9.5V12H7.5v3.5H10V21h3.5v-5.5H16l.7-3.5h-3.2V9.6c0-.7.4-1.1 1-1.1z" /></Svg>;
export const IcX = (p) => <Svg {...p}><path d="M4 4l16 16M20 4L4 20" /></Svg>;
export const IcIg = (p) => <Svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" strokeWidth="2.8" /></Svg>;
export const IcLi = (p) => <Svg {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V17M8 7.6h.01M12 17v-3.6a2.2 2.2 0 0 1 4.4 0V17" strokeWidth="2.1" /></Svg>;
export const IcYt = (p) => <Svg {...p}><rect x="2.8" y="5.5" width="18.4" height="13" rx="4" /><path d="M10.2 9.4l4.8 2.6-4.8 2.6z" /></Svg>;

/* ---------- services / values ---------- */
export const IcDrillSvc = (p) => <Svg {...p}><path d="M9 3h6v3H9zM10 6v4h4V6M8 10h8l-1.4 5h-5.2L8 10zM10.6 15L12 21l1.4-6" /></Svg>;
export const IcTradeSvc = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z" /><path d="M15.5 8.5l3-1-1 3" /></Svg>;
export const IcTarget = (p) => <Svg {...p}><circle cx="12" cy="12" r="8.6" /><circle cx="12" cy="12" r="4.6" /><circle cx="12" cy="12" r="1" strokeWidth="2.4" /></Svg>;
export const IcShield = (p) => <Svg {...p}><path d="M12 3l7.5 2.8v5.4c0 4.6-3.1 8-7.5 9.8-4.4-1.8-7.5-5.2-7.5-9.8V5.8L12 3z" /><path d="M8.8 12l2.3 2.3 4.1-4.4" /></Svg>;
export const IcUsers = (p) => <Svg {...p}><circle cx="9" cy="9" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="10" r="2.4" /><path d="M15.8 14.6a4.6 4.6 0 0 1 4.7 4.4" /></Svg>;
export const IcHands = (p) => <Svg {...p}><path d="M12 20.5s-7.5-4.6-7.5-9.9A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6c0 5.3-7.5 9.9-7.5 9.9z" /></Svg>;
export const IcBadge = (p) => <Svg {...p}><circle cx="12" cy="9.5" r="5.5" /><path d="M9.5 8.9l1.7 1.8 3.3-3.4M8.5 14l-1.5 6 5-2.6L17 20l-1.5-6" /></Svg>;
export const IcGlobeHeart = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16.6s-3.6-2.2-3.6-4.7A2 2 0 0 1 12 10a2 2 0 0 1 3.6 1.9c0 2.5-3.6 4.7-3.6 4.7z" /></Svg>;

/* ---------- category icons, keyed by legacy cid ---------- */
const cats = {
    20: (p) => <Svg {...p}><path d="M9 21L11 6h2l2 15M7 21h10M8.5 12h7M12 6V3M9.5 3h5" /></Svg>,
    18: (p) => <Svg {...p}><path d="M8 3h8M10 3v4h4V3M8 7h8l-1.2 6H9.2L8 7zM10.5 13L12 21l1.5-8" /></Svg>,
    17: (p) => <Svg {...p}><circle cx="12" cy="12" r="8.6" /><path d="M12 12V6.5M12 12l4 2.6M12 12l-4.5 1.5" /><circle cx="12" cy="12" r="1.4" strokeWidth="2.4" /></Svg>,
    16: (p) => <Svg {...p}><path d="M12 3.5S6.5 9.6 6.5 13.6a5.5 5.5 0 0 0 11 0C17.5 9.6 12 3.5 12 3.5z" /><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" /></Svg>,
    15: (p) => <Svg {...p}><rect x="4" y="8" width="13" height="10" rx="2" /><path d="M17 11h3v4h-3M8 8V5.5M13 8V5.5M6 5.5h9M8 18v2.2M13 18v2.2" /></Svg>,
    14: (p) => <Svg {...p}><path d="M4.5 8.5L10 3l3 3-5.5 5.5zM10.8 8.2l7 7-2.6 2.6-7-7M15 19l3.5-3.5" /></Svg>,
    13: (p) => <Svg {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.3 6.3L5.2 5.2M18.8 18.8l-1.1-1.1M6.3 17.7l-1.1 1.1M18.8 5.2l-1.1 1.1" /></Svg>,
    12: (p) => <Svg {...p}><path d="M14.5 6.5a4 4 0 0 0-5.6 5L4 16.4V20h3.6l4.9-4.9a4 4 0 0 0 5-5.6l-2.8 2.8-2-2 2.8-2.8z" /></Svg>,
    11: (p) => <Svg {...p}><path d="M3 18h13M4.5 18v-4l6-1V9h3l4 4v5" /><circle cx="7" cy="20" r="1.6" /><circle cx="16" cy="20" r="1.6" /><path d="M13.5 9V5.5H9" /></Svg>,
    10: (p) => <Svg {...p}><path d="M3 16V7h10v9M13 10h4l3 3.5V16h-2" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="16" cy="17.5" r="1.8" /><path d="M9 17.5h5" /></Svg>,
    9: (p) => <Svg {...p}><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z" /><path d="M12 4.5V3M12 21v-1.5M6.7 6.7L5.6 5.6M18.4 18.4l-1.1-1.1M4.5 12H3M21 12h-1.5M6.7 17.3l-1.1 1.1M18.4 5.6l-1.1 1.1" /></Svg>,
    8: (p) => <Svg {...p}><path d="M12 21c0-6 0-9 6.5-13.5C19 12 17 17 12 18.5M12 21c0-4.5-1-7-6-9.5C6 15.5 8 18.5 12 19.5" /></Svg>,
    7: (p) => <Svg {...p}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></Svg>,
};

export function CatIcon({ cid, className }) {
    const C = cats[cid] || cats[7];
    return <C className={className} />;
}

/* ---------- careers department icons (req #8), keyed by canonical name ---------- */
const depts = {
    Finance: (p) => <Svg {...p}><path d="M4 20h16M6 20v-6M10 20V8M14 20v-9M18 20V5" /><path d="M5 9l4-4 3 3 6-6" /></Svg>,
    Operation: (p) => <Svg {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 4V2.5M12 21.5V20M4 12H2.5M21.5 12H20M6.3 6.3L5.2 5.2M18.8 18.8l-1.1-1.1M6.3 17.7l-1.1 1.1M18.8 5.2l-1.1 1.1" /></Svg>,
    'Human Resource': (p) => <Svg {...p}><circle cx="9" cy="9" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="10" r="2.4" /><path d="M15.8 14.6a4.6 4.6 0 0 1 4.7 4.4" /></Svg>,
    Logistic: (p) => <Svg {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></Svg>,
    Sales: (p) => <Svg {...p}><path d="M4 4.5h7l8.5 8.5-6.5 6.5L4 11.5z" /><circle cx="8" cy="8.5" r="1.4" strokeWidth="2.2" /></Svg>,
    Information: (p) => <Svg {...p}><rect x="3" y="4.5" width="18" height="12" rx="2" /><path d="M8 20h8M12 16.5V20" /><path d="M12 9.2v3.6M12 7h.01" strokeWidth="2.3" /></Svg>,
};

export function DeptIcon({ name, className }) {
    const D = depts[name] || depts.Operation;
    return <D className={className} />;
}
