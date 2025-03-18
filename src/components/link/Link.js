import React from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './Link.css';
import lukkoImg from 'Static/img/lukko.svg';

const Link = ({isLoggedIn, namespace, icon, link}) => {
  const { t } = useTranslation("selection");
  return (
    <a className={`${styles.link} ${isLoggedIn ? styles['link-loggedin'] : styles['link-loggedout']}`} href={link}>
      <img className={styles['link-image']} src={isLoggedIn ? icon : lukkoImg}/>
      <span className={styles['link-text']}>{t(namespace + '.title')}</span>
    </a>
  );
}

export default Link;
