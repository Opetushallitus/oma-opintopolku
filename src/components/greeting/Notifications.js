import React, {useEffect, useState} from 'react';
import { Alert, Stack } from '@mui/material';
import { useFetchContentfulNotifications } from '../../hooks/useFetchContentfulNotifications';
import Markdown from 'markdown-to-jsx';

export const Notifications = () => {
  const [closedNotificationsIds, setClosedNotificationsIds] = useState([]);

  const notifications = useFetchContentfulNotifications();

  return (<>
    {notifications && notifications.length > 0 && (<Stack>
      {notifications.filter(n => !closedNotificationsIds.includes(n.id)).map(notification =>
        (<Alert
          key={notification.id}
          severity={notification.alertType ?? 'error'}
          onClose={() => setClosedNotificationsIds([...closedNotificationsIds, notification.id])}>
          <Markdown>{notification.hairionKuvaus}</Markdown>
        </Alert>)
      )}
    </Stack>)}
  </>);
};
