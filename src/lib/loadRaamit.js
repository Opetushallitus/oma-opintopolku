const scripts = [
  { id: 'apply-raamit', path: '/oppija-raamit/js/apply-raamit.js' },
  { id: 'apply-modal', path: '/oppija-raamit/js/apply-modal.js' },
];

const RAAMIT_HOST_MAP = {
  // prod
  'opintopolku.fi': 'https://opintopolku.fi',   // FI
  'studieinfo.fi': 'https://studieinfo.fi',     // SV
  'studyinfo.fi': 'https://studyinfo.fi',       // EN

  // test
  'testiopintopolku.fi': 'https://testiopintopolku.fi',
  'testistudieinfo.fi': 'https://testiopintopolku.fi',
  'testistudyinfo.fi': 'https://testiopintopolku.fi',

  // local
  'localhost': '',
  '127.0.0.1': '',
};

function injectScript({ id, url }) {
  if (document.getElementById(id)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.defer = true;
    el.id = id;
    el.src = url;
    el.onload = resolve;
    el.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(el);
  });
}

function pickRaamitHost(hostname) {
  if (!hostname) return '';
  const entry = Object.entries(RAAMIT_HOST_MAP).find(([domain]) =>
    hostname === domain || hostname.endsWith(`.${domain}`));
  return entry ? entry[1] : `https://${hostname}`;
}

export async function loadRaamit() {
  const base = pickRaamitHost(window.location.hostname);
  await Promise.all(scripts.map(script =>
    injectScript({ id: script.id, url: `${base}${script.path}` })));
}
