import React from 'react';
import {Link} from 'react-router-dom';

const Nav = (props) => {
    return (
    <div className="nav">
        <Link to="/" className="nav-links">
            Home
            </Link>
        {props.loggedIn === true && <Link to="/SavedBooks" className="nav-links">
            My Books
              </Link>}
        {props.loggedIn === false && <button
            onClick={props.login}
        >
            Login
              </button>}
        {props.loggedIn === true ? <button onClick={props.logout}>
            Logout
              </button> : null}
    </div>
    )
}

export default Nav;