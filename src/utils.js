import Cookies from 'js-cookie';

const domains = {
  FI: 'opintopolku.fi',
  SV: 'studieinfo.fi',
  EN: 'studyinfo.fi'
};

function fetchUser() {
  const domain = `${window.location.protocol}//${window.location.hostname}`;
  const sessionUrl = domain + '/oma-opintopolku/session'
  return fetch(sessionUrl, {
    headers: new Headers({ 'Caller-Id': '1.2.246.562.10.00000000001.oma-opintopolku.frontend' }),
    credentials: 'include'
  })
}

export function getUser() {
  return new Promise((resolve, reject) => {
    fetchUser()
      .then((response) => {
        if (response.status === 200) {
          response.json().then((user) => {
            window.home.setUser(user);
            console.log(user);
            resolve(user);
          }).catch(err => {
            console.log('Failed to fetch user, retrying...');
            fetchUser()
              .then((response) => {
                if (response.status === 200) {
                  response.json().then((user) => {
                    window.home.setUser(user);
                    console.log(user);
                    resolve(user);
                  }).catch(err => {
                    console.error(err);
                    reject(new Error('No session found!'));
                  })
                } else {
                  window.home.setLoggedIn(false);
                  reject(new Error('No session found!'));
                }
              }).catch(err => {
                console.error(err);
                reject(new Error('Failed to fetch session!'));
              });
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
  return domain + '/cas-oppija/logout?service=' + encodeURIComponent(logoutdomain + '/oma-opintopolku');
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

export const DEFAULT_LANGUAGE = 'fi';
export function getHairiotiedoteTranslation(notification = [], lang) {
  const userLang = lang ?? DEFAULT_LANGUAGE;

  //TODO: Jos käyttäjän kielellä ei löydy kuvausta, käytetään suomenkielistä
  return notification?.hairionKuvaus?.[userLang]
}

export function getOrderNumber(notification, numberOfNotifications) {
  // order-kenttä ei ole lokalisoitu contentfulissa, mutta contentfulista se palautuu muodossa
  // { order: { fi: <ARVO>}}, jossa fi = default kieli contentfulissa
  const orderNumber = notification.order?.[DEFAULT_LANGUAGE];

  if (orderNumber !== undefined) {
    return orderNumber;
  } else {
    return numberOfNotifications
  }
};


export function sortByOrderNumber(notifications) {
  const numberOfNotifications = notifications.length;
  const compare = (a, b) => {
    const orderNumberA = getOrderNumber(a, numberOfNotifications)
    const orderNumberB = getOrderNumber(b, numberOfNotifications)

    if (orderNumberA < orderNumberB) {
      return -1;
    } else if (orderNumberA > orderNumberB) {
      return 1;
    } else {
      return 0;
    }

  };

  return notifications.sort(compare)
}
