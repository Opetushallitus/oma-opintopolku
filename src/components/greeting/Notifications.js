import React from 'react';
import { Alert, Stack } from '@mui/material';
import { useFetchContentfulNotifications } from '../../hooks/useFetchContentfulNotifications';
import { getHairiotiedoteTranslation, sortByOrderNumber } from '../../utils.js'
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
          return (
            <Alert key={i}
              severity={`${notification.alertType?.[lang] ?? 'error'}`}
            >
              <Markdown>{getHairiotiedoteTranslation(notification, lang)}</Markdown>
            </Alert>
          )
        })
      )}
    </Stack>
  );
};
