// Site-wide constants for Qpdf.ca. Used at build time (vite.config.ts,
// scripts/qpdf/*.mjs) and safe to import from browser code.

const env = typeof process !== 'undefined' && process.env ? process.env : {};

export const SITE = {
  name: 'Qpdf.ca',
  url: (env.SITE_URL || 'https://qpdf.ca').replace(/\/+$/, ''),
  locale: 'en_CA',
  lang: 'en-CA',
  tagline: 'Private PDF tools. Simple by design.',
  description:
    'Free, private PDF tools that run in your browser. Compress, merge, split, convert, sign and edit PDFs without uploading your documents.',
  // Public source code for AGPL-3.0 section 13. Override with SOURCE_URL.
  sourceUrl: env.SOURCE_URL || 'https://github.com/hjavaran/Qpdf.ca',
  developer: { name: 'wealththeory.ca', url: 'https://wealththeory.ca/' },
  madeIn: 'Vancouver, BC',
  upstream: {
    name: 'BentoPDF',
    url: 'https://github.com/alam00000/bentopdf',
    version: '2.8.11',
    commit: '1a55d8d44b61f35e1274607582207e4cfabd2bd8',
  },
  themeColor: '#b4232f',
};

// Static, non-tool pages. `path` is the public URL.
export const PAGES = {
  index: {
    path: '/',
    title: 'Qpdf.ca — PDF Tools Built for Privacy',
    description:
      'Compress, merge, split, convert, sign and edit PDFs directly in your browser. Your documents stay on your device. Free, no sign-up.',
  },
  tools: {
    path: '/tools/',
    title: 'All PDF Tools — Qpdf.ca',
    description:
      'Every Qpdf.ca tool in one place: compress, merge, split, organize, edit, convert, sign and secure PDFs locally in your browser.',
    crumb: 'All tools',
  },
  privacy: {
    path: '/privacy/',
    title: 'Your PDFs Stay Private — How Qpdf.ca Works',
    description:
      'How Qpdf.ca processes PDFs inside your browser with JavaScript and WebAssembly, what is and is not sent over the network, and how to verify it yourself offline.',
    crumb: 'Privacy & security',
  },
  'privacy-policy': {
    path: '/privacy-policy/',
    title: 'Privacy Policy — Qpdf.ca',
    description:
      'The Qpdf.ca privacy policy: what information is and is not collected when you use qpdf.ca, and how browser storage is used.',
    crumb: 'Privacy policy',
  },
  about: {
    path: '/about/',
    title: 'About Qpdf.ca — Private PDF Tools from Vancouver',
    description:
      'Why Qpdf.ca exists: a free, privacy-first PDF toolkit that processes documents on your own device. Built in Vancouver, BC on open-source software.',
    crumb: 'About',
  },
  terms: {
    path: '/terms/',
    title: 'Terms of Use — Qpdf.ca',
    description:
      'Terms of use for qpdf.ca, a free browser-based PDF toolkit provided as-is under open-source licences.',
    crumb: 'Terms of use',
  },
  'site-index': {
    path: '/site-index/',
    title: 'Site Index — Qpdf.ca',
    description:
      'A complete, human-readable index of every page on Qpdf.ca: PDF tools by category, guides and information pages.',
    crumb: 'Site index',
  },
  contact: {
    path: '/contact/',
    title: 'Contact Qpdf.ca — Questions, Feedback and Support',
    description:
      'Send a message to the Qpdf.ca developer: questions, feedback or bug reports. Contact messages are sent securely for delivery; your PDFs never are.',
    crumb: 'Contact',
  },
  licenses: {
    path: '/licenses/',
    title: 'Open-Source Licences and Credits — Qpdf.ca',
    description:
      'Qpdf.ca is free software under the GNU AGPL-3.0, built on BentoPDF and other open-source projects. Licences, credits and source code.',
    crumb: 'Open-source licences',
  },
  guides: {
    path: '/guides/',
    title: 'PDF Guides — Qpdf.ca',
    description:
      'Practical, plain-English guides to working with PDFs privately: compressing, merging, signing, redacting and more.',
    crumb: 'Guides',
  },
  404: {
    path: '/404',
    title: 'Page Not Found — Qpdf.ca',
    description: 'The page you were looking for could not be found.',
    noindex: true,
  },
};

export const NAV = [
  { label: 'Tools', href: '/tools/' },
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Guides', href: '/guides/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
