import React from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from '../Greeting.css';

function displayDate(date) {
  if (date) {
    return 's. ' + date.toLocaleDateString('fi-FI');
  }
}

const UserGreeting = ({ user, showNotification }) => {
  const { t } = useTranslation("home");
  return (
    <div className={styles['greeting-container']}>
      {showNotification && (
        <p className={styles.notification}><div dangerouslySetInnerHTML={{__html: t('notification')}} /></p>
      )}
      <h1 className={styles.heading}>{t('greeting')}</h1>
      <p className={styles.subtitle}>{t('description')}</p>
      <p className={styles.identity}>
        <span className={styles.name}>{ user.name }</span>
        <span className={styles.birthday}>{user.birthDay}</span>
      </p>
      <p className={styles.oppijanumero}>
        <span>{t('oppijanumero')} {user.personOid}</span>
      </p>
    </div>
  );
}

export default UserGreeting;
