import React from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from '../Greeting.css';
import { Notifications } from '../Notifications';

const GuestGreeting = () => {
  const { t } = useTranslation("home");
  return (
    <div className={styles['greeting-container-space-below']}>
      <Notifications />
      <h1 className={styles['guest-header']}>{t('login.header')}</h1>
      <p className={styles['guest-greeting']}>{t('login.info')}</p>
    </div>
  );
}

export default GuestGreeting;
