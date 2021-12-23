import React from 'react';
import SelectionItem from '../selectionitem/SelectionItem';
import Link from '../link/Link'
import styles from './Selection.css';
import koskiImg from 'Static/img/opintoni_white.svg';
import valpasImg from 'Static/img/opintoni_white.svg';
import vardaImg from 'Static/img/opintoni_white.svg';
import omatsivutImg from 'Static/img/hakemukseni_white.svg';
import tietojenikayttoImg from 'Static/img/tietojenikaytto.svg';

const Selection = ({isLoggedIn, usingValtuudet}) => (
  <React.Fragment>
    <div className={styles['flex-container']}>
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='omatsivut' icon={omatsivutImg} link='/omatsivut' />
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='koski' icon={koskiImg} link='/koski/omattiedot' />
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={false} namespace='varda' icon={vardaImg} link='/varda' />
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='ehoks' icon={koskiImg} link='/ehoks' />
      <SelectionItem isLoggedIn={isLoggedIn} disableForValtuudet={usingValtuudet} namespace='valpas' icon={valpasImg} link='/valpas' />
    </div>
    <div className={styles['bottom-container']}>
      {!usingValtuudet
        ? <Link isLoggedIn={isLoggedIn} namespace='tietojenikaytto' icon={tietojenikayttoImg} link='/koski/omadata/kayttooikeudet' />
        : null}
    </div>
  </React.Fragment>
);

export default Selection;
