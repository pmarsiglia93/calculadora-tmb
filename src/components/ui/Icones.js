/**
 * Ícones em SVG inline — sem biblioteca externa, herdam a cor do texto.
 */
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const IconeChama = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2c2.5 4 1 6-1 7.5C9 11 8 12.5 8 14.5A4 4 0 0 0 12 19a4 4 0 0 0 4-4.5c0-1.5-.6-2.6-1.3-3.4" />
    <path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-3-7" />
    <path d="M12 22a7 7 0 0 1-7-7c0-2 .8-3.4 1.8-4.6" />
  </svg>
);

export const IconePrato = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 3v4.5M21 12h-4.5M12 21v-4.5M3 12h4.5" />
  </svg>
);

export const IconeBalanca = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8 8h8" />
    <path d="M12 11v6" />
    <path d="M9.5 13.5 12 11l2.5 2.5" />
  </svg>
);

export const IconeFita = (p) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="7" width="19" height="10" rx="3" />
    <path d="M7 7v3M10 7v2M13 7v3M16 7v2" />
  </svg>
);

export const IconeAlvo = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

export const IconeGota = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3Z" />
  </svg>
);

export const IconeHaltere = (p) => (
  <svg {...base} {...p}>
    <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />
  </svg>
);

export const IconeCoracao = (p) => (
  <svg {...base} {...p}>
    <path d="M20.5 8.5c0 4.5-8.5 10-8.5 10S3.5 13 3.5 8.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2Z" />
    <path d="M3 12.5h4l1.5-2.5 2 5 2-4 1.5 1.5H21" />
  </svg>
);

export const IconeTenis = (p) => (
  <svg {...base} {...p}>
    <path d="M2 17v-4l4-3 2.5 2L12 9l9 4.5c1 .5 1 1.5 1 2.5v1H2Z" />
    <path d="M2 17h20" />
    <path d="M9 11.5 11 14M12.5 10.5l2 2.5" />
  </svg>
);

export const IconeUsuario = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const IconeSol = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const IconeLua = (p) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
);

export const IconeSeta = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
