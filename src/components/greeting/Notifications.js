import React from 'react';
import { Alert, Stack } from '@mui/material';
import { useFetchContentfulNotifications } from '../../hooks/useFetchContentfulNotifications';
import { DEFAULT_LANGUAGE, EN_LANGUAGE, getHairiotiedoteTranslation, sortByOrderNumber } from '../../utils.js'
import { getLang } from '../../utils';
import Markdown from 'markdown-to-jsx';

export const Notifications = () => {
  const notifications = useFetchContentfulNotifications();
  const lang = getLang();

  const sortedNotifications = sortByOrderNumber(notifications);

  return (
    <Stack>
      {sortedNotifications?.length > 0 && (
        sortedNotifications.map((notification, i) => {
          const hairiotiedoteTranslation = getHairiotiedoteTranslation(notification, lang);
          // alertType-kenttä ei ole lokalisoitu contentfulissa, mutta contentfulista se palautuu muodossa
          // { alertType: { <YMPÄRISTÖN DEFAULT KIELI>: <ARVO>}}, joten fi/sv-ympäristöstä alertType sijaitsee
          // 'fi'-avaimen arvona ja en-ympäristössä 'en'-avaimen arvona
          const alertTypeFi = notification.alertType?.[DEFAULT_LANGUAGE]
          const alertTypeEn = notification.alertType?.[EN_LANGUAGE]
          let severity = '';

          if (alertTypeFi !== undefined) {
            severity = alertTypeFi;
          } else if (alertTypeEn !== undefined) {
            severity = alertTypeEn;
          } else {
            severity = 'error';
          }

          {
            if (hairiotiedoteTranslation) {
              return (
                <Alert key={i} severity={severity} >
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
