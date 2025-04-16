import React, { Fragment } from "react";
import Selection from "../selection/Selection";
import Greeting from "../greeting/Greeting";
import "./Home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        birthDay: "",
        personOid: "",
        hetu: "",
        usingValtuudet: false,
      },
      isLoggedIn: false,
    };
  }

  setUser = (user) => {
    if (user) {
      this.setState({ user: user, isLoggedIn: true });
    }
  };

  setLoggedIn = (value) => {
    this.setState({ isLoggedIn: value });
  };

  render() {
    const showNotification = true;
    return (
      <Fragment>
        <Greeting
          user={this.state.user}
          isLoggedIn={this.state.isLoggedIn}
          showNotification={showNotification}
        />
        <Selection
          isLoggedIn={this.state.isLoggedIn}
          usingValtuudet={this.state.user.usingValtuudet}
        />
      </Fragment>
    );
  }
}

export default Home;
