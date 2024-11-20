import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { LoadingPage } from './components/InitialPage';


function App() {
  return (
    <Router>
 
      <div className="App flex items-center justify-center" style={{'height':"100vh"}}>
       <Routes>
        <Route path='/' Component={LoadingPage}/>
        <Route path='/login' Component={Login}/>
        <Route path='/signup' Component={Signup}/>
        <Route path='/home' Component={Home} />
       </Routes>
      </div>
    </Router>
  );
}

export default App;