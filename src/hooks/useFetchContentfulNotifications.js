import { useEffect, useState } from 'react';
import { getLang, sortByOrderNumber } from '../utils';
import { urls } from 'oph-urls-js';

const SERVICE = 'Oma Opintopolku';

async function getNotificationLocation(lang) {
  const manifest = await fetch(
    urls.url('oma-opintopolku.content', 'manifest.json'),
  );
  const data = await manifest.json();
  return data.hairiotiedote[lang.toLowerCase()];
}

export function useFetchContentfulNotifications() {
  const userLang = getLang();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchHairiotiedotteet() {
      try {
        const notificationLocation = await getNotificationLocation(userLang);

        const response = await fetch(
          urls.url('oma-opintopolku.content', notificationLocation),
        );

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const notifications = await response.json();

        setNotifications(
          sortByOrderNumber(
            notifications.filter((n) => n.whereShown.includes(SERVICE)),
          ),
        );
      } catch (error) {
        console.error(error.message);
        setNotifications([]);
      }
    }
    fetchHairiotiedotteet();
  }, [userLang]);

  return notifications;
}
