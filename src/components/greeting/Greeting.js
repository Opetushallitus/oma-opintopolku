import React from 'react';
import UserGreeting from './user/UserGreeting';
import GuestGreeting from './guest/GuestGreeting';

const Greeting = ({ user, isLoggedIn }) => {
  if (isLoggedIn) {
    return <UserGreeting user={user} />
  }
  return <GuestGreeting />
};

export default Greeting;
