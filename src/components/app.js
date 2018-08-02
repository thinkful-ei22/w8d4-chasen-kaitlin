import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';
import {clearAuth, authWarning, refreshAuthToken} from '../actions/auth';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';

export class App extends React.Component {

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.props.dispatch(authWarning())
    //     }, 5000);
    //     setTimeout(() => {
    //         this.props.dispatch(clearAuth())
    //     }, 60000);
    // }

    componentDidUpdate(prevProps) {
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    // componentWillReceiveProps(prevProps) {
    //     if(!prevProps.loggedIn && this.props.loggedIn) {
    //         this.startWarningTimer();
    //     }
    // }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            10 * 60 * 1000 // Ten minutes
        );
    }

    // setTimeout(e=> console.log('Hello'), 2000);

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    startWarningTimer() {
        setTimeout(() => {
            return <h1>You will be logged out in 1 minute</h1>, 
            1 *  8 * 1000
        })
    }

    // warn() {
    //     if(this.props.warning) {
    //         return <h1>You will be logged out in 1 minute</h1>;
    //     }
    // }

    render() {
        const refreshEveryFive = () => {
            if (this.props.loggedIn) {
                // this.refreshInterval = setInterval(()=> {
                //     console.log('You will be logged out'), 1 *  8 * 1000 
                // });
                setTimeout(() => {
                    console.log('You will be logged out'), 
                    1 * 8 * 1000
                })
                this.refreshInterval = setInterval(
                    () => this.props.dispatch(clearAuth()),
                    1 * 10 * 1000 // Ten Seconds
                );
            };
        }

        return (
            <div className="app" onClick={e => refreshEveryFive(e)}>
                <HeaderBar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/register" component={RegistrationPage} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null,
    warning: state.auth.warning
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
