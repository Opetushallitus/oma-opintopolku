import React from 'react';
import SelectionItem from '../selectionitem/SelectionItem';
import Link from '../link/Link'
import styles from './Selection.css';
import koskiImg from 'Static/img/opintoni_white.svg';
import vardaImg from 'Static/img/opintoni_white.svg';
import omatsivutImg from 'Static/img/hakemukseni_white.svg';
import tietojenikayttoImg from 'Static/img/tietojenikaytto.svg';

const Selection = ({isLoggedIn, isUsingValtuudet}) => (
  <React.Fragment>
    <div className={styles['flex-container']}>
      <SelectionItem isLoggedIn={isLoggedIn} isUsingValtuudet={isUsingValtuudet} namespace='omatsivut' icon={omatsivutImg} link='/omatsivut' />
      <SelectionItem isLoggedIn={isLoggedIn} isUsingValtuudet={isUsingValtuudet} namespace='koski' icon={koskiImg} link='/koski/omattiedot' />
      <SelectionItem isLoggedIn={isLoggedIn} isUsingValtuudet={isUsingValtuudet} namespace='varda' icon={vardaImg} link='/varda' />
    </div>
    <div className={styles['bottom-container']}>
      <Link isLoggedIn={isLoggedIn} namespace='tietojenikaytto' icon={tietojenikayttoImg} link='/koski/omadata/kayttooikeudet' />
    </div>
  </React.Fragment>
);

export default Selection;
