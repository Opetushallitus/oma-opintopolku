import React from 'react';
import { I18n } from 'react-i18next';
import { login } from '../../../utils.js'
import styles from '../Greeting.css';

const handleLoginClick = e => {
  e.preventDefault()
  login()
}

const GuestGreeting = () => (
  <I18n ns="home">
    {t => (
      <div className={styles['greeting-container-space-below']}>
        <p className={styles.notification}>{t('notification')}</p>
        <h1 className={styles['guest-header']}>{t('login.header')}</h1>
        <p className={styles['guest-greeting']}>{t('login.info')}</p>
      </div>
    )}
  </I18n>
);

export default GuestGreeting;
