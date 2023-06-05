import React from 'react';
import UserGreeting from './user/UserGreeting';
import GuestGreeting from './guest/GuestGreeting';

const Greeting = ({user, isLoggedIn, showNotification}) => {
  if (isLoggedIn) {
    return <UserGreeting user={user} showNotification={showNotification} />
  }
  return <GuestGreeting showNotification={showNotification} />
};

export default Greeting;
