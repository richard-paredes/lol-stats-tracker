import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './assets/css/App.css';

// Local components
import Header from './components/Header/index';
import Search from './components/Search/index';
import Profile from './components/Profile/index';
import NotFound from './components/NotFound/index';

// notification flash messages
toast.configure({ autoClose: 3000, draggable: true });

function App() {
  return (
    <BrowserRouter>
      <div className="App-header container">

        <Header />
        <Switch>
          <Route exact path="/" component={Search} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </div>

    </BrowserRouter>

  );
}

export default App;
