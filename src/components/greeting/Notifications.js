import React from 'react';
import { Alert, Stack } from '@mui/material';
import { useFetchContentfulNotifications } from '../../hooks/useFetchContentfulNotifications';
import { DEFAULT_LANGUAGE, EN_LANGUAGE, getHairiotiedoteTranslation, sortByOrderNumber } from '../../utils.js'
import { getLang } from '../../utils';
import Markdown from 'markdown-to-jsx';

export const Notifications = () => {
  const notifications = useFetchContentfulNotifications();
  const userLang = getLang();
  const envDefaultLanguage = userLang === EN_LANGUAGE ? EN_LANGUAGE : DEFAULT_LANGUAGE;

  const sortedNotifications = sortByOrderNumber(notifications, envDefaultLanguage);

  return (
    <Stack>
      {sortedNotifications?.length > 0 && (
        sortedNotifications.map((notification, i) => {
          const hairiotiedoteTranslation = getHairiotiedoteTranslation(notification, userLang);
          // alertType-kenttä ei ole lokalisoitu contentfulissa, mutta contentfulista se palautuu muodossa
          // { alertType: { <YMPÄRISTÖN DEFAULT KIELI>: <ARVO>}}, joten fi/sv-ympäristöstä alertType sijaitsee
          // 'fi'-avaimen arvona ja en-ympäristössä 'en'-avaimen arvona
          const alertType = notification.alertType?.[envDefaultLanguage]

          {
            if (hairiotiedoteTranslation) {
              return (
                <Alert key={i} severity={alertType ?? 'error'} >
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
