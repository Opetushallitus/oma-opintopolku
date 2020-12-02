import Cookies from 'js-cookie';

const domains = {
  FI: 'opintopolku.fi',
  SV: 'studieinfo.fi',
  EN: 'studyinfo.fi'
};

export function getUser() {
  return new Promise((resolve, reject) => {
    const lang = getLang().toUpperCase();
    const domain = createDomain(lang);
    const sessionUrl = domain + '/oma-opintopolku/session'
      fetch(sessionUrl, {
      headers: new Headers({'Caller-Id': '1.2.246.562.10.00000000001.oma-opintopolku.frontend'}),
      credentials: 'include'
    })
      .then((response) => {
        if (response.status === 200) {
            response.json().then((user) => {
            window.home.setUser(user);
            console.log(user);
            resolve(user);
          })
        } else {
          window.home.setLoggedIn(false);
          reject(new Error('No session found!'));
        }
      }).catch(err => {
      console.error(err);
      reject(new Error('Failed to fetch session!'));
    });
  });
}

export function login() {
  const lang = getLang().toUpperCase();
  window.location.replace(createLoginUrl(lang));
}

export function logout() {
  const lang = getLang().toUpperCase();
  window.location.replace(createLogoutUrl(lang));
}

export function getLang() {
  let lang = Cookies.get('lang');
  if (lang) {
    return lang;
  }

  return getLanguageFromHost();
}

function createLoginUrl(lang) {
  const domain = createDomain(lang);
  return domain + '/oma-opintopolku/authenticate';
}

function createLogoutUrl(lang) {
  //create opintopolku logout-domain because CAS logins to opintopolku.
  const domain = createDomain('FI');
  const logoutdomain = createDomain(lang);
  return domain + '/cas-oppija/logout?service=' + encodeURI(logoutdomain + '/oma-opintopolku');
}

function createDomain(lang) {
  const origin = document.location.origin;
  if (origin.includes('https://')) {
    const domainPrefix = origin.replace(/opintopolku.fi|studyinfo.fi|studieinfo.fi/g, '');
    const domainSuffix = domains[lang];
    return domainPrefix + domainSuffix;
  } else {
    return 'localhost:8080';
  }
}

function getLanguageFromHost(host) {
  if (!host) {
    host = document.location.host;
  }

  let parts = host.split('.');
  if (parts.length < 2) {
    return 'fi';
  }

  let domain = parts[parts.length - 2];
  if (domain.indexOf('opintopolku') > -1) {
    return 'fi';
  } else if (domain.indexOf('studieinfo') > -1) {
    return 'sv';
  } else if (domain.indexOf('studyinfo') > -1) {
    return 'en'
  }
  return 'fi'
}
