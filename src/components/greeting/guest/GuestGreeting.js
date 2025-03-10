import React from 'react';
import { useTranslation } from 'react-i18next';
import { login } from '../../../utils.js'
import * as styles from '../Greeting.css';

const handleLoginClick = e => {
  e.preventDefault()
  login()
}

const GuestGreeting = ({ showNotification }) => {
  const { t } = useTranslation("home");
  return (
    <div className={styles['greeting-container-space-below']}>
      {showNotification && (
        <p className={styles.notification}><div dangerouslySetInnerHTML={{__html: t('notification')}} /></p>
      )}
      <h1 className={styles['guest-header']}>{t('login.header')}</h1>
      <p className={styles['guest-greeting']}>{t('login.info')}</p>
    </div>
  );
}

export default GuestGreeting;
