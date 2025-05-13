import React, { useState } from 'react';
import { Alert, Stack } from '@mui/material';
import { useFetchContentfulNotifications } from '../../hooks/useFetchContentfulNotifications';
import {
  DEFAULT_LANGUAGE,
  EN_LANGUAGE,
  getHairiotiedoteTranslation,
  getLang,
  sortByOrderNumber
} from '../../utils.js'
import Markdown from 'markdown-to-jsx';

export const Notifications = () => {
  const [closedNotificationsIds, setClosedNotificationsIds] = useState([]);
  const notifications = useFetchContentfulNotifications();
  const userLang = getLang();
  const envDefaultLanguage = userLang === EN_LANGUAGE ? EN_LANGUAGE : DEFAULT_LANGUAGE;

  const openNotifications = notifications.filter(notification => !closedNotificationsIds.includes(notification.id))
  const sortedOpenNotifications = sortByOrderNumber(openNotifications, envDefaultLanguage);

  return (
    <Stack>
      {sortedOpenNotifications?.length > 0 && (
        sortedOpenNotifications.map(({ id, data }, i) => {
          const hairiotiedoteTranslation = getHairiotiedoteTranslation(data, userLang);
          // alertType-kenttä ei ole lokalisoitu contentfulissa, mutta contentfulista se palautuu muodossa
          // { alertType: { <YMPÄRISTÖN DEFAULT KIELI>: <ARVO>}}, joten fi/sv-ympäristöstä alertType sijaitsee
          // 'fi'-avaimen arvona ja en-ympäristössä 'en'-avaimen arvona
          const alertType = data.alertType?.[envDefaultLanguage]

          {
            if (hairiotiedoteTranslation) {
              return (
                <Alert
                  key={i}
                  severity={alertType ?? 'error'}
                  onClose={() => setClosedNotificationsIds([...closedNotificationsIds, id])}>
                  <Markdown>{hairiotiedoteTranslation}</Markdown>
                </Alert>
              )
            } else {
              null
            }
          }
        })
      )}
    </Stack>
  );
};
