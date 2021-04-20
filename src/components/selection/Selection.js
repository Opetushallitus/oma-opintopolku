import React from 'react';
import SelectionItem from '../selectionitem/SelectionItem';
import Link from '../link/Link'
import styles from './Selection.css';
import koskiImg from 'Static/img/opintoni_white.svg';
import vardaImg from 'Static/img/opintoni_white.svg';
import omatsivutImg from 'Static/img/hakemukseni_white.svg';
import otiImg from 'Static/img/hakemukseni_white';
import ykiImg from 'Static/img/hakemukseni_white';
import virkailijaImg from 'Static/img/opintoni_white';
import tietojenikayttoImg from 'Static/img/tietojenikaytto.svg';

const Selection = ({isLoggedIn, usingValtuudet}) => (
  <React.Fragment>
    <div className={styles['flex-container']}>
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='omatsivut' icon={omatsivutImg} link='/omatsivut' />
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='koski' icon={koskiImg} link='/koski/omattiedot' />
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={false} namespace='varda' icon={vardaImg} link='/varda' />
	    <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='oti' icon={otiImg} link='https://oti.opintopolku.fi' />
	    <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='yki' icon={ykiImg} link='https://yki.opintopolku.fi' />
	    <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='virkailija' icon={virkailijaImg} link='https://virkailija.opintopolku.fi' />
    </div>
    <div className={styles['bottom-container']}>
      {!usingValtuudet
        ? <Link isLoggedIn={isLoggedIn} namespace='tietojenikaytto' icon={tietojenikayttoImg} link='/koski/omadata/kayttooikeudet' />
        : null}
    </div>
  </React.Fragment>
);

export default Selection;
