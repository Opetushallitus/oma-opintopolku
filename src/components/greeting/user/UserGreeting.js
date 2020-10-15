import React from 'react';
import { I18n } from 'react-i18next';
import styles from '../Greeting.css';

function displayDate(date) {
  if (date) {
    return 's. ' + date.toLocaleDateString('fi-FI');
  }
}

const UserGreeting = ({ user }) => (
  <I18n ns="home">
    {t => (
      <div className={styles['greeting-container']}>
        <h1 className={styles.heading}>{t('greeting')}</h1>
        <p className={styles.subtitle}>{t('description')}</p>
        <p className={styles.identity}>
          <span className={styles.name}>{ user.name }</span>
          {/*<span className={styles.birthday}>{displayDate(user.birthDay)}</span>*/}
        </p>
      </div>
    )}
  </I18n>
);

export default UserGreeting;
