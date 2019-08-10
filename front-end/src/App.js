//node packages
import React from 'react';
import { Switch, Route} from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';
//components
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home'
import Project from './Components/Project/Project'
//css
import './CSS/reset.css';
import './App.css'


class App extends React.Component {

  render(){
    return (
      <Router>
        <Switch>
          <Route path = '/signup' component = {Signup} />
          <Route path = '/login' render = {(props) => {
            return <Login {...props}/>
          }} />
          <Route exact path ='/' component = {Home} />
          <Route path ='/projects/:id' component={Project}/>
        </Switch>
      </Router>
    );
}

  }

export default App;
