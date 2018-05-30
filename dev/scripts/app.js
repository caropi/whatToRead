import React from 'react';
import ReactDOM from 'react-dom';
import RecPage from './RecPage';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import SavedBooks from './SavedBooks';
import firebase from 'firebase';
import Footer from './Footer';


  //Saved books page/user authentication
    //Use react router to generate alternate page view
    //display saved books
    // each saved book has checkable 'reading' and 'read' options and delete book button


const config = {
  apiKey: "AIzaSyBkxhr4FMicWjtQin03JrWbbGVhe8mJgzM",
  authDomain: "whattoreadapp.firebaseapp.com",
  databaseURL: "https://whattoreadapp.firebaseio.com",
  projectId: "whattoreadapp",
  storageBucket: "whattoreadapp.appspot.com",
  messagingSenderId: "493854943854"
};

firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      userID: '',
      userName: ''
    };
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    this.dbRef = firebase.database().ref();

    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.dbRef.on("value", snapshot => {
        });
        this.setState({ 
          loggedIn: true,
          userID: user.uid,
          userName: user.displayName
        });
      } else {
        this.setState({ 
          loggedIn: false,
          userID: ''
        });
      }
    });
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then((user) => {
        if(user) {
          const token = user.credential.accessToken;
          const user = user.user;
          const userID = user.user.uid;
          const userName = user.user.displayName;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  logout() {
    firebase.auth().signOut();
    this.dbRef.off("value");
  }

  render() {
    return <Router>
        <div className="app-container">
          <div className="nav">
            <Link to="/" className="nav-links">
              Home
            </Link>
            {this.state.loggedIn === true && <Link to="/SavedBooks" className="nav-links">
                My Books
              </Link>}
            {this.state.loggedIn === false && <button
                onClick={this.loginWithGoogle}
              >
                Login
              </button>}
            {this.state.loggedIn === true ? <button onClick={this.logout}>
                Logout
              </button> : null}
          </div>
          <Route exact path="/" render={() => <RecPage userID={this.state.userID} loggedIn={this.state.loggedIn} login={this.loginWithGoogle} />} />
          <Route path="/SavedBooks" component={SavedBooks} />
          <Footer />
        </div>
      </Router>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));