import React from 'react';
import { useFetchContentfulNotifications } from '../../hooks/useFetchContentfulNotifications';
import { getHairiotiedoteTranslations } from '../../utils.js'
import * as styles from './Greeting.css';
import { getLang } from '../../utils';

export const Notifications = () => {
  const notifications = useFetchContentfulNotifications();
  const lang = getLang();

  const notificationsTranslations = getHairiotiedoteTranslations(notifications, lang);
  return (
    <div>
      {notifications?.length > 0 && (
        notificationsTranslations.map((notification, i) => {
          return (
            <div key={i} className={styles.notification}>
              <p>{notification}</p>
            </div>)
        })
      )}
    </div>
  );
};
