import React from 'react';
import './App.css';
import Dashboard from '../src/components/admin/Dashboard';
import Home from './components/FrontEnd/Home';
import Login from './components/FrontEnd/auth/Login';
import Register from './components/FrontEnd/auth/register';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MaterielApp from './components/admin/materiels/MaterielApp';
import MaterielForm from './components/admin/materiels/MaterielForm';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact  path="/" component={Home} />
        <Route path="/admin" component={Dashboard} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/admin/materiels" component={MaterielApp} />
        <Route path="/admin/demande_reparation" component={MaterielForm} />
      </Switch>
    </Router>
  );
}

export default App;
