import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';

import InputForm from './components/InputForm.js';
import AdminPanel from './components/AdminPanel.js';
import Error from './components/Error.js';
import NavBar from './components/NavBar.js';

class App extends Component {
    render() {
        return(
            <BrowserRouter>
            <div>
                <NavBar />
                <Switch>
                    <Route path='/' component={InputForm} exact />
                    <Route path='/admin' component={AdminPanel} />
                    <Route component={Error} />
                </Switch>
            </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));