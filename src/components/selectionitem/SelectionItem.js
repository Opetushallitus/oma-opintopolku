import React from 'react';
import { useTranslation } from 'react-i18next';
import * as styles from './SelectionItem.css';

const tExists = (t, key) => {
  return t(key) !== key;
}
const SelectionItem = ({isLoggedIn, disableForValtuudet, namespace, icon, link}) => {
  const { t } = useTranslation("selection");
  return (
    <div className={styles['flex-item']}>
      <div className={styles['title-wrapper']}>
        <div className={styles['image-wrapper']}>
          <img className={styles['icon-image']} src={icon} alt="" />
        </div>
        <h2 className={styles.title}>{t(namespace + '.title')}</h2>
      </div>

      <div className={styles['content-wrapper']}>
        <p className={styles.subtitle}>
          {t(namespace + '.subtitle')}
          &nbsp;
          {t(namespace + '.subtitleLink') !== namespace + '.subtitleLink'
            ? <a href={t(namespace + '.subtitleLink.href')} target="_blank" class="text-link">{t(namespace + '.subtitleLink.text')}</a>
            : null}
        </p>
        <div className={styles['list-wrapper']}>
          <p>{t(namespace + '.label')}</p>
          <ul className={styles.list}>
            <li dangerouslySetInnerHTML={{__html: t(namespace + '.item1')}} />
            <li dangerouslySetInnerHTML={{__html: t(namespace + '.item2')}} />
            <li dangerouslySetInnerHTML={{__html: t(namespace + '.item3')}} />
            { tExists(t, namespace + '.item4') && <li dangerouslySetInnerHTML={{__html: t(namespace + '.item4')}}/> }
          </ul>
        </div>
      </div>
      <div className={styles['link-container']}>
        { !disableForValtuudet
          ? <a className={`${styles.link} ${isLoggedIn ? styles['link-loggedin'] : styles['link-loggedout']}`} href={ link }>
            { !isLoggedIn
              ? <span className={styles['link-text']}>{t(namespace + '.linkLoggedOut')}</span>
              : <span className={styles['link-text']}>{t(namespace + '.link')}</span>
            }
          </a>
          : <span className={`${styles['link-disabled']} ${styles['link-text-disabled-valtuudet']}`}>{t(namespace + '.linkUsingValtuudet')}</span>
        }
      </div>
    </div>
  );
}

export default SelectionItem;
